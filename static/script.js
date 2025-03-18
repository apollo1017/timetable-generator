let courses_Permanent = [];
let rooms_Permanent = []; 
let students_Permanent = [];
let studentEnrollments_Permanent = [];
$(document).ready(function() {

     // Initialize courses as an empty array
    let courses = [];

// Function to fetch courses from the backend
function fetchCourses() {
    $.ajax({
        url: "/api/courses",
        method: "GET",
        success: function(response) {
            console.log("Courses fetched successfully:", response);
            courses = response;
            courses_Permanent = response;

            // Append courses to the #coursesList
            courses.forEach(course => {
                $('#coursesList').append(`
                    <div class="course" data-id="${course.id}" data-name="${course.name}" data-section="${course.section}" style="background-color: ${course.color};">
                        ${course.name} - ${course.section}
                    </div>
                `);
            });

            // Make courses draggable
            $('.course').draggable({
                helper: 'clone',
                revert: "invalid"
            });
        },
        error: function(error) {
            console.error("Error fetching courses:", error);
        }
    });
}

 // Function to fetch rooms from the backend
 function fetchRooms() {
    $.ajax({
        url: "/api/rooms",
        method: "GET",
        success: function(response) {
            console.log("Rooms fetched successfully:", response);
            rooms_Permanent = response;
        },
        error: function(error) {
            console.error("Error fetching rooms:", error);
        }
    });
}

    let students = [];
    let studentEnrollments = [];

    function fetchStudentsAndEnrollments() {
        // Fetch Students
        $.ajax({
            url: "/api/students",
            method: "GET",
            success: function(response) {
                console.log("Students fetched successfully:", response);
                // Process student data
                students = response;
                students_Permanent = response;
            },
            error: function(error) {
                console.error("Error fetching students:", error);
            }
        });
    
        // Fetch Student Enrollments
        $.ajax({
            url: "/api/student-enrollments",
            method: "GET",
            success: function(response) {
                console.log("Student enrollments fetched successfully:", response);
                // Process enrollment data
                studentEnrollments = response;
                studentEnrollments_Permanent = response;
            },
            error: function(error) {
                console.error("Error fetching student enrollments:", error);
            }
        });
    }

    // Call fetchCourses on page load
    fetchRooms();
    fetchCourses();
   // fetchStudentsAndEnrollments();

    console.log(courses_Permanent); // Debugging line
    
   // Append courses to the #coursesList with proper format
    courses.forEach(course => {
        const courseSections = course.name.split(" - ");
        const courseName = courseSections[0];
        const section = courseSections[1];
        $('#coursesList').append(`<div class="course" data-id="${course.id}" data-name="${course.name}" style="background-color: ${course.color};">${courseName} - ${section}</div>`);
    });

    $('.course').draggable({
        helper: 'clone',
        revert: "invalid"
    });

    $('#generateTimetable').click(function() {
        const totalRooms = parseInt($('#totalRooms').val()) || 0;
        const classDuration = parseInt($('#classDuration').val()) || 0;
        const breakTime = parseInt($('#breakTime').val()) || 0;
        const totalDays = Math.min(parseInt($('#totalDays').val()) || 0, 7);
        const startTime = $('#startTime').val();
        const endTime = $('#endTime').val();
        console.log('Break Time:', breakTime);
        console.log('Total Days:', totalDays);
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);
        generateTimetable(totalDays, classDuration, breakTime, startTime, endTime);
    });
});

function toggleDrawer() {
    var drawer = document.getElementById("coursesList");
    var toggleButton = document.getElementById("toggleButton");

    if (drawer.style.left === "-250px") {
        drawer.style.left = "0px"; // Open the drawer
        toggleButton.style.left = "225px"; // Align with the drawer's edge
        toggleButton.innerHTML = "&#10094;"; // Left arrow
    } else {
        drawer.style.left = "-250px"; // Close the drawer
        toggleButton.style.left = "0px"; // Back to screen edge
        toggleButton.innerHTML = "&#10095;"; // Right arrow
    }
}

// Update the generateTimetable function
function generateTimetable(totalDays, classDuration, breakTime, startTime, endTime) {
    let timetableHtml = '<div class="day-tabs">';
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (let day = 0; day < totalDays; day++) {
        timetableHtml += `<span class="day-tab" onclick="switchDay(${day + 1})">${weekdays[day]}</span>`;
    }
    timetableHtml += '</div><div class="timetable-day">';

    let currentHour = parseInt(startTime.split(':')[0]);
    let currentMinute = parseInt(startTime.split(':')[1]);

    for (let day = 1; day <= totalDays; day++) {
        timetableHtml += `<table class="timetable" id="day${day}"><tr><th>Room / Time</th>`;
        const endHour = parseInt(endTime.split(':')[0]);
        const endMinute = parseInt(endTime.split(':')[1]);

        // Headers for class and break times

        while (true) {
            let slotEnd = addMinutes(currentHour, currentMinute, classDuration);

            // Check if adding the next class slot would exceed the end time
            if (slotEnd.hour > endHour || (slotEnd.hour === endHour && slotEnd.minute >= endMinute)) {
                break;
            }
            timetableHtml += `<th>${formatTime(currentHour, currentMinute)}-${formatTime(slotEnd.hour, slotEnd.minute)}</th>`;

            // Move current time to the end of the class slot
            currentHour = slotEnd.hour;
            currentMinute = slotEnd.minute;

            let breakEnd = addMinutes(currentHour, currentMinute, breakTime);
            // Check if adding the next break would exceed the end time
            if (breakEnd.hour > endHour || (breakEnd.hour === endHour && breakEnd.minute >= endMinute)) {
                break;
            }
            // timetableHtml += `<th class="break-time">${formatTime(currentHour, currentMinute)}-${formatTime(breakEnd.hour, breakEnd.minute)}</th>`;

            // Move current time to the end of the break
            currentHour = breakEnd.hour;
            currentMinute = breakEnd.minute;
        }

        timetableHtml += '</tr>';

        // Rows for class and break times
        rooms_Permanent.forEach((room) => {
            timetableHtml += `<tr><td>${room.building_name} - ${room.room_number}</td>`;

            let currentHour = parseInt(startTime.split(':')[0]);
            let currentMinute = parseInt(startTime.split(':')[1]);

            while (true) {
                let slotEnd = addMinutes(currentHour, currentMinute, classDuration);

                // Check if adding the next class slot would exceed the end time
                if (slotEnd.hour > endHour || (slotEnd.hour === endHour && slotEnd.minute >= endMinute)) {
                    break;
                }
                timetableHtml += `<td class="time-slot" data-time="${formatTime(currentHour, currentMinute)}-${formatTime(slotEnd.hour, slotEnd.minute)}"></td>`;

                currentHour = slotEnd.hour;
                currentMinute = slotEnd.minute;

                let breakEnd = addMinutes(currentHour, currentMinute, breakTime);

                // Check if adding the next break would exceed the end time
                if (breakEnd.hour > endHour || (breakEnd.hour === endHour && breakEnd.minute >= endMinute)) {
                    // Do not add a break slot if it exceeds end time
                    break;
                }
                // timetableHtml += `<td class="break-time-slot" style="background-color: #cccccc;"></td>`;

                currentHour = breakEnd.hour;
                currentMinute = breakEnd.minute;
            }
            timetableHtml += '</tr>';
        });

        timetableHtml += '</table>';
    }
       
    $('#timetableContainer').html(timetableHtml);
    $('.timetable').hide();
    $('#day1').show(); // Assuming day 1 is the first day
    setupDroppables();
    switchDay(1);
}



// Function to handle the click event on a dropped course in the timetable
$(document).on('click', '.dropped-course', function() {
    console.log("Dropped course clicked"); // Debugging line
    const courseId = $(this).data('id');
    const section = $(this).data('section'); // Add this line to get the section info
    
    // Update the AJAX call to fetch course details
    $.ajax({
        url: `/api/course-details/${courseId}/${section}`,  // Updated URL to include course ID and section
        method: 'GET',
        success: function(response) {
            console.log("Course details fetched successfully:", response);

            // Display the course details in a popup or any other way you prefer
            const courseDetailsHtml = `
                <h3>${response.name}</h3>
                <p><strong>Taught by:</strong> ${response.instructor}</p>
                <p><strong>Section:</strong> ${response.section}</p>
                <p><strong>Department:</strong> ${response.department}</p>
                <p><strong>Number of Students:</strong> ${response.num_students}</p>
            `;

            // Display the course details in a popup or any other way you prefer
            // For example, you can use a Bootstrap modal
            $('#coursePopup .course-details').html(courseDetailsHtml);
            $('#coursePopup').show();
        },
        error: function(error) {
            console.error("Error fetching course details:", error);
        }
    });
});



// Close popup logic
$(document).on('click', function(event) {
    if (!$(event.target).closest('.course-popup, .dropped-course').length) {
        $('#coursePopup').hide();
    }
});

 // Add functionality to the "Save Timetable" button
 $('#saveTimetable').click(function() {
    // Use html2pdf library to save the timetable as a PDF
    const element = document.getElementById('timetableContainer');
    html2pdf(element);
});

// Initialize an empty array to store timetable data
var timetableData = [];

// Event listener for the "Save to Database" button
$('#saveTimetable').on('click', function () {
    // Use AJAX to send a request to your Flask server to handle the database operation
    $.ajax({
        type: 'POST',
        url: '/save-timetable',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ assigned_courses: timetableData }),
        success: function (response) {
            console.log('Timetable saved to the database successfully:', response.message);
            // Add any additional logic or feedback here
        },
        error: function (error) {
            console.error('Error saving timetable to the database:', error);
            // Handle errors or display an error message to the user
        }
    });
});

function setupDroppables() {
    $('.timetable .time-slot').not('.break-time').droppable({
        accept: ".course, .dropped-course",
        drop: function(event, ui) {
            const courseId = $(ui.draggable).data('id');
            const courseName = $(ui.draggable).data('name') || $(ui.draggable).text();
            const courseColor = $(ui.draggable).css('background-color');
            const timeSlot = $(this).data('time');
            const dayId = $(this).closest('.timetable').attr('id');
            const room = $(this).closest('tr').index() + 1; // Get the room number
            const section = $(ui.draggable).data('section'); // Get the section information
            console.log('Course ID:', courseId);
            console.log('Course Name:', courseName);
            console.log('Section:', section);

            // Check for clash with existing courses in the same time slot and room
            if (!isCourseScheduled(courseId, timeSlot, dayId, room)) {
                // Allow adding the course to the timetable
                if ($(ui.draggable).hasClass('course')) {
                    // If it's a clone, append a new dropped-course div with data-section
                    $(this).append(`<div class="dropped-course" data-id="${courseId}" data-section="${section}" style="background-color: ${courseColor};">${courseName}</div>`);
                } else {
                    // If it's being moved, append the existing draggable
                    $(this).append(ui.draggable);
                }

                // Make the newly added course draggable
                $(this).find('.dropped-course').last().draggable({
                    helper: 'clone',
                    revert: "invalid"
                });
            } else {
                alert(`Clash detected: ${courseName} is already scheduled in this time slot and room.`);
            }
        }
    });

    $('#coursesList').droppable({
        accept: ".dropped-course",
        drop: function(event, ui) {
            ui.draggable.remove();
        }
    });

    // Make sure to apply draggable functionality after fetching courses
    fetchCourses();
}



function addMinutes(hour, minute, minsToAdd) {
    minute += minsToAdd;
    hour += Math.floor(minute / 60);
    minute %= 60;
    return { hour, minute };
}

function formatTime(hour, minute) {
    let period = "AM";
    if (hour >= 12) {
        period = "PM";
        if (hour > 12) hour -= 12;
    }
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
}

function switchDay(day) {
    $('.timetable').hide();
    $(`#day${day}`).show();
}

function isCourseScheduled(courseId, timeSlot, dayId, roomId) {
    let isScheduled = false;
    let scheduledCourseName = null;

    // Check if any course is scheduled in the same time slot, day, and room
    $(`#${dayId} .time-slot[data-time="${timeSlot}"] .dropped-course`).each(function () {
        const $scheduledCourse = $(this);
        const scheduledCourseId = $scheduledCourse.data('id');
        const scheduledRoomId = $scheduledCourse.closest('tr').index() + 1;

        if (roomId === scheduledRoomId) {
            if (courseId === scheduledCourseId) {
                // The course itself is in the slot, consider it a clash
                isScheduled = true;
                scheduledCourseName = $scheduledCourse.data('name') || $scheduledCourse.text();
                return false; // Break the loop
            }
            
            // Check if a different course is scheduled in the same room and time slot
            isScheduled = true;
            scheduledCourseName = $scheduledCourse.data('name') || $scheduledCourse.text();
            return false; // Break the loop
        }
    });

    if (isScheduled) {
        alert(`Clash detected: ${scheduledCourseName} is already scheduled in this time slot and room.`);
    }

    return isScheduled;
}

// Event listener for the "Reset Timetable" button
$('#resetTimetable').on('click', function () {
    // Confirm with the user before resetting the timetable
    if (confirm('Are you sure you want to reset the timetable?')) {
        // Use AJAX to send a request to your Flask server to handle the reset operation
        $.ajax({
            type: 'POST',
            url: '/reset-timetable', // Adjust the route based on your Flask app
            success: function (response) {
                console.log('Timetable reset successfully:', response.message);
                // Add any additional logic or feedback here
            },
            error: function (error) {
                console.error('Error resetting the timetable:', error);
                // Handle errors or display an error message to the user
            }
        });
    }
});






