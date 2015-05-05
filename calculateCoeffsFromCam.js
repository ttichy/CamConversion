var linear = require("./calculate_linear.js");
var cubic = require("./calculate_cubic.js");



/**
 * [CalculateCoeffsFromCam Calculates coefficients for an array of X and Y values given interpolation type T]
 * @param {double Array} X  [array of X values]
 * @param {double Array} Y  [array of Y values]
 * @param {int Array} 	 T  [interpolation type 0=linear, 1=cubic]
 * @param {double} s0 [initial slope]
 * @param {double} sf [final slope]
 */
exports.CalculateCoeffsFromCam = function(X,Y,T, s0,sf){
	"use strict";

	// data checks
	if(X.constructor != Array || Y.constructor != Array || T.constructor != Array)
		throw new Error("X and Y must be arrays");

	if(X.length != Y.length) {
		throw new Error("Matrices must have the same length");
	}

	if(X.length==1)
		throw new Error ("Cannot interpolate a single point");

	if(X.length-1 !=T.length)
		throw new Error("invalid length of types array T")

	if(! T.every(function(el,idx,array){

		return el ==1 || el ==0;
	}))
		throw new Error("only 1 or 0 is a valid interploation type");

	var result=[];


	var currentRow=1;
	var cubicStart=0;
	var initSlope=s0;
	var finalSlope=sf;


	debugger;

	while(currentRow<=X.length)
	{	
		if(T[currentRow-1]==0)
		{

			//calculate the linear segment first, cuz need final slope
			var linRes = linear.CalculateLinear(X.slice(currentRow-1,currentRow+1), Y.slice(currentRow-1,currentRow+1));

			finalSlope=linRes[0][1];

			//need to calculate all previous cubic rows
			var cubicSegs=currentRow-cubicStart;
			if(cubicSegs > 0){
				var coeffs3=cubic.CalculateCubic(X.slice(cubicStart,cubicStart+cubicSegs),
				 Y.slice(cubicStart,cubicStart+cubicSegs),
				 initSlope,
				 finalSlope);
				result = result.concat(coeffs3);
			}

			
			initSlope=linRes[0][1];

			result = result.concat(linRes);
			cubicStart=currentRow;
		}

		currentRow++;

	}


	// there may be 'leftover' cubic segments
	var cubicSegs=currentRow-cubicStart;
	if(cubicSegs > 0){
		var coeffs3=cubic.CalculateCubic(X.slice(cubicStart,cubicStart+cubicSegs),
		 Y.slice(cubicStart,cubicStart+cubicSegs),
		 initSlope,
		 finalSlope);
		result = result.concat(coeffs3);
	}
	return result;


}

var res1 = exports.CalculateCoeffsFromCam([0,1,3,5,7],[0,2,4,5,8],[1,1,0,1],0,0);
console.log(res1);