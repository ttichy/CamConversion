
var numeric = require('numeric');

// ReSharper disable once WrongExpressionStatement
"use strict";

/**
 *  INPUTS:
 *
 *  c1 .. initial slope
 *  cn .. final slope
 *  
 *  X.... array of x values
 *  Y.... array of y values
 *
 *
 * OUTPUT:
 * a,b,c,d coefficients for each interval [xn-1,xn] that correspond to x0, v0, a0, j in the position formula
 *
 * x = x0 + v0*t+1/2 *a0*t^2 * 1/6 *j*t^3
 * 
 */


// natural cubic spline can be solved relatively easy with Thompson algorithm (because the matrix is tri-diagonal)
// however, since we need a more generic solution, just going with the numeric library


//-----<INPUTS>---------------------------------------

// start with natural cubic spline
var c1=0;
var cn=0;

var X = [1,2,3,4,5];	//define X points
var Y = [2,3,5,6,7];	//define Y points

//-----</INPUTS>----------------------------------------


/**
 * [Am populate matrix rwo]
 * @param {int} m [1, 2 or 3 which row entry (each matrix row has three entries]
 * @param {int} r matrix row
 * @param {array} h array of hs (master position differences)
 */
var Am = function (m, r, h) {
    
    var hSize = h.length;
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

var Bm = function (r, h, deltaY) {
    return 3 * deltaY[r + 1] / h[r + 1] - 3 * deltaY[0] / h[r];
}


if(X.length != Y.length) {
	throw new Error("Matrices must have the same length");
}




// define and assign h and deltaYj
var h=[];
var deltaYj=[];

for (var i = 1; i < X.length; i++) {
	h[i-1]=X[i]-X[i-1];
	deltaYj[i-1]=Y[i]-Y[i-1];
}

console.log(h);

// need to have matrices in form AX=B, then can do
// inv(A)*B=X

// A matrix has X.length - 2 rows
var rows = X.length - 2;
var cols = rows;

var A = new Array();
var B = new Array();



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
var C = numeric.dot(Ainv, B);

// C contains the middle c coefficients, need to add c1 and cn

var C1 = [c1];
var CN = [cn];

C.unshift(C1);
C.push(CN);

console.log(A);
console.log(B);
console.log(C);

//calculate the rest of coefficients

var d = [];
var a = [];
var b = [];
for (var i = 0; i < X.length-1; i++) {
    d[i] = (C[i + 1] - C[i]) / (3 * h[i]);
    b[i] = deltaYj[i] / h[i] - C[i][0] * h[i] - d[i] * Math.pow(h[i], 2);
    a[i] = Y[i];
}


console.log(a);
console.log(b);
console.log(d);

console.log("end");





//console.log(numeric.prettyPrint(A));