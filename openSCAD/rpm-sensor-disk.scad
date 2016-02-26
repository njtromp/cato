
module pie_slice(thickness,innerRadius,outerRadius,angle) {
	$fn=64;
	difference() {
		intersection() {
			cylinder(h=thickness, r=outerRadius, center=false);
			cube([outerRadius,outerRadius,thickness],false);
	    	rotate(angle-90) cube([outerRadius,outerRadius,thickness],false);
		}
      cylinder(h=thickness, r=innerRadius, center=false);
	}
}

module rpm_disk(thickness,axeRadius,nodgeIndent,outerRadius,innerRadius,wingCount) {
	$fn=30;
	// Create hole for axis
	difference() {
		cylinder(thickness, r=innerRadius);
		cylinder(thickness, r=axeRadius);
	}
	// CouterRadiusrection for nodge
	translate([axeRadius-nodgeIndent, -axeRadius, 0]) {
		cube([axeRadius, 2*axeRadius, thickness]);
	}

	// Place 'wings'
	for(angle = [0: 360/wingCount : 359]) {
		rotate(angle) {
			pie_slice(thickness,innerRadius-0.5,outerRadius,180/wingCount);
		}
	}
}

rpm_disk(3,3,0.5,20,10,6);
