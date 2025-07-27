document.addEventListener("DOMContentLoaded", () => {
  populateVendorInfo()
  setupLogout()
})

async function populateVendorInfo() {
  const token = localStorage.getItem("jwtToken")

  if (!token) return

  try {
    const response = await fetch("http://127.0.0.1:8080/api/vendors/getuserdetails", {
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
