import { Chart } from "@/components/ui/chart"
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
    document.getElementById("userName").textContent = userData.firstName || "User"
  } catch (error) {
    window.location.href = "login.html"
    return
  }

  // Initialize analytics dashboard
  initializeDashboard()
  setupEventListeners()

  function initializeDashboard() {
    // Set default date range (last 30 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    document.getElementById("startDate").value = startDate.toISOString().split("T")[0]
    document.getElementById("endDate").value = endDate.toISOString().split("T")[0]

    // Load initial data
    loadAnalyticsData()
  }

  function setupEventListeners() {
    // Date range filters
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        setQuickFilter(Number.parseInt(e.target.dataset.period))
      })
    })

    // Apply filter button
    document.getElementById("applyFilter").addEventListener("click", loadAnalyticsData)

    // Export buttons
    document.getElementById("exportPDF").addEventListener("click", exportToPDF)
    document.getElementById("exportExcel").addEventListener("click", exportToExcel)
    document.getElementById("exportCSV").addEventListener("click", exportToCSV)

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("streetsource_token")
      localStorage.removeItem("streetsource_user")
      window.location.href = "login.html"
    })
  }

  function setQuickFilter(days) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    document.getElementById("startDate").value = startDate.toISOString().split("T")[0]
    document.getElementById("endDate").value = endDate.toISOString().split("T")[0]

    // Update active filter button
    document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"))
    document.querySelector(`[data-period="${days}"]`).classList.add("active")

    loadAnalyticsData()
  }

  // API_ENDPOINT: GET /analytics/sales - Get sales analytics data
  async function loadAnalyticsData() {
    const startDate = document.getElementById("startDate").value
    const endDate = document.getElementById("endDate").value

    try {
      // API_ENDPOINT: GET /analytics/sales - Load sales analytics
      const analyticsData = await mockAnalyticsAPI(userData.id, startDate, endDate)

      updateMetrics(analyticsData.metrics)
      renderSalesTrendsChart(analyticsData.trends)
      renderProductPerformanceChart(analyticsData.products)
      renderHourlyChart(analyticsData.hourly)
      renderCustomerChart(analyticsData.customers)
      updateTopProducts(analyticsData.topProducts)
      updatePeakHours(analyticsData.peakHours)
      updateCustomerStats(analyticsData.customerStats)
    } catch (error) {
      console.error("Failed to load analytics data:", error)
    }
  }

  // Mock API function - replace with actual API call
  async function mockAnalyticsAPI(userId, startDate, endDate) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate mock analytics data
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))

    return {
      metrics: {
        totalRevenue: Math.round(15000 + Math.random() * 10000),
        totalOrders: Math.round(200 + Math.random() * 100),
        avgOrderValue: Math.round(75 + Math.random() * 25),
        totalCustomers: Math.round(150 + Math.random() * 50),
        revenueChange: Math.round(-5 + Math.random() * 20),
        ordersChange: Math.round(-3 + Math.random() * 15),
        aovChange: Math.round(-2 + Math.random() * 10),
        customersChange: Math.round(-1 + Math.random() * 12),
      },
      trends: generateTrendsData(days),
      products: generateProductData(),
      hourly: generateHourlyData(),
      customers: generateCustomerData(),
      topProducts: generateTopProducts(),
      peakHours: {
        morning: "8:00 AM - 10:00 AM",
        lunch: "12:00 PM - 2:00 PM",
        evening: "6:00 PM - 8:00 PM",
      },
      customerStats: {
        new: Math.round(30 + Math.random() * 20),
        returning: Math.round(120 + Math.random() * 30),
        retention: Math.round(75 + Math.random() * 15),
      },
    }
  }

  function updateMetrics(metrics) {
    document.getElementById("totalRevenue").textContent = `₹${metrics.totalRevenue.toLocaleString()}`
    document.getElementById("totalOrders").textContent = metrics.totalOrders.toLocaleString()
    document.getElementById("avgOrderValue").textContent = `₹${metrics.avgOrderValue}`
    document.getElementById("totalCustomers").textContent = metrics.totalCustomers.toLocaleString()

    // Update change indicators
    updateChangeIndicator("revenueChange", metrics.revenueChange)
    updateChangeIndicator("ordersChange", metrics.ordersChange)
    updateChangeIndicator("aovChange", metrics.aovChange)
    updateChangeIndicator("customersChange", metrics.customersChange)
  }

  function updateChangeIndicator(elementId, change) {
    const element = document.getElementById(elementId)
    element.textContent = `${change > 0 ? "+" : ""}${change}%`
    element.className = `metric-change ${change >= 0 ? "positive" : "negative"}`
  }

  function renderSalesTrendsChart(trendsData) {
    const ctx = document.getElementById("salesTrendsChart").getContext("2d")

    new Chart(ctx, {
      type: "line",
      data: {
        labels: trendsData.labels,
        datasets: [
          {
            label: "Revenue",
            data: trendsData.revenue,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Orders",
            data: trendsData.orders,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.4,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Revenue (₹)",
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Orders",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    })
  }

  function renderProductPerformanceChart(productData) {
    const ctx = document.getElementById("productPerformanceChart").getContext("2d")

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: productData.labels,
        datasets: [
          {
            data: productData.values,
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    })
  }

  function renderHourlyChart(hourlyData) {
    const ctx = document.getElementById("hourlyChart").getContext("2d")

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: hourlyData.labels,
        datasets: [
          {
            label: "Sales",
            data: hourlyData.values,
            backgroundColor: "#3b82f6",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
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
              text: "Sales Volume",
            },
          },
          x: {
            title: {
              display: true,
              text: "Hour of Day",
            },
          },
        },
      },
    })
  }

  function renderCustomerChart(customerData) {
    const ctx = document.getElementById("customerChart").getContext("2d")

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["New Customers", "Returning Customers"],
        datasets: [
          {
            data: customerData.values,
            backgroundColor: ["#10b981", "#3b82f6"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    })
  }

  function updateTopProducts(topProducts) {
    const container = document.getElementById("topProducts")

    container.innerHTML = topProducts
      .map(
        (product, index) => `
      <div class="product-item">
        <div class="product-rank">${index + 1}</div>
        <div class="product-details">
          <h4>${product.name}</h4>
          <p>₹${product.revenue.toLocaleString()} revenue</p>
        </div>
        <div class="product-stats">
          <span class="product-sales">${product.sales} sold</span>
          <div class="product-bar">
            <div class="product-fill" style="width: ${product.percentage}%"></div>
          </div>
        </div>
      </div>
    `,
      )
      .join("")
  }

  function updatePeakHours(peakHours) {
    document.getElementById("morningPeak").textContent = peakHours.morning
    document.getElementById("lunchPeak").textContent = peakHours.lunch
    document.getElementById("eveningPeak").textContent = peakHours.evening
  }

  function updateCustomerStats(stats) {
    document.getElementById("newCustomers").textContent = stats.new
    document.getElementById("returningCustomers").textContent = stats.returning
    document.getElementById("customerRetention").textContent = `${stats.retention}%`
  }

  // API_ENDPOINT: GET /analytics/export/pdf - Export analytics as PDF
  async function exportToPDF() {
    try {
      // API_ENDPOINT: GET /analytics/export/pdf - Export PDF report
      const response = await mockExportAPI("pdf")

      // Create download link
      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "sales-analytics.pdf"
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert("Failed to export PDF")
    }
  }

  // API_ENDPOINT: GET /analytics/export/excel - Export analytics as Excel
  async function exportToExcel() {
    try {
      // API_ENDPOINT: GET /analytics/export/excel - Export Excel report
      const response = await mockExportAPI("excel")

      // Create download link
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "sales-analytics.xlsx"
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert("Failed to export Excel")
    }
  }

  // API_ENDPOINT: GET /analytics/export/csv - Export analytics as CSV
  async function exportToCSV() {
    try {
      // API_ENDPOINT: GET /analytics/export/csv - Export CSV report
      const response = await mockExportAPI("csv")

      // Create download link
      const blob = new Blob([response.data], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "sales-analytics.csv"
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert("Failed to export CSV")
    }
  }

  // Helper functions to generate mock data
  function generateTrendsData(days) {
    const labels = []
    const revenue = []
    const orders = []

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      labels.push(date.toLocaleDateString())
      revenue.push(Math.round(500 + Math.random() * 1000))
      orders.push(Math.round(10 + Math.random() * 20))
    }

    return { labels, revenue, orders }
  }

  function generateProductData() {
    return {
      labels: ["Chaat", "Dosa", "Tea", "Juice", "Snacks"],
      values: [30, 25, 20, 15, 10],
    }
  }

  function generateHourlyData() {
    const labels = ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"]
    const values = [10, 25, 40, 80, 70, 45, 85, 60, 30]

    return { labels, values }
  }

  function generateCustomerData() {
    return {
      values: [35, 65],
    }
  }

  function generateTopProducts() {
    return [
      { name: "Pani Puri", revenue: 5000, sales: 200, percentage: 100 },
      { name: "Masala Dosa", revenue: 4200, sales: 150, percentage: 84 },
      { name: "Chai", revenue: 3500, sales: 300, percentage: 70 },
      { name: "Samosa", revenue: 2800, sales: 120, percentage: 56 },
      { name: "Lassi", revenue: 2200, sales: 80, percentage: 44 },
    ]
  }

  async function mockExportAPI(format) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      data: `Mock ${format.toUpperCase()} export data`,
      filename: `sales-analytics.${format}`,
    }
  }
})
