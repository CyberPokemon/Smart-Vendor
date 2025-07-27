let ingredientCount = 0;

function addIngredient() {
    const list = document.getElementById("ingredientList");

    const group = document.createElement("div");
    group.className = "ingredient-group";
    group.id = `ingredient-${ingredientCount}`;

    group.innerHTML = `
    <label for="name-${ingredientCount}">Ingredient Name:</label>
    <input type="text" id="name-${ingredientCount}" placeholder="e.g., Tomatoes" required>

    <label for="qty-${ingredientCount}">Quantity per Day:</label>
    <input type="number" id="qty-${ingredientCount}" placeholder="e.g., 50" required>

    <label for="price-${ingredientCount}">Average Price:</label>
    <input type="number" id="price-${ingredientCount}" placeholder="e.g., 100" required>

    <label for="unit-${ingredientCount}">Unit:</label>
    <select id="unit-${ingredientCount}">
      <option value="per kg">per kg</option>
      <option value="per liter">per liter</option>
      <option value="per unit">per unit</option>
      <option value="per gram">per gram</option>
      <option value="per ml">per ml</option>
    </select>
  `;

    list.appendChild(group);
    ingredientCount++;
}

function submitIngredients() {
    const data = [];

    for (let i = 0; i < ingredientCount; i++) {
        const name = document.getElementById(`name-${i}`);
        const qty = document.getElementById(`qty-${i}`);
        const price = document.getElementById(`price-${i}`);
        const unit = document.getElementById(`unit-${i}`);

        if (name && qty && price && unit) {
            const ingName = name.value.trim();
            const quantity = parseFloat(qty.value);
            const avgprice = parseFloat(price.value);
            const unitValue = unit.value;

            if (ingName && !isNaN(quantity) && !isNaN(avgprice)) {
                data.push({
                    ingridiends: ingName,
                    quantity: quantity,
                    avgprice: avgprice,
                    unit: unitValue
                });
            }
        }
    }

    if (data.length === 0) {
        alert("Please fill in at least one valid ingredient.");
        return;
    }

    console.log(data);

    fetch(`${API_BASE_URL}/api/vendors/updateingredientlist`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('jwtToken')}` 
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            document.getElementById("ingredientForm").classList.add("hidden");
            document.getElementById("successMessage").classList.remove("hidden");
            window.location.href = 'vendor_entry.html';
        })
        .catch(err => {
            console.error(err);
            alert("Failed to submit data. Try again later.");
        });
}

// Initialize with one ingredient field
document.addEventListener("DOMContentLoaded", () => {
    addIngredient();
});
