// App.js

/*
    SETUP
*/
var db = require('./database/db-connector')
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public')); // this is needed to allow for the form to use the ccs style sheet
PORT        = 9326;                 // Set a port number at the top so it's easy to change in the future

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
/*
    ROUTES
*/

app.get('/', function(req, res){
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
});                                         // will process this file, before sending the finished HTML to the client.

// FUNCTIONS FOR EMPLOYEES //

app.get('/employee', function(req, res){
     // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.last_name === undefined)
    {
        query1 = "SELECT * FROM Employees;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Employees WHERE last_name LIKE "${req.query.last_name}%"`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM Employees;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let people = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
            let jobs = rows;

            return res.render('employee', {data: people, jobs: jobs});
        })
    })
});

app.post('/add-employee-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Employees (first_name, last_name, job, email) VALUES ('${data['input-first_name']}', '${data['input-last_name']}', '${data['input-job']}', '${data['input-email']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/employee');
        }
    })
});

app.delete('/delete-employee-ajax/', function(req,res,next){
    let data = req.body;
    let employeeID = parseInt(data.id);
    let deleteShift_Details = `DELETE FROM Shift_Details WHERE employee_id = ?`;
    let deleteEmployee= `DELETE FROM Employees WHERE employee_id = ?`;
	// Run the 1st query
	db.pool.query(deleteShift_Details, [employeeID], function(error, rows, fields){
		if (error) {

		// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
		console.log(error);
		res.sendStatus(400);
		}

		else
		{
		
			// Run the second query
			db.pool.query(deleteEmployee, [employeeID], function(error, rows, fields) {

				if (error) {
					console.log(error);
					res.sendStatus(400);
				} else {
					
					//res.sendStatus(204);
				}
			})
		}
	})
});

app.put('/put-employee-ajax', function(req,res,next){
    let data = req.body;
    //let employeeID = parseInt(data.id);
    let job = data.job;
    let employee = parseInt(data.fullname);
  
    let queryUpdateJob = `UPDATE Employees SET job = ? WHERE Employees.employee_id = ?`;
    let selectJob = `SELECT * FROM Employees WHERE employee_id = ?`
  
	// Run the 1st query
	db.pool.query(queryUpdateJob, [job, employee], function(error, rows, fields){
		if (error) {

		// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
		console.log(error);
		res.sendStatus(400);
		}

		// If there was no error, we run our second query and return that data so we can use it to update the people's
		// table on the front-end
		else
		{
			// Run the second query
			db.pool.query(selectJob, [job], function(error, rows, fields) {

				if (error) {
					console.log(error);
					res.sendStatus(400);
				} else {
					res.send(rows);
				}
			})
		}
	})
});

// FUNCTIONS FOR EVENTS //

app.get('/event', function(req, res){          
	// Declare Query 1
	let query1;

	// If there is no query string, we just perform a basic SELECT
	if (req.query.event_type === undefined)
	{
		query1 = "SELECT * FROM Events;";
	}

	// If there is a query string, we assume this is a search, and return desired results
	else
	{
		query1 = `SELECT * FROM Events WHERE event_type LIKE "${req.query.event_type}%"`
	}

	// Query 2 is the same in both cases
	let query2 = "SELECT * FROM Exhibits;";

	// Run the 1st query
	db.pool.query(query1, function(error, rows, fields){
		
		// Save the people
		let events = rows;
	
		db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
            let exhibits = rows;
            return res.render('event', {data: events, exhibits: exhibits});	// Note the call to render() and not send(). Using render() ensures the templating engine
        })
		
	})
});  

app.post('/add-event-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Events (event_type, event_date, exhibit_name, host) VALUES ('${data['input-event_type']}', '${data['input_date']}', '${data['input-exhibit_name']}', '${data['input-host']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/event');
        }
    })
});

app.delete('/delete-event-ajax/', function(req,res,next){
    let data = req.body;
    let eventID = parseInt(data.id);
    let deleteEvent = `DELETE FROM Events WHERE event_id = ?`;
		
	// Run the query
	db.pool.query(deleteEvent, [eventID], function(error, rows, fields) {

		if (error) {
			console.log(error);
			res.sendStatus(400);
		} else {
			
			//res.sendStatus(204);
		}
	})
});

app.put('/put-event-ajax', function(req,res,next){
    let data = req.body;
    let attendance = parseInt(data.event_attendance);
    let event = parseInt(data.event_type);
  
    let queryUpdateEvent = `UPDATE Events SET event_attendance = ? WHERE Events.event_id = ?`;
    let selectEvent = `SELECT * FROM Events WHERE event_id = ?`
  
	// Run the 1st query
	db.pool.query(queryUpdateEvent, [attendance, event], function(error, rows, fields){
		if (error) {

		// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
		console.log(error);
		res.sendStatus(400);
		}

		// If there was no error, we run our second query and return that data so we can use it to update the people's
		// table on the front-end
		else
		{
			// Run the second query
			db.pool.query(selectEvent, [attendance], function(error, rows, fields) {

				if (error) {
					console.log(error);
					res.sendStatus(400);
				} else {
					res.send(rows);
				}
			})
		}
	})
});

// FUNCTIONS FOR EXHIBITS //


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/exhibit', function(req, res){
    // Declare Query 1
   let query1;

   // If there is no query string, we just perform a basic SELECT
   if (req.query.exhibit_name === undefined)
   {
       query1 = "SELECT * FROM Exhibits;";
   }

   // If there is a query string, we assume this is a search, and return desired results
   else
   {
       query1 = `SELECT * FROM Exhibits WHERE exhibit_name LIKE "${req.query.exhibit_name}%"`
   }

   // Query 2 is the same in both cases
   let query2 = "SELECT * FROM Exhibits;";

   // Run the 1st query
   db.pool.query(query1, function(error, rows, fields){
       
       // Save the people
       let exhibit = rows;
       
       // Run the second query
       db.pool.query(query2, (error, rows, fields) => {
           
           // Save the planets
           let names = rows;

           return res.render('exhibit', {data: exhibit, names: names});
       })
   })
});



app.post('/add-exhibit-form', function(req, res){
   // Capture the incoming data and parse it back to a JS object
   let data = req.body;

   // Create the query and run it on the database
   query1 = `INSERT INTO Exhibits (exhibit_name, attendance, is_permanent, theme, rotation_date, install_date, exhibit_past_loc, exhibit_future_loc) VALUES ('${data['input-exhibit_name']}', '${data['input-attendance']}', '${data['input-is_permanent']}', '${data['input-theme']}', '${data['input-rotation_date']}', '${data['input-install_date']}', '${data['input-exhibit_past_loc']}', '${data['input-exhibit_future_loc']}')`;
   db.pool.query(query1, function(error, rows, fields){

       // Check to see if there was an error
       if (error) {

           // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
           console.log(error)
           res.sendStatus(400);
       }

       // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
       // presents it on the screen
       else
       {
           res.redirect('/exhibit');
       }
   })
});

app.delete('/delete-exhibit-ajax/', function(req,res,next){
   let data = req.body;
   let exhibitName = data.exhibit_name;
   let deleteExhibit= `DELETE FROM Exhibits WHERE exhibit_name = ?`;
                 // Run the second query
                 db.pool.query(deleteExhibit, [exhibitName], function(error, rows, fields) {
 
                     if (error) {
                         console.log(error);
                         res.sendStatus(400);
                     } else {
                         
                         //res.sendStatus(204);
                     }
                 })
});

app.put('/put-exhibit-ajax', function(req,res,next){
   let data = req.body;
   //let employeeID = parseInt(data.id);
   let attendance = parseInt(data.attendance);
   let exhibit = data.exhibitName;
 
   let queryUpdateAttendance = `UPDATE Exhibits SET attendance = ? WHERE Exhibits.exhibit_name = ?`;
   let selectAttendance = `SELECT * FROM Exhibits WHERE exhibit_name = ?`;
 
         // Run the 1st query
         db.pool.query(queryUpdateAttendance, [attendance, exhibit], function(error, rows, fields){
             if (error) {
 
             // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
             console.log(error);
             res.sendStatus(400);
             }
 
             // If there was no error, we run our second query and return that data so we can use it to update the people's
             // table on the front-end
             else
             {
                 // Run the second query
                 db.pool.query(selectAttendance, [exhibit], function(error, rows, fields) {
 
                     if (error) {
                         console.log(error);
                         res.sendStatus(400);
                     } else {
                         res.send(rows);
                     }
                 })
             }
 })}); 

// FUNCTIONS FOR SHIFT DETAILS //

app.get('/shift', function(req, res){
    // Declare Query 1
   let query1;

   // If there is no query string, we just perform a basic SELECT
   if (req.query.exhibit_name === undefined)
   {
       query1 = "SELECT * FROM Shift_Details;";
   }

   // If there is a query string, we assume this is a search, and return desired results
   else
   {
       query1 = `SELECT * FROM Shift_Details WHERE exhibit_name LIKE "${req.query.exhibit_name}%"`
   }

   // Query 2 is the same in both cases
   let query2 = "SELECT * FROM Shift_Details;";

   // Run the 1st query
   db.pool.query(query1, function(error, rows, fields){
       
       // Save the people
       let people = rows;
       
       // Run the second query
       db.pool.query(query2, (error, rows, fields) => {
           
           // Save the planets
           let jobs = rows;

           return res.render('shift', {data: people, jobs: jobs});
       })
   })
});

app.post('/add-shift-form', function(req, res){
   // Capture the incoming data and parse it back to a JS object
   let data = req.body;

   // Create the query and run it on the database
   query1 = `INSERT INTO Shift_Details (exhibit_name, employee_id, shift_start, shift_end) VALUES ('${data['input-exhibit_name']}', '${data['input-employee_id']}', '${data['input_date_start']}', '${data['input_date_end']}')`;
   db.pool.query(query1, function(error, rows, fields){

       // Check to see if there was an error
       if (error) {

           // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
           console.log(error)
           res.sendStatus(400);
       }

       // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
       // presents it on the screen
       else
       {
           res.redirect('/shift');
       }
   })
});

app.delete('/delete-shift-ajax/', function(req,res,next){
    let data = req.body;
    let shiftID = parseInt(data.id);
    let deleteShift = `DELETE FROM Shift_Details WHERE shift_id = ?`;
		
	// Run the query
	db.pool.query(deleteShift, [shiftID], function(error, rows, fields) {

		if (error) {
			console.log(error);
			res.sendStatus(400);
		} else {
			
			//res.sendStatus(204);
		}
	})
});

app.put('/put-shift-ajax', function(req,res,next){
   let data = req.body;
   //let employeeID = parseInt(data.id);
   let shiftStart = data.shift_start;
   let shiftEnd = data.shift_end;
   let shift = parseInt(data.shift_id);
 
   let queryUpdateShift = `UPDATE Shift_Details SET shift_start = ?, shift_end = ?  WHERE Shift_Details.shift_id = ?`;
   let selectShift = `SELECT * FROM Shift_Details WHERE shift_id = ?`
 
   // Run the 1st query
   db.pool.query(queryUpdateShift, [shiftStart, shiftEnd, shift], function(error, rows, fields){
       if (error) {

       // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
       console.log(error);
       res.sendStatus(400);
       }

       // If there was no error, we run our second query and return that data so we can use it to update the people's
       // table on the front-end
       else
       {
           // Run the second query
           db.pool.query(selectShift, [shift], function(error, rows, fields) {

               if (error) {
                   console.log(error);
                   res.sendStatus(400);
               } else {
                   res.send(rows);
               }
           })
       }
   })
});


// FUNCTIONS FOR FEATURED ITEMS //

app.get('/featured', function(req, res){
    // Declare Query 1
	let query1;

	// If there is no query string, we just perform a basic SELECT
	if (req.query.exhibit_name === undefined)
	{
		query1 = "SELECT * FROM Featured_Items;";
	}

	// If there is a query string, we assume this is a search, and return desired results
	else
	{
		query1 = `SELECT * FROM Featured_Items WHERE exhibit_name LIKE "${req.query.exhibit_name}%"`
	}

	// Query 2 is the same in both cases
	let query2 = "SELECT * FROM Exhibits;";

	// Run the 1st query
	db.pool.query(query1, function(error, rows, fields){
		
		// Save the people
		let items = rows;	

		db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
            let exhibits = rows;
            return res.render('featured', {data: items, exhibits: exhibits});	// Note the call to render() and not send(). Using render() ensures the templating engine
        })
	})
});  

app.post('/add-featured-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Featured_Items (description, date_last_maintained, need_repair, exhibit_name) VALUES ('${data['input-description']}', '${data['input_date']}', '${data['input-need_repair']}', '${data['input-exhibit_name']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/featured');
        }
    })
});

app.delete('/delete-featured-ajax/', function(req,res,next){
    let data = req.body;
    let itemID = parseInt(data.id);
    let deleteItem = `DELETE FROM Featured_Items WHERE item_id = ?`;
		
	// Run the query
	db.pool.query(deleteItem, [itemID], function(error, rows, fields) {

		if (error) {
			console.log(error);
			res.sendStatus(400);
		} else {
			
			//res.sendStatus(204);
		}
	})
});

app.put('/put-featured-ajax', function(req,res,next){
    let data = req.body;
    let description = parseInt(data.description);
    let date = data.date_last_maintained;
	let repair = parseInt(data.need_repair);
  
    let queryUpdateItem = `UPDATE Featured_Items SET date_last_maintained = ?, need_repair = ? WHERE Featured_Items.item_id = ?`;
  
	// Run the 1st query
	db.pool.query(queryUpdateItem, [date, repair, description], function(error, rows, fields){
		if (error) {

		// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
		console.log(error);
		res.sendStatus(400);
		}

		
	})
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});