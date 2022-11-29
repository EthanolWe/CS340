-- Database Manipulation queries for Museum of Natural History website.
-- The ":" character is what we are using to represent the varible names in our database.

-- Select all employees based on jobs.
select first_name, last_name from Employees where job = :job_input OR first_name = :first_name_input OR last_name = :last_name_input;
select exhibit_name, theme, attendance from Exhibits where exhibit_date = :exhibit_date_input;
select description, date_last_maintained, need_repair from Featured_Items where exhibit_name = :exhibit_name_input;
select host, event_type, event_date from Events where event_date = :event_date_input;
select employee_id, exhibit_name from Shift_Details where exhibit_name = :exhibit_name_input;

-- Add a new employee.
INSERT INTO Employees(first_name, last_name, job, email)
VALUES (:first_name_input, :last_name_input, :job_input, :email_input);

-- Add a new exhibit.
INSERT INTO Exhibits(exhibit_name, attendance, is_permanent, theme, rotation_date, install_date, exhibit_past_loc, exhibit_future_loc) 
VALUES (:exhibit_name_input, :attendance_input, :is_permanent_input, :theme_input, :rotation_date_input, :install_date_input, :exhibit_past_loc_input, :exhibit_future_loc_input);

-- Add a new featured item.
INSERT INTO Featured_Items(exhibit_name, date_last_maintained, need_repair, description)
VALUES (:exhibit_name_input, :date_last_maintained_input, :need_repair_input, :description_input);

-- Add a new event.
INSERT INTO Events(event_attendance, event_type, event_date, exhibit_name, host) 
VALUES (:event_attendance_input, :event_type_input, :event_date_input, :exhibit_name_input, :host_inputs);

-- Add a new shift details for an employee.
INSERT INTO Shift_Details(exhibit_name, employee_id, shift_start, shift_end)
VALUES (:exhibit_name_input, :employee_id_input, :shift_start_input, :shift_end_input);

-- Update the job of a current employee.
UPDATE Employees SET job = :job_input WHERE first_name = :first_name_input and last_name = :last_name_input; 

-- Update the repair information for a certain item.
UPDATE Featured_Items SET (date_last_maintained = :date_last_maintained_input and need_repair = :need_repair_input) WHERE description = :description_input;

-- Remove a shift based on the start and end times.
DELETE from Shift_Details WHERE shift_start = :shift_start_input and shift_end = :shift_end_input;