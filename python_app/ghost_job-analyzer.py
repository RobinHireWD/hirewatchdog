import pandas as pd
import json
import os
import time
from sqlalchemy import create_engine, MetaData, Table, text
from sqlalchemy.orm import sessionmaker

# Database configuration
DB_SETTINGS = {
    'dbname': 'hirewatchdog_db',
    'user': 'postgres',
    'password': 'Robin123',
    'host': 'localhost'
}

# JSON file settings
JSON_INDENT = 4
OUTPUT_DIR = r"C:\Users\singh\hirewatchdog\python_app\Ghost_JSON"

def convert_timestamp(ts):
    """Convert pandas Timestamp to ISO format string."""
    return None if pd.isna(ts) else ts.isoformat()

def fetch_data_from_db(table_name):
    """Fetch data from the specified table in the PostgreSQL database using SQLAlchemy."""
    try:
        engine = create_engine(f'postgresql://{DB_SETTINGS["user"]}:{DB_SETTINGS["password"]}@{DB_SETTINGS["host"]}/{DB_SETTINGS["dbname"]}')
        query = f'SELECT * FROM "{table_name}";'
        data = pd.read_sql_query(query, engine)
        return data
    except Exception as e:
        print(f"Error fetching data from table {table_name}: {e}")
        return None

def export_to_json(data, file_path):
    """Export DataFrame to JSON file."""
    try:
        data = data.applymap(lambda x: convert_timestamp(x) if isinstance(x, pd.Timestamp) else x)
        data.to_json(file_path, orient='records', indent=JSON_INDENT)
        print(f"Data exported successfully to {file_path}")
    except Exception as e:
        print(f"Error exporting data: {e}")

def export_application_data():
    """Fetch and export data from 'Applications' table."""
    data = fetch_data_from_db('Applications')
    if data is not None:
        export_to_json(data, os.path.join(OUTPUT_DIR, 'application.json'))

def analyze_application_data():
    """Analyze 'application.json' data and populate 'CompanyInsight.json'."""
    try:
        with open(os.path.join(OUTPUT_DIR, 'application.json'), 'r') as app_file:
            application_data = json.load(app_file)

        insights = []
        for app in application_data:
            feedback_time = app.get("feedbackTime", 0)
            status = app.get("ApplicationStatus", "Unknown")
            company = app.get("company", "Unknown")
            
            is_ghost_job = (feedback_time > 3 and status == "Rejected")
            insight = {
                "companyName": company,
                "feedbackTime": feedback_time,
                "ghostJobIndicator": is_ghost_job,
                "rating": 1 if is_ghost_job else 5,
                "createdAt": app.get("createdAt"),
                "updatedAt": app.get("updatedAt")
            }
            insights.append(insight)

        with open(os.path.join(OUTPUT_DIR, 'CompanyInsight.json'), 'w') as insight_file:
            json.dump(insights, insight_file, indent=JSON_INDENT)
        print(f"Company insights exported successfully to CompanyInsight.json")
    except Exception as e:
        print(f"Error analyzing data: {e}")

def insert_company_insights():
    """Insert data from CompanyInsight.json into the Companies table and update metrics."""
    try:
        engine = create_engine(f'postgresql://{DB_SETTINGS["user"]}:{DB_SETTINGS["password"]}@{DB_SETTINGS["host"]}/{DB_SETTINGS["dbname"]}')
        Session = sessionmaker(bind=engine)
        session = Session()

        with open(os.path.join(OUTPUT_DIR, 'CompanyInsight.json'), 'r') as insight_file:
            insights = json.load(insight_file)

        metadata = MetaData()
        metadata.reflect(bind=engine)
        companies_table = Table('Companies', metadata, autoload_with=engine)
        applications_table = Table('Applications', metadata, autoload_with=engine)

        for insight in insights:
            company_name = insight['companyName']
            existing_company = session.query(companies_table).filter_by(name=company_name).first()

            if existing_company:
                print(f"Company {company_name} already exists. Updating...")
                company_id = existing_company.id

                # Update numApplicants
                session.execute(text(f"""
                    UPDATE "Companies"
                    SET "numapplicants" = "numapplicants" + 1
                    WHERE id = :company_id
                """), {'company_id': company_id})

                # Update avgFeedbackTime
                session.execute(text(f"""
                    WITH feedback_times AS (
                        SELECT "feedbackTime"
                        FROM "Applications"
                        WHERE "company" = :company_name
                    )
                    UPDATE "Companies"
                    SET "avgfeedbacktime" = (
                        SELECT AVG("feedbackTime") FROM feedback_times
                    )
                    WHERE id = :company_id
                """), {'company_name': company_name, 'company_id': company_id})

                # Update ghostJobProbability
                session.execute(text(f"""
                    WITH ghost_jobs AS (
                        SELECT COUNT(*) AS ghost_count
                        FROM "Applications"
                        WHERE "company" = :company_name AND "feedbackTime" > 3 AND "ApplicationStatus" = 'Rejected'
                    ),
                    total_apps AS (
                        SELECT COUNT(*) AS total_count
                        FROM "Applications"
                        WHERE "company" = :company_name
                    )
                    UPDATE "Companies"
                    SET "ghostjobprobability" = (
                        SELECT COALESCE((ghost_count::FLOAT / total_count), 0)
                        FROM ghost_jobs, total_apps
                    )
                    WHERE id = :company_id
                """), {'company_name': company_name, 'company_id': company_id})
                
            else:
                result = session.execute(companies_table.insert().values({
                    'name': company_name,
                    'rating': insight['rating'],
                    'isghostjob': insight['ghostJobIndicator'],
                    'feedbacktime': insight['feedbackTime'],
                    'numapplicants': 1,  # Initialize with 1 as this is the first application
                    'avgfeedbacktime': insight['feedbackTime'],  # Initialize with the current feedbackTime
                    'ghostjobprobability': 0  # Initialize with 0
                }))
                company_id = result.inserted_primary_key[0]

                # Insert application data
                session.execute(applications_table.insert().values({
                    'company': company_name,
                    'position': insight.get('position', 'unknown'),
                    'country': insight.get('country', 'unknown'),
                    'feedbackTime': insight['feedbackTime'],
                    'degree': insight.get('degree', 'unknown'),
                    'applicationSource': insight.get('applicationSource', 'unknown'),
                    'salaryExpectation': insight.get('salaryExpectation', 0),
                    'ApplicationStatus': insight.get('ApplicationStatus', 'unknown'),
                    'listingDuration': insight.get('listingDuration', 0),
                    'experience': insight.get('experience', 'unknown'),
                }))

        session.commit()
        print("Company insights and applications inserted/updated successfully.")

    except Exception as e:
        print(f"Error inserting company insights: {e}")

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Step 1: Fetch and export Applications data to JSON
    export_application_data()

    # Introduce delay to ensure data is ready
    time.sleep(2)  # Delay to ensure the file is generated

    # Step 2: Analyze application data and generate insights
    analyze_application_data()

    # Step 3: Insert insights into Companies table
    insert_company_insights()

if __name__ == "__main__":
    main()
