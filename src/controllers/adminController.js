const User = require("../models/User");
const Material = require("../models/Material");
const Summary = require("../models/Summary");
const Flashcard = require("../models/Flashcard");
const Quiz = require("../models/Quiz");
const StudyPlan = require("../models/StudyPlan");

exports.listUsers = async (req, res, next) => {
  try { res.json(await User.find().select("-password").sort({ createdAt: -1 })); }
  catch (err) { next(err); }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["student", "admin"].includes(role))
      return res.status(400).json({ message: "role must be student or admin" });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.user._id))
      return res.status(400).json({ message: "You cannot delete your own account" });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const q = { userId: user._id };
    await Promise.all([
      Material.deleteMany(q), Summary.deleteMany(q), Flashcard.deleteMany(q),
      Quiz.deleteMany(q), StudyPlan.deleteMany(q),
    ]);
    res.json({ message: "User and related data deleted" });
  } catch (err) { next(err); }
};

// AI usage / platform monitoring
exports.stats = async (req, res, next) => {
  try {
    const [users, materials, summaries, flashcards, quizzes, studyPlans] = await Promise.all([
      User.countDocuments(), Material.countDocuments(), Summary.countDocuments(),
      Flashcard.countDocuments(), Quiz.countDocuments(), StudyPlan.countDocuments(),
    ]);
    res.json({ users, materials, aiUsage: { summaries, flashcards, quizzes, studyPlans } });
  } catch (err) { next(err); }
};
