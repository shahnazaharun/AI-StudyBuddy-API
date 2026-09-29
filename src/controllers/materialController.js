const Material = require("../models/Material");
const Summary = require("../models/Summary");
const { generateText } = require("../utils/gemini");

exports.upload = async (req, res, next) => {
  try {
    const { title, subject } = req.body;
    // Content comes from an uploaded file (field "file") or from the body text
    const content = req.file ? req.file.buffer.toString("utf-8") : req.body.content;
    if (!title || !content || !content.trim())
      return res.status(400).json({ message: "title and content (or a file) are required" });

    const material = await Material.create({
      userId: req.user._id,
      title,
      subject,
      content: content.trim(),
    });
    res.status(201).json(material);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const materials = await Material.find({ userId: req.user._id })
      .select("-content")
      .sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const material = await Material.findOne({ _id: req.params.id, userId: req.user._id });
    if (!material) return res.status(404).json({ message: "Material not found" });
    res.json(material);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { title, subject, content } = req.body;
    const material = await Material.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, subject, content },
      { new: true, omitUndefined: true, runValidators: true }
    );
    if (!material) return res.status(404).json({ message: "Material not found" });
    res.json(material);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const material = await Material.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!material) return res.status(404).json({ message: "Material not found" });
    res.json({ message: "Material deleted" });
  } catch (err) { next(err); }
};

// POST /api/materials/:id/summarize
exports.summarize = async (req, res, next) => {
  try {
    const material = await Material.findOne({ _id: req.params.id, userId: req.user._id });
    if (!material) return res.status(404).json({ message: "Material not found" });

    const text = await generateText(
      `You are a study assistant. Summarize the following study material into concise, ` +
      `well-structured revision notes (key concepts, definitions, important points).\n\n` +
      `Title: ${material.title}\nSubject: ${material.subject}\n\n${material.content}`
    );

    const summary = await Summary.findOneAndUpdate(
      { materialId: material._id },
      { userId: req.user._id, materialId: material._id, summary: text },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(summary);
  } catch (err) { next(err); }
};
