require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const currencyRoutes = require('./routes/currencyRoutes');

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/currency', currencyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});