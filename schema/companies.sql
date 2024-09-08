-- Create Companies table
CREATE TABLE IF NOT EXISTS "Companies" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    rating FLOAT,
    isghostjob BOOLEAN DEFAULT FALSE,
    feedbacktime INTEGER,
    jobposts INTEGER,
    numapplicants INTEGER DEFAULT 0,
    avgfeedbacktime FLOAT DEFAULT 0,
    ghostjobprobability FLOAT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update company metrics
CREATE OR REPLACE FUNCTION update_company_metrics() RETURNS TRIGGER AS $$
DECLARE
    avg_feedback_time FLOAT;
    num_applicants INTEGER;
    ghost_job_probability FLOAT;
    is_ghost_job BOOLEAN;
BEGIN
    -- Calculate metrics for the company associated with the new application
    WITH metrics AS (
        SELECT 
            COUNT(*) AS total_applications,
            SUM(feedbacktime) AS total_feedback_time,
            SUM(CASE WHEN feedbacktime > 30 THEN 1 ELSE 0 END) AS long_feedback_time_count
        FROM applications
        WHERE company_id = NEW.company_id
    )
    SELECT
        total_feedback_time / total_applications / 7 AS avg_feedback_time, -- Convert to weeks
        total_applications AS num_applicants,
        (long_feedback_time_count::FLOAT / total_applications) * 100 AS ghost_job_probability,
        (long_feedback_time_count::FLOAT / total_applications) * 100 > 50 AS is_ghost_job -- Threshold for ghost job
    INTO avg_feedback_time, num_applicants, ghost_job_probability, is_ghost_job
    FROM metrics;

    -- Update the Companies table with the calculated metrics
    UPDATE companies
    SET 
        avgfeedbacktime = avg_feedback_time,
        numapplicants = num_applicants,
        ghostjobprobability = ghost_job_probability,
        isghostjob = is_ghost_job,
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = NEW.company_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for applications table
CREATE TRIGGER applications_after_insert
AFTER INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION update_company_metrics();
