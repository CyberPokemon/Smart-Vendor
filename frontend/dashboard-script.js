const ingredientPrices = {
  "Onion 🧅": 20,
  "Potato 🥔": 15,
  "Tomato 🍅": 25,
  "Oil 🛢️": 120,
  "Salt 🧂": 10,
  "Flour 🌾": 35,
  "Chilli Powder 🌶️": 160,
  "Paneer 🧀": 240
};

const ingredientUnits = {
  "Onion 🧅": "kg",
  "Potato 🥔": "kg",
  "Tomato 🍅": "kg",
  "Oil 🛢️": "litre",
  "Salt 🧂": "kg",
  "Flour 🌾": "kg",
  "Chilli Powder 🌶️": "kg",
  "Paneer 🧀": "kg"
};

const suggestedList = Object.keys(ingredientPrices);
let ingredientCount = 0;

function addIngredientField(name = "", qty = "", insertAtTop = false) {
  const list = document.getElementById("ingredientList");
  const row = document.createElement("div");
  row.className = "flex flex-col sm:flex-row items-center gap-4";

  const options = Object.keys(ingredientPrices).map(ing => `<option value="${ing}" ${ing === name ? "selected" : ""}>${ing}</option>`).join("");

  const selectHtml = (ingredientCount === 0 || name === "") ? `
    <select class="ingredientSelect w-full sm:w-1/4 px-4 py-2 border rounded" onchange="updatePrice(this)">
      <option value="">--Select Ingredient--</option>
      ${options}
    </select>` : `<input type="text" class="ingredientSelect w-full sm:w-1/4 px-4 py-2 border rounded bg-gray-100" value="${name}" readonly>`;

  row.innerHTML = `
    ${selectHtml}
    <input type="number" min="0" placeholder="Quantity" class="quantity w-full sm:w-1/6 px-4 py-2 border rounded" value="${qty}">
    <input type="text" class="unit w-full sm:w-1/6 px-4 py-2 border rounded bg-gray-100" placeholder="unit" readonly>
    <input type="text" placeholder="₹/unit" class="price w-full sm:w-1/6 px-4 py-2 border rounded bg-gray-200" readonly>
    <span class="text-sm text-gray-500">(per unit)</span>
    <button type="button" onclick="confirmDelete(this)" class="text-red-600 hover:text-red-800">❌</button>
  `;

  if (insertAtTop && list.firstChild) {
    list.insertBefore(row, list.firstChild);
  } else {
    list.appendChild(row);
  }

  ingredientCount++;
  updatePrice(row.querySelector(".ingredientSelect"));
}

function toggleAddIngredient() {
  addIngredientField();
}

function updatePrice(selectEl) {
  if (!selectEl) return;
  const selectedValue = selectEl.value;
  const priceField = selectEl.parentElement.querySelector(".price");
  const unitField = selectEl.parentElement.querySelector(".unit");
  priceField.value = selectedValue ? ingredientPrices[selectedValue] : "";
  unitField.value = selectedValue ? ingredientUnits[selectedValue] || "pcs" : "";
}

function predictQuantities() {
  document.querySelectorAll('.quantity').forEach(input => {
    if (!input.value) {
      input.value = Math.floor(Math.random() * 10) + 1;
    }
  });
}

function renderSuggestions() {
  const container = document.getElementById("suggestedItems");
  suggestedList.forEach(item => {
    const emoji = item.match(/\p{Emoji}/gu)?.[0] || "🛒";
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="text-4xl mb-2">${emoji}</div>
      <p class="text-lg font-semibold text-gray-700">${item}</p>
      <p class="text-sm text-gray-500">💵 Price: ₹${ingredientPrices[item]}</p>
      <button onclick="addIngredientField('${item}', '', true)" class="btn blue mt-2">🛒 Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

function confirmDelete(button) {
  if (confirm("Are you sure you want to delete this ingredient?")) {
    button.closest(".flex").remove();
  }
}

document.getElementById("ingredientForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const selects = document.querySelectorAll(".ingredientSelect");
  const quantities = document.querySelectorAll(".quantity");

  const output = document.getElementById("outputList");
  const totalCostDisplay = document.getElementById("totalCost");
  let grandTotal = 0;
  output.innerHTML = "";

  selects.forEach((selectEl, index) => {
    const name = selectEl.value || selectEl.textContent || selectEl.value;
    if (!name) return;

    let qty = parseFloat(quantities[index].value.trim());
    if (isNaN(qty)) qty = 0;

    const price = ingredientPrices[name];
    const itemTotal = qty * price;
    grandTotal += itemTotal;

    const li = document.createElement("li");
    li.textContent = `🍽️ ${name} — Qty: ${qty}, ₹${price}/unit, Total: ₹${itemTotal.toFixed(2)}`;
    output.appendChild(li);
  });

  totalCostDisplay.textContent = grandTotal.toFixed(2);
  document.getElementById("output").classList.remove("hidden");
});

window.onload = () => {
  addIngredientField();
  renderSuggestions();
};
