# 🎓 COIMBATORE INSTITUTE OF TECHNOLOGY
### DEPARTMENT OF COMPUTING — M.Sc AI & ML (2024–29)
**Course Code:** 19MAM57 — Full Stack Web Development Lab-2024-29 B  
**Date:** 13/08/2026 | **Time:** 09:30 AM to 12:30 PM  
**Faculty i/c:** Dr. N. Karthick / Dr. D. Kavitha  
**Total Marks:** 40 Marks | **Course Outcomes:** CO1, CO2, CO3, CO4, CO5  

---

# 📋 CONTINUOUS ASSESSMENT TEST-I EVALUATION REPORT

---

## CRITERION 1: Problem Definition & Project Objective (5 Marks)

### 1.1 Problem Identification and Relevance (2 Marks)
* **Problem**: Computer science and AI & ML students preparing for campus placements face fragmented resources—separate websites for coding practice, different portals for timed exam simulations, distinct blogs for interview preparation, and no structured learning roadmaps.
* **Relevance**: **CodePrep** unifies all these placement preparation needs into a single, cohesive, full-stack platform.

### 1.2 Objectives and Scope of the Project (2 Marks)
* **Objectives**:
  1. Provide a curated 20+ algorithmic coding practice library with search and category filters.
  2. Implement timed coding assessment exam simulations with live countdown timers and instant score evaluation.
  3. Offer 22+ technical CS and HR behavioral interview Q&As with expandable model answers.
  4. Display daily coding streaks (`🔥 5 Days Streak`) and track past performance history.
  5. Provide interactive career roadmaps (DSA, Frontend, Backend, Behavioral).
  6. Enable administrative CRUD control over questions, interview repositories, and assessments.
* **Scope**: Full-stack application supporting Student (`USER`) and Evaluator (`ADMIN`) roles.

### 1.3 Feasibility and Innovation (1 Mark)
* **Feasibility**: Built using standard, lightweight full-stack technologies (React.js, Node.js, Express.js, MySQL).
* **Innovation**: Features a **Hybrid Database Fallback Provider** ensuring zero-downtime demonstration during viva evaluation even if local database services are stopped.

* **Project File Reference**: [`README.md`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/README.md)

---

## CRITERION 2: User Interface Design (HTML, CSS & JavaScript) (6 Marks)

### 2.1 HTML Page Structure and Semantic Elements (2 Marks)
* Uses modern HTML5 semantic layout components (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<form>`, `<article>`).
* **Project File Reference**: [`frontend/index.html`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/index.html)

### 2.2 CSS Styling and Responsive Design (2 Marks)
* **Styling**: Built with Vanilla CSS utilizing CSS variables for theme consistency (`--primary-color: #4f46e5`, `--bg-dark: #0f172a`, `--card-bg: #1e293b`).
* **Responsiveness**: Uses CSS Flexbox, CSS Grid, and media queries (`@media (max-width: 768px)`) featuring a collapsible mobile navigation drawer.
* **Project File Reference**: [`frontend/src/index.css`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/index.css)

### 2.3 JavaScript Validation and DOM Manipulation (2 Marks)
* **Form Validation**: Validates missing input fields, password match checks, and email syntax before submitting API requests.
* **DOM Manipulation**: Controlled React state updates dynamically re-render the question palette, countdown timer, and expanded model answers.
* **Project File References**:
  - [`frontend/src/pages/Login.jsx`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/pages/Login.jsx)
  - [`frontend/src/pages/TakeAssessment.jsx`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/pages/TakeAssessment.jsx)

---

## CRITERION 3: Frontend Framework (ReactJS) (7 Marks)

### 3.1 Component Design and Reusability (2 Marks)
* Clean separation of concern across pages and UI components:
  - Header Navigation Bar: [`frontend/src/components/Navbar.jsx`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/components/Navbar.jsx)
  - Application Footer: [`frontend/src/components/Footer.jsx`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/components/Footer.jsx)
  - Student Dashboard: [`frontend/src/pages/Dashboard.jsx`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/pages/Dashboard.jsx)
  - Practice Library: [`frontend/src/pages/Questions.jsx`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/pages/Questions.jsx)
  - Timed Workspace: [`frontend/src/pages/TakeAssessment.jsx`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/pages/TakeAssessment.jsx)
  - Career Roadmaps: [`frontend/src/pages/Roadmaps.jsx`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/pages/Roadmaps.jsx)
  - Admin Panel: [`frontend/src/pages/AdminDashboard.jsx`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/pages/AdminDashboard.jsx)

### 3.2 Routing and Navigation (2 Marks)
* Built using `react-router-dom` with client-side route protection:
  - `<ProtectedRoute>` redirects unauthenticated users to `/login`.
  - `<AdminRoute>` guards administrative management pages (`/admin`).
* **Project File Reference**: [`frontend/src/App.jsx`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/App.jsx)

### 3.3 State Management and Data Binding (2 Marks)
* Uses React Context API (`AuthContext`) to manage user session, authentication tokens, and user role globally.
* Employs standard hooks (`useState`, `useEffect`, `useContext`) for state synchronization and lifecycle management.
* **Project File Reference**: [`frontend/src/context/AuthContext.jsx`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/context/AuthContext.jsx)

### 3.4 Code Organization and Best Practices (1 Mark)
* Strict directory hierarchy (`/components`, `/context`, `/pages`, `/services`).

---

## CRITERION 4: Backend Development (Node.js & Express.js) (7 Marks)

### 4.1 REST API Development (2 Marks)
* Standard RESTful endpoints implementing JSON responses:
  - Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
  - Questions: `GET /api/questions`, `GET /api/questions/:id`
  - Assessments: `GET /api/assessments`, `GET /api/assessments/:id`, `POST /api/assessments/:id/submit`
  - Interview: `GET /api/interview`
  - Admin Stats: `GET /api/admin/stats`
* **Project File Reference**: [`backend/server.js`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/backend/server.js)

### 4.2 Routing and Middleware Implementation (2 Marks)
* Express router modules mounted for each feature domain (`auth.routes.js`, `question.routes.js`, `assessment.routes.js`, `interview.routes.js`, `admin.routes.js`).
* Protected with custom JWT authorization middleware (`protect`, `adminOnly`).
* **Project File Reference**: [`backend/middleware/auth.middleware.js`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/backend/middleware/auth.middleware.js)

### 4.3 Error Handling and Server-Side Validation (2 Marks)
* Global Express Error Middleware (`errorHandler`) handles duplicate email registrations (`ER_DUP_ENTRY`), connection drops, and JWT token expirations without exposing raw database stack traces.
* **Project File Reference**: [`backend/middleware/error.middleware.js`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/backend/middleware/error.middleware.js)

### 4.4 Code Modularity and Structure (1 Mark)
* Separation into Controllers, Routes, Middleware, and Database Config.

---

## CRITERION 5: Database Design & CRUD Operations (6 Marks)

### 5.1 Database Schema Design (2 Marks)
* Relational database schema with 6 tables (`users`, `coding_questions`, `interview_questions`, `assessments`, `assessment_questions`, `assessment_attempts`).
* Enforces primary keys, auto-increments, unique constraints on user emails, and foreign key cascades.
* **Project File References**:
  - [`database/schema.sql`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/database/schema.sql)
  - [`database/seed.sql`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/database/seed.sql)

### 5.2 CRUD Operations (Create, Read, Update, Delete) (3 Marks)
* **Create (C)**: User Registration (`POST /api/auth/register`), Admin Add Question (`POST /api/questions`), Admin Create Assessment (`POST /api/assessments`).
* **Read (R)**: Fetch Problems (`GET /api/questions`), Fetch Interview Q&A (`GET /api/interview`), Get User Stats (`GET /api/users/stats`).
* **Update (U)**: Admin Edit Coding Question (`PUT /api/questions/:id`), Admin Edit Assessment Mappings (`PUT /api/assessments/:id`).
* **Delete (D)**: Admin Delete Question (`DELETE /api/questions/:id`), Admin Delete Assessment (`DELETE /api/assessments/:id`).
* **Project File References**:
  - [`backend/controllers/question.controller.js`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/backend/controllers/question.controller.js)
  - [`backend/controllers/assessment.controller.js`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/backend/controllers/assessment.controller.js)

### 5.3 Database Connectivity and Validation (1 Mark)
* Uses MySQL `mysql2/promise` connection pool (`dbPool`) with asynchronous async/await execution.
* Includes hybrid fallback data provider ensuring 100% database query execution.
* **Project File Reference**: [`backend/config/db.js`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/backend/config/db.js)

---

## CRITERION 6: Integration & Application Functionality (5 Marks)

### 6.1 Frontend–Backend Integration (2 Marks)
* Centralized Axios instance (`API`) with request interceptor automatically attaching `Authorization: Bearer <token>` headers from `localStorage`.
* **Project File Reference**: [`frontend/src/services/api.js`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/frontend/src/services/api.js)

### 6.2 Backend–Database Integration (2 Marks)
* Parameterized SQL queries preventing SQL injection attacks (`dbPool.query('SELECT * FROM users WHERE email = ?', [email])`).

### 6.3 Overall Application Functionality (1 Mark)
* Complete end-to-end user workflows: Login -> Dashboard -> Practice Questions -> Take Assessment -> Score Calculation -> Results History -> Career Roadmaps -> Admin Management.

---

## CRITERION 7: Documentation & Code Quality (2 Marks)

### 7.1 Code Readability, Comments, Modularity (1 Mark)
* JSDoc annotations, clear variable naming conventions, clean code formatting.

### 7.2 Project Documentation / Report (1 Mark)
* Detailed documentation detailing setup instructions, technology stack, database schema, demo accounts, and API endpoints.
* **Project File Reference**: [`README.md`](file:///c:/Users/akhil/Desktop/coding%20assesment%20and%20interview%20platform/README.md)

---

## CRITERION 8: Project Demonstration & Viva Responses (2 Marks)

### 8.1 Demonstration of Application (1 Mark)
* Live application running locally:
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:5000`
  - GitHub Repository: `https://github.com/R-Adhiya/Codeprep.git`

### 8.2 Technical Explanation & Viva Q&A Guide (1 Mark)

#### Q1: How is user authentication secured in CodePrep?
> **Answer**: User authentication uses **JSON Web Tokens (JWT)** and **bcryptjs**. During registration, passwords are hashed with 10 salt rounds before database insertion. Upon login, a signed JWT token is issued containing user ID and role, stored in `localStorage`, and attached to outgoing requests via Axios interceptors.

#### Q2: How does the countdown timer and auto-submission work in TakeAssessment.jsx?
> **Answer**: `TakeAssessment.jsx` calculates total remaining seconds based on assessment duration (`duration * 60`). A React `useEffect` hook runs a `setInterval` timer decrementing seconds every 1000ms. When `timeLeft === 0`, it triggers `handleAutoSubmit()` to post user code answers to `POST /api/assessments/:id/submit`.

#### Q3: How is Role-Based Access Control (RBAC) enforced?
> **Answer**: On the backend, `adminOnly` middleware checks if `req.user.role === 'ADMIN'`. On the frontend, `App.jsx` wraps admin pages inside `<AdminRoute>`, redirecting non-admin users to `/dashboard`.

---

### 🔑 Demo Credentials for Viva Evaluation
- **Student Account**: `user@codeprep.com` | `user123`
- **Admin Account**: `admin@codeprep.com` | `admin123`
