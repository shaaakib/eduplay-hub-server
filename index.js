const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('EduPlay-Hub is running');
});

app.listen(port, () => {
  console.log(`EduPlay-Hub server is running on port ${port}`);
});
