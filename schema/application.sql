-- Create Applications table with foreign key reference
CREATE TABLE IF NOT EXISTS "Applications" (
    id SERIAL PRIMARY KEY,                -- Unique identifier for each application
    company VARCHAR(255) NOT NULL,        -- Store company name
    company_id INTEGER REFERENCES "Companies"(id) ON DELETE SET NULL, -- Foreign key reference
    position VARCHAR(255) NOT NULL,       -- Position applied for
    country VARCHAR(255) NOT NULL,        -- Country where the job is located
    feedbacktime INTEGER NOT NULL,        -- Feedback time in weeks
    degree VARCHAR(255) NOT NULL,         -- Degree required for the position
    applicationsource VARCHAR(255) NOT NULL, -- Source from where the application came
    salaryexpectation INTEGER NOT NULL,   -- Salary expectation in USD
    applicationstatus VARCHAR(255) NOT NULL, -- Status of the application
    listingduration INTEGER NOT NULL,     -- Listing duration in days
    experience VARCHAR(255) NOT NULL,     -- Experience level required
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create a table to queue company updates
CREATE TABLE IF NOT EXISTS "CompanyUpdateQueue" (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Function to notify on application insert
CREATE OR REPLACE FUNCTION notify_application_insert() RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('applications_update', 'new_application');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to notify updates
CREATE TRIGGER applications_after_insert
AFTER INSERT ON "Applications"
FOR EACH ROW
EXECUTE FUNCTION notify_application_insert();

-- Function to queue company update
CREATE OR REPLACE FUNCTION queue_company_update() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "CompanyUpdateQueue" (company_id)
    VALUES (NEW.company_id)
    ON CONFLICT (company_id) DO NOTHING; -- Avoid duplicates
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for Applications table to queue updates
CREATE TRIGGER applications_after_update
AFTER INSERT ON "Applications"
FOR EACH ROW
EXECUTE FUNCTION queue_company_update();
