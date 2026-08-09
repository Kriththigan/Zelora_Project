const express = require('express');
const router = express.Router();
const candidates = require('../data/candidates');

// GET /api/candidates - list all (with optional stage filter)
router.get('/', (req, res) => {
  const { stage } = req.query;

  let result = candidates;
  if (stage) {
    result = candidates.filter(c => c.stage === stage);
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

  if (!name || !stage) {
    return res.status(400).json({ error: 'Name and stage are required' });
  }

  const newCandidate = {
    id: candidates.length > 0 ? Math.max(...candidates.map(c => c.id)) + 1 : 1,
    name,
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

  Object.assign(candidate, req.body);
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