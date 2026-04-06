require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');


const app = express();
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
  credentials: true
}));

// Supabase client setup
const supabase = createClient(process.env.DATABASE_URL, process.env.SUPABASE_KEY);
app.set('supabase', supabase);

// Import routes
const leadRoutes = require('./routes/leadRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

app.use('/api', leadRoutes);
app.use('/api', propertyRoutes);
app.use('/api', webhookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
