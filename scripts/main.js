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
	//Snodonia
	lat =	53.06851;
	lon = -4.07615;
	
	//Lugnaquilla
	//lat = 52.96709;
	//lon = -6.46461;
	//Expect 303210 191771 (T 03210 91771)

  

	
	var ukGrid = document.getElementById('gridUK').checked;
	
	alert("About to calculate Grid Reference"+ukGrid);
	var gridRef = getGridFromLatLong(ukGrid,lat,lon);
	var lat = document.getElementById('gridResult').value = gridRef;

}

