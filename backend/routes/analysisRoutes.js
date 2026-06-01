const express = require("express");

const {
  analyzeTask,
} = require("../services/aiService");

const router = express.Router();

router.post("/analyze-task", async (req, res) => {
  try {
    const result = await analyzeTask(req.body);

    res.json({
      success: true,
      analysis: result,
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;