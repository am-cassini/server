import express from 'express';
import Request from '../models/Request.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// Create a new request
router.post('/', async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all requests
router.get("/latest", async (req, res) => {
  try {
    const latest = await Request.findOne().sort({ createdAt: -1 });
    res.json(latest || {});
  } catch (err) {
    res.status(500).json({ message: "Server error getting latest request" });
  }
});

// Update request status
router.put('/:id', async (req, res) => {
  try {
    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/requests/:id/status
router.put("/:id/status", async (req, res) => {
  try {
    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "Done" },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status." });
  }
});

// Get requests for the logged-in user
router.get('/my-requests', authMiddleware, async (req, res) => {
  try {
    const email = req.user.institutionalEmail;
    const requests = await Request.find({ email });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your requests' });
  }
});

// PATCH /api/requests/:id
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Request.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating request" });
  }
});


export default router;
