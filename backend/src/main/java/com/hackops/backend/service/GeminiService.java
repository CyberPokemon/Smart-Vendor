package com.hackops.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackops.backend.dto.vendor.IngredientUsageResponseDTO;
import com.hackops.backend.model.Users;
import com.hackops.backend.repository.IngredientUsageLogRepository;
import com.hackops.backend.repository.UserRepository;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;


    @Autowired
    private IngredientUsageLogRepository ingredientUsageLogRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VendorService vendorService;

    private  final WebClient webClient;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public GeminiService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }

    public Map<String, Map<String, Double>>  predictIngriendlist(String username)
    {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(14);
        List<IngredientUsageResponseDTO> last14DaysUsage = vendorService.getUsageByDateRange(username,start,today);
        String location = user.getAddresss();
        List<String> ingridientlist  = vendorService.getIngredientNamesByUsername(username);

        List<String> vendorMessages = vendorService.getVendorMessages(user, start, today);


        Map<String, List<String>> foodToIngredientsMap = vendorService.getFoodToIngredientsMap(user);
        try {
            ObjectMapper mapper = new ObjectMapper();
            String inputJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(last14DaysUsage);

//            String prompt = buildPrompt(inputJson);
            String prompt = buildPrompt(inputJson,location,ingridientlist,foodToIngredientsMap,vendorMessages);

            Map<String, Object> requestbody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", prompt)))
                    )
            );

            // Send prompt to Gemini
            String response = webClient.post()
                    .uri(geminiApiUrl)
                    .header("Content-Type", "application/json")
                    .header("X-goog-api-key",geminiApiKey)
                    .bodyValue(requestbody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            String rawText = objectMapper.readTree(response)
                    .get("candidates").get(0)
                    .get("content").get("parts").get(0)
                    .get("text").asText();

            String cleaned = rawText.replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            String unescapedJson = StringEscapeUtils.unescapeJson(cleaned);

            return objectMapper.readValue(unescapedJson,
                    new TypeReference<Map<String, Map<String, Double>>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage(), e);
        }
    }
    private String buildPrompt(String inputJson) {
        return """
        You are an intelligent forecasting assistant designed to help food vendors in India predict ingredient needs.

        Your task is to analyze the past 14 days of ingredient purchase and usage data, and then generate a forecast for the next 7 days.

        Each entry in the data has the following format:
        - ingredientName: the name of the ingredient
        - quantityBought: how much of the ingredient was bought that day (in kilograms)
        - quantityUsed: how much was actually used (in kilograms)
        - date: the date of the entry in YYYY-MM-DD format

        Take the following considerations into account while predicting:
        - Seasonality patterns and current **weather forecasts in India** (assume this is for Kolkata).
        - Cultural context and **Indian festivals** (e.g., Raksha Bandhan, Eid, Independence Day, etc.)
        - Linear or slightly exponential demand growth based on past usage trends.

        ### Input Data (Last 14 Days Usage):

        """ + inputJson + """

        Respond in this JSON format only, where:

        The key is the date (YYYY-MM-DD) for the next 7 days

        Each value is a dictionary of ingredients

        For each ingredient, the value is a 2-element list: [requiredAmount, predictedConsumption]

        {
          "2025-07-27": {
            "Tomatoes": [35, 30],
            "Onions": [25, 23],
            "Potatoes": [46, 38]
          },
          ...
        }

        Additional Instructions:
        - Ensure consistency with regional demand patterns in Kolkata.
        - Use IST (Indian Standard Time) when considering dates.
        - Keep the prediction realistic (no sharp jumps unless justified by festival demand or weather).
        """;
    }


//    private String buildPrompt(String inputJson, String location, List<String> vendorIngredients, Map<String, List<String>> foodToIngredientsMap, List<String> vendorMessages) {
//        String ingredientList = String.join(", ", vendorIngredients);
//        String vendorRemarks = String.join("\n- ", vendorMessages);
//
//        StringBuilder foodComposition = new StringBuilder();
//        for (Map.Entry<String, List<String>> entry : foodToIngredientsMap.entrySet()) {
//            foodComposition.append("- ").append(entry.getKey()).append(": ");
//            foodComposition.append(String.join(", ", entry.getValue())).append("\n");
//        }
//
//        return """
//    You are a smart forecasting assistant built for Indian street food vendors.
//
//    Your task is to analyze the past 14 days of ingredient usage data and generate a realistic 7-day forecast of ingredient requirements.
//
//    The data is from a vendor located in: **""" + location + """**
//
//    ### Additional Context:
//
//    1. **Ingredients the vendor regularly uses**:
//       """ + ingredientList + """
//
//    2. **Food items sold and their ingredient composition**:
//       """ + foodComposition.toString() + """
//
//    3. **Vendor Notes / Comments over time**:
//       - """ + vendorRemarks + """
//
//    Please also consider:
//    - **Weather forecast in the vendor’s region (`""" + location + """`)**
//    - **Local Indian festivals in that region**
//    - **Growth in customer demand due to local events or weekends**
//    - Seasonality of ingredients and known consumption patterns
//
//    ---
//
//    ### Input Data (Last 14 Days Usage):
//
//    """ + inputJson + """
//
//    ### Expected Output Format:
//
//    Return **only** a JSON object of this structure, with no markdown, text, or explanations:
//
//    ```json
//    {
//      "2025-07-27": {
//        "Tomatoes": 35,
//        "Onions": 25,
//        "Potatoes": 46
//      },
//      ...
//    }
//    ```
//
//    - The **key** is the date (next 7 days, in YYYY-MM-DD)
//    - The **value** is a mapping of each ingredient to its **required quantity (in kilograms)**.
//    - Only include ingredients the vendor actually uses.
//    - Round quantities to 2 decimal places.
//    """;
//    }


    private String buildPrompt(String inputJson, String location, List<String> vendorIngredients, Map<String, List<String>> foodToIngredientsMap, List<String> vendorMessages) {
        String ingredientList = String.join(", ", vendorIngredients);
        String vendorRemarks = String.join("\n- ", vendorMessages);

        StringBuilder foodComposition = new StringBuilder();
        for (Map.Entry<String, List<String>> entry : foodToIngredientsMap.entrySet()) {
            foodComposition.append("- ").append(entry.getKey()).append(": ");
            foodComposition.append(String.join(", ", entry.getValue())).append("\n");
        }

        StringBuilder prompt = new StringBuilder("""
        You are a smart forecasting assistant built for Indian street food vendors.

        Your task is to analyze the past 14 days of ingredient usage data and generate a realistic 7-day forecast of ingredient requirements.

        The data is from a vendor located in:
        """);

        prompt.append(location).append("\n\n");

        prompt.append("""
        ### Additional Context:

        1. **Ingredients the vendor regularly uses**:
        """).append(ingredientList).append("\n\n");

        prompt.append("2. **Food items sold and their ingredient composition**:\n")
                .append(foodComposition.toString()).append("\n");

        prompt.append("3. **Vendor Notes / Comments over time**:\n")
                .append("- ").append(vendorRemarks).append("\n\n");

        prompt.append("""
        Please also consider:
        - **Weather forecast in the vendor’s region**
        - **Local Indian festivals in that region**
        - **Growth in customer demand due to local events or weekends**
        - Seasonality of ingredients and known consumption patterns

        ---

        ### Input Data (Last 14 Days Usage):

        """).append(inputJson).append("\n\n");

        prompt.append("""
        ### Expected Output Format:

        Return **only** a JSON object of this structure, with no markdown, text, or explanations:

        {
          "2025-07-27": {
            "Tomatoes": 35,
            "Onions": 25,
            "Potatoes": 46
          },
          ...
        }

        - The **key** is the date (next 7 days, in YYYY-MM-DD)
        - The **value** is a mapping of each ingredient to its **required quantity (in kilograms)**.
        - Only include ingredients the vendor actually uses.
        - Round quantities to 2 decimal places.
        """);

        return prompt.toString();
    }


}
