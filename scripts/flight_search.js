var currentFlightList = [];
var flightList;
/************************************/
function getToDate() {
  var d = new Date();
      
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month,year].join('-');
}

function flight_in_list_found(list, item) {
  item = item.toLowerCase();
  
  if (item) {
    if (item !== "") {
      for (i = 0; i < list.length; i++) {
        if (list[i].Show.toLowerCase() === item) {
          $('.rt-btn.rt-btn-next').show(); 
          return true;
        }
      }
    }
  }
  $('.rt-btn.rt-btn-next').hide(); 
  return false;
}

function load_flight_list() {
  flightList = JSON.parse(departuresFlightList);
  for (i = 0; i < flightList.length; i++) {
    let flight = flightList[i];
    //console.log("flight.Show old", flight.Show);
    //add one more hour to change from UTC to GMT
    var first_part = flight.Show.substring(0,9);
    var third_part = flight.Show.substring(14,flight.Show.lenght);
    var dhour_int = parseInt(flight.Show.substring(9,11)) + 1;
    var dhour = "0" + dhour_int;
    dhour = dhour.substring(dhour.length-2,dhour.length);
    var dminutes = flight.Show.substring(12,14);
    var dtime = dhour + ":" + dminutes;
    flight.Show = first_part + dtime + third_part;
    //console.log("flight.Show new", flight.Show);
    //
  }
}

function update_drop_box_list() {
  var input = document.getElementById('inputFlightCodeID').value;
  var searchList = document.getElementById('flightSearchList');
  
  searchList.innerHTML = '';
  currentFlightList = [];
  currentFlightList.length = 0;
  input = input.toLowerCase();

  var today = getToDate();
  var count = 0;
  for (i = 0; i < flightList.length; i++) {
    let flight = flightList[i];

    if (today == flight.Date) { 
      if (flight.Show.toLowerCase().includes(input)) {
        const elem = document.createElement("option");
        elem.value = flight.Show;
        searchList.appendChild(elem);
        currentFlightList.push(flight);
        count++;
      }
    }
    
    if (count > 30) {
      break;
    }
  }

  if (flight_in_list_found(flightList, document.getElementById('inputFlightCodeID').value)) {
    console.log("Found ", document.getElementById('inputFlightCodeID').value);
  }
  else{
    console.log("Not found ", document.getElementById('inputFlightCodeID').value);
  }  
  
  console.log("update_drop_box_list done!");
}

function select_flight() {
  var selectedFlight = document.getElementById('inputFlightCodeID').value;
  var flightDestinationValue;
  var found = false;
 //$('.rt-btn.rt-btn-next').hide(); 

  for (i = 0; i < currentFlightList.length; i++) {
    var currentFlight = currentFlightList[i];
    if (currentFlight.Show == selectedFlight) { 

      api.fn.answers({Airport_code:  currentFlight.Airport_code });
      api.fn.answers({Airport_name:  currentFlight.Airport_name });
      api.fn.answers({Airline_code:  currentFlight.Airline });
      api.fn.answers({Flight_number: currentFlight.Flight });
      api.fn.answers({Flight_Search_show_Value:  currentFlight.Show});
      found = true;
      $('.rt-btn.rt-btn-next').show(); 
      break;
    }
  }
  if (!found) {
    alert("Please select a flight number from the list.");
  }
}

function show_flight_search_box() {
  load_flight_list();

  $('.rt-element.rt-text-container').append(`<input list="flightSearchList" onchange="select_flight()"  onkeyup="update_drop_box_list()" name="inputFlightCodeID" id="inputFlightCodeID" >
  <datalist id="flightSearchList"> </datalist>`);

  var currentValue  = api.fn.answers().Flight_Search_show_Value;
  if (currentValue) {
    if (currentValue !== "") {
      document.getElementById('inputFlightCodeID').value = currentValue;
    }
  }

  if (flight_in_list_found(flightList, document.getElementById('inputFlightCodeID').value)) {
    console.log("Found ", document.getElementById('inputFlightCodeID').value);
  }
  else{
    console.log("not found ", document.getElementById('inputFlightCodeID').value);
  }
  $('#inputFlightCodeID').show(); 
}


function hide_flight_search_box() {
  $('#inputFlightCodeID').hide();
  //var x = document.getElementById('inputFlightCodeID');
  //x.style.display = "none";
}