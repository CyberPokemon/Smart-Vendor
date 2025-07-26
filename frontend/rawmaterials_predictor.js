const historyTableBody = document.getElementById("historyTableBody");
const addEntryBtn = document.getElementById("addEntry");
const predictBtn = document.getElementById("predictBtn");
const predictionOutput = document.getElementById("predictionOutput");

let rawMaterialData = [];

window.addEventListener("DOMContentLoaded", loadIngredientNames);

async function loadIngredientNames() {
  const dropdown = document.getElementById("materialName");
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    alert("User not authenticated. Please login again.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8080/api/vendors/getingredientnames", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to load ingredient names");
    }

    const ingredientNames = await response.json();

    ingredientNames.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading ingredients:", error);
    alert("Unable to load ingredient names.");
  }
}

// addEntryBtn.addEventListener("click", () => {
//   const date = document.getElementById("entryDate").value;
//   const name = document.getElementById("materialName").value.trim();
//   const bought = parseFloat(document.getElementById("quantityBought").value);
//   const used = parseFloat(document.getElementById("quantityUsed").value);
//   const price = parseFloat(document.getElementById("materialPrice").value);

//   if (!date || !name || isNaN(bought) || isNaN(used) || isNaN(price)) {
//     alert("Please fill all fields correctly.");
//     return;
//   }

//   const entry = { date, name, bought, used, price };
//   rawMaterialData.push(entry);
//   updateHistoryTable();
//   clearForm();
// });


addEntryBtn.addEventListener("click", async () => {
    const date = document.getElementById("entryDate").value;
    const name = document.getElementById("materialName").value.trim();
    const bought = parseFloat(document.getElementById("quantityBought").value);
    const used = parseFloat(document.getElementById("quantityUsed").value);
    const price = parseFloat(document.getElementById("materialPrice").value);
  
    if (!date || !name || isNaN(bought) || isNaN(used) || isNaN(price)) {
      alert("Please fill all fields correctly.");
      return;
    }
  
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("User not authenticated. Please login again.");
      return;
    }
  
    const entryPayload = {
      entries: [{
        ingredientName: name,
        quantityBought: bought,
        quantityUsed: used,
        price: price,
        date: date
      }]
    };
  
    try {
      const response = await fetch("http://127.0.0.1:8080/api/vendors/setdailyusage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(entryPayload)
      });
  
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }
  
      rawMaterialData.push({ date, name, bought, used, price });
      updateHistoryTable();
      clearForm();
  
      alert("Entry saved successfully!");
    } catch (err) {
      console.error("Error saving entry:", err);
      alert("Failed to save entry: " + err.message);
    }
  });
  
function updateHistoryTable() {
  historyTableBody.innerHTML = "";
  rawMaterialData.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.name}</td>
      <td>${entry.bought}</td>
      <td>${entry.used}</td>
      <td>₹${entry.price.toFixed(2)}</td>
    `;
    historyTableBody.appendChild(row);
  });
}

function clearForm() {
  document.getElementById("entryDate").value = "";
  document.getElementById("materialName").value = "";
  document.getElementById("quantityBought").value = "";
  document.getElementById("quantityUsed").value = "";
  document.getElementById("materialPrice").value = "";
}

predictBtn.addEventListener("click", () => {
  if (rawMaterialData.length === 0) {
    predictionOutput.innerHTML = "<p>No data available for prediction.</p>";
    return;
  }

  const materialMap = {};

  rawMaterialData.forEach(({ name, used }) => {
    if (!materialMap[name]) {
      materialMap[name] = { totalUsed: 0, days: 0 };
    }
    materialMap[name].totalUsed += used;
    materialMap[name].days += 1;
  });

  let html = `<h4>Predicted Raw Material Requirement for Next 7 Days</h4><ul>`;
  for (const material in materialMap) {
    const avgDailyUse = materialMap[material].totalUsed / materialMap[material].days;
    const predicted7DayUse = (avgDailyUse * 7).toFixed(2);
    html += `<li><strong>${material}</strong>: ${predicted7DayUse} kg</li>`;
  }
  html += `</ul>`;
  predictionOutput.innerHTML = html;
});

const filterType = document.getElementById("filterType");
const filterDate = document.getElementById("filterDate");
const filterMonth = document.getElementById("filterMonth");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const filterBtn = document.getElementById("filterBtn");

filterType.addEventListener("change", () => {
  document.querySelectorAll(".filter-input").forEach(el => el.style.display = "none");

  const value = filterType.value;
  if (value === "date") document.getElementById("filter-date").style.display = "block";
  else if (value === "month") document.getElementById("filter-month").style.display = "block";
  else if (value === "range") document.getElementById("filter-range").style.display = "block";
});

filterBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("User not authenticated. Please login again.");
    return;
  }

  const type = filterType.value;
  let url = "";

  if (type === "date") {
    const date = filterDate.value;
    if (!date) return alert("Select a date");
    url = `http://127.0.0.1:8080/api/vendors/usage/bydate?date=${date}`;
  } else if (type === "month") {
    const [year, month] = filterMonth.value.split("-");
    if (!month || !year) return alert("Select a month");
    url = `http://127.0.0.1:8080/api/vendors/usage/bymonth?month=${parseInt(month)}&year=${year}`;
  } else if (type === "range") {
    const start = startDate.value;
    const end = endDate.value;
    if (!start || !end) return alert("Select a valid range");
    url = `http://127.0.0.1:8080/api/vendors/usage/byrange?start=${start}&end=${end}`;
  } else {
    return alert("Please select a filter type.");
  }

  try {
    const response = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to fetch usage history");

    const data = await response.json();

    rawMaterialData = data.map(entry => ({
      date: entry.date,
      name: entry.ingredientName,
      bought: entry.quantityBought,
      used: entry.quantityUsed,
      price: 0  // backend doesn't return price
    }));

    updateHistoryTable();
  } catch (error) {
    console.error("Error loading history:", error);
    alert("Failed to load data: " + error.message);
  }
});
