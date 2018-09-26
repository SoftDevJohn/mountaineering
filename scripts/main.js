/*
Convert from the given latitude and longitude 
to the corresponding Grid Reference.
*/
function XXgetGridFromLatLong(ukGrid,lat,lon){
	var grid = "T " + lat + " " + lon +" (UK Grid="+ukGrid+")";
	return grid;1
}

function doIt(){
	//alert("aaaaa");
	//Set the default coordinates to the Summit of Lugnaquilla as given my ViewRanger.
	
	//Lugnaquilla
	//lat = 52.96712;
	//lon = -6.46464;
	//Expect 303210 191771 (T 03210 91771)

	//Taken from the center of the Triangulation point in the EastWestmap
	//where the paths converge and confirmed on the OSI map at the 
	//lower right corner of the triangulation point
	document.getElementById('latitude').value = "52.96712";
	document.getElementById('longitude').value = "-6.46464";
	//ViewRanger gives: IG: 303208,191774 (T 03208 91774)

	//Other summits
	//Croaghgirm
	//Viewranger 54.75419 -8.08101 => 194832,389585
	//This script => 194832389585
	//Spot on
}
document.onload = doIt();
ngulatui
/*
Calculate Grid reference button handler
*/
function calculateGridRefHandler() {
	//doSomething();
	
	var lat = document.getElementById('latitude').value;
	var lon = document.getElementById('longitude').value;
	//Snodonia
	//lat =	53.06851;
	//lon = -4.07615;
	
	//Lugnaquilla
	//lat = 52.96709;
	//lon = -6.46461;
	//Expect 303210 191771 (T 03210 91771)

  

	
	var ukGrid = document.getElementById('gridUK').checked;
	
	alert("About to calculate Grid Reference"+ukGrid);
	var gridRef = getGridFromLatLong(ukGrid,lat,lon);
	var lat = document.getElementById('gridResult').value = gridRef;

}

