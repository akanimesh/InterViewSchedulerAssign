# Interview Scheduler

A web application developed to Schedule Interview. Where admin can Schedule the Interview with 2 or more participants.


## Tech Stack

**Front End:** React, JavaScript, HTML, CSS, Material UI

**Back End:** Python, Django, Django Rest Framework

**DataBase:** SQlite3


## Features

- Admin can creater interviews by picking a date for 2 or more participants.
- Basic login based on Username and Password
- System will generate the free time slot common for all the chosen participants.
- generated time slot depends upon the date and the number of participants chosen.
- Admin and participants can view the upcoming and past meetings
- Admin has the right to delete the Interviews


## Assumptions

- Atleast 2 participants needed to create the interview
- Interview start and finishes with in a day
- A participant can attend atmax one interviews at a time
- Interviewer and Interviewe both are participants
- Start Time will always be greater than End Time

## Validations

- System ensures validation for user inputs like date and time
- Start time should always be greater than End Time
- Atleast 2 participant should be there in order to create and interview
- System ensures no meet clash by 1) providing common availble timeSlots and 2) Backend throws error when admin creates an interview that will clash.
