

/**
 * Calculates linear interpolation for X and Y points
 * @param {[type]} X [description]
 * @param {[type]} Y [description]
 */
exports.CalculateLinear = function(X,Y){

	//data checks
	if(X.constructor != Array || Y.constructor != Array)
		throw new Error("X and Y must be arrays");

	if(X.length != Y.length) {
		throw new Error("Matrices must have the same length");
	}

	if(X.length==1)
		throw new Error ("Cannot interpolate a single point");


	var A = [];

	for (var i = 1; i < X.length; i++) {
		var slope=(Y[i]-Y[i-1]) / (X[i]-X[i-1]);
		var icpt=Y[i-1];
		A[i-1] = [icpt,slope,0,0];
	};


	return A;
}

