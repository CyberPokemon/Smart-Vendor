// Landing page functionality
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Check authentication status
  checkAuthStatus()

  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout)
  }
  // Initialize testimonial carousel if on home page
  if (document.querySelector(".testimonials")) {
    initializeTestimonials()
  }

  // Set up smooth scrolling for anchor links
  setupSmoothScrolling()
}

function checkAuthStatus() {
  const user = getCurrentUser()
  const token = localStorage.getItem("jwtToken")
  const authButtons = document.getElementById("authButtons")
  const userMenu = document.getElementById("userMenu")

  if (user && token && authButtons && userMenu) {
    // User is logged in
    authButtons.style.display = "none"
    userMenu.style.display = "flex"

    const userNameElement = document.getElementById("userName")
    if (userNameElement) {
      userNameElement.textContent = `Welcome, ${user.firstName}!`
    }
  } else if (authButtons && userMenu) {
    // User is not logged in
    authButtons.style.display = "flex"
    userMenu.style.display = "none"
  }
}

function getCurrentUser() {
  try {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error("Error parsing user data:", error)
    return null
  }
}

function logout() {
  // Clear user data
  localStorage.removeItem("user")
  localStorage.removeItem("jwtToken")
  localStorage.removeItem("salesData")
  localStorage.removeItem("orders")

  // Redirect to home page
  window.location.href = "index.html"
}

// Testimonials functionality
let currentTestimonial = 0
const testimonials = document.querySelectorAll(".testimonial-card")
const dots = document.querySelectorAll(".dot")

function initializeTestimonials() {
  if (testimonials.length > 0) {
    // Auto-rotate testimonials every 5 seconds
    setInterval(nextTestimonial, 5000)
  }
}

function showTestimonial(index) {
  // Hide all testimonials
  testimonials.forEach((testimonial) => {
    testimonial.classList.remove("active")
  })

  // Remove active class from all dots
  dots.forEach((dot) => {
    dot.classList.remove("active")
  })

  // Show selected testimonial
  if (testimonials[index]) {
    testimonials[index].classList.add("active")
  }

  // Activate corresponding dot
  if (dots[index]) {
    dots[index].classList.add("active")
  }

  currentTestimonial = index
}

function nextTestimonial() {
  const nextIndex = (currentTestimonial + 1) % testimonials.length
  showTestimonial(nextIndex)
}

function setupSmoothScrolling() {
  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

function formatTime(date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date))
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments

    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Export functions for use in other scripts
window.getCurrentUser = getCurrentUser
window.logout = logout
window.showTestimonial = showTestimonial
window.formatCurrency = formatCurrency
window.formatDate = formatDate
window.formatTime = formatTime
window.generateId = generateId
window.debounce = debounce
window.throttle = throttle
