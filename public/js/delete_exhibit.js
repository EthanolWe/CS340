
function deleteDropDownMenu(exhibitName){
  let selectMenu = document.getElementById("mySelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(exhibitName)){
      selectMenu[i].remove();
      break;
    } 

  }
}


function deleteRow(exhibitName){
  let table = document.getElementById("exhibit-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
     //iterate through rows
     //rows would be accessed using the "row" variable assigned in the for loop
     console.log(exhibitName);
     if (table.rows[i].getAttribute("data-value") == exhibitName) {
          table.deleteRow(i);
          deleteDropDownMenu(exhibitName);
          break;
     }
  }
}

function deleteExhibit(exhibitName) {
  // Put our data we want to send in a javascript object
  let data = {
      exhibit_name: exhibitName
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-exhibit-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {

          // Add the new data to the table
          deleteRow(exhibitName);
          
      }
      else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.")
      }
  }
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
  alert("Exhibit deleted. Refreshing the page.");
  window.location.href = 'http://flip2.engr.oregonstate.edu:9326/exhibit';
}


