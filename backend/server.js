require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const winston = require('winston'); // Logging

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Construct the database URL from individual environment variables
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
const DATABASE_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`;

// Log environment variables for debugging
console.log('Environment Variables Loaded:');
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
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Companies',
      key: 'id'
    },
    allowNull: true
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feedbacktime: {  // Keep feedbacktime here for Application
    type: DataTypes.INTEGER,
    allowNull: false
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: false
  },
  applicationsource: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salaryexpectation: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  applicationstatus: {
    type: DataTypes.STRING,
    allowNull: false
  },
  listingduration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Applications',
  timestamps: true,
  underscored: true
});

// Define Company model with num_feedback instead of feedbacktime
const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  isghostjob: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  num_feedback: {  // Changed feedbacktime to num_feedback
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  jobposts: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  numapplicants: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  avgfeedbacktime: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  ghostjobprobability: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'Companies',
  timestamps: true,
  underscored: true
});

// Establish associations
Company.hasMany(Application, { foreignKey: 'company_id' });
Application.belongsTo(Company, { foreignKey: 'company_id' });

// Create the tables if they don't exist
sequelize.sync({ alter: true })
  .then(() => console.log('Database synchronized'))
  .catch(error => console.error('Error synchronizing the database:', error));

// Error handling helper function
const handleError = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({ error: `${message}: ${error.message}` });
};

// Helper function to find or create a company
const findOrCreateCompany = async (companyName) => {
  const [company, created] = await Company.findOrCreate({
    where: { name: companyName }
  });
  return company;
};

// Routes for Applications
app.post('/applications', async (req, res) => {
  console.log('Received request to create application');
  try {
    const {
      company,
      position,
      country,
      feedbacktime,
      degree,
      applicationsource,
      salaryexpectation,
      applicationstatus,
      listingduration,
      experience
    } = req.body;

    // Detailed validation
    const missingFields = [];
    if (!company) missingFields.push('company');
    if (feedbacktime === undefined) missingFields.push('feedbacktime');
    if (!applicationsource) missingFields.push('applicationsource');
    if (salaryexpectation === undefined) missingFields.push('salaryexpectation');
    if (!applicationstatus) missingFields.push('applicationstatus');
    if (listingduration === undefined) missingFields.push('listingduration');

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Find or create the company
    const companyRecord = await findOrCreateCompany(company);

    // Create a new application entry
    const newApplication = await Application.create({
      company,
      company_id: companyRecord.id,
      position,
      country,
      feedbacktime,
      degree,
      applicationsource,
      salaryexpectation,
      applicationstatus,
      listingduration,
      experience
    });

    // Update the company with the new number of applicants
    await Company.update(
      { numapplicants: sequelize.literal('numapplicants + 1') },
      { where: { id: companyRecord.id } }
    );

    res.status(201).json(newApplication);
  } catch (error) {
    handleError(res, error, 'Failed to create application');
  }
});

app.get('/applications', async (req, res) => {
  console.log('Fetching applications');
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await Application.findAndCountAll({
      limit,
      offset
    });

    res.json({ applications: rows, total: count });
  } catch (error) {
    handleError(res, error, 'Failed to fetch applications');
  }
});

// Routes for Company Insights
app.get('/api/company-insights', async (req, res) => {
  console.log('Fetching company insights');
  try {
    const companies = await Company.findAll({
      include: {
        model: Application,
        attributes: ['feedbacktime'] // Include only available fields
      }
    });
    res.json(companies);
  } catch (error) {
    handleError(res, error, 'Failed to fetch company insights');
  }
});

// Route to update company rating (num_feedback and other fields updated here)
app.post('/update-company-rating', async (req, res) => {
  console.log('Updating company rating');
  try {
    const { name, rating, num_feedback, jobposts } = req.body;

    const company = await Company.findOne({ where: { name } });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const isghostjob = num_feedback < 5 || jobposts < 5; // Example criteria for ghost job

    company.rating = rating;
    company.isghostjob = isghostjob;
    company.num_feedback = num_feedback;
    company.jobposts = jobposts;

    await company.save();
    res.json(company);
  } catch (error) {
    handleError(res, error, 'Failed to update company rating');
  }
});

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Optionally exit the process
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Optionally exit the process
  process.exit(1);
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
