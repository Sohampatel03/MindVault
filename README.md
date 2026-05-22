# 🧠 MindVault — AI-Powered Study Companion

<div align="center">

![MindVault Banner](https://img.shields.io/badge/MindVault-AI%20Study%20Companion-6366f1?style=for-the-badge&logo=brain&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://mind-vault-green.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://mindvault-0zfk.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**Transform your study materials into AI-generated quizzes. Upload notes, images, or text — let Gemini AI do the rest.**

[Live Demo](https://mind-vault-green.vercel.app) · [Report Bug](https://github.com/Sohampatel03/MindVault/issues) · [Request Feature](https://github.com/Sohampatel03/MindVault/issues)

</div>

---

## 📸 Screenshots

| Landing Page | Dashboard | Quiz Mode |
|---|---|---|
| ![Landing](https://kommodo.ai/i/4kdw6KHT8U9oyI1elzzw) | ![Dashboard](https://kommodo.ai/i/ixjOwevQe0IC5uXOJ63I) | ![Quiz](https://kommodo.ai/i/1R4946DnutX7lCanxBFU) |

---

## ✨ Features

### 📁 Smart Organization
- Create **folders** for different subjects (Mathematics, Science, History, etc.)
- Add **concepts** inside folders with text descriptions or image uploads
- Search and filter concepts by type (image/text)

### 🤖 AI-Powered Quiz Generation
- **Google Gemini 2.0 Flash** automatically generates multiple-choice questions from your content
- Works with both text descriptions and uploaded images (via OCR)
- Graceful fallback questions when AI is unavailable

### 📷 OCR Support
- Upload **handwritten notes**, diagrams, or textbook photos
- Python-powered OCR (Tesseract + EasyOCR) extracts text automatically
- Extracted text is fed to Gemini for smarter quiz generation

### 🎯 Interactive Quiz Experience
- **Timed quizzes** with live countdown timer
- **Pause & resume** anytime during the quiz
- Navigate between questions freely
- Real-time answer selection with visual feedback

### 📊 Results & Analytics
- Detailed score breakdown (correct/incorrect/unanswered)
- Grade calculation (A+, A, B, C, D, F)
- Per-question answer review with correct answer reveal
- Time tracking per session

### 🔐 Secure Authentication
- JWT-based authentication with 7-day token expiry
- bcrypt password hashing
- Protected routes on both frontend and backend
- Auto session restore on page refresh

### ☁️ Cloud Storage
- Images uploaded to **Cloudinary** CDN
- Automatic temp file cleanup after upload
- 10MB file size limit with type validation

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Router v7 | Client-side routing |
| TanStack Query v5 | Server state management |
| Axios | HTTP client |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| React Dropzone | Image upload UI |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 4 | REST API server |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Authentication |
| Multer | File upload handling |
| Cloudinary SDK | Image cloud storage |
| @google/genai | Gemini AI integration |
| Axios | OCR service client |

### AI & OCR (Python Microservice)
| Technology | Purpose |
|---|---|
| FastAPI | OCR REST API |
| Tesseract OCR | Primary text extraction |
| EasyOCR | Fallback text extraction |
| OpenCV | Image preprocessing |
| Pillow | Image validation |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | Image CDN |
| Google AI Studio | Gemini API |

---

## 📁 Project Structure
MindVault/
├── 📂 backend/
│   ├── server.js                    # Entry point + graceful shutdown
│   ├── package.json
│   ├── .env.example
│   ├── 📂 src/
│   │   ├── app.js                   # Express app + CORS + middleware
│   │   ├── 📂 config/
│   │   │   ├── db.js                # MongoDB connection
│   │   │   └── cloudinary.js        # Cloudinary setup
│   │   ├── 📂 controllers/
│   │   │   ├── authController.js    # Register, Login, GetMe
│   │   │   ├── folderController.js  # Full folder CRUD
│   │   │   ├── conceptController.js # Full concept CRUD + AI + OCR
│   │   │   └── quizController.js    # Quiz generation + results
│   │   ├── 📂 middleware/
│   │   │   └── auth.js              # JWT protect middleware
│   │   ├── 📂 models/
│   │   │   ├── User.js              # User schema + bcrypt hooks
│   │   │   ├── Folder.js            # Folder schema
│   │   │   ├── Concept.js           # Concept + embedded question schema
│   │   │   └── QuizResult.js        # Quiz result schema + grade virtual
│   │   ├── 📂 routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── folder.routes.js
│   │   │   ├── concept.routes.js
│   │   │   └── quiz.routes.js
│   │   └── 📂 services/
│   │       ├── geminiClient.js      # AI question generation + retry logic
│   │       └── ocrClient.js         # OCR microservice client
│   └── 📂 ocr-service/              # Python FastAPI microservice
│       ├── app.py
│       ├── requirements.txt
│       ├── 📂 services/
│       │   └── ocr_processor.py     # Tesseract + EasyOCR dual engine
│       └── 📂 utils/
│           └── image_utils.py       # Download + validate images
│
└── 📂 frontend/
├── package.json
├── tailwind.config.js
├── .env.example
└── 📂 src/
├── App.jsx                  # Router + providers + toast
├── index.js
├── 📂 components/
│   ├── 📂 auth/             # LoginForm, RegisterForm, ProtectedRoute
│   ├── 📂 common/           # Breadcrumb, AppLoader
│   ├── 📂 concepts/         # ConceptCard, ConceptForm, ImageUpload
│   ├── 📂 dashboard/        # StatsCard, QuickActions
│   ├── 📂 folders/          # FolderCard, CreateFolderModal
│   ├── 📂 quiz/             # QuestionCard, QuizResults, Timer, ProgressBar
│   ├── 📂 layout/           # Header
│   └── 📂 ui/               # Button, Input, LoadingSpinner, Toast
├── 📂 context/
│   └── AuthContext.jsx      # Auth state + session restore + backend ping
├── 📂 hooks/
│   ├── useFolders.js
│   ├── useConcepts.js
│   ├── useQuiz.js
│   └── useToast.js
├── 📂 pages/
│   ├── LandingPage.jsx
│   ├── DashboardPage.jsx
│   ├── FoldersPage.jsx
│   ├── FolderDetailPage.jsx
│   ├── CreateConceptPage.jsx
│   ├── ConceptDetailPage.jsx
│   ├── EditConceptPage.jsx
│   ├── QuizPage.jsx
│   └── QuizResultsPage.jsx
└── 📂 services/
├── api.js               # Axios instance + interceptors
├── folderService.js
├── conceptService.js
└── quizService.js

---

## 🚀 Getting Started

### Prerequisites

- **Node.js ≥ 20** (required by `@google/genai`)
- **MongoDB** (local or [Atlas](https://cloud.mongodb.com))
- **Python 3.9+** (optional — for OCR service)
- **Cloudinary** account → [cloudinary.com](https://cloudinary.com)
- **Gemini API key** → [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

Check Node version:
```bash
node --version  # Must be >= 20
```

---

### 1. Clone the Repository

```bash
git clone https://github.com/Sohampatel03/MindVault.git
cd MindVault
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from example):
```bash
cp .env.example .env
```

Fill in your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mindvault
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
OCR_SERVICE_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:3000
NODE_ENV=development
```

Start backend:
```bash
npm run dev       # Development (nodemon)
npm start         # Production
```

Backend runs on `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

---

### 4. OCR Service Setup (Optional)

OCR enables text extraction from uploaded images. Without it, concepts still work but image text won't be extracted.

```bash
cd backend/ocr-service
pip install -r requirements.txt
python app.py
```

OCR service runs on `http://localhost:8000`

> **Windows users:** Install Tesseract from [github.com/UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki) and add to your PATH, or set `TESSERACT_CMD` env variable.

---

## 🔌 API Reference

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login, returns JWT token |
| `GET` | `/api/auth/me` | ✅ | Get current logged-in user |

### Folder Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/folders` | ✅ | Get all folders for user |
| `POST` | `/api/folders` | ✅ | Create new folder |
| `GET` | `/api/folders/:folderId` | ✅ | Get single folder |
| `PATCH` | `/api/folders/:folderId` | ✅ | Update folder name |
| `DELETE` | `/api/folders/:folderId` | ✅ | Delete folder |

### Concept Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/concepts` | ✅ | Create concept (multipart/form-data) |
| `GET` | `/api/concepts/folder/:folderId` | ✅ | Get all concepts in a folder |
| `GET` | `/api/concepts/:conceptId` | ✅ | Get single concept |
| `PATCH` | `/api/concepts/:conceptId` | ✅ | Update concept |
| `DELETE` | `/api/concepts/:conceptId` | ✅ | Delete concept |

**Create Concept Request (multipart/form-data):**
folderId    string   required
name        string   required
description string   optional
image       file     optional (jpg, png, webp, gif, bmp — max 10MB)

### Quiz Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/quiz/:folderId` | ✅ | Generate quiz from folder concepts |
| `POST` | `/api/quiz/:folderId/results` | ✅ | Submit quiz result |
| `GET` | `/api/quiz/history` | ✅ | Get all quiz history |
| `GET` | `/api/quiz/history/:folderId` | ✅ | Get quiz history for folder |
| `GET` | `/api/quiz/analytics/:folderId` | ✅ | Get quiz analytics |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Server port |
| `MONGO_URI` | ✅ | — | MongoDB connection string |
| `JWT_SECRET` | ✅ | — | JWT signing secret (min 32 chars) |
| `CLOUDINARY_CLOUD_NAME` | ✅ | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | — | Cloudinary API secret |
| `GEMINI_API_KEY` | ✅ | — | Google Gemini API key |
| `OCR_SERVICE_URL` | No | `http://localhost:8000` | Python OCR service URL |
| `ALLOWED_ORIGINS` | No | `http://localhost:3000` | Comma-separated CORS origins |
| `NODE_ENV` | No | `development` | Environment |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_API_URL` | No | `http://localhost:5000` | Backend API base URL |

---

## 🚢 Deployment

### Deploy Frontend → Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:
REACT_APP_API_URL = https://your-backend.onrender.com
5. Deploy

### Deploy Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo
3. Configure:
Root Directory: backend
Build Command:  npm install
Start Command:  node server.js
4. Add all backend environment variables
5. Set `ALLOWED_ORIGINS` to your Vercel URL:
ALLOWED_ORIGINS = https://your-app.vercel.app

### Deploy OCR Service → Render (Optional)

1. New Web Service → same repo
2. Configure:
Root Directory: backend/ocr-service
Build Command:  pip install -r requirements.txt
Start Command:  python app.py
3. Set `OCR_SERVICE_URL` in backend env to this service's URL

### Database → MongoDB Atlas

1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Network Access → Add IP `0.0.0.0/0`
3. Get connection string → set as `MONGO_URI`

> ⚠️ **Note:** Render free tier services sleep after 15 minutes of inactivity. The app shows a loading screen with a warm-up message during cold starts (~30-60 seconds).

---

## 🔄 Application Flow
User visits app
↓
AppLoader pings backend (handles cold start)
↓
Session restored from localStorage token
↓
Landing Page → Register/Login
↓
Dashboard → Create Folders
↓
Folder Detail → Add Concepts
↓
Create Concept:
├── Upload image → Cloudinary → OCR extracts text
├── OR enter text description
└── Gemini AI generates MCQ question
↓
Start Quiz → Answer questions → Timer running
↓
Submit → Results page (score, grade, breakdown)

---

## 🧠 AI Question Generation

MindVault uses **Google Gemini 2.0 Flash** to generate quiz questions:

1. User creates a concept with text/image
2. If image → OCR extracts text from image
3. Combined text sent to Gemini with structured prompt
4. Gemini returns JSON: `{ question, options[4], answer }`
5. Stored in MongoDB with the concept

**Fallback behavior:**
- If Gemini API key is missing → smart fallback question used
- If rate limited (429) → automatic retry after suggested delay
- If API key suspended/invalid → fallback for rest of session
- App never crashes — always returns a question

---

## 🛡️ Security Features

- **JWT tokens** expire after 7 days
- **bcrypt** password hashing (salt rounds: 10)
- **CORS** whitelist — only allowed origins can call the API
- **Input validation** on all backend routes
- **User isolation** — users can only access their own data
- **File type validation** — only images allowed for upload
- **File size limit** — 10MB maximum
- **Temp file cleanup** — multer files deleted after Cloudinary upload
- **401 auto-logout** — frontend detects expired tokens and redirects

---

## 📝 Known Limitations

| Limitation | Details |
|---|---|
| Free tier cold start | Render free tier sleeps → 30-60s first load |
| Gemini free quota | Limited requests per day on free tier |
| OCR accuracy | Depends on image quality; blurry images give poor results |
| Single question per concept | Each concept stores one MCQ |
| No real-time collaboration | Single-user per account |

---

## 🗺️ Roadmap

- [ ] Multiple questions per concept
- [ ] Spaced repetition algorithm
- [ ] PDF upload support
- [ ] Share folders with other users
- [ ] Mobile app (React Native)
- [ ] Streak tracking and gamification
- [ ] Export quiz results as PDF
- [ ] Dark mode
- [ ] Bulk concept import via CSV

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo, then:
git clone https://github.com/YOUR_USERNAME/MindVault.git
git checkout -b feature/amazing-feature
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Soham Patel**

[![GitHub](https://img.shields.io/badge/GitHub-Sohampatel03-181717?style=flat&logo=github)](https://github.com/Sohampatel03)

---

<div align="center">

Built with ❤️ for students everywhere

⭐ **Star this repo if MindVault helped you study better!** ⭐

</div>