const express = require('express');
const cors = require('cors');
const candidateRoutes = require('./routes/candidates');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Zelora backend is running 🚀');
});

app.use('/api/candidates', candidateRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});