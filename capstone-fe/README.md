# Smart Digital Twin - Personal Productivity Prediction Platform (Frontend)

![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0.12-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.19-38B2AC?style=for-the-badge&logo=tailwind-css)
![Zustand](https://img.shields.io/badge/Zustand-5.0.14-orange?style=for-the-badge)

## 📌 Project Overview

Smart Digital Twin System for Personal Productivity Prediction adalah platform berbasis Artificial Intelligence (AI) yang membantu pengguna memahami pola aktivitas harian secara lebih mendalam.

Platform ini membangun representasi digital pengguna berdasarkan kebiasaan nyata untuk:
- menganalisis produktivitas
- memberikan insight kesehatan dan beban kerja
- memprediksi performa di masa depan

---

## ✨ Key Highlights

- AI-based productivity prediction (next-day performance)
- Dynamic time filtering (3 days, 7 days, 30 days)
- Activity heatmap visualization
- Fatigue level & burnout detection signals
- Google OAuth authentication
- Interactive analytics dashboard with charts

---

## 🚀 Features

- **AI Productivity Analytics & Charts**  
  Visualisasi tren produktivitas harian menggunakan Recharts dengan kalkulasi rata-rata otomatis.

- **Dynamic Time Filter**  
  Filter data berdasarkan 3 hari, 7 hari, dan 30 hari.

- **Activity Heatmap Distribution**  
  Representasi intensitas aktivitas berdasarkan hari dalam seminggu.

- **AI Insights & Recommendations**  
  Analisis performa, prediksi besok, tingkat kelelahan, dan burnout warning.

- **Secure Authentication**  
  Login menggunakan Google OAuth (`@react-oauth/google`).

- **Global State Management**  
  Menggunakan Zustand untuk state management yang ringan dan efisien.

- **Modern UI & Animations**  
  UI responsif dengan Framer Motion dan CSS animation (typewriter effect).

---

## 🛠️ Tech Stack

### Core
- React 18.3.1
- Vite 8.0.12
- React Router DOM 6.28.0

### UI / Styling
- Tailwind CSS 3.4.19
- Framer Motion 12.40.0
- Lucide React 1.16.0
- Recharts 3.8.1

### State & Auth
- Zustand 5.0.14
- Google OAuth (`@react-oauth/google`)

---

## 📂 Project Structure

```text
frontend-capstone/
├── public/
└── src/
    ├── activity/
    ├── ai-insight/
    ├── analytics/
    ├── auth/
    ├── daily-checkin/
    ├── dashboard/
    ├── history/
    ├── routes/
    ├── store/
    ├── user-management/
    ├── utils/
    ├── App.css
    ├── App.jsx
    ├── index.css
    └── main.jsx