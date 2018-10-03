/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Convert latitude/longitude <=> OS National Grid Reference points (c) John Costigan 2018       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/*
Calculate Grid reference button handler
*/
function getGridFromLatLong(ukGrid,lat,lon){
  return convert(lat, lon);
 }

/*
 * convert geodesic co-ordinates to OS grid reference
 */
 function convert(lat,lon) {
  // -- convert polar to cartesian coordinates (using ellipse 1)
	
  var deg2rad = Math.PI / 180;
  
  var latRad = lat * deg2rad; // convert degrees to radians
  var lonRad = lon * deg2rad; // convert degrees to radians

  var a = 6378137; //WGS84.a
  var b = 6356752.3142;	//WGS84.b
  var tx = -482.53;
  var ty = 130.596;
  var tz = -564.557;
  var rx = 1.042/3600 * deg2rad;  // normalise seconds to radians
  var ry = 0.214/3600 * deg2rad;
  var rz = 0.631/3600 * deg2rad;
//  var s1 = -8.15/1e6 + 1;              // normalise ppm to (s+1)
  var s1 = -8.15/1000000 + 1;              // normalise ppm to (s+1)

  var F0 = 1.000035;        
  var lat0 = (53.5) * deg2rad;		
  var lon0 = (-8) * deg2rad;
  var N0 = 250000, E0 = 200000; 
  
  var sinPhi = Math.sin(latRad), cosPhi = Math.cos(latRad);
  var sinLambda = Math.sin(lonRad), cosLambda = Math.cos(lonRad);
  var H = 0;
 
  var eSq = (a*a - b*b) / (a*a);
  var nu = a / Math.sqrt(1 - eSq*sinPhi*sinPhi);
 
  var x1 = (nu+H) * cosPhi * cosLambda;
  var y1 = (nu+H) * cosPhi * sinLambda;
  var z1 = ((1-eSq)*nu + H) * sinPhi;
 
  // apply transform
  var x2 = tx + x1*s1 - y1*rz + z1*ry;
  var y2 = ty + x1*rz + y1*s1 - z1*rx;
  var z2 = tz - x1*ry + y1*rx + z1*s1;
  
  // -- convert cartesian to polar coordinates (using ellipse 2) 
  a = 6377340.189; // Airy1965.a
  b = 6356034.447; //Airy1965.b
  var precision = 4 / a;  // results accurate to around 4 metres
 
  eSq = (a*a - b*b) / (a*a);
  
  
  var p = Math.sqrt(x2*x2 + y2*y2);
  var phi = Math.atan2(z2, p*(1-eSq)), phiP = 2*Math.PI;
  
  
  
  while (Math.abs(phi-phiP) > precision) {
    nu = a / Math.sqrt(1 - eSq*Math.sin(phi)*Math.sin(phi));
    phiP = phi;
    phi = Math.atan2(z2 + eSq*nu*Math.sin(phi), p);
  }
  var lambda = Math.atan2(y2, x2);
  H = p/Math.cos(phi) - nu;
 
	lat = phi * 180 / Math.PI;
	lon = lambda * 180 / Math.PI;

	/////SUUNTO TO HERE

  ///////////////// mergin latLonToOsGrid
  latRad = lat * deg2rad; 			
  lonRad = lon * deg2rad; 			

  var n = (a-b)/(a+b), n2 = n*n, n3 = n*n*n;

  var cosLat = Math.cos(latRad), sinLat = Math.sin(latRad);
  nu = a*F0/Math.sqrt(1-eSq*sinLat*sinLat);              
  var rho = a*F0*(1-eSq)/Math.pow(1-eSq*sinLat*sinLat, 1.5);  
  var eta2 = nu/rho-1;

  var Ma = (1 + n + (5/4)*n2 + (5/4)*n3) * (latRad-lat0);
  var Mb = (3*n + 3*n*n + (21/8)*n3) * Math.sin(latRad-lat0) * Math.cos(latRad+lat0);
  var Mc = ((15/8)*n2 + (15/8)*n3) * Math.sin(2*(latRad-lat0)) * Math.cos(2*(latRad+lat0));
  var Md = (35/24)*n3 * Math.sin(3*(latRad-lat0)) * Math.cos(3*(latRad+lat0));
  var M = b * F0 * (Ma - Mb + Mc - Md);              

   alert("n is: "+lonRad);

 
  
  var cos3lat = cosLat*cosLat*cosLat;
  var cos5lat = cos3lat*cosLat*cosLat;
  var tan2lat = Math.tan(latRad)*Math.tan(latRad);
  var tan4lat = tan2lat*tan2lat;

  var I = M + N0;
  var II = (nu/2)*sinLat*cosLat;
  var III = (nu/24)*sinLat*cos3lat*(5-tan2lat+9*eta2);
  var IIIA = (nu/720)*sinLat*cos5lat*(61-58*tan2lat+tan4lat);
  var IV = nu*cosLat;
  var V = (nu/6)*cos3lat*(nu/rho-tan2lat);
  var VI = (nu/120) * cos5lat * (5 - 18*tan2lat + tan4lat + 14*eta2 - 58*tan2lat*eta2);


  var dLon = lonRad-lon0;
  var dLon2 = dLon*dLon, dLon3 = dLon2*dLon, dLon4 = dLon3*dLon, dLon5 = dLon4*dLon, dLon6 = dLon5*dLon;

  var N = I + II*dLon2 + III*dLon4 + IIIA*dLon6;
  var E = E0 + IV*dLon + V*dLon3 + VI*dLon5;

  var digits = 10;
  E = Math.floor((E%10000000)/Math.pow(10,5-digits/2));
  N = Math.floor((N%10000000)/Math.pow(10,5-digits/2));

  
  var es = E.toString();
  for (var i=0; i<(digits/2)-es.length; i++) es = '0' + es;

  var ns = N.toString();
  for (var i=0; i<(digits/2)-ns.length; i++) ns = '0' + ns;

  var gridRef = es + ns;

  return gridRef;
  }


