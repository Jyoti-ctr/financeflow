# FinanceFlow

**FinanceFlow** is a modern full-stack application designed to help you manage your personal finances with ease. Built with a powerful **FastAPI** backend and a responsive **React** frontend, it allows you to track income, categorize expenses, and visualize your financial health through interactive dashboards.

---

## 🚀 Setup Instructions

To get the project running, you need to keep **two terminals open simultaneously**—one for the backend and one for the frontend.

## ⚡ Quick Start

### Prerequisites

- Python 3.8+

- Node.js 16+

- npm or yarn

# Create and activate virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```
# Install dependencies and start
```bash
pip install -r requirements.txt
python main.py
```
### 1. Initial Preparation
First, clone the repository and navigate into the project folder:
```bash
git clone https://github.com/Jyoti-ctr/financeflow.git
cd financeflow
```

## 🔧 Environment Variables

Create a `.env` file in the `backend` directory:

```env

SECRET_KEY=your-secret-key-here

DATABASE_URL=sqlite:///./finance.db

```
### 2. Run the Application
Open two separate terminal windows or tabs and run the following commands:

Terminal 1: Backend (FastAPI)
```bash
cd backend
uvicorn main:app
```
Terminal 2: Frontend (React)
```bash
cd frontend
```
# Install dependencies
```bash
npm install
```
# Start the application
```bash
npm start
```


### 💡 What happens next?
Once both commands are running:

The Backend will initialize the database and stay active to handle your data.

The Frontend will automatically open your default web browser to http://localhost:3000.

You can now register an account and start tracking your finances!

## 🛠️ Tech Stack
**Backend**: FastAPI, SQLAlchemy (ORM), SQLite, Pydantic.

**Frontend**: React 18, Recharts (Data Viz), Axios.

**Auth**: Secure JWT-based authentication.

## 📱 Usage

1. **Register** - Create a new account

2. **Login** - Sign in with your credentials

3. **Add Categories** - Create categories for your income/expenses

4. **Add Transactions** - Record your financial activities

5. **View Dashboard** - See your financial overview

6. **Check Reports** - Analyze spending patterns

Built with ❤️ using FastAPI and React
