import psycopg2
from psycopg2.extras import DictCursor

# Database connection settings
DATABASE = {
    'dbname': 'hirewatchdog_db',
    'user': 'postgres',
    'password': 'Robin123',
    'host': 'localhost'
}

def connect_db():
    """Establish a connection to the PostgreSQL database."""
    conn = psycopg2.connect(**DATABASE)
    return conn

def fetch_applications(conn):
    """Fetch application data from the database."""
    query = 'SELECT * FROM "Applications"'  # Ensure correct table name casing
    with conn.cursor(cursor_factory=DictCursor) as cur:
        cur.execute(query)
        return cur.fetchall()

def analyze_applications(applications):
    """Analyze applications to determine metrics."""
    feedback_time_threshold = 30  # days
    ghost_job_probability_threshold = 50  # percentage

    company_metrics = {}

    for app in applications:
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
            avg_feedback_time = metrics['total_feedback_time'] / total_applications / 7  # Convert to weeks
            ghost_job_probability = (metrics['long_feedback_time_count'] / total_applications) * 100
            is_ghost_job = ghost_job_probability > ghost_job_probability_threshold

        results[company_id] = {
            'avg_feedback_time': avg_feedback_time,
            'num_applicants': total_applications,
            'is_ghost_job': is_ghost_job,
            'ghost_job_probability': ghost_job_probability
        }

    return results

def update_company(conn, company_id, metrics):
    """Update the company's metrics in the database."""
    query = """
        UPDATE "Companies"  -- Use double quotes for correct table reference
        SET rating = %s,
            isghostjob = %s,
            feedbacktime = %s,
            jobposts = (SELECT COUNT(DISTINCT "position") FROM "Applications" WHERE company_id = %s),
            numapplicants = %s,
            avgfeedbacktime = %s,
            ghostjobprobability = %s,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
    """
    with conn.cursor() as cur:
        cur.execute(query, (
            0,  # Assuming a rating is calculated separately
            metrics['is_ghost_job'],
            metrics['avg_feedback_time'],
            company_id,
            metrics['num_applicants'],
            metrics['avg_feedback_time'],
            metrics['ghost_job_probability'],
            company_id
        ))
        conn.commit()

def main():
    conn = connect_db()

    try:
        applications = fetch_applications(conn)
        company_metrics = analyze_applications(applications)

        for company_id, metrics in company_metrics.items():
            update_company(conn, company_id, metrics)

        print("Companies table updated successfully.")
    finally:
        conn.close()

if __name__ == '__main__':
    main()
