function deleteDropDownMenu(eventID){
  let selectMenu = document.getElementById("mySelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(eventID)){
      selectMenu[i].remove();
      break;
    } 

  }
}

function deleteRow(eventID){
  let table = document.getElementById("event-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
     //iterate through rows
     //rows would be accessed using the "row" variable assigned in the for loop
     if (table.rows[i].getAttribute("data-value") == eventID) {
          table.deleteRow(i);
          deleteDropDownMenu(eventID);
          break;
     }
  }
}

function deleteEvent(eventID) {
  // Put our data we want to send in a javascript object
  let data = {
      id: eventID
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-event-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {

          // Add the new data to the table
          deleteRow(eventID);
          
      }
      else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.")
      }
  }
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
  alert("Employee deleted. Refreshing the page.");
  window.location.href = 'http://flip1.engr.oregonstate.edu:9329/event';
}


