DROP TABLE IF EXISTS Shift_Details, Featured_Items, Events, Exhibits, Employees;

Create or Replace Table Exhibits(
    exhibit_name varchar(255) NOT NULL,
    primary key (exhibit_name),
    attendance int(10) NOT NULL,
    is_permanent boolean NOT NULL,
    theme varchar(255),
    rotation_date date,
    install_date date,
    exhibit_past_loc varchar(255),
    exhibit_future_loc varchar(255)
);

Create or Replace Table Featured_Items(
    item_id int(10) NOT NULL AUTO_INCREMENT,
    primary key (item_id),
    exhibit_name varchar(255) NOT NULL,
    foreign key (exhibit_name) references Exhibits(exhibit_name),
    date_last_maintained date NOT NULL,
    need_repair boolean,
    description varchar(255)
);

Create or Replace Table Events(
    event_id int(10) NOT NULL AUTO_INCREMENT,
    primary key (event_id),
	event_attendance int NOT NULL,
    event_type varchar(255) NOT NULL,
    event_date datetime NOT NULL,
    exhibit_name varchar(255) NOT NULL,
	host varchar(255),
    foreign key (exhibit_name) references Exhibits(exhibit_name)
);

/*
full name idea was taken from Intermediate SQL Assignment
*/

Create or Replace Table Employees(
    employee_id int(10) NOT NULL AUTO_INCREMENT,
    primary key (employee_id),
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    Constraint full_name unique (first_name, last_name),
    job varchar(255) NOT NULL, 
    email varchar(255)
);

Create or Replace Table Shift_Details (
	shift_id int NOT NULL AUTO_INCREMENT,
	primary key (shift_id),
	exhibit_name varchar(255) NOT NULL,
	employee_id int,
	shift_start datetime NOT NULL,
	shift_end datetime NOT NULL,
	foreign key (exhibit_name) references Exhibits(exhibit_name) ON DELETE CASCADE,
	foreign key (employee_id) references Employees(employee_id) ON DELETE CASCADE
);

insert into Employees(
    first_name,
    last_name,
    job,
    email

) values (
    "Bruce",
    "Wayne",
    "Night Guard",
    "bwayne@alterego.com"
),
(
    "Joseph",
    "Kerr",
    "Entertainer",
    "jkerr@clown.com"
),
(
    "Barry",
    "Allen",
    "Messanger",
    "theflash@speedy.com"
);

insert into Exhibits(
    exhibit_name,
    attendance,
    is_permanent,
    theme,
    rotation_date,
    install_date,
    exhibit_past_loc,
    exhibit_future_loc

) values (
    "Diamond Gallery",
    1567,
    1,
    "A gallery of diamonds",
    NULL,
    '1900-01-01',
    NULL,
    NULL
),
(
    "Money Gallery",
    2012,
    1,
    "A gallery of money",
    NULL,
    '1900-01-01',
    NULL,
    NULL
),
(
	"Land of the Dead",
    3524,
    0,
    "A view of ancient Egypt's tombs",
    '2013-05-01',
    '2012-06-01',
    "Museum of Archeological Discovery",
    "Grand Museum of Ancient History"
),
(
	"Bugland",
    3524,
    1,
    "A showcase of bugs from the past and present",
    NULL,
    '2015-08-12',
    "The Biology Gallery",
    NULL
);

insert into Featured_Items(
    exhibit_name,
    date_last_maintained,
    need_repair,
    description

) values (
    "Diamond Gallery",
    '1960-01-01',
    1,
    "A 3,106 carat diamond"
),
(
    "Money Gallery",
    '1963-07-03',
    0,
    "Several display cases of different types of currency"
),
(
    "Money Gallery",
    '1980-03-08',
    0,
    "A rare one dollar bill from 1912"
),
(
    "Land of the Dead",
    '2012-06-10',
    0,
    "A sarcophagus containing Egyptian pharaoh Djaroh the Wise"
),
(
    "Bugland",
    '2019-12-14',
    1,
    "A large stag beetle"
);

insert into Events(
    event_attendance,
    event_type,
    event_date,
    exhibit_name,
	host

) values (
    312,
    "Fundraiser to celebrate diamonds",
    '1964-01-01 12',
    "Diamond Gallery",
	"Shine Jewelers"
),
(
	140,
    "A celebration of the US currency",
    '1964-01-02 12',
    "Money Gallery",
	"Whimbledon Business School"
),
(
	226,
    "Journey through Bugland!",
    '2018-10-09 9:30',
    "Bugland",
	"Jordan Elementary School"
);

insert into Shift_Details (
	exhibit_name,
	employee_id,
	shift_start,
	shift_end
) values (
	"Diamond Gallery",
	(select employee_id from Employees where first_name = "Bruce" and last_name = "Wayne"),
	'2022-10-20 20',
	'2022-10-21 0'
),
(
	"Money Gallery",
	(select employee_id from Employees where first_name = "Bruce" and last_name = "Wayne"),
	'2022-10-21 0',
	'2022-10-21 4'
),
(
	"Money Gallery",
	(select employee_id from Employees where first_name = "Joseph" and last_name = "Kerr"),
	'2022-10-20 12',
	'2022-10-20 13:30'
);


-- select * from Employees;
-- select * from Exhibits;
-- select * from Featured_Items;
-- select * from Events;
-- select * from Shift_Details;
