/*
Lattitude/Longitude to UK Grid Reference

UK:
UK Grid
Lat/Lon (WGS84) 52.65,1.70 => TG 50370 12234, 650370.322,312234.323


Snowdonia:  53.06851,-4.07615 => 260991,354379 (SH 60991 54379) = 
			ViewRanger: SH6099 5438 (meters)
						SH6099 5437
The calculation is out by 1 metre(gps will only be accurate to 3 metres)

IRELAND: 
Irish Grid
	Lugnaquilla
	Viewrange:	52.96709,-6.46461 => 303210 191771 (T 03210 91771)
	

*/

/*
Calculate Grid reference button handler
*/
function getGridFromLatLong(ukGrid,lat,lon){
  var pWGS = new LatLon(lat, lon);
  pOSGB = convertWGS84toOSGB36(pWGS);
  return LatLongToOSGrid(pOSGB);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Convert latitude/longitude <=> OS National Grid Reference points (c) John Costigan 2018       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/*
 * convert geodesic co-ordinates to OS grid reference
 */
function LatLongToOSGrid(p) {
  var lat = p.lat * Math.PI / 180; // convert degrees to radians
  var lon = p.lon * Math.PI / 180; // convert degrees to radians
  
  var a = 6377563.396, b = 6356256.910;          // Airy 1830 major & minor semi-axes
  var F0 = 0.9996012717;                         // NatGrid scale factor on central meridian
  var lat0 = (49) * Math.PI / 180
  var lon0 = (-2) * Math.PI / 180;  // NatGrid true origin
  var N0 = -100000, E0 = 400000;                 // northing & easting of true origin, metres
  var e2 = 1 - (b*b)/(a*a);                      // eccentricity squared
  var n = (a-b)/(a+b), n2 = n*n, n3 = n*n*n;

  var cosLat = Math.cos(lat), sinLat = Math.sin(lat);
  var nu = a*F0/Math.sqrt(1-e2*sinLat*sinLat);              // transverse radius of curvature
  var rho = a*F0*(1-e2)/Math.pow(1-e2*sinLat*sinLat, 1.5);  // meridional radius of curvature
  var eta2 = nu/rho-1;

  var Ma = (1 + n + (5/4)*n2 + (5/4)*n3) * (lat-lat0);
  var Mb = (3*n + 3*n*n + (21/8)*n3) * Math.sin(lat-lat0) * Math.cos(lat+lat0);
  var Mc = ((15/8)*n2 + (15/8)*n3) * Math.sin(2*(lat-lat0)) * Math.cos(2*(lat+lat0));
  var Md = (35/24)*n3 * Math.sin(3*(lat-lat0)) * Math.cos(3*(lat+lat0));
  var M = b * F0 * (Ma - Mb + Mc - Md);              // meridional arc

  var cos3lat = cosLat*cosLat*cosLat;
  var cos5lat = cos3lat*cosLat*cosLat;
  var tan2lat = Math.tan(lat)*Math.tan(lat);
  var tan4lat = tan2lat*tan2lat;

  var I = M + N0;
  var II = (nu/2)*sinLat*cosLat;
  var III = (nu/24)*sinLat*cos3lat*(5-tan2lat+9*eta2);
  var IIIA = (nu/720)*sinLat*cos5lat*(61-58*tan2lat+tan4lat);
  var IV = nu*cosLat;
  var V = (nu/6)*cos3lat*(nu/rho-tan2lat);
  var VI = (nu/120) * cos5lat * (5 - 18*tan2lat + tan4lat + 14*eta2 - 58*tan2lat*eta2);

  var dLon = lon-lon0;
  var dLon2 = dLon*dLon, dLon3 = dLon2*dLon, dLon4 = dLon3*dLon, dLon5 = dLon4*dLon, dLon6 = dLon5*dLon;

  var N = I + II*dLon2 + III*dLon4 + IIIA*dLon6;
  var E = E0 + IV*dLon + V*dLon3 + VI*dLon5;

  var digits = 8;
  E = Math.floor((E%10000000)/Math.pow(10,5-digits/2));
  N = Math.floor((N%10000000)/Math.pow(10,5-digits/2));
  var gridRef = E.padLZ(digits/2) + N.padLZ(digits/2);
  return gridRef;
  
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/*
 * pad a number with sufficient leading zeros to make it w chars wide
 */
Number.prototype.padLZ = function(w) {
  var n = this.toString();
  for (var i=0; i<w-n.length; i++) n = '0' + n;
  return n;
}

function LatLon(lat, lon, height) {
  if (arguments.length < 3) height = 0;
  this.lat = lat;
  this.lon = lon;
  this.height = height;
}
 
 
 

// ellipse parameters
var e = { WGS84:    { a: 6378137,     b: 6356752.3142, f: 1/298.257223563 },
          Airy1830: { a: 6377563.396, b: 6356256.910,  f: 1/299.3249646   } };
 
// helmert transform parameters
var h = { WGS84toOSGB36: { tx: -446.448,  ty:  125.157,   tz: -542.060,   // m
                           rx:   -0.1502, ry:   -0.2470,  rz:   -0.8421,  // sec
                           s:    20.4894 },                               // ppm
          OSGB36toWGS84: { tx:  446.448,  ty: -125.157,   tz:  542.060,
                           rx:    0.1502, ry:    0.2470,  rz:    0.8421,
                           s:   -20.4894 } };
 
 
 
function convertWGS84toOSGB36(p1) {
  var p2 = convert(p1, e.WGS84, h.WGS84toOSGB36, e.Airy1830);
  return p2;
}

function convert(p, e1, t, e2) {
  // -- convert polar to cartesian coordinates (using ellipse 1)
  
  p1 = new LatLon(p.lat, p.lon, p.height);  // to avoid modifying passed param

  
  
  p1.lat = p.lat * Math.PI / 180; // convert degrees to radians
  p1.lon = p.lon * Math.PI / 180; // convert degrees to radians
 
 
  var a = e1.a, b = e1.b;
 
  var sinPhi = Math.sin(p1.lat), cosPhi = Math.cos(p1.lat);
  var sinLambda = Math.sin(p1.lon), cosLambda = Math.cos(p1.lon);
  var H = p1.height;
 
  var eSq = (a*a - b*b) / (a*a);
  var nu = a / Math.sqrt(1 - eSq*sinPhi*sinPhi);
 
  var x1 = (nu+H) * cosPhi * cosLambda;
  var y1 = (nu+H) * cosPhi * sinLambda;
  var z1 = ((1-eSq)*nu + H) * sinPhi;
 
 
  // -- apply helmert transform using appropriate params
  
  var tx = t.tx, ty = t.ty, tz = t.tz;
  var rx = t.rx/3600 * Math.PI/180;  // normalise seconds to radians
  var ry = t.ry/3600 * Math.PI/180;
  var rz = t.rz/3600 * Math.PI/180;
  var s1 = t.s/1e6 + 1;              // normalise ppm to (s+1)
 
  // apply transform
  var x2 = tx + x1*s1 - y1*rz + z1*ry;
  var y2 = ty + x1*rz + y1*s1 - z1*rx;
  var z2 = tz - x1*ry + y1*rx + z1*s1;
 
 
  // -- convert cartesian to polar coordinates (using ellipse 2)
 
  a = e2.a, b = e2.b;
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
 
  return new LatLon(phi * 180 / Math.PI, lambda * 180 / Math.PI, H);
}

