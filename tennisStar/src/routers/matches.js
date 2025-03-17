const { Router } = require("express");

const matchController = require("../controllers/matches");
const { requireAllFields } = require("../middleware/matches");
const { validObjectId } = require("../middleware/mongo");

const router = Router();

router.post("/", requireAllFields, matchController.createOne);
router.get("/", matchController.getAll);
router.get("/:id", validObjectId, matchController.getOne);
router.put("/:id", validObjectId, requireAllFields, matchController.updateOne);
router.patch("/:id", validObjectId, matchController.updateOne);
router.delete("/:id", validObjectId, matchController.deleteOne);

module.exports = router;
