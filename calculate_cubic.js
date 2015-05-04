
var numeric = require('numeric');
"use strict";

/**
 *  INPUTS:
 *
 *  s0 .. initial slope
 *  sf .. final slope
 *  
 *  X.... array of x values
 *  Y.... array of y values
 *  T.....array of types (linear=0, cubic=1)
 *
 *
 * OUTPUT:
 * a,b,c,d coefficients for each interval [xn-1,xn] that correspond to x0, v0, a0, j in the position formula
 *
 * x = x0 + v0*t+1/2 *a0*t^2 * 1/6 *j*t^3
 * 
 */

// the type of cubic interpolation that is used is called 'clamped'
exports.CalculateCubic = function(X,Y,s0,sf){


	//-----<INPUTS>---------------------------------------

	// var s0=0;
	// var sf=0;

	// var X = [1,2];	//define X points
	// var Y = [2,4];	//define Y points
	// var T = [1];    // type - linear or cubic ( one less than points)

	//-----</INPUTS>----------------------------------------




	// data checks
	if(X.length != Y.length) {
		throw new Error("Matrices must have the same length");
	}

	/**
	 * [Am populate matrix row]
	 * @param {int} m [1, 2 or 3 which row entry (each matrix row has three entries]
	 * @param {int} r matrix row
	 * @param {array} h array of hs (master position differences)
	 */
	var Am = function (m, r, h) {
	    
	    var hSize = h.length+1;
	    if (r > hSize)
	        throw new Error("passed row number too large.");
	    
	    // juggle the h's a bit in order to make handle first and last row
	    var prevH=h[r-1];
	    if(!!!prevH)
	    	prevH=0;
	    var thisH=h[r];
	    if(!!!thisH)
	    	thisH=0;


	    switch (m) {
	        case 1:
	            return prevH;
	        case 2:
	            return 2 * (prevH+thisH);
	        case 3:
	            return thisH;
	        default:
	            throw new Error("only 1,2 or 3 are valid values for m");

	    }
	}



	var Bm = function (r, d) {
	    //first row?
	    if(r==0)
	        return 6*(d[0]-s0);

	    //last row?
	    if(r==d.length)
	        return 6*(sf-d[r-1]);

	    //all other rows
	    return 6*(d[r]-d[r-1]);
	}


	// define and assign h and slopes d
	var h=[];
	var d=[];

	for (var i = 1; i < X.length; i++) {
		h[i-1]=X[i]-X[i-1];
		d[i-1]=(Y[i]-Y[i-1])/h[i-1];
	}

	// need to have matrices in form AX=B, then can do
	// inv(A)*B=X


	var rows = X.length;
	var cols = rows;

	var A = new Array();
	var B = new Array();
	var C = new Array();

	    	debugger;

	for (var row = 0; row < rows; row++) {


	    //create a new row and fill with zeroes

	    A[row] = Array.apply(null, new Array(cols)).map(Number.prototype.valueOf, 0);


	    // which column to start in
	    var startCol = row - 1;
	    var stopCol = startCol + 2;
		


	    //special cases for first and last row

	    if (startCol < 0) {
	        stopCol = 1;
	        startCol = 0;
	    }

	    if (stopCol > rows-1)
	        stopCol = rows-1;


	    for (var col = startCol; col <= stopCol; col++) {
	        A[row][col] = Am(col-row+2 , row, h);
	    }

	    B[row] = new Array();
	    B[row][0] = Bm(row, d);


	};

	var Ainv = numeric.inv(A);
	C = numeric.dot(Ainv, B);

	//flatten result into one array mk
	var mk = [];
	mk=mk.concat.apply(mk,C);	

	//calculate the rest of coefficients
	var aa = [];
	var bb = [];
	var cc = [];
	var dd = [];


	for (var i = 0; i < X.length-1; i++) {
	    aa[i] = Y[i];
		bb[i] = d[i] - (h[i]/6)*(2*mk[i]+mk[i+1]);
		cc[i] = mk[i]/2;
	    dd[i] = (mk[i+1]-mk[i])/(6*h[i]);
	}

	// console.log(aa);
	// console.log(bb);
	// console.log(cc);
	// console.log(dd);


	return([aa,bb,cc,dd]);






};




