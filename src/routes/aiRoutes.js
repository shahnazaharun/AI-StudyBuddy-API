const router = require("express").Router();
const c = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/flashcards", c.flashcards);
router.post("/quiz", c.quiz);
router.post("/study-plan", c.studyPlan);
router.get("/flashcards", c.myFlashcards);
router.get("/quizzes", c.myQuizzes);
router.get("/study-plans", c.myStudyPlans);

module.exports = router;
