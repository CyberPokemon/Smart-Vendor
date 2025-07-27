document.addEventListener("DOMContentLoaded", () => {
  const forgotPasswordForm = document.getElementById("forgotPasswordForm")

  // Declare variables before using them
  const showMessage = (message, type = "error") => {
    const messageElement = document.createElement("div")
    messageElement.textContent = message
    messageElement.className = `message ${type}`
    document.body.appendChild(messageElement)
    setTimeout(() => {
      document.body.removeChild(messageElement)
    }, 3000)
  }

  const setButtonLoading = (button, isLoading) => {
    if (isLoading) {
      button.disabled = true
      button.textContent = "Loading..."
    } else {
      button.disabled = false
      button.textContent = "Send Reset Instructions"
    }
  }

  const authManager = {
    forgotPassword: async (email) => {
      // Simulate forgot password API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: "Reset instructions sent successfully!" })
        }, 1000)
      })
    },
  }

  forgotPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(forgotPasswordForm)
    const email = formData.get("email")

    // Basic validation
    if (!email) {
      showMessage("Please enter your email address")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email address")
      return
    }

    const submitButton = forgotPasswordForm.querySelector('button[type="submit"]')
    setButtonLoading(submitButton, true)

    try {
      const result = await authManager.forgotPassword(email)

      if (result.success) {
        showMessage(result.message, "success")

        // Reset form
        forgotPasswordForm.reset()

        // Redirect to login after showing success message
        setTimeout(() => {
          window.location.href = "login.html"
        }, 3000)
      } else {
        showMessage(result.message || "Failed to send reset instructions")
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      showMessage("An error occurred. Please try again.")
    } finally {
      setButtonLoading(submitButton, false)
    }
  })
})
