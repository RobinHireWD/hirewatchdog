-- Create Applications table with foreign key reference
CREATE TABLE IF NOT EXISTS "Applications" (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL, -- Store company name
    company_id INTEGER REFERENCES "Companies"(id) ON DELETE SET NULL, -- Foreign key reference
    position VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    feedbacktime INTEGER NOT NULL, -- Feedback time in weeks
    degree VARCHAR(255) NOT NULL,
    applicationsource VARCHAR(255) NOT NULL,
    salaryexpectation INTEGER NOT NULL,
    applicationstatus VARCHAR(255) NOT NULL,
    listingduration INTEGER NOT NULL, -- Listing duration in days
    experience VARCHAR(255) NOT NULL,
    createdat TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Function to notify when an application is inserted or updated
CREATE OR REPLACE FUNCTION notify_application_update()
RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify('application_update', 'Application data updated');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER application_update_trigger
AFTER INSERT OR UPDATE ON "Applications"
FOR EACH ROW
EXECUTE FUNCTION notify_application_update();
