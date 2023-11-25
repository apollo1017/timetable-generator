$(document).ready(function() {
    const courses = [
        {
            id: 101,
            name: "Data Science",
            instructor: "Dr. White",
            section: "CS-A",
            color: "#A9D2E1",
            department: "Computer Science"
        },
        {
            id: 102,
            name: "Network Security",
            instructor: "Dr. Green",
            section: "CS-B",
            color: "#C1D8E7",
            department: "Computer Science"
        },
        {
            id: 103,
            name: "Machine Learning",
            instructor: "Dr. Black",
            section: "CS-C",
            color: "#8C9FB2",
            department: "Computer Science"
        },
        {
            id: 104,
            name: "Web Development",
            instructor: "Dr. Red",
            section: "CS-D",
            color: "#ADC4D6",
            department: "Computer Science"
        },
        {
            id: 105,
            name: "Database Management",
            instructor: "Dr. Blue",
            section: "CS-E",
            color: "#9CA8B9",
            department: "Computer Science"
        },
        {
            id: 106,
            name: "Cybersecurity",
            instructor: "Dr. Yellow",
            section: "CS-F",
            color: "#ADC4D6",
            department: "Computer Science"
        },
        {
            id: 107,
            name: "Artificial Intelligence",
            instructor: "Dr. Purple",
            section: "CS-G",
            color: "#8C9FB2",
            department: "Computer Science"
        },
        {
            id: 108,
            name: "Cloud Computing",
            instructor: "Dr. Pink",
            section: "CS-H",
            color: "#C1D8E7",
            department: "Computer Science"
        },
        {
            id: 109,
            name: "Human-Computer Interaction",
            instructor: "Dr. Orange",
            section: "CS-I",
            color: "#ADC4D6",
            department: "Computer Science"
        },
        {
            id: 110,
            name: "Software Testing",
            instructor: "Dr. Gray",
            section: "CS-J",
            color: "#9CA8B9",
            department: "Computer Science"
        },
        {
            id: 111,
            name: "Mobile App Development",
            instructor: "Dr. Brown",
            section: "CS-K",
            color: "#A9D2E1",
            department: "Computer Science"
        },
        {
            id: 112,
            name: "Robotics",
            instructor: "Dr. Silver",
            section: "CS-L",
            color: "#C1D8E7",
            department: "Computer Science"
        },
        {
            id: 113,
            name: "Data Warehousing",
            instructor: "Dr. Gold",
            section: "CS-M",
            color: "#8C9FB2",
            department: "Computer Science"
        },
        {
            id: 114,
            name: "Game Development",
            instructor: "Dr. Indigo",
            section: "CS-N",
            color: "#C1D8E7",
            department: "Computer Science"
        },
        {
            id: 115,
            name: "IoT Programming",
            instructor: "Dr. Cyan",
            section: "CS-O",
            color: "#9CA8B9",
            department: "Computer Science"
        },
        {
            id: 116,
            name: "E-commerce Technologies",
            instructor: "Dr. Maroon",
            section: "CS-P",
            color: "#A9D2E1",
            department: "Computer Science"
        },
        {
            id: 117,
            name: "Big Data Analytics",
            instructor: "Dr. Teal",
            section: "CS-Q",
            color: "#C1D8E7",
            department: "Computer Science"
        },
        {
            id: 118,
            name: "Embedded Systems",
            instructor: "Dr. Olive",
            section: "CS-R",
            color: "#9CA8B9",
            department: "Computer Science"
        }
        
        // Add more courses as needed
    ];

    
    courses.forEach(course => {
        $('#coursesList').append(`<div class="course" data-id="${course.id}" data-name="${course.name}" style="background-color: ${course.color};">${course.name}</div>`);
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
        generateTimetable(totalRooms, classDuration, breakTime, totalDays, startTime, endTime);
    });
});

function generateTimetable(totalRooms, classDuration, breakTime, totalDays, startTime, endTime) {
    let timetableHtml = '<div class="day-tabs">';
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let day = 0; day < totalDays; day++) {
        timetableHtml += `<span class="day-tab" onclick="switchDay(${day + 1})">${weekdays[day]}</span>`;
    }
    timetableHtml += '</div><div class="timetable-day">';

    for (let day = 1; day <= totalDays; day++) {
        timetableHtml += `<table class="timetable" id="day${day}"><tr><th>Room / Time</th>`;
        let currentHour = parseInt(startTime.split(':')[0]);
        let currentMinute = parseInt(startTime.split(':')[1]);
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
        for (let room = 1; room <= totalRooms; room++) {
            timetableHtml += `<tr><td>Room ${room}</td>`;
            currentHour = parseInt(startTime.split(':')[0]);
            currentMinute = parseInt(startTime.split(':')[1]);
        
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
        }
        
        timetableHtml += '</table>';
    }

    $('#timetableContainer').html(timetableHtml);
    setupDroppables();
    switchDay(1);
}

function setupDroppables() {
    $('.timetable .time-slot').not('.break-time').droppable({
        accept: ".course, .dropped-course",
        drop: function(event, ui) {
            const courseId = $(ui.draggable).data('id');
            const courseName = $(ui.draggable).data('name') || $(ui.draggable).text();
            const courseColor = $(ui.draggable).css('background-color');
            const timeSlot = $(this).data('time');
            const dayId = $(this).closest('.timetable').attr('id');
            const isClone = $(ui.draggable).hasClass('course');

            if (isClone) {
                if (!isCourseScheduled(courseId, timeSlot, dayId)) {
                    $(this).append(`<div class="dropped-course" data-id="${courseId}" style="background-color: ${courseColor};">${courseName}</div>`);
                } else {
                    alert(`Clash detected: ${courseName} is already scheduled in this time slot.`);
                }
            } else {
                const currentSlot = $(ui.draggable).parent();
                if (this !== currentSlot[0] && !isCourseScheduled(courseId, timeSlot, dayId)) {
                    $(this).append(ui.draggable);
                } else {
                    alert(`Clash detected: Cannot move ${courseName} to an occupied time slot.`);
                }
            }

            $(this).find('.dropped-course').last().draggable({
                helper: 'clone',
                revert: "invalid"
            });
        }
    });

    $('#coursesList').droppable({
        accept: ".dropped-course",
        drop: function(event, ui) {
            ui.draggable.remove();
        }
    });
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

function isCourseScheduled(courseId, timeSlot, dayId) {
    let isScheduled = false;
    $(`#${dayId} .time-slot[data-time="${timeSlot}"]`).each(function() {
        if ($(this).find(`.dropped-course[data-id="${courseId}"]`).length > 0) {
            isScheduled = true;
            return false; // Break the loop
        }
    });
    return isScheduled;
}
