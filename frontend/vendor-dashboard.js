import { Chart } from "@/components/ui/chart"
// Vendor dashboard functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  const token = localStorage.getItem("streetsource_token")
  const user = localStorage.getItem("streetsource_user")

  if (!token || !user) {
    window.location.href = "login.html"
    return
  }

  let userData
  try {
    userData = JSON.parse(user)
    if (userData.userType !== "vendor") {
      window.location.href = userData.userType === "supplier" ? "supplier-dashboard.html" : "index.html"
      return
    }
    document.getElementById("userName").textContent = userData.firstName || "Vendor"
    document.getElementById("vendorName").textContent = userData.firstName || "Vendor"
  } catch (error) {
    window.location.href = "login.html"
    return
  }

  // Sample data
  const suppliers = [
    {
      id: 1,
      name: "Fresh Vegetables Co.",
      image: "/placeholder.svg?height=100&width=100",
      items: ["Onions", "Tomatoes", "Potatoes", "Green Chilies"],
      rating: 4.8,
      distance: "2.5 km",
      verified: true,
      contact: "+91 98765 43210",
      category: "vegetables",
      priceRange: "low",
    },
    {
      id: 2,
      name: "Spice Masters",
      image: "/placeholder.svg?height=100&width=100",
      items: ["Turmeric", "Red Chili", "Coriander", "Cumin"],
      rating: 4.9,
      distance: "1.8 km",
      verified: true,
      contact: "+91 98765 43211",
      category: "spices",
      priceRange: "medium",
    },
    {
      id: 3,
      name: "Rice & Grains Hub",
      image: "/placeholder.svg?height=100&width=100",
      items: ["Basmati Rice", "Wheat Flour", "Lentils", "Chickpeas"],
      rating: 4.7,
      distance: "3.2 km",
      verified: true,
      contact: "+91 98765 43212",
      category: "grains",
      priceRange: "low",
    },
    {
      id: 4,
      name: "Packaging Solutions",
      image: "/placeholder.svg?height=100&width=100",
      items: ["Paper Plates", "Plastic Cups", "Food Containers", "Napkins"],
      rating: 4.6,
      distance: "4.1 km",
      verified: true,
      contact: "+91 98765 43213",
      category: "packaging",
      priceRange: "medium",
    },
  ]

  const orderHistory = [
    {
      id: "ORD001",
      supplier: "Fresh Vegetables Co.",
      items: "Onions (10kg), Tomatoes (5kg)",
      amount: "₹850",
      date: "2024-01-15",
      status: "Delivered",
    },
    {
      id: "ORD002",
      supplier: "Spice Masters",
      items: "Turmeric (2kg), Red Chili (1kg)",
      amount: "₹420",
      date: "2024-01-12",
      status: "Delivered",
    },
    {
      id: "ORD003",
      supplier: "Rice & Grains Hub",
      items: "Basmati Rice (25kg)",
      amount: "₹1,200",
      date: "2024-01-10",
      status: "In Transit",
    },
  ]

  let filteredSuppliers = [...suppliers]

  // DOM elements
  const searchInput = document.getElementById("searchInput")
  const categoryFilter = document.getElementById("categoryFilter")
  const priceFilter = document.getElementById("priceFilter")
  const distanceFilter = document.getElementById("distanceFilter")
  const suppliersGrid = document.getElementById("suppliersGrid")
  const supplierCount = document.getElementById("supplierCount")
  const orderHistoryTable = document.getElementById("orderHistoryTable")

  // Initialize dashboard
  initializeDashboard()
  setupEventListeners()
  loadSalesData()

  function initializeDashboard() {
    // Set today's date as default
    const today = new Date().toISOString().split("T")[0]

    // Load dashboard stats
    loadDashboardStats()

    // Initialize charts
    initializeSalesChart()
  }

  function setupEventListeners() {
    // Add food item button
    document.getElementById("addFoodItem").addEventListener("click", addFoodItemRow)

    // Add raw material button
    document.getElementById("addRawMaterial").addEventListener("click", addRawMaterialRow)

    // Sales form submission - Updated to use your API
  salesForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(salesForm)
    const rawMaterialRows = document.querySelectorAll(".raw-material-row")

    // Prepare ingredients data for your API
    const ingredientEntries = []
    const currentDate = DateUtils.getCurrentDate()

    rawMaterialRows.forEach((row) => {
      const ingredientName = row.querySelector('[name="ingredientName"]').value
      const quantityBought = parseFloat(row.querySelector('[name="quantityBought"]').value) || 0
      const quantityUsed = parseFloat(row.querySelector('[name="quantityUsed"]').value) || 0

      if (ingredientName && quantityBought > 0 && quantityUsed > 0) {
        ingredientEntries.push({
          ingredientName,
          quantityBought,
          quantityUsed,
          date: currentDate
        })
      }
    })

    if (ingredientEntries.length === 0) {
      showMessage("Please add at least one ingredient with quantities", "error")
      return
    }

    const submitButton = salesForm.querySelector('button[type="submit"]')
    setButtonLoading(submitButton, true)

    try {
      // Call your real API
      const response = await IngredientAPI.setDailyUsage(ingredientEntries)
      
      showMessage(response.message || "Ingredient usage recorded successfully!", "success")
      
      // Refresh the usage data display
      await loadTodaysUsage()
      await loadUsageStats()
      
      // Reset form
      salesForm.reset()
      
    } catch (error) {
      console.error("Sales submission error:", error)
      showMessage(error.message || "Failed to save ingredient usage data", "error")
    } finally {
      setButtonLoading(submitButton, false)
    }
  })

    // Get prediction button
    document.getElementById("getPrediction").addEventListener("click", generatePrediction)

    // Find suppliers button
    const findSuppliersBtn = document.getElementById("findSuppliers")
    if (findSuppliersBtn) {
      findSuppliersBtn.addEventListener("click", () => {
        window.location.href = "search.html"
      })
    }

    // View analytics button
    const viewAnalyticsBtn = document.getElementById("viewAnalytics")
    if (viewAnalyticsBtn) {
      viewAnalyticsBtn.addEventListener("click", () => {
        window.location.href = "sales-analytics.html"
      })
    }

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("streetsource_token")
      localStorage.removeItem("streetsource_user")
      window.location.href = "login.html"
    })
  }

  function addFoodItemRow() {
    const container = document.getElementById("foodItemsContainer")
    const newRow = document.createElement("div")
    newRow.className = "food-item-row"
    newRow.innerHTML = `
      <div class="form-group">
        <label>Food Item</label>
        <select class="food-item-select" name="foodItem">
          <option value="">Select Item</option>
          <option value="pani-puri">Pani Puri</option>
          <option value="bhel-puri">Bhel Puri</option>
          <option value="dosa">Dosa</option>
          <option value="vada-pav">Vada Pav</option>
          <option value="samosa">Samosa</option>
          <option value="chai">Chai</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label>Quantity Sold</label>
        <input type="number" name="quantity" placeholder="e.g., 50" min="0">
      </div>
      <div class="form-group">
        <label>Revenue (₹)</label>
        <input type="number" name="revenue" placeholder="e.g., 500" min="0">
      </div>
      <button type="button" class="btn-remove" onclick="removeFoodItem(this)">
        <i class="fas fa-trash"></i>
      </button>
    `
    container.appendChild(newRow)
  }

  function addRawMaterialRow() {
    const container = document.getElementById("rawMaterialsContainer")
    const newRow = document.createElement("div")
    newRow.className = "raw-material-row"
    newRow.innerHTML = `
      <div class="form-group">
        <label>Ingredient Name</label>
        <select class="raw-material-select" name="ingredientName">
          <option value="">Select Ingredient</option>
          <option value="Tomatoes">Tomatoes</option>
          <option value="Onions">Onions</option>
          <option value="Potatoes">Potatoes</option>
          <option value="Oil">Oil</option>
          <option value="Flour">Flour</option>
          <option value="Rice">Rice</option>
          <option value="Spices">Spices</option>
          <option value="Green Chilies">Green Chilies</option>
          <option value="Garlic">Garlic</option>
          <option value="Ginger">Ginger</option>
        </select>
      </div>
      <div class="form-group">
        <label>Quantity Bought</label>
        <input type="number" name="quantityBought" placeholder="e.g., 10" min="0" step="0.1" required>
      </div>
      <div class="form-group">
        <label>Quantity Used</label>
        <input type="number" name="quantityUsed" placeholder="e.g., 8" min="0" step="0.1" required>
      </div>
      <button type="button" class="btn-remove" onclick="removeRawMaterial(this)">
        <i class="fas fa-trash"></i>
      </button>
    `
    container.appendChild(newRow)
  }

  // Global functions for removing rows
  window.removeFoodItem = (button) => {
    const row = button.closest(".food-item-row")
    const container = row.parentElement
    if (container.children.length > 1) {
      row.remove()
    } else {
      alert("At least one food item is required")
    }
  }

  window.removeRawMaterial = (button) => {
    const row = button.closest(".raw-material-row")
    const container = row.parentElement
    if (container.children.length > 1) {
      row.remove()
    } else {
      alert("At least one raw material is required")
    }
  }

  // API_ENDPOINT: POST /sales/daily - Submit daily sales data
  async function handleSalesSubmission(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const salesData = {
      date: new Date().toISOString().split("T")[0],
      vendorId: userData.id,
      foodItems: [],
      rawMaterials: [],
    }

    // Collect food items data
    const foodRows = document.querySelectorAll(".food-item-row")
    foodRows.forEach((row) => {
      const foodItem = row.querySelector('[name="foodItem"]').value
      const quantity = row.querySelector('[name="quantity"]').value
      const revenue = row.querySelector('[name="revenue"]').value

      if (foodItem && quantity && revenue) {
        salesData.foodItems.push({
          item: foodItem,
          quantity: Number.parseInt(quantity),
          revenue: Number.parseFloat(revenue),
        })
      }
    })

    // Collect raw materials data
    const materialRows = document.querySelectorAll(".raw-material-row")
    materialRows.forEach((row) => {
      const material = row.querySelector('[name="rawMaterial"]').value
      const quantityUsed = row.querySelector('[name="quantityUsed"]').value
      const unit = row.querySelector('[name="unit"]').value

      if (material && quantityUsed && unit) {
        salesData.rawMaterials.push({
          material: material,
          quantityUsed: Number.parseFloat(quantityUsed),
          unit: unit,
        })
      }
    })

    if (salesData.foodItems.length === 0) {
      alert("Please add at least one food item")
      return
    }

    if (salesData.rawMaterials.length === 0) {
      alert("Please add at least one raw material")
      return
    }

    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]')
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'
      submitBtn.disabled = true

      // API_ENDPOINT: POST /sales/daily - Submit daily sales data
      const response = await mockSalesSubmissionAPI(salesData)

      if (response.success) {
        alert("Sales data saved successfully!")

        // Reset form
        e.target.reset()

        // Reload dashboard stats
        loadDashboardStats()
        loadSalesData()

        // Enable prediction button
        document.getElementById("getPrediction").disabled = false
      }

      // Reset button
      submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Today\'s Data'
      submitBtn.disabled = false
    } catch (error) {
      console.error("Failed to save sales data:", error)
      alert("Failed to save sales data. Please try again.")
    }
  }

  // API_ENDPOINT: POST /prediction/generate - Generate AI prediction
  async function generatePrediction() {
    try {
      const btn = document.getElementById("getPrediction")
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...'
      btn.disabled = true

      // API_ENDPOINT: POST /prediction/generate - Generate AI prediction based on sales data
      const predictionData = await mockPredictionAPI(userData.id)

      displayPredictions(predictionData)

      // Reset button
      btn.innerHTML = '<i class="fas fa-brain"></i> Get AI Prediction'
      btn.disabled = false
    } catch (error) {
      console.error("Failed to generate prediction:", error)
      alert("Failed to generate prediction. Please try again.")
    }
  }

  function displayPredictions(data) {
    // Show predictions card
    document.getElementById("predictionsCard").style.display = "block"

    // Update prediction stats
    document.getElementById("predictedSales").textContent = `₹${data.predictedSales}`
    document.getElementById("confidenceLevel").textContent = `${data.confidence}%`

    // Display recommended materials
    const materialsList = document.getElementById("materialsList")
    materialsList.innerHTML = data.recommendedMaterials
      .map(
        (material) => `
        <div class="material-card">
          <div class="material-icon">
            <i class="${material.icon}"></i>
          </div>
          <div class="material-details">
            <div class="material-name">${material.name}</div>
            <div class="material-quantity">Recommended: ${material.quantity} ${material.unit}</div>
          </div>
          <div class="material-priority priority-${material.priority}">
            ${material.priority.toUpperCase()}
          </div>
        </div>
      `,
      )
      .join("")

    // Scroll to predictions
    document.getElementById("predictionsCard").scrollIntoView({ behavior: "smooth" })
  }

  // Load today's usage data
  async function loadTodaysUsage() {
    try {
      const today = DateUtils.getCurrentDate()
      const usageData = await IngredientAPI.getUsageByDate(today)
      displayUsageData(usageData, "Today's Usage")
    } catch (error) {
      console.error("Error loading today's usage:", error)
    }
  }

  // Load usage statistics
  async function loadUsageStats() {
    try {
      const { month, year } = DateUtils.getCurrentMonth()
      const monthlyData = await IngredientAPI.getUsageByMonth(month, year)
      
      // Calculate statistics from monthly data
      const stats = calculateUsageStats(monthlyData)
      updateDashboardStats(stats)
    } catch (error) {
      console.error("Error loading usage stats:", error)
    }
  }

  // Calculate usage statistics
  function calculateUsageStats(data) {
    const totalBought = data.reduce((sum, item) => sum + item.quantityBought, 0)
    const totalUsed = data.reduce((sum, item) => sum + item.quantityUsed, 0)
    const wastePercentage = totalBought > 0 ? ((totalBought - totalUsed) / totalBought * 100).toFixed(1) : 0
    
    return {
      totalBought: totalBought.toFixed(1),
      totalUsed: totalUsed.toFixed(1),
      wastePercentage
    }
  }

  // Display usage data in a table or cards
  function displayUsageData(data, title) {
    const usageContainer = document.getElementById('usageDataContainer') || createUsageContainer()
    
    let html = `<h3>${title}</h3>`
    
    if (data.length === 0) {
      html += '<p>No usage data found for this period.</p>'
    } else {
      html += `
        <div class="usage-table-container">
          <table class="usage-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Bought (kg)</th>
                <th>Used (kg)</th>
                <th>Waste</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
      `
      
      data.forEach(item => {
        const waste = (item.quantityBought - item.quantityUsed).toFixed(1)
        const wastePercentage = ((waste / item.quantityBought) * 100).toFixed(1)
        
        html += `
          <tr>
            <td>${item.ingredientName}</td>
            <td>${item.quantityBought}</td>
            <td>${item.quantityUsed}</td>
            <td>${waste} kg (${wastePercentage}%)</td>
            <td>${item.date}</td>
          </tr>
        `
      })
      
      html += `
            </tbody>
          </table>
        </div>
      `
    }
    
    usageContainer.innerHTML = html
  }

  // Weekly usage data
  async function loadWeeklyUsage() {
    try {
      const today = new Date()
      const weekAgo = new Date(today)
      weekAgo.setDate(today.getDate() - 7)
      
      const startDate = DateUtils.formatDate(weekAgo)
      const endDate = DateUtils.formatDate(today)
      
      const usageData = await IngredientAPI.getUsageByRange(startDate, endDate)
      displayUsageData(usageData, "This Week's Usage")
    } catch (error) {
      console.error("Error loading weekly usage:", error)
      showMessage("Failed to load weekly usage data", "error")
    }
  }

  // Monthly usage data
  async function loadMonthlyUsage() {
    try {
      const { month, year } = DateUtils.getCurrentMonth()
      const usageData = await IngredientAPI.getUsageByMonth(month, year)
      displayUsageData(usageData, "This Month's Usage")
    } catch (error) {
      console.error("Error loading monthly usage:", error)
      showMessage("Failed to load monthly usage data", "error")
    }
  }

  // Custom date range
  async function loadCustomRange() {
    try {
      const startDate = document.getElementById('startDate').value
      const endDate = document.getElementById('endDate').value
      
      if (!startDate || !endDate) {
        showMessage("Please select both start and end dates", "error")
        return
      }
      
      if (new Date(startDate) > new Date(endDate)) {
        showMessage("Start date cannot be after end date", "error")
        return
      }
      
      const usageData = await IngredientAPI.getUsageByRange(startDate, endDate)
      displayUsageData(usageData, `Usage from ${startDate} to ${endDate}`)
    } catch (error) {
      console.error("Error loading custom range usage:", error)
      showMessage("Failed to load usage data for selected range", "error")
    }
  }

  // Make functions globally available
  window.loadTodaysUsage = loadTodaysUsage
  window.loadWeeklyUsage = loadWeeklyUsage
  window.loadMonthlyUsage = loadMonthlyUsage
  window.loadCustomRange = loadCustomRange

  // Load initial data
  loadTodaysUsage()
  loadUsageStats()
  async function loadDashboardStats() {
    try {
      // API_ENDPOINT: GET /sales/stats - Load dashboard statistics
      const stats = await mockStatsAPI(userData.id)

      document.getElementById("todaySales").textContent = `₹${stats.todaySales}`
      document.getElementById("weekSales").textContent = `₹${stats.weekSales}`
      document.getElementById("monthSales").textContent = `₹${stats.monthSales}`
    } catch (error) {
      console.error("Failed to load dashboard stats:", error)
    }
  }

  // API_ENDPOINT: GET /sales/history - Get sales history
  async function loadSalesData() {
    try {
      // API_ENDPOINT: GET /sales/history - Load sales history
      const salesHistory = await mockSalesHistoryAPI(userData.id)

      updateSalesChart(salesHistory.chartData)
      updateSalesTable(salesHistory.recentSales)
    } catch (error) {
      console.error("Failed to load sales data:", error)
    }
  }

  function initializeSalesChart() {
    const ctx = document.getElementById("salesChart").getContext("2d")

    window.salesChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Daily Sales",
            data: [],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Sales (₹)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
        },
      },
    })
  }

  function updateSalesChart(chartData) {
    if (window.salesChart) {
      window.salesChart.data.labels = chartData.labels
      window.salesChart.data.datasets[0].data = chartData.values
      window.salesChart.update()
    }
  }

  function updateSalesTable(salesData) {
    const tableBody = document.getElementById("salesTableBody")
    tableBody.innerHTML = salesData
      .map(
        (sale) => `
        <tr>
          <td>${sale.date}</td>
          <td>₹${sale.totalSales}</td>
          <td>${sale.itemsSold}</td>
          <td>${sale.topItem}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-outline btn-sm" onclick="viewSaleDetails('${sale.id}')">
                <i class="fas fa-eye"></i>
                View
              </button>
              <button class="btn btn-outline btn-sm" onclick="editSale('${sale.id}')">
                <i class="fas fa-edit"></i>
                Edit
              </button>
            </div>
          </td>
        </tr>
      `,
      )
      .join("")
  }

  // Global functions for table actions
  window.viewSaleDetails = (saleId) => {
    // Implement view sale details functionality
  }

  window.editSale = (saleId) => {
    // Implement edit sale functionality
  }

  // Mock API functions - replace with actual API calls
  async function mockSalesSubmissionAPI(salesData) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return { success: true, message: "Sales data saved successfully" }
  }

  async function mockPredictionAPI(vendorId) {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    return {
      predictedSales: 1250,
      confidence: 87,
      recommendedMaterials: [
        {
          name: "Onions",
          quantity: 8,
          unit: "kg",
          priority: "high",
          icon: "fas fa-seedling",
        },
        {
          name: "Tomatoes",
          quantity: 5,
          unit: "kg",
          priority: "medium",
          icon: "fas fa-seedling",
        },
        {
          name: "Oil",
          quantity: 2,
          unit: "liters",
          priority: "high",
          icon: "fas fa-tint",
        },
        {
          name: "Flour",
          quantity: 3,
          unit: "kg",
          priority: "low",
          icon: "fas fa-wheat-awn",
        },
      ],
    }
  }

  async function mockStatsAPI(vendorId) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      todaySales: 850,
      weekSales: 5200,
      monthSales: 22500,
    }
  }

  async function mockSalesHistoryAPI(vendorId) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const labels = []
    const values = []

    // Generate last 7 days data
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      labels.push(date.toLocaleDateString())
      values.push(Math.round(500 + Math.random() * 800))
    }

    return {
      chartData: { labels, values },
      recentSales: [
        {
          id: "1",
          date: "2024-01-15",
          totalSales: 850,
          itemsSold: 45,
          topItem: "Pani Puri",
        },
        {
          id: "2",
          date: "2024-01-14",
          totalSales: 920,
          itemsSold: 52,
          topItem: "Dosa",
        },
        {
          id: "3",
          date: "2024-01-13",
          totalSales: 780,
          itemsSold: 38,
          topItem: "Vada Pav",
        },
        {
          id: "4",
          date: "2024-01-12",
          totalSales: 1100,
          itemsSold: 65,
          topItem: "Pani Puri",
        },
        {
          id: "5",
          date: "2024-01-11",
          totalSales: 650,
          itemsSold: 32,
          topItem: "Chai",
        },
      ],
    }
  }

  function filterSuppliers() {
    const searchQuery = searchInput.value.toLowerCase()
    const category = categoryFilter.value
    const price = priceFilter.value
    const distance = distanceFilter.value

    filteredSuppliers = suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchQuery) ||
        supplier.items.some((item) => item.toLowerCase().includes(searchQuery))
      const matchesCategory = category === "all" || supplier.category === category
      const matchesPrice = price === "all" || supplier.priceRange === price
      const matchesDistance =
        distance === "all" ||
        (distance === "near" && Number.parseFloat(supplier.distance) <= 3) ||
        (distance === "far" && Number.parseFloat(supplier.distance) > 3)

      return matchesSearch && matchesCategory && matchesPrice && matchesDistance
    })

    renderSuppliers()
  }

  function renderSuppliers() {
    supplierCount.textContent = filteredSuppliers.length

    suppliersGrid.innerHTML = filteredSuppliers
      .map(
        (supplier) => `
            <div class="supplier-card">
                <div class="supplier-header">
                    <div class="supplier-avatar">
                        <img src="${supplier.image}" alt="${supplier.name}">
                    </div>
                    <div class="supplier-info">
                        <h3 class="supplier-name">${supplier.name}</h3>
                        <div class="supplier-meta">
                            <div class="meta-item">
                                <i class="fas fa-star"></i>
                                <span class="rating">${supplier.rating}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${supplier.distance}</span>
                            </div>
                        </div>
                    </div>
                    ${supplier.verified ? '<div class="badge badge-success">Verified</div>' : ""}
                </div>
                
                <div class="supplier-items">
                    <div class="items-label">Available Items:</div>
                    <div class="items-tags">
                        ${supplier.items
                          .slice(0, 3)
                          .map((item) => `<span class="item-tag">${item}</span>`)
                          .join("")}
                        ${supplier.items.length > 3 ? `<span class="item-tag">+${supplier.items.length - 3} more</span>` : ""}
                    </div>
                </div>
                
                <div class="supplier-contact">
                    <i class="fas fa-phone"></i>
                    <span>${supplier.contact}</span>
                </div>
                
                <div class="supplier-actions">
                    <a href="supplier-profile.html?id=${supplier.id}" class="btn btn-outline btn-sm">
                        <i class="fas fa-eye"></i>
                        View Profile
                    </a>
                    <button class="btn btn-primary btn-sm">
                        <i class="fas fa-shopping-cart"></i>
                        Order
                    </button>
                </div>
            </div>
        `,
      )
      .join("")
  }

  function renderOrderHistory() {
    orderHistoryTable.innerHTML = orderHistory
      .map(
        (order) => `
            <tr>
                <td class="font-medium">${order.id}</td>
                <td>${order.supplier}</td>
                <td>${order.items}</td>
                <td class="font-semibold">${order.amount}</td>
                <td>${order.date}</td>
                <td>
                    <div class="badge ${order.status === "Delivered" ? "badge-success" : "badge-primary"}">
                        ${order.status}
                    </div>
                </td>
            </tr>
        `,
      )
      .join("")
  }
})
