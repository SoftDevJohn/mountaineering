function setDefaultValues(){
	//Taken from the center of the Lugnaquilla Triangulation point on the EastWest map
	//where the paths converge and confirmed on the OSI map at the 
	//lower right corner of the triangulation point
	document.getElementById('latitude').value = "52.96712";
	document.getElementById('longitude').value = "-6.46464";
}

document.onload = setDefaultValues();

/*
Calculate Grid reference button handler
*/
function calculateGridRefHandler() {
	var lat = document.getElementById('latitude').value;
	var lon = document.getElementById('longitude').value;
	var ukGrid = document.getElementById('gridUK').checked;
	
	var gridRef = getGridFromLatLong(ukGrid,lat,lon);
	var lat = document.getElementById('gridResult').value = gridRef;
}

