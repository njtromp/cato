$fn=30;

t=3; // thickness
ar=3;   // axe radius
or=20;  // outer radius
ir=10;  // inner radius => wing length = or - ir
ni=0.5; // nodge indent
wc=6;   // wing count

module pie_slice(h=1,ri=1,ro=1,a=60) {
	$fn=64;
	difference() {
		intersection() {
			cylinder(h=t, r1=ro, r2=ro, center=false);
			cube([ro,ro,t],false);
	    	rotate(a-90) cube([ro,ro,t],false);
		}
      cylinder(h=t, r1=ri, r2=ri, center=false);
	}
}

// Create inner hole for axis
difference() {
	cylinder(t, ir, ir);
	cylinder(t, ar, ar);
}
// Correct for nodge
translate([ar-ni, -ar, 0]) {
	cube([ar, 2*ar, t]);
}

// Place 'wings'
for(angle = [0: 360/wc : 359]) {
	rotate(angle) {
		pie_slice(h=t,ri=ir-0.5,ro=or,a=180/wc);
	}
}
