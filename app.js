/*
    SETUP
*/


// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
PORT        = 9328;                 // Set a port number at the top so it's easy to change in the future

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
    let query1 = "SELECT * FROM Employees;";
    db.pool.query(query1, function(error, rows, fields){
        res.render('index', {data: rows});
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

    app.put('/put-employee-ajax', function(req,res,next){
        let data = req.body;
      
        let job = parseInt(data.job);
        let employee = parseInt(data.fullname);
      
        let queryJob = `UPDATE Employee SET job = ? WHERE Employee.id = ?`;
        let selectWorld = `SELECT * FROM Employee WHERE id = ?`
      
              // Run the 1st query
              db.pool.query(queryjob, [job, person], function(error, rows, fields){
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
      })});
    
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});