# FinanceFlow

A full-stack personal finance management application built with FastAPI (backend) and React (frontend). Track your income, expenses, and visualize your financial data with beautiful charts.

![FinanceFlow](https://img.shields.io/badge/FinanceFlow-v1.0.0-green)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-cyan)

## 🚀 Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Transaction Management** - Add, edit, and delete income/expense transactions
- **Category Management** - Organize transactions by custom categories
- **Dashboard** - View financial summary with key metrics
- **Reports** - Visualize spending patterns with interactive charts
- **Dark/Light Theme** - Toggle between theme modes

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Lightweight database
- **Pydantic** - Data validation
- **Python-JWT** - Token-based authentication

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Axios** - HTTP client

## 📁 Project Structure

```
financeflow/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py         # Database configuration
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── auth.py             # Authentication utilities
│   ├── routes/
│   │   ├── auth_routes.py      # Auth endpoints
│   │   ├── transaction_routes.py
│   │   ├── category_routes.py
│   │   └── report_routes.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   └── api.js         # API client
│   ├── package.json
│   └── public/
└── README.md
```

## ⚡ Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Jyoti-ctr/financeflow.git
cd financeflow
```

#### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

The API will be available at `http://localhost:8000`

#### 3. Frontend Setup

```bash
# Navigate to frontend (from root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## � API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | List all transactions |
| POST | `/transactions` | Create transaction |
| PUT | `/transactions/{id}` | Update transaction |
| DELETE | `/transactions/{id}` | Delete transaction |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List all categories |
| POST | `/categories` | Create category |
| PUT | `/categories/{id}` | Update category |
| DELETE | `/categories/{id}` | Delete category |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/summary` | Financial summary |
| GET | `/reports/monthly` | Monthly breakdown |
| GET | `/reports/category-wise` | Category analysis |

## 🔧 Environment Variables

Create a `.env` file in the `backend` directory:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./finance.db
```

## 📱 Usage

1. **Register** - Create a new account
2. **Login** - Sign in with your credentials
3. **Add Categories** - Create categories for your income/expenses
4. **Add Transactions** - Record your financial activities
5. **View Dashboard** - See your financial overview
6. **Check Reports** - Analyze spending patterns

## 📦 Build for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
# Use a production server like uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using FastAPI and React
