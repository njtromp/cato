$fn=30;

module pie_slice(h=2,ri=0.0,ro=3.0,a=15) {
	$fn=64;
	difference() {
		intersection() {
			cylinder(h=h, r1=ro, r2=ro, center=true);
			cube([ro,ro,h],false);
	    	rotate(a-90) cube([ro,ro,h],false);
		}
      cylinder(h=h, r1=ri, r2=ri);
	}
}

// Create inner hole for axis
difference() {
	cylinder(3, 10, 10);
	cylinder(3, 3, 3);
}
// Correct for nodge
translate([2, -3, 0]) {
	cube([3, 6, 3]);
}

// Place 'wings'
for(angle = [0: 60: 320]) {
	rotate(angle) {
		pie_slice(h=6,ri=9,ro=20,a=30);
	}
}
