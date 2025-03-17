const { Router } = require("express");

const courtController = require("../controllers/courts.js");
const { requireAllFields } = require("../middleware/courts.js");
const { validObjectId } = require("../middleware/mongo.js");

const router = Router();

router.post("/", requireAllFields, courtController.createOne);
router.get("/", courtController.getAll);

router.get("/:id", validObjectId, courtController.getOne);
router.put("/:id", validObjectId, requireAllFields, courtController.updateOne);
router.patch("/:id", validObjectId, courtController.updateOne);
router.delete("/:id", validObjectId, courtController.deleteOne);

module.exports = router;
