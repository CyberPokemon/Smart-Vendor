<p align="center">
  <img src="https://img.shields.io/badge/Smart%20Vendor-Powered%20by%20Spring%20Boot%20%7C%20Modern%20Frontend-blueviolet?style=for-the-badge" alt="Smart Vendor"/>
</p>

<h1 align="center">Smart Vendor</h1>

<p align="center">
  <img src="https://img.icons8.com/color/96/000000/restaurant.png" width="80"/>
</p>

<p align="center">
  <b>AI-powered ingredient management, sales analytics, and menu prediction for food vendors</b>
</p>

---

## 🚀 Features

- 🌟 **Modern Frontend**: Responsive, beautiful UI with HTML, CSS, and JavaScript
- 🔒 **Secure Backend**: Spring Boot 3.5.4, Java 21, JWT authentication, PostgreSQL
- 📊 **Sales Analytics**: Visualize sales and ingredient usage
- 🤖 **AI Forecasting**: Predict ingredient needs with Gemini AI
- 🛒 **Vendor Dashboard**: Manage menu, daily usage, and inventory
- 👤 **Authentication**: Register, login, and role-based access
- 📱 **Mobile Friendly**: Works great on all devices

---

## 🏗️ Project Structure

```text
Smart-Vendor/
├── backend/           # Spring Boot backend (Java, Maven, PostgreSQL)
│   ├── src/main/java/com/hackops/backend/
│   │   ├── config/           # Security, JWT, filters
│   │   ├── controller/       # REST API controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── model/            # JPA Entities
│   │   ├── repository/       # Spring Data JPA Repos
│   │   └── service/          # Business logic, AI, JWT
│   └── resources/
│       └── application.properties
├── frontend/          # HTML, CSS, JS (no framework)
│   ├── *.html
│   ├── *.css
│   └── *.js
└── README.md
```

---

## 🌐 Live Demo

**🚀 Website Deployed on Render:** [Smart Vendor Live](https://smart-vendor.onrender.com)

> ⚠️ **Important Note:** The backend server is hosted on Render's free tier and may take **2-3 minutes** to start up if it has been inactive. Please be patient during the initial load time.

**Demo Credentials:**
- Username: `demo`
- Password: `demo123`

---
<!-- 
## 🖥️ Screenshots

<p align="center">
  <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80" width="350" alt="Dashboard"/>
  <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" width="350" alt="Analytics"/>
</p> -->

<!-- --- -->

## ⚡ Quick Start

### 1. Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

- Configure your PostgreSQL DB in `src/main/resources/application.properties`
- API runs at `http://localhost:8080`

### 2. Frontend (Static)

Just open `frontend/index.html` in your browser, or use a static server:

```bash
cd frontend
python -m http.server 5500
```

---

## 🔑 Authentication
- JWT-based login and registration
- Role-based access (Vendor, Admin)
- Secure endpoints for all vendor operations

---

## 📦 Tech Stack

| Layer      | Technology                |
|------------|--------------------------|
| Frontend   | HTML, CSS, JavaScript    |
| Backend    | Spring Boot 3.5.4, Java 21 |
| Database   | PostgreSQL               |
| Auth       | JWT                      |
| AI         | Gemini API (Google)      |

---

## 🧠 AI Forecasting
- Uses Gemini API for ingredient demand prediction
- Considers seasonality, festivals, and weather
- Helps vendors optimize inventory and reduce waste

---

## 📈 Analytics & Dashboard
- Visual sales and ingredient usage charts
- Daily, monthly, and custom range analytics
- Easy menu and inventory management

---

## 🛠️ Developer Guide

### Backend
- Java 21, Spring Boot, Maven
- Main entry: `BackendApplication.java`
- DTOs, Services, Controllers, Repositories follow standard Spring structure

### Frontend
- Pure HTML/CSS/JS, no build step
- All logic in `frontend/*.js`
- Easily customizable for your brand

---

## 👥 Team HackOps Members

<p align="center">
  <img src="https://img.icons8.com/color/48/000000/group.png" width="60"/>
</p>

<table align="center">
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/👨‍💻-Arghadeep%20Tambuli-blue?style=for-the-badge" alt="Arghadeep Tambuli"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/👨‍💻-Imon%20Mallik-green?style=for-the-badge" alt="Imon Mallik"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/👩‍💻-Soumi%20Sahu-purple?style=for-the-badge" alt="Soumi Sahu"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/👩‍💻-Abhilasha%20Shee-orange?style=for-the-badge" alt="Abhilasha Shee"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/👩‍💻-Tritiya%20Bhattacharya-yellow?style=for-the-badge" alt="Tritiya Bhattacharya"/>
    </td>
  </tr>
</table>

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F%20by%20HackOps-blue?style=for-the-badge"/>
</p>