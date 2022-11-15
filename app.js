// App.js

/*
    SETUP
*/
var db = require('./database/db-connector')
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
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
})

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