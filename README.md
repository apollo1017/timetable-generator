# Automated Timetable Generator

## Project Overview
The **Automated Timetable Generator** is an intelligent scheduling tool initially designed to streamline course scheduling for FAST-NUCES, Islamabad Campus. It ensures clash-free timetable creation by providing an interactive drag-and-drop interface for administrators to assign courses to available timeslots. The system proactively detects scheduling conflicts for students and instructors, reducing administrative workload and improving scheduling efficiency. While the system is currently tailored for FAST-NUCES, it can be further enhanced and adapted for other academic institutions with similar scheduling needs.

## Problem Statement
Manually generating a timetable for a university is a time-consuming and error-prone process. Coordinators must ensure that no student or instructor has overlapping classes while also managing room availability and course assignments. The process often leads to inefficiencies, last-minute adjustments, and scheduling conflicts, affecting students' learning experience and faculty workload.

Moreover, when conflicts arise—such as overlapping courses, unavailable instructors, or room allocation issues—students are often required to go through lengthy bureaucratic processes to request changes. This typically involves waiting in long queues, filling out request forms, and repeatedly following up with administrators to get their schedules adjusted. Such inefficiencies not only add to administrative burdens but also cause frustration among students and faculty, delaying their ability to finalize academic plans.

An automated system that proactively prevents conflicts and allows seamless adjustments can significantly improve the scheduling process, reducing unnecessary delays and enhancing the overall academic experience.

## Target Audience
- **University administrators** responsible for scheduling courses.
- **Faculty members** who need efficient and fair scheduling.
- **Students** who benefit from conflict-free timetables.

## Key Features

### 1. Course and Instructor Management
- Predefined courses assigned to specific instructors.
- Hardcoded section assignments for each course.

### 2. Student Enrollment and Clash Detection
- Students are pre-enrolled in specific courses.
- System detects clashes for students and instructors and provides real-time alerts.

### 3. Timeslot Generation
- Administrators define available time slots and durations for a 5-day schedule.
- Courses are assigned to slots using a drag-and-drop interface.

### 4. Conflict Resolution and Notifications
- The system flags conflicts when a student is enrolled in overlapping courses.
- Displays affected students’ roll numbers for easy resolution.
- Highlights instructor clashes for better decision-making.

### 5. Room Allocation
- Courses are assigned to specific rooms within predefined buildings.
- Ensures optimal room utilization and minimizes scheduling errors.

## Expected Impact
By automating timetable creation, this project significantly reduces human errors, optimizes scheduling time, and enhances the overall academic experience. The system ensures fairness in scheduling and provides transparency for all stakeholders involved.

## Installation & Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/automated-timetable-generator.git
cd automated-timetable-generator

# Install dependencies
pip install -r requirements.txt

# Run the application
python main.py
```

## Contributing
Contributions are welcome! Feel free to fork this repository and submit pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
