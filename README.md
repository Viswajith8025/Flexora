# Flexora: Short-Term Work, Done Right 💼

![Flexora Banner](https://images.unsplash.com/photo-1521737706076-34863f8ad2bf?auto=format&fit=crop&q=80&w=1200)

Flexora is a full-stack, high-fidelity platform designed to bridge the gap between job seekers and short-term employers across Kerala. Built with the **MERN** stack, it provides a seamless "Same-Day Hiring" experience with a focus on transparency, verified profiles, and real-time management.

## 🌟 Core Pillars

- **⚡ Instant Hiring**: Post a job in minutes and receive applicants the same day.
- **🛡️ Verified Ecosystem**: Multi-tier authentication for seekers and providers to ensure platform safety.
- **💰 Financial Transparency**: Upfront pay rates on all listings—no hidden negotiations.
- **📍 Hyper-Local**: Location-aware job matching to minimize commutes and maximize productivity.

## 🛠️ Technical Architecture

### Frontend (Client)
- **Framework**: React.js with Vite for blazing-fast HMR.
- **State Management**: Context API for global Auth and Notification states.
- **UI Architecture**: Custom Design System built with Tailwind CSS.
- **Animations**: Framer Motion for industrial-grade UI transitions.
- **Security**: Centralized Auth interceptors with Axios.

### Backend (Server)
- **Runtime**: Node.js & Express.
- **Database**: MongoDB (Mongoose ODM) with optimized indexing for geospatial and status queries.
- **Authentication**: JWT-based secure sessions with persistent token management.
- **Payment Gateway**: Seamless Razorpay integration for secure transactions.
- **Real-time**: Socket.io for instant notifications and live status updates.

## 🚀 Key Features

- **Dashboard Suite**: Specialized hubs for Admin, Job Providers, and Job Seekers.
- **Smart Filtering**: Advanced job search by category, district, and pay range.
- **Admin Hub**: A command center for moderating users, jobs, and platform analytics.
- **Responsive Navigation**: Adaptive mobile drawer with intelligent state management.
- **Premium Aesthetics**: Glassmorphic UI elements with a focused "Slate & Blue" professional color palette.

## 📥 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or Local instance
- Razorpay API Keys (for payments)

### Installation

1. **Clone the Hub**:
   ```bash
   git clone https://github.com/your-username/flexora.git
   ```

2. **Server Setup**:
   ```bash
   cd Server
   npm install
   # Create a .env file based on .env.example
   npm start
   ```

3. **Client Setup**:
   ```bash
   cd Client
   npm install
   # Create a .env file with VITE_API_URL
   npm run dev
   ```

## 🔐 Security & Optimization

Flexora implements industrial-standard security:
- **Express 5 Ready**: Custom manual sanitizers for NoSQL injection and XSS protection.
- **Rate Limiting**: Throttling on Auth and API routes to prevent brute-force attacks.
- **Cloudinary Integration**: Auto-optimized image delivery (f_auto, q_auto) for faster page loads.

---

Built for the future of flexible work in Kerala. 🥥
🔗 [Live Demo](https://flexora-hub.vercel.app/) (Optional)
