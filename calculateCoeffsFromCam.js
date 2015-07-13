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
exports.CalculateCoeffsFromCam = function(X, Y, T, s0, sf) {
	// data checks
	if (X.constructor != Array || Y.constructor != Array || T.constructor != Array)
		throw new Error("X and Y must be arrays");

	if (X.length != Y.length) {
		throw new Error("Matrices must have the same length");
	}

	if (X.length == 1)
		throw new Error("Cannot interpolate a single point");

	if (X.length - 1 != T.length)
		throw new Error("invalid length of types array T");

	if (!T.every(function(el, idx, array) {

			return el == 1 || el == 0;
		}))
		throw new Error("only 1 or 0 is a valid interploation type");

	var result = [];

	var currentRow = 1;
	var cubicStart = 0;
	var initSlope = s0;
	var finalSlope = sf;
	while (currentRow <= X.length - 1) {
		if (T[currentRow - 1] == 0) {

			//calculate the linear segment first, cuz need final slope
			var linRes = linear.CalculateLinear(X.slice(currentRow - 1, currentRow + 1), Y.slice(currentRow - 1, currentRow + 1));

			finalSlope = linRes[0][1];

			//need to calculate all previous cubic rows
			var cubicSegs = currentRow - cubicStart;
			if (cubicSegs > 1) {
				var coeffs3 = cubic.CalculateCubic(X.slice(cubicStart, cubicStart + cubicSegs),
					Y.slice(cubicStart, cubicStart + cubicSegs),
					initSlope,
					finalSlope);
				result = result.concat(coeffs3);
			}


			initSlope = linRes[0][1];

			result = result.concat(linRes);
			cubicStart = currentRow;
		}

		currentRow++;
	}


	// there may be 'leftover' cubic segments
	//current row is passed the last row now, so need to subtract one to get to actual number of segments
	cubicSegs = currentRow - 1 - cubicStart;

	// use final slope that user specified
	finalSlope = sf;

	if (cubicSegs > 0) {
		coeffs3 = cubic.CalculateCubic(X.slice(cubicStart, cubicStart + cubicSegs + 1),
			Y.slice(cubicStart, cubicStart + cubicSegs + 1),
			initSlope,
			finalSlope);
		result = result.concat(coeffs3);
	}
	//console.log(result);
	return result;
};



var res1 = exports.CalculateCoeffsFromCam([0, 0.33333333, 0.66666666, 1], [0, .25, .75, 1], [1, 0, 1], 0, 0);
// var res1 = exports.CalculateCoeffsFromCam([0.66666,1],[0.75,1],[1],1.5,0);
console.log(res1);