// let totalFoods = 0;
// let currentFoodIndex = 0;
// const foodForm = document.getElementById("foodForm");
// const submitBtn = document.getElementById("submitAll");
// const successMessage = document.getElementById("successMessage");

// function startEntry() {
//   const foodCount = parseInt(document.getElementById("foodCount").value);
//   if (isNaN(foodCount) || foodCount < 1) {
//     alert("Please enter a valid number of food items.");
//     return;
//   }
//   totalFoods = foodCount;
//   const countSection = document.getElementById("food-count-section");
//   countSection.style.display = "none";
//   foodForm.classList.remove("hidden");
//   addFoodForm();
//   foodForm.scrollIntoView({ behavior: "smooth" });

// }

// function addFoodForm() {
//   if (currentFoodIndex >= totalFoods) {
//     submitBtn.classList.remove("hidden");
//     submitBtn.scrollIntoView({ behavior: "smooth" });
//     return;
//   }

//   const foodDiv = document.createElement("div");
//   foodDiv.className = "food-section";
//   foodDiv.id = `food-${currentFoodIndex}`;

//   foodDiv.innerHTML = `
//     <h3>Food Item ${currentFoodIndex + 1}</h3>
//     <label>Food Name:</label>
//     <input type="text" name="foodName-${currentFoodIndex}" required />

//     <label>Food Type:</label>
//     <select name="foodType-${currentFoodIndex}">
//       <option value="veg">Veg</option>
//       <option value="non-veg">Non-Veg</option>
//     </select>

//     <div id="ingredients-${currentFoodIndex}">
//       <label>Ingredients:</label>
//       <div class="ingredient-group">
//         <input type="text" placeholder="Ingredient Name" class="ingredient-name" />
//         <input type="number" placeholder="Quantity" class="ingredient-qty" />
//         <select class="ingredient-unit">
//           <option value="grams">grams</option>
//           <option value="kg">kg</option>
//           <option value="ml">ml</option>
//           <option value="liters">liters</option>
//           <option value="pieces">pieces</option>
//         </select>
//       </div>
//     </div>

//     <button type="button" onclick="addIngredient(${currentFoodIndex})">Add Ingredient</button>
//     <button type="button" onclick="nextFood()">Next Food</button>
//   `;

//   foodForm.appendChild(foodDiv);
//   foodDiv.scrollIntoView({ behavior: "smooth" }); // 👈 smooth scroll to new section
// }


// function addIngredient(index) {
//   const ingredientDiv = document.getElementById(`ingredients-${index}`);
//   const group = document.createElement("div");
//   group.className = "ingredient-group";
//   group.innerHTML = `
//     <input type="text" placeholder="Ingredient Name" class="ingredient-name" />
//     <input type="number" placeholder="Quantity" class="ingredient-qty" />
//     <select class="ingredient-unit">
//       <option value="grams">grams</option>
//       <option value="kg">kg</option>
//       <option value="ml">ml</option>
//       <option value="liters">liters</option>
//       <option value="pieces">pieces</option>
//     </select>
//   `;
//   ingredientDiv.appendChild(group);
// }


// function nextFood() {
//   currentFoodIndex++;
//   addFoodForm();
// }

// function submitAllData() {
//   const allData = [];

//   for (let i = 0; i < totalFoods; i++) {
//     const foodSection = document.getElementById(`food-${i}`);
//     const foodName = foodSection.querySelector(`[name="foodName-${i}"]`).value.trim();
//     const foodType = foodSection.querySelector(`[name="foodType-${i}"]`).value;

//     const ingredients = [];
//     const names = foodSection.querySelectorAll(".ingredient-name");
//     const qtys = foodSection.querySelectorAll(".ingredient-qty");
//     const units = foodSection.querySelectorAll(".ingredient-unit");

//     for (let j = 0; j < names.length; j++) {
//       const ingName = names[j].value.trim();
//       const quantity = qtys[j].value.trim();
//       if (ingName) {
//         ingredients.push({
//           name: ingName,
//           quantity: quantity === "" ? "0" : quantity,
//           unit: units[j].value
//         });
//       }
//     }

//     allData.push({
//       foodName,
//       foodType,
//       ingredients
//     });
//   }

//   // Hide the form and show preview
//   foodForm.classList.add("hidden");
//   submitBtn.classList.add("hidden");

//   showPreview(allData);
// }

// function showPreview(data) {
//   const container = document.querySelector(".container");
//   const previewDiv = document.createElement("div");
//   previewDiv.id = "previewDiv";

//   const heading = document.createElement("h2");
//   heading.textContent = "Preview Your Submission";
//   heading.style.margin = "20px 0";
//   container.appendChild(heading);

//   data.forEach((item, idx) => {
//     const card = document.createElement("div");
//     card.className = "food-section";
//     card.innerHTML = `
//       <h3>${idx + 1}. ${item.foodName} (${item.foodType})</h3>
//       <ul>
//         ${item.ingredients.map(ing => `
//           <li>${ing.name}: ${ing.quantity} ${ing.unit}</li>
//         `).join("")}
//       </ul>
//     `;
//     previewDiv.appendChild(card);
//   });

//   const confirmBtn = document.createElement("button");
//   confirmBtn.textContent = "Confirm & Submit";
//   confirmBtn.onclick = () => {
//     // Optional: localStorage.setItem("submittedFoods", JSON.stringify(data));
//     window.location.href = "submission_success.html";
//   };

//   previewDiv.appendChild(confirmBtn);
//   container.appendChild(previewDiv);

//   previewDiv.scrollIntoView({ behavior: "smooth" });
// }


let totalFoods = 0;
let currentFoodIndex = 0;
let availableIngredients = [];

const foodForm = document.getElementById("foodForm");
const submitBtn = document.getElementById("submitAll");
const successMessage = document.getElementById("successMessage");

// Fetch registered ingredients from backend
async function fetchAvailableIngredients() {
  try {
    const token = localStorage.getItem("jwtToken"); // Make sure this is set on login

    const response = await fetch("http://127.0.0.1:8080/api/vendors/getingredientnames", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ingredients.");
    }

    availableIngredients = await response.json();
    console.log("Available Ingredients:", availableIngredients);
  } catch (err) {
    console.error("Error fetching ingredients:", err);
    alert("Could not load available ingredients.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchAvailableIngredients(); // Load before form starts
});

function startEntry() {
  const foodCount = parseInt(document.getElementById("foodCount").value);
  if (isNaN(foodCount) || foodCount < 1) {
    alert("Please enter a valid number of food items.");
    return;
  }
  totalFoods = foodCount;
  const countSection = document.getElementById("food-count-section");
  countSection.style.display = "none";
  foodForm.classList.remove("hidden");
  addFoodForm();
  foodForm.scrollIntoView({ behavior: "smooth" });
}

function addFoodForm() {
  if (currentFoodIndex >= totalFoods) {
    submitBtn.classList.remove("hidden");
    submitBtn.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const foodDiv = document.createElement("div");
  foodDiv.className = "food-section";
  foodDiv.id = `food-${currentFoodIndex}`;

  foodDiv.innerHTML = `
    <h3>Food Item ${currentFoodIndex + 1}</h3>
    <label>Food Name:</label>
    <input type="text" name="foodName-${currentFoodIndex}" required />

    <label>Food Type:</label>
    <select name="foodType-${currentFoodIndex}">
      <option value="veg">Veg</option>
      <option value="non-veg">Non-Veg</option>
    </select>

    <div id="ingredients-${currentFoodIndex}">
      <label>Ingredients:</label>
      <div class="ingredient-group">
        <select class="ingredient-name">
          ${availableIngredients.map(name => `<option value="${name}">${name}</option>`).join("")}
        </select>
        <input type="number" placeholder="Quantity" class="ingredient-qty" />
        <select class="ingredient-unit">
          <option value="grams">grams</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="liters">liters</option>
          <option value="pieces">pieces</option>
        </select>
      </div>
    </div>

    <button type="button" onclick="addIngredient(${currentFoodIndex})">Add Ingredient</button>
    <button type="button" onclick="nextFood()">Next Food</button>
  `;

  foodForm.appendChild(foodDiv);
  foodDiv.scrollIntoView({ behavior: "smooth" });
}

function addIngredient(index) {
  const ingredientDiv = document.getElementById(`ingredients-${index}`);
  const group = document.createElement("div");
  group.className = "ingredient-group";

  group.innerHTML = `
    <select class="ingredient-name">
      ${availableIngredients.map(name => `<option value="${name}">${name}</option>`).join("")}
    </select>
    <input type="number" placeholder="Quantity" class="ingredient-qty" />
    <select class="ingredient-unit">
      <option value="grams">grams</option>
      <option value="kg">kg</option>
      <option value="ml">ml</option>
      <option value="liters">liters</option>
      <option value="pieces">pieces</option>
    </select>
  `;

  ingredientDiv.appendChild(group);
}

function nextFood() {
  currentFoodIndex++;
  addFoodForm();
}

function submitAllData() {
  const allData = [];

  for (let i = 0; i < totalFoods; i++) {
    const foodSection = document.getElementById(`food-${i}`);
    const foodName = foodSection.querySelector(`[name="foodName-${i}"]`).value.trim();
    const foodType = foodSection.querySelector(`[name="foodType-${i}"]`).value;

    const ingredients = [];
    const names = foodSection.querySelectorAll(".ingredient-name");
    const qtys = foodSection.querySelectorAll(".ingredient-qty");
    const units = foodSection.querySelectorAll(".ingredient-unit");

    for (let j = 0; j < names.length; j++) {
      const ingName = names[j].value.trim();
      const quantity = qtys[j].value.trim();
      if (ingName) {
        ingredients.push({
          name: ingName,
          quantity: quantity === "" ? "0" : quantity,
          unit: units[j].value
        });
      }
    }

    allData.push({
      foodName,
      foodType,
      ingredients
    });
  }

  // Hide form and preview
  foodForm.classList.add("hidden");
  submitBtn.classList.add("hidden");

  showPreview(allData);
}

function showPreview(data) {
  const container = document.querySelector(".container");
  const previewDiv = document.createElement("div");
  previewDiv.id = "previewDiv";

  const heading = document.createElement("h2");
  heading.textContent = "Preview Your Submission";
  heading.style.margin = "20px 0";
  container.appendChild(heading);

  data.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "food-section";
    card.innerHTML = `
      <h3>${idx + 1}. ${item.foodName} (${item.foodType})</h3>
      <ul>
        ${item.ingredients.map(ing => `
          <li>${ing.name}: ${ing.quantity} ${ing.unit}</li>
        `).join("")}
      </ul>
    `;
    previewDiv.appendChild(card);
  });

  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Confirm & Submit";
  confirmBtn.onclick = () => {
    // You can add a real submission API here
    console.log("Submitted:", data);
    window.location.href = "submission_success.html";
  };

  previewDiv.appendChild(confirmBtn);
  container.appendChild(previewDiv);

  previewDiv.scrollIntoView({ behavior: "smooth" });
}
