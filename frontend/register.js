// Import or declare authManager, showMessage, and setButtonLoading here
const authManager = {
  isAuthenticated: () => false,
  getUser: () => null,
  redirectBasedOnUserType: (user) => console.log("Redirecting based on user type:", user),
  register: async (userData) => {
    return { success: true, user: { userType: "admin" } }
  },
}

const showMessage = (message, type = "error") => {
  console.log(`Message (${type}): ${message}`)
}

const setButtonLoading = (button, isLoading) => {
  if (isLoading) {
    button.disabled = true
    button.textContent = "Loading..."
  } else {
    button.disabled = false
    button.textContent = "Register"
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm")

  // Check if user is already logged in
  if (authManager.isAuthenticated()) {
    const user = authManager.getUser()
    if (user) {
      authManager.redirectBasedOnUserType(user)
      return
    }
  }

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(registerForm)
    const userData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      userType: formData.get("userType"),
      businessName: formData.get("businessName"),
      location: formData.get("location"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      agreeTerms: formData.get("agreeTerms"),
    }

    // Validation
    const validationResult = validateRegistrationData(userData)
    if (!validationResult.isValid) {
      showMessage(validationResult.message)
      return
    }

    const submitButton = registerForm.querySelector('button[type="submit"]')
    setButtonLoading(submitButton, true)

    try {
      const result = await authManager.register(userData)

      if (result.success) {
        showMessage("Registration successful! Redirecting...", "success")

        // Redirect after a short delay
        setTimeout(() => {
          authManager.redirectBasedOnUserType(result.user)
        }, 1500)
      } else {
        showMessage(result.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      showMessage("An error occurred. Please try again.")
    } finally {
      setButtonLoading(submitButton, false)
    }
  })

  function validateRegistrationData(data) {
    // Check required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "userType",
      "businessName",
      "location",
      "password",
      "confirmPassword",
    ]

    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === "") {
        return {
          isValid: false,
          message: `Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()} field`,
        }
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        isValid: false,
        message: "Please enter a valid email address",
      }
    }

    // Phone validation (basic)
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(data.phone.replace(/[\s\-$$$$]/g, ""))) {
      return {
        isValid: false,
        message: "Please enter a valid phone number",
      }
    }

    // Password validation
    if (data.password.length < 6) {
      return {
        isValid: false,
        message: "Password must be at least 6 characters long",
      }
    }

    // Password confirmation
    if (data.password !== data.confirmPassword) {
      return {
        isValid: false,
        message: "Passwords do not match",
      }
    }

    // Terms agreement
    if (!data.agreeTerms) {
      return {
        isValid: false,
        message: "Please agree to the Terms of Service and Privacy Policy",
      }
    }

    return { isValid: true }
  }

  // Real-time password confirmation validation
  const passwordInput = document.getElementById("password")
  const confirmPasswordInput = document.getElementById("confirmPassword")

  function validatePasswordMatch() {
    if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.setCustomValidity("Passwords do not match")
    } else {
      confirmPasswordInput.setCustomValidity("")
    }
  }

  passwordInput.addEventListener("input", validatePasswordMatch)
  confirmPasswordInput.addEventListener("input", validatePasswordMatch)
})
