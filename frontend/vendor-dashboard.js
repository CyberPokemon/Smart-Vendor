document.addEventListener("DOMContentLoaded", () => {
  populateVendorInfo()
  setupLogout()
  loadMenuItems()
})

async function loadMenuItems() {
  const token = localStorage.getItem("jwtToken");
  const container = document.getElementById("menuItemsContainer");

  if (!token || !container) return;

  try {
    const response = await fetch(`/api/vendors/getmenu`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch menu");

    const menu = await response.json();
    container.innerHTML = "";

    if (menu.length === 0) {
      container.innerHTML = "<p>No menu items available.</p>";
      return;
    }

    const tableHTML = `
      <div class="menu-table-container">
        <table class="menu-table">
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Type</th>
              <th>Price (₹)</th>
              <th>Ingredients</th>
            </tr>
          </thead>
          <tbody>
            ${menu
              .map(
                item => `
              <tr>
                <td>${item.foodName}</td>
                <td><span class="food-type-tag">${item.foodType}</span></td>
                <td>${item.price}</td>
                <td>
                  <ul class="ingredients-list">
                    ${item.ingredientNames
                      .map(
                        ing =>
                          `<li>${ing.ingredientName} - ${ing.amount} ${ing.unitType}</li>`
                      )
                      .join("")}
                  </ul>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = tableHTML;
  } catch (err) {
    console.error("Error loading menu:", err);
    container.innerHTML = "<p>Failed to load menu.</p>";
  }
}



async function populateVendorInfo() {
  const token = localStorage.getItem("jwtToken")

  if (!token) return

  try {
    const response = await fetch(`${API_BASE_URL}/api/vendors/getuserdetails`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user details")
    }

    const data = await response.json()

    // Set values in the DOM
    document.getElementById("vendorName").textContent = data.name || "Vendor"
    document.getElementById("vendorBusiness").textContent = data.businessname || "Your Business"
    document.getElementById("vendorAddress").textContent = data.addresss || "Your Address"
  } catch (err) {
    console.error("Error loading vendor info:", err)
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user")
      localStorage.removeItem("jwtToken")
      window.location.href = "index.html"
    })
  }
}
