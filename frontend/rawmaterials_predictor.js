const ingredientTableBody = document.getElementById("ingredientTableBody");
const submitAllBtn = document.getElementById("submitAllBtn");
const entryDateInput = document.getElementById("entryDate");
const vendorMessageInput = document.getElementById("vendorMessage");

let allIngredients = [];

let rawMaterialData = [];


window.addEventListener("DOMContentLoaded", async () => {
  await loadIngredientTable();
});

async function loadIngredientTable() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return alert("Not authenticated");

  try {
    const res = await fetch(`${API_BASE_URL}/api/vendors/getingredientnames`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch ingredient names");

    const names = await res.json();
    allIngredients = names;

    names.forEach(name => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${name}</td>
        <td><input type="number" placeholder="Bought (kg)" class="form-input" data-type="bought" /></td>
        <td><input type="number" placeholder="Used (kg)" class="form-input" data-type="used" /></td>
        <td><input type="number" placeholder="Price (₹/kg)" class="form-input" data-type="price" /></td>
      `;
      row.dataset.ingredient = name;
      ingredientTableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error:", err);
    alert("Error loading ingredient list.");
  }
}

submitAllBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return alert("User not authenticated");

  const date = entryDateInput.value;
  if (!date) return alert("Please select a date");

  const message = vendorMessageInput.value.trim();

  const rows = ingredientTableBody.querySelectorAll("tr");
  const entries = [];

  rows.forEach(row => {
    const name = row.dataset.ingredient;
    const bought = parseFloat(row.querySelector('input[data-type="bought"]').value);
    const used = parseFloat(row.querySelector('input[data-type="used"]').value);
    const price = parseFloat(row.querySelector('input[data-type="price"]').value);

    if (!isNaN(bought) || !isNaN(used) || !isNaN(price)) {
      entries.push({
        ingredientName: name,
        quantityBought: isNaN(bought) ? 0 : bought,
        quantityUsed: isNaN(used) ? 0 : used,
        price: isNaN(price) ? 0 : price,
        date: date
      });
    }
  });

  if (entries.length === 0) {
    return alert("Please enter at least one entry.");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/vendors/setdailyusage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        entries,
        messageFromVendor: message
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    alert("Entries submitted successfully!");
    ingredientTableBody.innerHTML = "";
    vendorMessageInput.value = "";
    await loadIngredientTable();
  } catch (err) {
    console.error("Submission failed:", err);
    alert("Submission failed: " + err.message);
  }
});

function updateHistoryTable() {
  const historyTableBody = document.getElementById("historyTableBody");

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

predictBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("User not authenticated.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/vendors/predictionai`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Failed to fetch prediction data.");

    const data = await response.json();

    let html = `<h4>Predicted Raw Material Requirement for Next 7 Days</h4>`;

    html += `<div class="table-container"><table class="data-table"><thead><tr><th>Date</th><th>Ingredient</th><th>Required Quantity (kg)</th></tr></thead><tbody>`;

    Object.entries(data).forEach(([date, ingredients]) => {
      Object.entries(ingredients).forEach(([ingredient, quantity]) => {
        html += `<tr>
          <td>${date}</td>
          <td>${ingredient}</td>
          <td>${quantity.toFixed(2)}</td>
        </tr>`;
      });
    });

    html += `</tbody></table></div>`;

    predictionOutput.innerHTML = html;
  } catch (err) {
    console.error("Prediction error:", err);
    predictionOutput.innerHTML = `<p style="color: red;">Failed to fetch prediction data.</p>`;
  }
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
    url = `${API_BASE_URL}/api/vendors/usage/bydate?date=${date}`;
  } else if (type === "month") {
    const [year, month] = filterMonth.value.split("-");
    if (!month || !year) return alert("Select a month");
    url = `${API_BASE_URL}/api/vendors/usage/bymonth?month=${parseInt(month)}&year=${year}`;
  } else if (type === "range") {
    const start = startDate.value;
    const end = endDate.value;
    if (!start || !end) return alert("Select a valid range");
    url = `${API_BASE_URL}/api/vendors/usage/byrange?start=${start}&end=${end}`;
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
      price: entry.price || 0   // backend doesn't return price
    }));

    updateHistoryTable();
  } catch (error) {
    console.error("Error loading history:", error);
    alert("Failed to load data: " + error.message);
  }
});
