const historyTableBody = document.getElementById("historyTableBody");
const addEntryBtn = document.getElementById("addEntry");
const predictBtn = document.getElementById("predictBtn");
const predictionOutput = document.getElementById("predictionOutput");

let rawMaterialData = [];

addEntryBtn.addEventListener("click", () => {
  const date = document.getElementById("entryDate").value;
  const name = document.getElementById("materialName").value.trim();
  const bought = parseFloat(document.getElementById("quantityBought").value);
  const used = parseFloat(document.getElementById("quantityUsed").value);
  const price = parseFloat(document.getElementById("materialPrice").value);

  if (!date || !name || isNaN(bought) || isNaN(used) || isNaN(price)) {
    alert("Please fill all fields correctly.");
    return;
  }

  const entry = { date, name, bought, used, price };
  rawMaterialData.push(entry);
  updateHistoryTable();
  clearForm();
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
