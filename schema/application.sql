-- Create Applications table with foreign key reference
CREATE TABLE IF NOT EXISTS "Applications" (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL, -- Store company name
    company_id INTEGER REFERENCES "Companies"(id) ON DELETE SET NULL, -- Foreign key reference
    position VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    feedbacktime INTEGER NOT NULL,
    degree VARCHAR(255) NOT NULL,
    applicationsource VARCHAR(255) NOT NULL,
    salaryexpectation INTEGER NOT NULL,
    applicationstatus VARCHAR(255) NOT NULL,
    listingduration INTEGER NOT NULL,
    experience VARCHAR(255) NOT NULL,
    createdat TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
