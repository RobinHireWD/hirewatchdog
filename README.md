HireWatchdog
HireWatchdog is a unique platform that provides job application insights, helping users navigate their job search effectively. It offers detailed analytics about companies and their job postings, empowering users with the information they need to make informed decisions.

Features
Company Insights: Get comprehensive information about companies, including ratings, feedback times, and rejection rates.
Application Tracker: Keep track of your job applications, with the ability to record application details and statuses.
Search and Filter: Easily search for companies and filter results based on various criteria.
Visual Analytics: Utilizes charts and graphs to provide visual insights into job application trends and statistics.
Technologies Used
Frontend: Built with React.js for a dynamic user interface.
Backend: Node.js with Express for the server-side, handling API requests and business logic.
Database: PostgreSQL, using Sequelize ORM for database interactions.
Authentication: Firebase Authentication for user management and secure sign-in.
Logging: Winston for logging application activities and errors.
Algorithms: Implemented using Python for advanced data processing and insights generation.
Getting Started
Prerequisites
Node.js (>= 14.x)
PostgreSQL
Python (>= 3.x)
Firebase account
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/hirewatchdog.git
cd hirewatchdog
Backend Setup:

Navigate to the backend directory:

bash
Copy code
cd backend
Install dependencies:

bash
Copy code
npm install
Create a .env file in the backend directory and add your database and Firebase credentials:

makefile
Copy code
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_NAME=your_db_name
PORT=5001
Start the server:

bash
Copy code
npm start
Frontend Setup:

Navigate to the frontend directory:

bash
Copy code
cd ../frontend
Install dependencies:

bash
Copy code
npm install
Start the React app:

bash
Copy code
npm start
Running Python Algorithms
Ensure you have Python and the required libraries installed. You may need libraries like pandas, numpy, and any other specific to your algorithms.

Create your algorithm scripts in the appropriate directory.

You can execute the scripts using:

bash
Copy code
python your_script.py
Usage
User Registration: Users can register using email or Google authentication.
Adding Applications: Users can submit job applications and track their status.
Viewing Insights: Users can view insights related to companies and their job postings.
Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes. Make sure to follow the coding standards and include relevant tests for any new features.

License
This project is licensed under the MIT License.
