
module raw_motor_support(width,depth,clearance,motorDiameter) {
	height = motorDiameter/2+clearance-0.5;
	difference() {
		cube([width,depth,height]);
		translate([width/2,0,motorDiameter/2+clearance]) {
			rotate([-90,0,0]) {
				$fn=64;
				cylinder(h=depth,d=motorDiameter);
			}
		}
	}
}

module nut_mount(nutDiameter,boltHeadDiameter,boltLength,boltDepth) {
	translate($fn=64,[0,0,boltDepth]) cylinder(boltLength, d=nutDiameter);
	cylinder($fn=6,boltDepth, d=boltHeadDiameter);
}

module bolt_mount(boltDiameter,boltHeadDiameter,boltLength,boltDepth) {
	$fn=64;
	translate([0,0,boltDepth]) cylinder(boltLength, d=boltDiameter);
	cylinder(boltDepth, d=boltHeadDiameter);
}

module upper_support() {
	difference() {
		raw_motor_support(width,depth,clearance,motorDiameter);
		translate([10,depth/2,0]) bolt_mount(boltDiameter+0.5,boltHeadDiameter+0.5,boltLength,boltDepth);
		translate([width-10,depth/2,0]) bolt_mount(boltDiameter+0.5,boltHeadDiameter+0.5,boltLength,boltDepth);
	}
}

module lower_support() {
	difference() {
		raw_motor_support(width,depth,clearance,motorDiameter);
		translate([10,depth/2,0]) nut_mount(boltDiameter+0.5,nutDiameter+0.5,boltLength,boltDepth);
		translate([width-10,depth/2,0]) nut_mount(boltDiameter+0.5,nutDiameter+0.5,boltLength,boltDepth);
	}
}

width=60;
depth=25;
clearance=10;
motorDiameter=32;
boltDiameter=3;
boltHeadDiameter=6;
nutDiameter=8;
boltLength=10;
boltDepth=motorDiameter/2+clearance-boltLength;

lower_support();
translate([width,0,motorDiameter +2*clearance]) rotate([0,180,0]) upper_support();

// difference(){
// 	translate([-2*clearance,-2*clearance,-clearance]) {
// 		cube([width+4*clearance,depth+4*clearance,clearance]);
// 	}
// }