# AI StudyBuddy – Backend

AI-powered study assistant: upload study material, then generate summaries, flashcards,
MCQ quizzes and personalized study plans with Google Gemini 2.5 Flash.

**Stack:** Node.js, Express, MongoDB + Mongoose, JWT + RBAC, bcryptjs, Multer, `@google/genai`.

## Setup
```bash
npm install
# edit .env (MONGO_URI, JWT_SECRET, GEMINI_API_KEY)
npm start        # or: npm run dev
```

## Structure
```
index.js
src/
  controllers/  auth, material, ai, admin
  middleware/   auth.js (JWT + RBAC), upload.js (Multer)
  models/       User, Material, Summary, Flashcard, Quiz, StudyPlan
  routes/       authRoutes, materialRoutes, aiRoutes, adminRoutes
  utils/        db.js, gemini.js
```

## API (send `Authorization: Bearer <token>` on everything except register/login)
| Method | Endpoint | Body |
|---|---|---|
| POST | /api/auth/register | name, email, password |
| POST | /api/auth/login | email, password |
| GET | /api/auth/me | – |
| POST | /api/material/upload | title, subject, content **or** multipart `file` (.txt/.md/.csv/.json) |
| GET/PUT/DELETE | /api/materials/:id | – |
| POST | /api/materials/:id/summarize | – |
| POST | /api/ai/flashcards | materialId, count? |
| POST | /api/ai/quiz | materialId, count? |
| POST | /api/ai/study-plan | subject, examDate, hoursPerDay, topics?, goals? |
| GET | /api/ai/flashcards, /quizzes, /study-plans | – |
| GET | /api/admin/users, /api/admin/stats | admin only |
| PATCH | /api/admin/users/:id/role | role: student/admin |
| DELETE | /api/admin/users/:id | admin only |

## Creating the first admin
Public registration always creates a `student`. Promote one user in MongoDB:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```
