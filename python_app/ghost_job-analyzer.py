import psycopg2
import psycopg2.extensions
from psycopg2.extras import DictCursor
import json
from datetime import datetime
import os

# Database connection settings
DATABASE = {
    'dbname': 'hirewatchdog_db',
    'user': 'postgres',
    'password': 'Robin123',
    'host': 'localhost'
}

def connect_db():
    """Establish a connection to the PostgreSQL database."""
    return psycopg2.connect(**DATABASE)

def fetch_applications(conn):
    """Fetch application data from the database."""
    query = 'SELECT * FROM "Applications"'  # Ensure correct table name casing
    with conn.cursor(cursor_factory=DictCursor) as cur:
        cur.execute(query)
        return cur.fetchall()

def analyze_applications(applications):
    """Analyze applications to determine metrics."""
    feedback_time_threshold = 4  # weeks
    ghost_job_probability_threshold = 50  # percentage

    company_metrics = {}

    for app in applications:
        if app['company_id'] is None or app['feedbacktime'] is None:
            continue

        company_id = app['company_id']
        if company_id not in company_metrics:
            company_metrics[company_id] = {
                'total_feedback_time': 0,
                'count': 0,
                'long_feedback_time_count': 0
            }
        
        metrics = company_metrics[company_id]
        metrics['total_feedback_time'] += app['feedbacktime']
        metrics['count'] += 1
        if app['feedbacktime'] > feedback_time_threshold:
            metrics['long_feedback_time_count'] += 1

    results = {}
    for company_id, metrics in company_metrics.items():
        total_applications = metrics['count']
        if total_applications == 0:
            avg_feedback_time = 0
            ghost_job_probability = 0
            is_ghost_job = False
        else:
            avg_feedback_time = metrics['total_feedback_time'] / total_applications
            ghost_job_probability = (metrics['long_feedback_time_count'] / total_applications) * 100
            is_ghost_job = ghost_job_probability > ghost_job_probability_threshold

        results[company_id] = {
            'avg_feedback_time': avg_feedback_time,
            'num_applicants': total_applications,
            'is_ghost_job': is_ghost_job,
            'ghost_job_probability': ghost_job_probability
        }

    return results

def calculate_jobposts(conn, company_id):
    """Calculate the number of distinct job posts for a given company."""
    query = """
        SELECT COUNT(DISTINCT "position") AS jobposts
        FROM "Applications"
        WHERE company_id = %s
    """
    with conn.cursor(cursor_factory=DictCursor) as cur:
        cur.execute(query, (company_id,))
        result = cur.fetchone()
        return result['jobposts']

def calculate_rating(avg_feedback_time, ghost_job_probability, num_applicants, jobposts):
    """
    Calculate the company rating on a scale from 1 to 5.
    
    The rating is based on:
    - Average feedback time (lower is better)
    - Ghost job probability (lower is better)
    - Number of applicants (higher is better)
    - Number of job posts (higher is better)
    """
    feedback_time_score = max(0, min(1, (8 - avg_feedback_time) / 8)) if avg_feedback_time is not None else 0
    ghost_job_score = max(0, min(1, (100 - ghost_job_probability) / 100)) if ghost_job_probability is not None else 0
    applicant_score = min(1, num_applicants / 100) if num_applicants is not None else 0
    jobpost_score = min(1, jobposts / 20) if jobposts is not None else 0
    
    rating_score = (feedback_time_score * 0.3) + (ghost_job_score * 0.4) + (applicant_score * 0.2) + (jobpost_score * 0.1)
    rating = rating_score * 4 + 1  # Scale 0-1 to 1-5
    
    return round(rating, 1)  # Round to one decimal place

def update_company(conn, company_id, metrics):
    """Update the company's metrics in the database."""
    jobposts = calculate_jobposts(conn, company_id)
    
    # Calculate the company rating
    rating = calculate_rating(
        avg_feedback_time=metrics['avg_feedback_time'],
        ghost_job_probability=metrics['ghost_job_probability'] / 100,  # Normalize to 0-1 range
        num_applicants=metrics['num_applicants'],
        jobposts=jobposts
    )
    
    # Ensure ghostjobprobability is within the range 0 to 1
    ghostjobprobability = max(0, min(1, metrics['ghost_job_probability'] / 100))

    query = """
        UPDATE "Companies"
        SET
            rating = %s,
            isghostjob = %s,
            num_feedback = %s,
            jobposts = %s,
            numapplicants = %s,
            avgfeedbacktime = %s,
            ghostjobprobability = %s,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
    """
    with conn.cursor() as cur:
        cur.execute(query, (
            rating,
            metrics['is_ghost_job'],
            metrics['num_applicants'],
            jobposts,
            metrics['num_applicants'],
            metrics['avg_feedback_time'] if metrics['avg_feedback_time'] is not None else 0,
            ghostjobprobability,
            company_id
        ))
        conn.commit()

    # Save the updated metrics to a JSON file
    save_metrics_to_json(company_id, metrics)

def save_metrics_to_json(company_id, metrics):
    """Save the updated company metrics to a JSON file with a timestamp."""
    output_dir = "C:\\Users\\singh\\hirewatchdog\\python_app\\Ghost_JSON"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    filename = os.path.join(output_dir, f'company_{company_id}_update_{timestamp}.json')

    with open(filename, 'w') as f:
        json.dump(metrics, f, indent=4)

    print(f"Updated metrics saved to {filename}")

def main():
    """Run the script manually for testing."""
    conn = connect_db()
    
    try:
        applications = fetch_applications(conn)
        
        if applications:
            company_metrics = analyze_applications(applications)

            for company_id, metrics in company_metrics.items():
                update_company(conn, company_id, metrics)
            print("Companies table updated successfully.")
        else:
            print("No applications data to process.")
    
    finally:
        conn.close()

if __name__ == '__main__':
    main()
