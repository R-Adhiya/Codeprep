# CodePrep – Coding Assessment & Interview Platform

CodePrep is a full-stack web application built for college assessment, coding practice, and technical & HR interview preparation. Designed specifically to demonstrate solid software engineering practices, clean modular architecture, and robust role-based access control.

---

## 🎯 Project Objective

To provide students with a comprehensive, single-platform solution to:
1. Practice curated algorithmic coding problems across various data structures.
2. Undergo timed coding assessment simulations with score tracking and instant performance feedback.
3. Prepare for technical and HR interviews using structured model answers and expert tips.
4. Enable administrators to manage coding questions, interview repositories, and assessment exams efficiently.

---

## ✨ Key Features

### 👤 User Module
- User Registration & Authentication (bcrypt password hashing, JWT tokens)
- Student & Admin Role Support
- Responsive Student Dashboard showing assessments taken, average score, and best score.

### 💻 Coding Assessment & Practice Module
- Topic-wise Coding Problem Repository (Arrays, Strings, Searching, Sorting, Data Structures, Algorithms)
- Difficulty Filtering (Easy, Medium, Hard) and Keyword Search
- Problem Details Modal with Sample Input, Sample Output, and Solution Code

### ⏱️ Timed Coding Assessments
- Real-time Countdown Timer with Auto-Submit when time reaches zero
- Interactive Question Palette & Question Navigation Workspace
- Instant Result Calculation (Score, Percentage %, Correct vs Wrong breakdown)
- Assessment Attempt History ("My Results")

### 🎙️ Interview Preparation Module
- Dedicated **Technical Interview** Prep (Programming, OOP, DBMS, SQL, Data Structures, Algorithms, OS)
- Dedicated **HR Interview** Prep (Tell me about yourself, Strengths/Weaknesses, 5-year goals, STAR method tips)
- Accordion-style Expandable Model Answers & Preparation Tips

### 🛠️ Admin Management Module
- Protected Admin Dashboard (`/admin`) with aggregate system statistics
- Admin Coding Question CRUD (View, Add, Edit, Delete)
- Admin Interview Question CRUD (View, Add, Edit, Delete)
- Admin Assessment CRUD (Set title, duration, add/remove questions, Delete)

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js (Vite), JavaScript, React Router DOM, Axios, Vanilla CSS (Design Tokens & Glassmorphism) |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL 8.0 |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |

*No complex microservices, Redis, MongoDB, or paid APIs used — strictly simple, understandable, and demonstrably solid stack.*

---

## 📂 Project Structure

```text
CodePrep/
│
├── frontend/                  # React + Vite Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Navbar, Footer
│   │   ├── context/           # AuthContext (JWT & User state)
│   │   ├── pages/             # Home, Login, Register, Dashboard, Questions, 
│   │   │                      # Assessments, TakeAssessment, AssessmentResult, 
│   │   │                      # ResultsHistory, InterviewPrep, AdminDashboard,
│   │   │                      # AdminCodingQuestions, AdminInterviewQuestions, AdminAssessments
│   │   ├── services/          # API Axios Client Instance
│   │   ├── App.jsx            # React Router Routes & Protected Guards
│   │   ├── main.jsx           # Entry Point
│   │   └── index.css          # Design tokens & responsive styles
│   └── package.json
│
├── backend/                   # Node.js + Express Backend Server
│   ├── config/                # db.js (MySQL Pool Connection)
│   ├── controllers/           # Auth, User, Question, Assessment, Interview, Admin Controllers
│   ├── middleware/            # Auth & Admin Middleware, Error Handler Middleware
│   ├── routes/                # Express API Route Handlers
│   ├── server.js              # Server Entry Point
│   ├── .env.example           # Environment Configuration Template
│   └── package.json
│
├── database/                  # MySQL Database Scripts
│   ├── schema.sql             # Table DDL Definitions & Constraints
│   └── seed.sql               # Pre-populated Sample Data & Accounts
│
├── README.md                  # Project Documentation
└── .gitignore                 # Git Ignored Files
```

---

## 🗄️ Database Architecture

The MySQL database is named **`CodePrep`** and consists of 6 tables:

1. **`users`**: Stores student and admin credentials (`id`, `name`, `email`, `password`, `role`, `created_at`).
2. **`coding_questions`**: Holds coding problems (`id`, `title`, `description`, `difficulty`, `category`, `sample_input`, `sample_output`, `solution`).
3. **`interview_questions`**: Holds technical & HR questions (`id`, `question`, `answer`, `category`, `difficulty`).
4. **`assessments`**: Stores assessment exams (`id`, `title`, `description`, `duration`).
5. **`assessment_questions`**: Junction table mapping questions to assessments (`assessment_id`, `question_id`).
6. **`assessment_attempts`**: Records student evaluation results (`id`, `user_id`, `assessment_id`, `score`, `total_questions`, `started_at`, `completed_at`).

---

## 🔑 Demo Credentials

Use these credentials to log in during lab evaluation / viva:

| Account Type | Email | Password | Role | Access |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Demo** | `admin@codeprep.com` | `admin123` | **ADMIN** | Full Access + `/admin` Control Panel |
| **Student Demo** | `user@codeprep.com` | `user123` | **USER** | Assessments, Questions, Prep & History |

---

## 🚀 Installation & Setup Guide

### 1. Database Setup
Ensure MySQL Server is installed and running on standard port `3306`.
Execute the schema and seed scripts using MySQL CLI or Workbench:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Backend Setup & Run
Navigate to the `backend/` directory, install dependencies, and start the server:

```bash
cd backend
npm install
npm run dev
```
*The backend server will run on `http://localhost:5000`.*

### 3. Frontend Setup & Run
Navigate to the `frontend/` directory, install dependencies, and start Vite dev server:

```bash
cd frontend
npm install
npm run dev
```
*The frontend application will be accessible at `http://localhost:5173`.*

---

## 📡 Key API Endpoints

### Authentication APIs
- `POST /api/auth/register` — Register a new user account.
- `POST /api/auth/login` — User login & JWT token retrieval.
- `GET /api/auth/me` — Retrieve logged-in user profile.

### User Stats APIs
- `GET /api/users/stats` — Retrieve student performance statistics.

### Coding Questions APIs
- `GET /api/questions` — List coding questions with search and filters.
- `GET /api/questions/:id` — Get single question details & solution code.

### Assessments & Scoring APIs
- `GET /api/assessments` — List available assessment exams.
- `GET /api/assessments/:id` — Fetch assessment details and mapped questions.
- `POST /api/assessments/:id/submit` — Submit answers, calculate score, and record attempt.
- `GET /api/assessments/attempts/:attemptId` — Retrieve specific assessment attempt result.
- `GET /api/assessments/user/attempts` — Get user's assessment history.

### Interview Preparation APIs
- `GET /api/interview` — List Technical & HR interview questions with filters.

### Admin APIs (Protected by Admin Role)
- `GET /api/admin/stats` — Retrieve aggregate system metrics.
- `POST /api/questions` | `PUT /api/questions/:id` | `DELETE /api/questions/:id` — Manage coding questions.
- `POST /api/interview` | `PUT /api/interview/:id` | `DELETE /api/interview/:id` — Manage interview questions.
- `POST /api/assessments` | `PUT /api/assessments/:id` | `DELETE /api/assessments/:id` — Manage assessments & question mappings.

---

## 🔮 Future Improvements

1. Code Execution Sandbox for automatic test case compilation.
2. Downloadable PDF certificates for completed assessments.
3. Discussion forum / peer Q&A for complex coding problems.
