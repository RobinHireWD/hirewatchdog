// Load environment variables from config.env file
require('dotenv').config({ path: './config.env' });

const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Construct the database URL from individual environment variables
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
const DATABASE_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`;

// Log environment variables for debugging
console.log('Environment Variables:');
console.log(`DATABASE_URL: ${DATABASE_URL}`);

// Set up PostgreSQL connection using Sequelize
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: false
  }
});

// Define Application model
const Application = sequelize.define('Application', {
  company: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, allowNull: false },
  feedbackTime: { type: DataTypes.INTEGER, allowNull: false },
  degree: { type: DataTypes.STRING, allowNull: false },
  applicationSource: { type: DataTypes.STRING, allowNull: false },
  salaryExpectation: { type: DataTypes.FLOAT, allowNull: false },
  ApplicationStatus: { type: DataTypes.STRING, allowNull: false },
  listingDuration: { type: DataTypes.INTEGER, allowNull: true },
  experience: { type: DataTypes.STRING, allowNull: true },
});

// Define Company model
const Company = sequelize.define('Company', {
  name: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: true },
  isGhostJob: { type: DataTypes.BOOLEAN, defaultValue: false },
  feedbackTime: { type: DataTypes.INTEGER, allowNull: true },
  jobPosts: { type: DataTypes.INTEGER, allowNull: true },
});

// Create the tables if they don't exist
sequelize.sync();

// Routes for Applications
app.post('/applications', async (req, res) => {
  try {
    const existingApp = await Application.findOne({ where: { company: req.body.company, position: req.body.position } });
    if (existingApp) {
      return res.status(400).json({ error: 'Application already exists' });
    }
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    console.error('Error adding application:', error);
    res.status(500).json({ error: 'Failed to add application' });
  }
});

app.get('/applications', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await Application.findAndCountAll({
      limit,
      offset,
    });

    res.json({ applications: rows, total: count });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Routes for Company Insights
app.get('/company-insights', async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    console.error('Error fetching company insights:', error);
    res.status(500).json({ error: 'Failed to fetch company insights' });
  }
});

app.post('/update-company-rating', async (req, res) => {
  try {
    const { name, rating, feedbackTime, jobPosts } = req.body;
    
    const company = await Company.findOne({ where: { name } });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    // Calculate if the company is posting ghost jobs
    const isGhostJob = feedbackTime > 30 || jobPosts < 5; // Example criteria

    company.rating = rating;
    company.isGhostJob = isGhostJob;
    company.feedbackTime = feedbackTime;
    company.jobPosts = jobPosts;

    await company.save();
    res.json(company);
  } catch (error) {
    console.error('Error updating company rating:', error);
    res.status(500).json({ error: 'Failed to update company rating' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
