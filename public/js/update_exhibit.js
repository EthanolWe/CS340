// Get the objects we need to modify
let updateExhibitForm = document.getElementById('update-exhibit-form-ajax');

// Modify the objects we need
updateExhibitForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputExhibitName = document.getElementById("mySelect");
    let inputAttendance = document.getElementById("input-attendance-update");
    
    // Get the values from the form fields
    let ExhibitNameValue = inputExhibitName.value;
    let attendanceValue = inputAttendance.value;
    console.log(ExhibitNameValue);
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // Put our data we want to send in a javascript object
    let data = {
        exhibitName: ExhibitNameValue,
        attendance: attendanceValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-exhibit-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, ExhibitNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    alert("Exhibit Updated. Refreshing the page.");
    window.location.href = 'http://flip1.engr.oregonstate.edu:9329/exhibit';
})


function updateRow(data, exhibitName){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("exhibit-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == exhibitName) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].attendance; 
       }
    }
}