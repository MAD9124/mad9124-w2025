const { Router } = require("express");

const matchController = require("../controllers/matches.js");

const router = Router();

router.post("/", matchController.createOne);
router.get("/", matchController.getAll);
router.get("/:id", matchController.getOne);
router.put("/:id", matchController.replaceOne);
router.patch("/:id", matchController.updateOne);
router.delete("/:id", matchController.deleteOne);

module.exports = router;
