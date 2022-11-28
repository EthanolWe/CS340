function deleteDropDownMenu(shiftID){
  let selectMenu = document.getElementById("mySelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(shiftID)){
      selectMenu[i].remove();
      break;
    } 

  }
}

function deleteRow(shiftID){
  let table = document.getElementById("shift-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
     //iterate through rows
     //rows would be accessed using the "row" variable assigned in the for loop
     if (table.rows[i].getAttribute("data-value") == shiftID) {
          table.deleteRow(i);
          deleteDropDownMenu(shiftID);
          break;
     }
  }
}

function deleteShift(shiftID) {
  // Put our data we want to send in a javascript object
  let data = {
      id: shiftID
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-shift-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {

          // Add the new data to the table
          deleteRow(shiftID);
          
      }
      else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.")
      }
  }
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
  alert("Shift deleted. Refreshing the page.");
  window.location.href = 'http://flip2.engr.oregonstate.edu:9326/shift';
}


