# Automated Timetable Generator

## Project Overview
The **Automated Timetable Generator** is an intelligent scheduling tool initially designed to streamline course scheduling for FAST-NUCES, Islamabad Campus. It ensures clash-free timetable creation by providing an interactive drag-and-drop interface for administrators to assign courses to available timeslots. The system proactively detects scheduling conflicts for students and instructors, reducing administrative workload and improving scheduling efficiency. While the system is currently tailored for FAST-NUCES, it can be further enhanced and adapted for other academic institutions with similar scheduling needs.

--- 

## Problem Statement
Manually generating a timetable for a university is a time-consuming and error-prone process. Coordinators must ensure that no student or instructor has overlapping classes while also managing room availability and course assignments. The process often leads to inefficiencies, last-minute adjustments, and scheduling conflicts, affecting students' learning experience and faculty workload.

Moreover, when conflicts arise—such as overlapping courses, unavailable instructors, or room allocation issues—students are often required to go through lengthy bureaucratic processes to request changes. This typically involves waiting in long queues, filling out request forms, and repeatedly following up with administrators to get their schedules adjusted. Such inefficiencies not only add to administrative burdens but also cause frustration among students and faculty, delaying their ability to finalize academic plans.

An automated system that proactively prevents conflicts and allows seamless adjustments can significantly improve the scheduling process, reducing unnecessary delays and enhancing the overall academic experience.

---

## Target Audience
- **University administrators** responsible for scheduling courses.
- **Faculty members** who need efficient and fair scheduling.
- **Students** who benefit from conflict-free timetables.
---
## Tech Stack  
- **Backend:** Python, Flask 
- **Database:** Microsoft SQL Server (via pyodbc & SQLAlchemy)
- **Frontend:**  HTML, CSS, JavaScript (Jinja templating for Flask)
- **Libraries:**
  - **Data Handling:** Pandas, NumPy
  - **Database ORM:** SQLAlchemy, PyODBC
  - **Environment Management:** Python-Dotenv
  - **Flask Utilities:** Blinker, Click, Werkzeug, Itsdangerous, Jinja2
    
---

## Key Features

### 1. Course and Instructor Management  
- Predefined courses are assigned to specific instructors.  
- Hardcoded section assignments ensure structured scheduling.  
- Clicking on a scheduled course displays a popup with details:  
  - Course name, section, instructor name, department, and enrolled students.  

### 2. Student Enrollment and Clash Detection  
- Students are pre-enrolled in specific courses.  
- The system automatically detects student scheduling conflicts.  
- Displays roll numbers of students with overlapping course schedules.  

### 3. Timeslot Generation and Management  
- Administrators define available time slots and durations for a **5-day schedule**.  
- Courses are assigned using an **interactive drag-and-drop interface**.  
- **Prevents instructor clashes** by ensuring an instructor isn't assigned multiple sections in the same timeslot.  

### 4. Conflict Resolution and Notifications  
- Detects and **prevents scheduling conflicts** for students, instructors, and rooms.  
- Displays popup alerts for:  
  - Student clashes (with affected roll numbers).  
  - Instructor clashes across multiple courses or sections.  
  - Room unavailability due to overlapping bookings.  

### 5. Room and Building Management  
- Courses are assigned to **specific rooms within predefined buildings**.  
- Dynamically fetches **room and building availability** from the database.  
- **Prevents double booking** of rooms for the same timeslot.  

### 6. Color-Coded Course List  
- Courses are visually differentiated using **distinct colors** for clarity.  

### 7. Save and Reset Functionality  
- **Save to Database** button stores:  
  - Timeslot, room number, course name, and course section.  
- **Reset Timetable** clears the timeslot table in the database, allowing a fresh schedule setup.  

### 8. Export Timetable as PDF  
- **Save as PDF** feature enables exporting the full timetable **day by day**.  

---

## Expected Impact  
By automating timetable creation, this project significantly **reduces human errors**, **optimizes scheduling time**, and **enhances the overall academic experience**. The system ensures fairness in scheduling and provides transparency for all stakeholders involved.  

---

## Getting Started  

Follow these steps to set up and run the **Automated Timetable Generator** on your local machine.  

### 1️. Clone the Repository  
```bash
git clone https://github.com/imamaaa/automated-timetable-generator.git
cd automated-timetable-generator
```
### 2. Install Dependencies
#### Ensure you have Python installed, then run:
```bash
pip install -r requirements.txt
```

### 3. Set Up the Database  
The system requires a **Microsoft SQL Server** database to store courses, instructors, and timetable data. Follow these steps to set it up:  

- Create a new **Microsoft SQL Server** database.  
- Run the SQL script to set up the necessary tables and initial data:  

```sql
sqlcmd -S your_server_name -U your_username -P your_password -d your_database_name -i database/setup.sql

```
_(Replace your_server_name, your_username, your_password, and your_database_name with your actual database credentials.)_

### 4️. Configure Environment Variables  
The system requires a `.env` file for **database connectivity**. Create a `.env` file in the project root and configure it as follows:  

```ini
DB_SERVER=your_server_name
DB_PORT=your_database_port
DB_NAME=your_database_name
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_DRIVER={ODBC Driver 17 for SQL Server}

```
_Make sure to replace the placeholders with your actual database credentials._

### 5. Run the application
Once everything is set up, launch the application:
```bash
python main.py
```
Now, you're ready to start scheduling courses with the Automated Timetable Generator!

---

## Workflow  
1. **Generate Time Slots** – Click the "Generate Timetable" button to create available scheduling slots.  
2. **Assign Courses** – Drag & drop courses into open timeslots.  
3. **Clash Detection** – The system alerts for instructor or student conflicts in real time.  
4. **Room Allocation** – Ensure each course is assigned to an available room/building.  
5. **Save Schedule** – Store the timetable in the database for future reference.  
6. **Export as PDF** – Download the final timetable for offline access.  
7. **Reset if Needed** – Use the "Reset Timetable" button to start over.  

---

## Future Enhancements & Scalability  
### **Planned Improvements**  
- **Dynamic Course & Instructor Management** – Add, edit, and remove courses, instructors, rooms, and buildings via an admin panel.  
- **Automated Section Creation** – Automatically split students into sections (e.g., 60 students per section).  
- **Batch-Based Course Division** – Organize courses according to student batches for structured scheduling.  
- **Enhanced Instructor Assignment** – Allow admin to assign courses & sections to instructors from a dedicated interface.  
- **Lab Session Enhancements** – Improved scheduling logic for 3-hour lab sessions.  
- **AI-Powered Scheduling** – Implement AI-based timetable optimization for conflict-free scheduling.  
- **Multi-Campus Support** – Expand functionality to support multiple university campuses.  

---  



