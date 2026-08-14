# Zensor Technical SEO Audit Engine - Frontend 🎨

The Frontend UI for the Technical SEO Audit Tool built with **React (TypeScript)**, **Vite**, **Vanilla CSS (Glassmorphism design)**, and **Nginx**.

🔗 **Backend Repository**: [https://github.com/GunjanUkani/seo-tool-backend](https://github.com/GunjanUkani/seo-tool-backend)

---

## 🚀 Docker Setup

### Build & Run with Docker
```bash
docker build -t seo-tool-frontend .
docker run -d -p 3000:80 --name seo-frontend seo-tool-frontend
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Local Development (Without Docker)

### Prerequisites
- Node.js 18+ & npm

### Setup & Run
```bash
npm install
npm run dev
```
Development server runs at [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Features & Tech Stack
- **Framework**: React 18 + Vite + TypeScript
- **Design & UI**: Custom Glassmorphism Theme, HSL tailored color palette, responsive grid, dynamic health score gauge.
- **Production Server**: Multi-stage Docker build serving optimized static bundle via Nginx.
