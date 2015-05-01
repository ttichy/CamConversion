
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



//-----<INPUTS>---------------------------------------

var s0=0;
var sf=0;

var X = [0,1,3,4];	//define X points
var Y = [0,0,2,2];	//define Y points
var T = [1,1,1];    // type one less than points

//-----</INPUTS>----------------------------------------

// data checks
if(X.length != Y.length) {
	throw new Error("Matrices must have the same length");
}
if(T.length != X.length-1)
    throw new Error("T must have one less members than X and Y")

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
    
    switch (m) {
        case 1:
            return h[r];
        case 2:
            return 2 * (h[r] + h[r + 1]);
        case 3:
            return h[r + 1];
        default:
            throw new Error("only 1,2 or 3 are valid values for m");

    }
}



var Bm = function (r, d) {
    //first row?
    if(r==0)
        return 6*(d[0]-s0);

    //last row?
    if(r==d.length+1)
        return 6*(sf-d[r-1]);

    //all other rows
    return 6*(d[r]-d[r-1];
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

if(rows>0) {
    for (var row = 0; row < rows; row++) {

        //create a new row and fill with zeroes
    
        A[row] = Array.apply(null, new Array(cols)).map(Number.prototype.valueOf, 0);

    
        // which column to start in
        var startCol = row - 1;
        var stopCol = startCol + 3;
    
        //special cases for first and last row

        if (startCol < 0) {
            stopCol = 2;
            startCol = 0;
        }

        if (stopCol > rows)
            stopCol = startCol + 2;

        if (rows == 1)
            stopCol = 1;

        for (var col = startCol; col < stopCol; col++) {
            A[row][col] = Am(col-row+2 , row, h);
        }

        B[row] = new Array();
        B[row][0] = Bm(row, h, deltaYj);


    };

    var Ainv = numeric.inv(A);
    C = numeric.dot(Ainv, B);

    
    var s0 = [s0];
    var sf = [sf];
    
    C.unshift(s0);
    C.push(sf);
    
    
    console.log(A);
    console.log(B);
    console.log(C);
    
    //calculate the rest of coefficients
    
    var d = [];
    var a = [];
    var b = [];
    for (var i = 0; i < X.length - 1; i++) {
        d[i] = (C[i + 1] - C[i]) / (3 * h[i]);
        b[i] = deltaYj[i] / h[i] - C[i][0] * h[i] - d[i] * Math.pow(h[i], 2);
        a[i] = Y[i];
    }

    console.log(a);
    console.log(b);
    console.log(d);

} else {
    A = [
        [1, X[0], Math.pow(X[0], 2), Math.pow(X[0], 3)],
        [1, X[1], Math.pow(X[1], 2), Math.pow(X[1], 3)],
        [0, 1, 2 * X[0], 3 * X[0]],
        [0, 1, 2 * X[1], 3 * X[1]]
    ];

    B = [
        [Y[0]],
        [Y[1]],
        [s0],
        [sf]
    ];

    var Ainv = numeric.inv(A);
    C = numeric.dot(Ainv, B);

    console.log(C);
}






console.log("end");





//console.log(numeric.prettyPrint(A));