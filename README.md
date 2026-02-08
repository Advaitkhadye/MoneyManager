# Finance Manager

**Master your money with smart, personalized insights.**

Finance Manager is a modern wealth tracking application designed to help you organize your finances effortlessly. Beyond just logging expenses, it uses smart AI to analyze your spending habits and offer professional financial advice in real-time.

## ✨ Key Features

*   **Smart Dashboard**: specific, visual breakdown of your expenses with interactive charts.
*   **AI Financial Advisor**: Chat with our smart assistant to get instant answers about your spending trends or tips to save money.
*   **Secure & Private**: Your data is protected with enterprise-grade authentication (Supabase).
*   **Cross-Platform**: Fully responsive design that looks great on your laptop, tablet, or phone.
*   **Real-Time Data**: Instant updates and seamless synchronization across devices.

## 🛠️ Technology Stack

We built this using robust, modern technologies to ensure speed and reliability:

*   **Frontend**: [Next.js](https://nextjs.org/) (React) with Tailwind CSS for a beautiful, fast user interface.
*   **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python) for high-performance data processing.
*   **Database**: [Supabase](https://supabase.com/) (PostgreSQL) for secure and scalable data storage.
*   **AI Engine**: Google Gemini for intelligent financial context and advice.

## 🚀 Getting Started

### Prerequisites
*   Node.js installed on your machine.
*   Python 3.9+ installed.

### Quick Run (Windows)
Simply double-click the `run_app.bat` file in the main folder!

### Manual Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/FinanceManager.git
    cd FinanceManager
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

3.  **Setup Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Visit App:** Open [http://localhost:3000](http://localhost:3000).

## ☁️ Deployment

This project is configured for seamless deployment:
*   **Frontend**: Deployed on [Vercel](https://vercel.com).
*   **Backend**: Deployed on [Render](https://render.com) or Vercel.

---

*Built with ❤️ for better financial health.*
