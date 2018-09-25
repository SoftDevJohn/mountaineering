/*
Lattitude/Longitude to UK Grid Reference
https://www.movable-type.co.uk/scripts/latlong-os-gridref.html

Lat/Lon (WGS84) 52.65,1.70 => TG 50370 12234, 650370.322,312234.323


Snowdonia:  53.06851,-4.07615 => 260991,354379 (SH 60991 54379) = 
			ViewRanger: SH6099 5438 (meters)
						SH6099 5437
The calculation is out by 1 metre(gps will only be accurate to 3 metres)
*/

/*
Calculate Grid reference button handler
*/
function doSomething() {
var p = {
	lat : 53.06851,
	lon : -4.07615
};

	alert("Do sommething in geo.js called: " + p.lat);
  var pWGS = new LatLon(p.lat, p.lon);
  pOSGB = convertWGS84toOSGB36(pWGS);
  var x = LatLongToOSGrid(pOSGB);

	
	//var x = ll2osg(p.lat, p.lon);
	//var grid = LatLongToOSGrid(x);
	alert("Grid is`: " + x );
	
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Convert latitude/longitude <=> OS National Grid Reference points (c) Chris Veness 2005-2010   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/*
 * convert geodesic co-ordinates to OS grid reference
 */
function LatLongToOSGrid(p) {
  var lat = p.lat.toRad(), lon = p.lon.toRad();
  
  var a = 6377563.396, b = 6356256.910;          // Airy 1830 major & minor semi-axes
  var F0 = 0.9996012717;                         // NatGrid scale factor on central meridian
  var lat0 = (49).toRad(), lon0 = (-2).toRad();  // NatGrid true origin
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

  //return [N, E];
  return gridrefNumToLet(E, N, 8);
}

/*
 * convert numeric grid reference (in metres) to standard-form grid ref
 */
function gridrefNumToLet(e, n, digits) {
  // get the 100km-grid indices
  var e100k = Math.floor(e/100000), n100k = Math.floor(n/100000);
  
  if (e100k<0 || e100k>6 || n100k<0 || n100k>12) return '';

  // translate those into numeric equivalents of the grid letters
  var l1 = (19-n100k) - (19-n100k)%5 + Math.floor((e100k+10)/5);
  var l2 = (19-n100k)*5%25 + e100k%5;

  // compensate for skipped 'I' and build grid letter-pairs
  if (l1 > 7) l1++;
  if (l2 > 7) l2++;
  var letPair = String.fromCharCode(l1+'A'.charCodeAt(0), l2+'A'.charCodeAt(0));

  // strip 100km-grid indices from easting & northing, and reduce precision
  e = Math.floor((e%100000)/Math.pow(10,5-digits/2));
  n = Math.floor((n%100000)/Math.pow(10,5-digits/2));

  var gridRef = letPair + e.padLZ(digits/2) + n.padLZ(digits/2);

  return gridRef;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/*
 * extend Number object with methods for converting degrees/radians
 */
Number.prototype.toRad = function() {  // convert degrees to radians
  return this * Math.PI / 180;
}
Number.prototype.toDeg = function() {  // convert radians to degrees (signed)
  return this * 180 / Math.PI;
}

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
 
 
 
// extend String object with method for parsing degrees or lat/long values to numeric degrees
//
// this is very flexible on formats, allowing signed decimal degrees, or deg-min-sec suffixed by 
// compass direction (NSEW). A variety of separators are accepted (eg 3º 37' 09"W) or fixed-width 
// format without separators (eg 0033709W). Seconds and minutes may be omitted. (Minimal validation 
// is done).
 
String.prototype.parseDeg = function() {
  if (!isNaN(this)) return Number(this);                 // signed decimal degrees without NSEW
 
  var degLL = this.replace(/^-/,'').replace(/[NSEW]/i,'');  // strip off any sign or compass dir'n
  var dms = degLL.split(/[^0-9.]+/);                     // split out separate d/m/s
  for (var i in dms) if (dms[i]=='') dms.splice(i,1);    // remove empty elements (see note below)
  switch (dms.length) {                                  // convert to decimal degrees...
    case 3:                                              // interpret 3-part result as d/m/s
      var deg = dms[0]/1 + dms[1]/60 + dms[2]/3600; break;
    case 2:                                              // interpret 2-part result as d/m
      var deg = dms[0]/1 + dms[1]/60; break;
    case 1:                                              // decimal or non-separated dddmmss
      if (/[NS]/i.test(this)) degLL = '0' + degLL;       // - normalise N/S to 3-digit degrees
      var deg = dms[0].slice(0,3)/1 + dms[0].slice(3,5)/60 + dms[0].slice(5)/3600; break;
    default: return NaN;
  }
  if (/^-/.test(this) || /[WS]/i.test(this)) deg = -deg; // take '-', west and south as -ve
  return deg;
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
 
                 
function convertOSGB36toWGS84(p1) {
  var p2 = convert(p1, e.Airy1830, h.OSGB36toWGS84, e.WGS84);
  return p2;
}
 
 
function convertWGS84toOSGB36(p1) {
  var p2 = convert(p1, e.WGS84, h.WGS84toOSGB36, e.Airy1830);
  return p2;
}

function convert(p, e1, t, e2) {
  // -- convert polar to cartesian coordinates (using ellipse 1)
  
  p1 = new LatLon(p.lat, p.lon, p.height);  // to avoid modifying passed param
  p1.lat = p.lat.toRad(); p1.lon = p.lon.toRad(); 
 
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
 
  return new LatLon(phi.toDeg(), lambda.toDeg(), H);
}

function ll2osg(lat, lon) {
  lat = lat.parseDeg();
  lon = lon.parseDeg();
  pWGS = new LatLon(lat, lon);
  pOSGB = convertWGS84toOSGB36(pWGS);
  return LatLongToOSGrid(pOSGB);
}
