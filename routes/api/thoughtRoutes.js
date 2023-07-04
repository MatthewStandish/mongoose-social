const express = require("express");
const router = express.Router();

const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
} = require("../../controllers/thoughtController");

router.get("/", getAllThoughts);
router.get("/:id", getThoughtById);
router.post("/", createThought);
router.put("/:id", updateThought);
router.delete("/:id", deleteThought);
router.post("/:thoughtId/reactions", createReaction);
router.delete("/:thoughtId/reactions/:reactionId", deleteReaction);

module.exports = router;
