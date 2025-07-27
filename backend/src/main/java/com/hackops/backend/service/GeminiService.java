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

    public Map<String, Map<String, List<Double>>> predictIngriendlist(String username)
    {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(14);
        List<IngredientUsageResponseDTO> last14DaysUsage = vendorService.getUsageByDateRange(username,start,today);

        try {
            ObjectMapper mapper = new ObjectMapper();
            String inputJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(last14DaysUsage);

            String prompt = buildPrompt(inputJson);

            Map<String, Object> requestbody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", prompt)))
                    )
            );

            System.out.println("request body : "+requestbody);

//            return "good";

            // Send prompt to Gemini (replace if you're using Google Vertex AI or other)
            String response = webClient.post()
                    .uri(geminiApiUrl)
                    .header("Content-Type", "application/json")
                    .header("X-goog-api-key",geminiApiKey)
                    .bodyValue(requestbody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("response = "+response);

//            return response;

            String rawText = objectMapper.readTree(response)
                    .get("candidates").get(0)
                    .get("content").get("parts").get(0)
                    .get("text").asText();

            String cleaned = rawText.replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            String unescapedJson = StringEscapeUtils.unescapeJson(cleaned);

            System.out.println("Cleaned JSON: " + unescapedJson);
            return objectMapper.readValue(unescapedJson,
                    new TypeReference<Map<String, Map<String, List<Double>>>>() {});

//            return unescapedJson;
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



}
