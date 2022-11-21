// Creates a single row from an Object representing a single record from
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("shift-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let exhibitCell = document.createElement("TD");
    let employeeCell = document.createElement("TD");
    let startCell = document.createElement("TD");
    let endCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.shift_id;
    exhibitCell.innerText = newRow.exhibit_name;
    employeeCell.innerText = newRow.employee_id;
    startCell.innerText = newRow.shift_start;
    endCell.innerText = newRow.shift_end;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteShift(newRow.id);
    };


    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(exhibitCell);
    row.appendChild(employeeCell);
    row.appendChild(startCell);
    row.appendChild(descCell);
    row.appendChild(endCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.description;
    option.value = newRow.id;
    selectMenu.add(option);
    // End of new step 8 code.
}