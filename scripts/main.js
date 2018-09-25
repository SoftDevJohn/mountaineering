/*
Convert from the given latitude and longitude 
to the corresponding Grid Reference.
*/
function XXgetGridFromLatLong(ukGrid,lat,lon){
	var grid = "T " + lat + " " + lon +" (UK Grid="+ukGrid+")";
	return grid;1
}

/*
Calculate Grid reference button handler
*/
function calculateGridRefHandler() {
	//doSomething();
	
	var lat = document.getElementById('latitude').value;
	var lon = document.getElementById('longitude').value;
	//lat =	53.06851;
	//lon = -4.07615;
  

	
	var ukGrid = document.getElementById('gridUK').checked;
	
	alert("About to calculate Grid Reference"+ukGrid);
	var gridRef = getGridFromLatLong(ukGrid,lat,lon);
	var lat = document.getElementById('gridResult').value = gridRef;

}

