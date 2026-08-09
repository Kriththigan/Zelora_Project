const express = require('express');
const router = express.Router();
const candidates = require('../data/candidates');

const VALID_STAGES = ['applying', 'screening', 'interview', 'test'];

// GET /api/candidates - list all (with optional stage filter, sorting, pagination)
router.get('/', (req, res) => {
  const { stage, sortBy, page, limit } = req.query;

  let result = candidates;

  if (stage) {
    result = result.filter(c => c.stage === stage);
  }

  if (sortBy === 'score') {
    result = [...result].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  } else if (sortBy === 'date') {
    result = [...result].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  if (page && limit) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;
    result = result.slice(start, end);
  }

  res.json(result);
});

// GET /api/candidates/:id - single candidate
router.get('/:id', (req, res) => {
  const candidate = candidates.find(c => c.id === parseInt(req.params.id));
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }
  res.json(candidate);
});

// POST /api/candidates - create new candidate
router.post('/', (req, res) => {
  const { name, date, score, referred, stage, pi, assessmentStatus } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }

  if (!stage || !VALID_STAGES.includes(stage)) {
    return res.status(400).json({ error: 'Valid stage is required', validStages: VALID_STAGES });
  }

  const newCandidate = {
    id: candidates.length > 0 ? Math.max(...candidates.map(c => c.id)) + 1 : 1,
    name: name.trim(),
    date: date || new Date().toLocaleDateString(),
    score: score ?? null,
    referred: referred ?? false,
    stage,
    pi: pi ?? 0,
    assessmentStatus: assessmentStatus || 'Not Started',
  };

  candidates.push(newCandidate);
  res.status(201).json(newCandidate);
});

// PUT /api/candidates/:id - update candidate
router.put('/:id', (req, res) => {
  const candidate = candidates.find(c => c.id === parseInt(req.params.id));
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  if (req.body.stage && !VALID_STAGES.includes(req.body.stage)) {
    return res.status(400).json({ error: 'Invalid stage', validStages: VALID_STAGES });
  }

  Object.assign(candidate, req.body);
  res.json(candidate);
});

// PATCH /api/candidates/:id/stage - update only the stage (for drag-and-drop)
router.patch('/:id/stage', (req, res) => {
  const { stage } = req.body;

  if (!stage || !VALID_STAGES.includes(stage)) {
    return res.status(400).json({ error: 'Valid stage is required', validStages: VALID_STAGES });
  }

  const candidate = candidates.find(c => c.id === parseInt(req.params.id));
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  candidate.stage = stage;
  res.json(candidate);
});

// DELETE /api/candidates/:id - delete candidate
router.delete('/:id', (req, res) => {
  const index = candidates.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  const deleted = candidates.splice(index, 1);
  res.json({ message: 'Candidate deleted', candidate: deleted[0] });
});

module.exports = router;