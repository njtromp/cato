$fn=30;

// thickness
t=3;
// axe radius
ar=3;
// outer radius
or=20;
// inner radius => wing length = outer radius - inner radius
ir=10;
// nodge indent  
ni=0.5;
// wing count
wc=6;

module pie_slice(h=1,ir=1,or=1,a=60) {
	$fn=64;
	difference() {
		intersection() {
			cylinder(h=t, r1=or, r2=or, center=false);
			cube([or,or,t],false);
	    	rotate(a-90) cube([or,or,t],false);
		}
      cylinder(h=t, r1=ir, r2=ir, center=false);
	}
}

// Create hole for axis
difference() {
	cylinder(t, ir, ir);
	cylinder(t, ar, ar);
}
// Correction for nodge
translate([ar-ni, -ar, 0]) {
	cube([ar, 2*ar, t]);
}

// Place 'wings'
for(angle = [0: 360/wc : 359]) {
	rotate(angle) {
		pie_slice(h=t,ir=ir-0.5,or=or,a=180/wc);
	}
}
