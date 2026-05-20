# 🧠 MindVault — AI-Powered Study Companion

MindVault helps students organize notes into folders and concepts, then automatically generates multiple-choice quiz questions using AI so you can do active revision efficiently.

---

## ✨ Features

- **Folder & Concept Management** — Create folders for subjects and add concepts (text or image-based)
- **AI Quiz Generation** — Gemini AI reads your notes/images and generates MCQs automatically
- **OCR Support** — Upload photos of handwritten notes; text is extracted and fed to the AI
- **Timed Quizzes** — Take quizzes with a live timer, pause/resume, and navigate between questions
- **Results & Analytics** — See your score, grade, per-question breakdown, and track improvement
- **JWT Authentication** — Secure login/register with bcrypt-hashed passwords
- **Image Uploads** — Cloudinary-backed image storage

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Tailwind CSS, Framer Motion, React Router v7 |
| Backend | Node.js, Express 4, Mongoose (MongoDB) |
| AI | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| OCR | Python FastAPI microservice (Tesseract + EasyOCR) |
| Storage | Cloudinary (images) |
| Auth | JWT + bcryptjs |
| State | TanStack Query v5, React Context |

---

## 📁 Project Structure

```
mindvault/
├── backend/
│   ├── server.js                  # Entry point
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── cloudinary.js      # Cloudinary config
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── conceptController.js
│   │   │   ├── folderController.js
│   │   │   └── quizController.js
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT protect middleware
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Folder.js
│   │   │   ├── Concept.js
│   │   │   └── QuizResult.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── folder.routes.js
│   │   │   ├── concept.routes.js
│   │   │   └── quiz.routes.js
│   │   └── services/
│   │       ├── geminiClient.js    # AI question generation
│   │       ├── ocrClient.js       # OCR microservice client
│   │       └── openaiClient.js    # (alternative, unused)
│   └── ocr-service/               # Python FastAPI OCR microservice
│       ├── app.py
│       ├── requirements.txt
│       ├── services/ocr_processor.py
│       └── utils/image_utils.py
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── context/AuthContext.jsx
    │   ├── hooks/               # useFolders, useConcepts, useQuiz, useToast
    │   ├── pages/               # LandingPage, Dashboard, Folders, Quiz, etc.
    │   ├── components/          # auth, concepts, folders, quiz, ui, layout
    │   └── services/            # api.js, folderService, conceptService, quizService
    └── tailwind.config.js
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- Python 3.9+ (for OCR service)
- Tesseract OCR installed on your system
- Cloudinary account
- Google Gemini API key

### 1. Clone & install

```bash
git clone https://github.com/your-username/mindvault.git
cd mindvault
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mindvault
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
OCR_SERVICE_URL=http://localhost:8000
```

```bash
npm run dev        # starts on port 5000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm start          # starts on port 3000
```

### 4. OCR service setup (optional)

```bash
cd backend/ocr-service
pip install -r requirements.txt
python app.py      # starts on port 8000
```

> OCR is optional — if the service is down, concept creation still works; the image text just won't be extracted.

---

## 🔌 API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Folders *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/folders` | Get all user folders |
| POST | `/api/folders` | Create folder |

### Concepts *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/concepts` | Create concept (multipart/form-data) |
| GET | `/api/concepts/folder/:folderId` | Get all concepts in folder |
| GET | `/api/concepts/:conceptId` | Get single concept |
| PATCH | `/api/concepts/:conceptId` | Update concept |
| DELETE | `/api/concepts/:conceptId` | Delete concept |

### Quiz *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quiz/:folderId` | Generate quiz for folder |
| POST | `/api/quiz/:folderId/results` | Submit quiz result |
| GET | `/api/quiz/history/:folderId?` | Get quiz history |
| GET | `/api/quiz/analytics/:folderId` | Get quiz analytics |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWTs |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `OCR_SERVICE_URL` | No | OCR service URL (default: http://localhost:8000) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | No | Backend URL (default: http://localhost:5000) |

---

## 🚢 Deployment Notes

See the deployment checklist in the project wiki or refer to the issues list for current pre-deploy tasks.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push and open a Pull Request

---