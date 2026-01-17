# Smart Story Teller

## 📋 Prerequisites

### System Requirements
- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **npm**: 8.0 or higher

### Python Dependencies
```bash
fastapi
uvicorn
edge-tts
pydub
python-multipart
PyPDF2
pdfplumber
aiofiles
requests
```

### Node.js Dependencies
```bash
react
react-dom
react-router-dom
axios
howler
framer-motion
lucide-react
tailwindcss
vite
```

## 🚀 How to Run

### Option 1: Automated Launch (Recommended)
```bash
python omstream.py
```
This script will:
- Install all dependencies automatically
- Start the backend server (port 8000)
- Start the frontend development server (port 5173)
- Open the application in your browser

### Option 2: Jupyter Notebook (Interactive)
```bash
jupyter notebook omstream.ipynb
```
This notebook provides:
- Step-by-step execution with visible output
- Better debugging and control over each process
- Manual dependency installation and server management
- Interactive cell-by-cell launch process

### Option 3: Manual Setup

#### Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

