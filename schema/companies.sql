-- Create Companies table with additional columns
CREATE TABLE IF NOT EXISTS "Companies" (
    id SERIAL PRIMARY KEY,                -- Unique identifier for each company
    name VARCHAR(255) NOT NULL UNIQUE,    -- Company name
    rating FLOAT,                         -- Rating on a scale from 1 to 5
    isghostjob BOOLEAN DEFAULT FALSE,     -- Whether the company is identified as a "ghost job"
    num_feedback INTEGER DEFAULT 0,       -- Number of feedback received (applications)
    jobposts INTEGER DEFAULT 0,           -- Number of distinct job posts
    numapplicants INTEGER DEFAULT 0,      -- Number of applicants
    avgfeedbacktime FLOAT DEFAULT 0,      -- Average feedback time in weeks
    ghostjobprobability FLOAT DEFAULT 0,  -- Probability of the job being a ghost job
    avglistingduration FLOAT DEFAULT 0,   -- Average listing duration in days
    numrejection INTEGER DEFAULT 0,      -- Number of rejections
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to update company metrics
CREATE OR REPLACE FUNCTION update_company_metrics(company_id INTEGER) RETURNS VOID AS $$
DECLARE
    avg_feedback_time FLOAT;
    num_applicants INTEGER;
    ghost_job_probability FLOAT;
    is_ghost_job BOOLEAN;
    avg_listing_duration FLOAT;
    num_rejections INTEGER;
    long_listing_threshold INTEGER := 60; -- Threshold for long listing duration (60 days)
    feedback_ratio_threshold FLOAT := 0.10; -- Minimum 10% feedback-applicant ratio
BEGIN
    -- Calculate metrics for the company associated with the new application
    WITH metrics AS (
        SELECT 
            COUNT(*) AS total_applications,
            COALESCE(SUM(feedbacktime), 0) AS total_feedback_time,
            COALESCE(SUM(CASE WHEN feedbacktime > (SELECT AVG(feedbacktime) FROM "Applications" WHERE company_id = company_id) THEN 1 ELSE 0 END), 0) AS long_feedback_time_count,
            COALESCE(SUM(CASE WHEN listingduration > long_listing_threshold THEN 1 ELSE 0 END), 0) AS long_listing_count,
            COALESCE(SUM(CASE WHEN feedbacktime > 0 THEN 1 ELSE 0 END), 0) AS feedback_count,
            COALESCE(AVG(listingduration), 0) AS avg_listing_duration,
            COALESCE(SUM(CASE WHEN applicationstatus = 'Rejected' THEN 1 ELSE 0 END), 0) AS num_rejections
        FROM "Applications"
        WHERE company_id = company_id
    )
    SELECT
        COALESCE(total_feedback_time / NULLIF(total_applications, 0) / 7, 0) AS avg_feedback_time, -- Convert to weeks, avoid division by zero
        total_applications AS num_applicants,
        COALESCE((long_feedback_time_count::FLOAT / NULLIF(total_applications, 0)) * 100, 0) AS ghost_job_probability,
        (COALESCE((feedback_count::FLOAT / NULLIF(total_applications, 0)), 0) < feedback_ratio_threshold OR long_listing_count > 0 OR ghost_job_probability > 50) AS is_ghost_job,
        avg_listing_duration,
        num_rejections
    INTO avg_feedback_time, num_applicants, ghost_job_probability, is_ghost_job, avg_listing_duration, num_rejections
    FROM metrics;

    -- Update the Companies table with the calculated metrics
    UPDATE "Companies"
    SET 
        avgfeedbacktime = avg_feedback_time,
        numapplicants = num_applicants,
        ghostjobprobability = ghost_job_probability,
        isghostjob = is_ghost_job,
        avglistingduration = avg_listing_duration,
        numrejections = num_rejections,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = company_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process the update queue
CREATE OR REPLACE FUNCTION process_update_queue() RETURNS VOID AS $$
DECLARE
    record RECORD;
BEGIN
    FOR record IN
        SELECT * FROM "CompanyUpdateQueue"
    LOOP
        -- Update company metrics
        PERFORM update_company_metrics(record.company_id);
        
        -- Remove the processed record from the queue
        DELETE FROM "CompanyUpdateQueue" WHERE id = record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a job to process the update queue periodically (e.g., every minute)
-- This is optional; if you prefer real-time updates via the Python script, you can skip this.
CREATE OR REPLACE FUNCTION schedule_update_queue() RETURNS VOID AS $$
BEGIN
    PERFORM pg_sleep(60); -- Wait for 60 seconds
    PERFORM process_update_queue();
END;
$$ LANGUAGE plpgsql;

-- Schedule the periodic function (if desired, using pg_cron or another scheduler)
-- Note: Make sure pg_cron is installed and configured in your PostgreSQL instance.
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('*/1 * * * *', 'SELECT schedule_update_queue();');
