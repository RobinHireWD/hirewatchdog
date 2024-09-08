-- Create Applications Table with a reference to Companies
CREATE TABLE IF NOT EXISTS "Applications" (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES "Companies"(id) ON DELETE CASCADE, -- Foreign key to Companies table
    position VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    feedbackTime INTEGER NOT NULL,
    degree VARCHAR(255) NOT NULL,
    applicationSource VARCHAR(255) NOT NULL,
    salaryExpectation INTEGER NOT NULL,
    ApplicationStatus VARCHAR(255) NOT NULL,
    listingDuration INTEGER NOT NULL,
    experience VARCHAR(255) NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
