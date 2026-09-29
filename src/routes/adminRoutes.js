const router = require("express").Router();
const c = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));
router.get("/users", c.listUsers);
router.patch("/users/:id/role", c.updateRole);
router.delete("/users/:id", c.deleteUser);
router.get("/stats", c.stats);

module.exports = router;
