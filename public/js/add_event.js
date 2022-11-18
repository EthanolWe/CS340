// Creates a single row from an Object representing a single record from
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("event-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let attendanceCell = document.createElement("TD");
    let typeCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let exhibitCell = document.createElement("TD");
	let hostCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    attendanceCell.innerText = newRow.event_attendance;
    typeCell.innerText = newRow.event_type;
    dateCell.innerText = newRow.date;
    exhibitCell.innerText = newRow.exhibit_name;
	hostCell.innerText = newRow.host_name;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteEvent(newRow.id);
    };


    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(attendanceCell);
    row.appendChild(typeCell);
    row.appendChild(dateCell);
    row.appendChild(exhibitCell);
	row.appendChild(hostCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.event_type;
    option.value = newRow.id;
    selectMenu.add(option);
    // End of new step 8 code.
}