-- hirewatchdog/schema/companies.sql

-- Create Companies table
CREATE TABLE IF NOT EXISTS "Companies" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating FLOAT,
    isghostjob BOOLEAN DEFAULT FALSE,
    feedbacktime INTEGER, -- This can be average feedback time if needed
    jobposts INTEGER,    -- This can be number of job posts if needed
    numapplicants INTEGER DEFAULT 0, -- Total number of applicants
    avgfeedbacktime FLOAT DEFAULT 0, -- Average feedback time
    ghostjobprobability FLOAT DEFAULT 0, -- Probability of ghost job
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure that columns do not contain NULL values if specified
ALTER TABLE "Companies" 
    ALTER COLUMN name SET NOT NULL;
