import psycopg2
import psycopg2.extensions
from psycopg2.extras import DictCursor
import time

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

def fetch_companies(conn):
    """Fetch company data from the database."""
    query = 'SELECT * FROM "Companies"'
    with conn.cursor(cursor_factory=DictCursor) as cur:
        cur.execute(query)
        return cur.fetchall()

def analyze_applications(applications):
    """Analyze applications to determine metrics."""
    feedback_time_threshold = 4  # weeks
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

def update_company(conn, company_id, metrics):
    """Update the company's metrics in the database."""
    jobposts = calculate_jobposts(conn, company_id)
    
    query = """
        UPDATE "Companies"
        SET
            rating = %s,  -- Assuming a default value or separate calculation
            isghostjob = %s,
            num_feedback = %s,
            jobposts = %s,
            numapplicants = %s,
            avgfeedbacktime = %s,
            ghostjobprobability = %s,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = %s
    """
    with conn.cursor() as cur:
        cur.execute(query, (
            0,  # Assuming a rating is calculated separately
            metrics['is_ghost_job'],
            metrics['num_applicants'],
            jobposts,
            metrics['num_applicants'],
            metrics['avg_feedback_time'],
            metrics['ghost_job_probability'],
            company_id
        ))
        conn.commit()

def listen_for_notifications():
    """Listen for notifications and process data."""
    conn = connect_db()
    conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute("LISTEN application_update;")

    print("Listening for notifications on channel 'application_update'...")
    try:
        while True:
            # Wait for a notification
            if conn.notifies:
                for notify in conn.notifies:
                    print(f"Received notification: {notify.payload}")
                    # Fetch updated applications and process them
                    applications = fetch_applications(conn)
                    company_metrics = analyze_applications(applications)

                    for company_id, metrics in company_metrics.items():
                        update_company(conn, company_id, metrics)
                    print("Companies table updated successfully.")

            time.sleep(5)  # Polling interval

    except KeyboardInterrupt:
        print("Stopped by user.")
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    listen_for_notifications()
