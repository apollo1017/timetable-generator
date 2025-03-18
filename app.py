import os
from flask import Flask, render_template, jsonify, request
from flask.cli import load_dotenv
import pyodbc

app = Flask(__name__)

# Define your connection string
conn_str = (
    r'DRIVER={ODBC Driver 17 for SQL Server};'
   r'SERVER=DESKTOP-99MP30B;'
   r'DATABASE=timetable;'
    r'Trusted_Connection=yes;'
)

# Load environment variables from .env file
load_dotenv()

# Get connection string from environment variable
conn_str = os.getenv("DB_CONNECTION_STRING")

# Create a connection and a cursor
if conn_str:
    try:
        # Create a connection and a cursor
        connection = pyodbc.connect(conn_str)
        cursor = connection.cursor()
        print("Database connection successful!")
    except pyodbc.Error as e:
        print(f"Database connection failed: {e}")
else:
    print("Warning: No database connection string found. Ensure the .env file is set up correctly.")

# API endpoint to fetch courses
@app.route('/api/courses')
def get_courses():
    try:
        # Use the cursor to execute SQL queries
        cursor.execute('''
            SELECT c.id, c.name, c.color, c.department, s.section
            FROM courses c
            JOIN courseSections s ON c.id = s.courseID
        ''')
    
        # Fetch all rows
        rows = cursor.fetchall()

        # Convert the result to a list of dictionaries
        courses = []
        for row in rows:
            course = {
                'id': row.id,
                'name': row.name,
                'color': row.color,
                'department': row.department,
                'section': row.section,
            }
            courses.append(course)

        # Log a message indicating successful course fetching
        print("Courses fetched successfully")

        return jsonify(courses)

    except Exception as e:
        import traceback
        traceback.print_exc()

        # Log an error message in case of an exception
        print("Error fetching courses:", str(e))

        return jsonify({'error': 'Failed to fetch courses'}), 500


# API endpoint to fetch course details
@app.route('/api/course-details/<int:course_id>/<string:section>')
def get_course_details(course_id, section):
    try:
        # Use the cursor to execute SQL queries
        cursor.execute('''
            SELECT c.id, c.name, i.name as instructor, t.section, c.color, c.department, COUNT(e.RollNumber) as num_students
            FROM courses c
            LEFT JOIN CoursesTaughtBy t ON c.id = t.course_id
            LEFT JOIN instructors i ON t.instructor_id = i.id
            LEFT JOIN StudentCourseEnrollment e ON c.id = e.CourseID AND t.section = e.CourseSection
            WHERE c.id = ? AND t.section = ?
            GROUP BY c.id, c.name, i.name, t.section, c.color, c.department
        ''', (course_id, section))

        # Fetch the row
        row = cursor.fetchone()

        if row:
            # Construct a dictionary with the course details
            course_details = {
                'id': row.id,
                'name': f'{row.name} - {row.section}',  # Combine course name and section
                'instructor': row.instructor,
                'section': row.section,
                'color': row.color,
                'department': row.department,
                'num_students': row.num_students,
            }

            return jsonify(course_details)
        else:
            # Handle the case where the course is not found
            return jsonify({'error': 'Course not found for the specified section'}), 404

    except Exception as e:
        # Log the exception for debugging
        print(f"Error fetching course details: {str(e)}")

        # Return an error response
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/api/rooms')
def get_rooms():
    try:
        # Use the cursor to execute SQL queries
        cursor.execute('''
            SELECT r.id, r.room_number, b.name AS building_name
            FROM rooms r
            JOIN buildings b ON r.building_id = b.id
        ''')

        # Fetch all rows
        rows = cursor.fetchall()

        # Convert the result to a list of dictionaries
        rooms = []
        for row in rows:
            room = {
                'id': row.id,
                'room_number': row.room_number,
                'building_name': row.building_name,
            }
            rooms.append(room)

        # Log a message indicating successful room fetching
        print("Rooms fetched successfully")

        return jsonify(rooms)

    except Exception as e:
        import traceback
        traceback.print_exc()

        # Log an error message in case of an exception
        print("Error fetching rooms:", str(e))

        return jsonify({'error': 'Failed to fetch rooms'}), 500


@app.route('/api/students')
def get_students():
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM Student')
    rows = cursor.fetchall()

    students = []
    for row in rows:
        student = {
            'RollNumber': row.RollNumber,
            'Name': row.Name,
            'ParentSection': row.ParentSection,
            'Degree': row.Degree,
            'Batch': row.Batch,
            'Gender': row.Gender,
            'Email': row.Email,
            'DateOfBirth': row.DateOfBirth,
            'CNIC': row.CNIC,
            'MobileNumber': row.MobileNumber,
            'BloodGroup': row.BloodGroup,
            'Nationality': row.Nationality
        }
        students.append(student)

    return jsonify(students)


@app.route('/api/student-enrollments')
def get_student_enrollments():
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM StudentCourseEnrollment')
    rows = cursor.fetchall()

    enrollments = []
    for row in rows:
        enrollment = {
            'EnrollmentID': row.EnrollmentID,
            'RollNumber': row.RollNumber,
            'CourseID': row.CourseID,
            'EnrollmentDate': row.EnrollmentDate
        }
        enrollments.append(enrollment)

    return jsonify(enrollments)


# Save button route
@app.route('/save-timetable', methods=['POST'])
def save_timetable():
    # Receive the data from the front end
    data = request.get_json()

    # Extract information about assigned courses
    assigned_courses = data.get('assigned_courses', [])

    # Insert records into the timeslots table
    for course in assigned_courses:
        query = f"""
            INSERT INTO timeslots (course_name, start_time, end_time, room_number)
            VALUES ('{course['name']}', '{course['start_time']}', '{course['end_time']}', '{course['room_number']}')
        """
        cursor.execute(query)

    connection.commit()

    return jsonify({'message': 'Timetable saved successfully'})

# Reset button route
@app.route('/reset-timetable', methods=['POST'])
def reset_timetable():
    # Delete all records from the timeslots table
    cursor.execute('DELETE FROM timeslots')
    connection.commit()

    return jsonify({'message': 'Timetable reset successfully'})

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
