//$fn=30;

// difference() {
// 	cylinder(3, 10, 10);
// 	cylinder(3, 3, 3);
// }
// translate([2, -3, 0]) {
// 	cube([3, 6, 3]);
// }

// for(angle = [0: 60: 320]) {
// 	rotate(angle) {
// 		translate([8, -4, 0]) {
// 			cube([10, 8, 3]);
// 		}
// 	}
// }


// translate(0, 0, 10) {
// 	polyhedron(points=[[10,0,0],[20,0,0],[20,5,0],[10,2,0],[10,0,4],[20,0,4],[20,5,4],[10,2,4]], faces=[[0,1,2],[0,2,3],[4,5,6],[4,6,7],[0,1,5],[0,4,5],[1,2,5],[2,5,6],[2,3,6],[3,6,7],[0,3,4],[3,4,7]]);
// }

module pie_slice(ri=0.0,ro=3.0,a=15) {
	$fn=64;
	difference() {
		intersection() {
			circle(ro);
			square(ro);
	    	rotate(a-90) square(ro);
		}
      circle(r=ri);
	}
}

for(angle = [0: 60: 320]) {
	rotate(angle) {
		pie_slice(ri=9,ro=20,a=30);
	}
}
