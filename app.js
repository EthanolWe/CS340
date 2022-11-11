/*
    SETUP
*/


// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
PORT        = 9358;                 // Set a port number at the top so it's easy to change in the future

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
// Database
var db = require('./db-connector')

/*
    ROUTES
*/
app.get('/', function(req, res)
    {
		let query1;
		query1 = "SELECT * FROM Employees;";
		if (req.query.last_name === undefined)
		{
			query1 = "SELECT * FROM Employees;";
		}	
        else
		{
			query1 = `SELECT * FROM Employees WHERE last_name LIKE "${req.query.last_name}%"`
		}

        db.pool.query(query1, function(error, rows, fields){
			let people = rows;

			return res.render('index', {data: people});
        })
    });

app.get('/index', function(req, res)
    {
        let query1 = "SELECT * FROM Employees;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('index', {data: rows});
        })
    });


app.get('/employee', function(req, res)
    {
        let query1 = "SELECT * FROM Employees;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('employee', {data: rows});
        })
    });

app.post('/add-person-form', function(req, res){
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Capture NULL values
    
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
                res.redirect('/');
            }
        })
    })

app.delete('/delete-person-ajax/', function(req,res,next){
	let data = req.body;
	let personID = parseInt(data.employee_id);
	let deleteShift_Details = `DELETE FROM ShiftDetails WHERE employee_id = ?`;
	let deleteEmployees = `DELETE FROM Employees WHERE employee_id = ?`;
	
	
		// Run the 1st query
		db.pool.query(deleteShift_Details, [personID], function(error, rows, fields){
			if (error) {

			// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
			console.log(error);
			res.sendStatus(400);
			}

			else
			{
				// Run the second query
				db.pool.query(deleteEmployees, [personID], function(error, rows, fields) {

					if (error) {
						console.log(error);
						res.sendStatus(400);
					} else {
						res.sendStatus(204);
					}
				})
			}
	})});
    
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});