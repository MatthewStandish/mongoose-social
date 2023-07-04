const User = require("../models/User");
const Thought = require("../models/Thought");

const thoughtController = {
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getThoughtById: async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.id);
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createThought: async function (req, res) {
    try {
      const dbThoughtData = await Thought.create(req.body);
      const dbUserData = await User.findOneAndUpdate(
        { username: dbThoughtData.username },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );
      if (!dbUserData) {
        return res.status(404).json({
          message: "Thought was created, but no user found with this id",
        });
      }
      res.json({ message: "Thought was created" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  updateThought: async (req, res) => {
    try {
      const { thoughtText } = req.body;
      const thought = await Thought.findByIdAndUpdate(
        req.params.id,
        { thoughtText },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteThought: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.id);
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      const user = await User.findById(thought.userId);
      user.thoughts.pull(thought._id);
      await user.save();
      res.json({ message: "Thought deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createReaction: async (req, res) => {
    try {
      const { reactionBody, username } = req.body;
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      thought.reactions.push({ reactionBody, username });
      await thought.save();
      res.status(201).json(thought);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteReaction: async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      thought.reactions.pull({ reactionId: req.params.reactionId });
      await thought.save();
      res.json({ message: "Reaction deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = thoughtController;
