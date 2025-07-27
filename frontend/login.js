document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const loginBtn = document.getElementById("loginBtn")
  const btnText = loginBtn.querySelector(".btn-text")
  const btnLoader = loginBtn.querySelector(".btn-loader")

  // Declare authManager, validateEmail, and showToast variables
  const authManager = {
    isAuthenticated: () => {
      const token = localStorage.getItem("streetsource_token");
      return !!token;
    },
    getUser: () => {
      const user = localStorage.getItem("streetsource_user");
      try {
        return user ? JSON.parse(user) : null;
      } catch {
        return null;
      }
    },
    login: async (credentials) => {
      // Demo login credentials
      const demoUsers = {
        'vendor@demo.com': {
          id: 1,
          email: 'vendor@demo.com',
          firstName: "Demo",
          lastName: "Vendor",
          userType: "vendor",
          businessName: "Demo Street Food",
          profileSetupComplete: false
        },
        'vendor2@demo.com': {
          id: 2,
          email: 'vendor2@demo.com',
          firstName: "Returning",
          lastName: "Vendor",
          userType: "vendor",
          businessName: "Established Food Stall",
          profileSetupComplete: true
        },
        'supplier@demo.com': {
          id: 3,
          email: 'supplier@demo.com',
          firstName: "Demo",
          lastName: "Supplier",
          userType: "supplier",
          businessName: "Fresh Supplies Co."
        }
      };

      // Check demo credentials
      const user = demoUsers[credentials.email];
      if (user && credentials.password === 'demo123') {
        localStorage.setItem("streetsource_token", "demo_token_" + Date.now());
        localStorage.setItem("streetsource_user", JSON.stringify(user));

        // For returning vendor, simulate existing profile setup
        if (user.email === 'vendor2@demo.com') {
          const profileSetup = {
            userId: user.id,
            foodType: "both",
            foodItems: ["Pani Puri", "Vada Pav", "Chai", "Samosa"],
            ingredients: ["Onions", "Tomatoes", "Potatoes", "Oil", "Flour", "Spices"],
            foodIngredientMapping: {
              "Pani Puri": ["Onions", "Tomatoes", "Spices"],
              "Vada Pav": ["Potatoes", "Oil", "Flour"],
              "Chai": ["Milk", "Sugar"],
              "Samosa": ["Potatoes", "Oil", "Flour", "Spices"]
            },
            setupCompletedAt: new Date().toISOString()
          };
          localStorage.setItem('vendor_profile_setup', JSON.stringify(profileSetup));
        }

        return { success: true, user };
      }

      // If not demo credentials, show error
      throw new Error("Invalid credentials. Use demo credentials:\nvendor@demo.com / demo123\nvendor2@demo.com / demo123\nsupplier@demo.com / demo123");
    },
    redirectBasedOnUserType: (user) => {
      // Check if profile setup is complete for vendors
      const profileSetup = localStorage.getItem('vendor_profile_setup');
      
      if (user.userType === "vendor" && !profileSetup) {
        // First time vendor - go to basic details setup
        window.location.href = "basic-details.html";
      } else if (user.userType === "vendor") {
        // Returning vendor - go to prediction dashboard
        window.location.href = "prediction-dashboard.html";
      } else if (user.userType === "supplier") {
        window.location.href = "supplier-dashboard.html";
      } else {
        window.location.href = "index.html";
      }
    },
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const showMessage = (message, type = "error") => {
    console.log(`${type}: ${message}`)
  }

  // Check if already authenticated
  if (authManager.isAuthenticated()) {
    const user = authManager.getUser()
    if (user) {
      authManager.redirectBasedOnUserType(user)
      return
    }
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(loginForm)
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    }

    // Basic validation
    if (!credentials.email || !credentials.password) {
      showMessage("Please fill in all fields")
      return
    }

    const submitButton = loginForm.querySelector('button[type="submit"]')
    setButtonLoading(submitButton, true)

    try {
      const result = await authManager.login(credentials)

      if (result.success) {
        showMessage("Login successful! Redirecting...", "success")

        // Redirect after a short delay
        setTimeout(() => {
          authManager.redirectBasedOnUserType(result.user)
        }, 1500)
      } else {
        showMessage(result.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      showMessage("An error occurred. Please try again.")
    } finally {
      setButtonLoading(submitButton, false)
    }
  })

  function setButtonLoading(button, loading) {
    button.disabled = loading
    button.querySelector(".btn-text").style.display = loading ? "none" : "inline"
    button.querySelector(".btn-loader").style.display = loading ? "flex" : "none"
  }

  // Add demo credentials helper to the page
  function addDemoCredentials() {
    const demoSection = document.createElement("div")
    demoSection.innerHTML = `
      <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-lg); text-align: center;">
        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;"><strong>Demo Credentials:</strong></p>
        <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem;">
          <button type="button" class="btn btn-outline btn-sm" onclick="fillDemoCredentials('new-vendor')">
            New Vendor (Basic Details Flow)
          </button>
          <button type="button" class="btn btn-outline btn-sm" onclick="fillDemoCredentials('returning-vendor')">
            Returning Vendor (Direct to Predictor)
          </button>
          <button type="button" class="btn btn-outline btn-sm" onclick="fillDemoCredentials('supplier')">
            Supplier
          </button>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-secondary);">
          <p>All passwords: <strong>demo123</strong></p>
        </div>
      </div>
    `

    // Insert after the form
    const form = document.getElementById("loginForm")
    form.parentNode.insertBefore(demoSection, form.nextSibling)
  }

  // Global function to fill demo credentials
  window.fillDemoCredentials = function(userType) {
    const emailInput = document.getElementById("email")
    const passwordInput = document.getElementById("password")
    
    switch(userType) {
      case 'new-vendor':
        emailInput.value = "vendor@demo.com"
        passwordInput.value = "demo123"
        break
      case 'returning-vendor':
        emailInput.value = "vendor2@demo.com"
        passwordInput.value = "demo123"
        break
      case 'supplier':
        emailInput.value = "supplier@demo.com"
        passwordInput.value = "demo123"
        break
    }
  }

  // Add demo credentials section
  addDemoCredentials()

  // Demo credentials helper
  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")

  // Add demo credentials buttons (for development)
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    const demoSection = document.createElement("div")
    demoSection.innerHTML = `
      <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-lg); text-align: center;">
        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Demo Credentials:</p>
        <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-outline btn-sm" onclick="fillDemoCredentials('vendor')">
            Vendor Demo
          </button>
          <button type="button" class="btn btn-outline btn-sm" onclick="fillDemoCredentials('supplier')">
            Supplier Demo
          </button>
        </div>
      </div>
    `
    loginForm.appendChild(demoSection)

    window.fillDemoCredentials = (type) => {
      if (type === "vendor") {
        emailInput.value = "vendor@example.com"
        passwordInput.value = "password123"
      } else if (type === "supplier") {
        emailInput.value = "supplier@example.com"
        passwordInput.value = "password123"
      }
    }
  }

  // Auto-focus on email input
  document.getElementById("email").focus()
})
