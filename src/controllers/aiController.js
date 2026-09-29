const Material = require("../models/Material");
const Flashcard = require("../models/Flashcard");
const Quiz = require("../models/Quiz");
const StudyPlan = require("../models/StudyPlan");
const { generateJSON } = require("../utils/gemini");

async function findOwnMaterial(req, res) {
  const { materialId } = req.body;
  if (!materialId) {
    res.status(400).json({ message: "materialId is required" });
    return null;
  }
  const material = await Material.findOne({ _id: materialId, userId: req.user._id });
  if (!material) res.status(404).json({ message: "Material not found" });
  return material;
}

// POST /api/ai/flashcards   { materialId, count? }
exports.flashcards = async (req, res, next) => {
  try {
    const material = await findOwnMaterial(req, res);
    if (!material) return;
    const count = Math.min(Number(req.body.count) || 10, 30);

    const cards = await generateJSON(
      `Create ${count} flashcards from the study material below for active recall.\n` +
      `Respond ONLY with a JSON array: [{"question": "...", "answer": "..."}]\n\n` +
      `${material.content}`
    );
    if (!Array.isArray(cards) || !cards.length)
      return res.status(502).json({ message: "AI did not return flashcards" });

    const saved = await Flashcard.insertMany(
      cards.map((c) => ({
        userId: req.user._id,
        materialId: material._id,
        question: c.question,
        answer: c.answer,
      }))
    );
    res.status(201).json(saved);
  } catch (err) { next(err); }
};

// POST /api/ai/quiz   { materialId, count? }
exports.quiz = async (req, res, next) => {
  try {
    const material = await findOwnMaterial(req, res);
    if (!material) return;
    const count = Math.min(Number(req.body.count) || 5, 20);

    const questions = await generateJSON(
      `Create ${count} multiple-choice questions from the study material below.\n` +
      `Respond ONLY with a JSON array: [{"question":"...","options":["A","B","C","D"],` +
      `"correctAnswer":"<must exactly match one option>","explanation":"..."}]\n\n` +
      `${material.content}`
    );
    if (!Array.isArray(questions) || !questions.length)
      return res.status(502).json({ message: "AI did not return quiz questions" });

    const quiz = await Quiz.findOneAndUpdate(
      { materialId: material._id },
      { userId: req.user._id, materialId: material._id, questions },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(quiz);
  } catch (err) { next(err); }
};

// POST /api/ai/study-plan   { subject, examDate, hoursPerDay, topics?, goals? }
exports.studyPlan = async (req, res, next) => {
  try {
    const { subject, examDate, hoursPerDay, topics, goals } = req.body;
    if (!subject || !examDate || !hoursPerDay)
      return res.status(400).json({ message: "subject, examDate and hoursPerDay are required" });
    const exam = new Date(examDate);
    if (isNaN(exam) || exam <= new Date())
      return res.status(400).json({ message: "examDate must be a valid future date" });

    const today = new Date().toISOString().slice(0, 10);
    const plan = await generateJSON(
      `Create a personalized day-by-day study plan.\n` +
      `Today: ${today}\nExam date: ${exam.toISOString().slice(0, 10)}\n` +
      `Subject: ${subject}\nHours available per day: ${hoursPerDay}\n` +
      `Topics: ${Array.isArray(topics) ? topics.join(", ") : topics || "not specified"}\n` +
      `Goals: ${goals || "pass the exam with good marks"}\n` +
      `Include revision and mock-test days near the exam. Respond ONLY with JSON: ` +
      `{"overview":"...","days":[{"date":"YYYY-MM-DD","focus":"...","tasks":["..."],"hours":0}]}`
    );

    const saved = await StudyPlan.create({
      userId: req.user._id,
      subject,
      studyPlan: plan,
      examDate: exam,
    });
    res.status(201).json(saved);
  } catch (err) { next(err); }
};

// Retrieval of saved AI resources
exports.myFlashcards = async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.materialId) filter.materialId = req.query.materialId;
    res.json(await Flashcard.find(filter).sort({ createdAt: -1 }));
  } catch (err) { next(err); }
};

exports.myQuizzes = async (req, res, next) => {
  try { res.json(await Quiz.find({ userId: req.user._id }).sort({ createdAt: -1 })); }
  catch (err) { next(err); }
};

exports.myStudyPlans = async (req, res, next) => {
  try { res.json(await StudyPlan.find({ userId: req.user._id }).sort({ createdAt: -1 })); }
  catch (err) { next(err); }
};
