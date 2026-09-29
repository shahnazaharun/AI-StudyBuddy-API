const router = require("express").Router();
const c = require("../controllers/materialController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect);
router.post("/upload", upload.single("file"), c.upload);
router.get("/", c.list);
router.get("/:id", c.getOne);
router.put("/:id", c.update);
router.delete("/:id", c.remove);
router.post("/:id/summarize", c.summarize);

module.exports = router;
