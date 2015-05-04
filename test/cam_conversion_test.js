var assert = require('assert');
var should = require('should');

var cubic = require("..\\calculate_cubic.js");



describe('Cam conversion', function(){
	describe('Should solve points [1,2],[3,4] with zero slopes', function(){

		it('Result should have the correct coefficients [2,0,6,-4]', function (){
			var result=cubic.CalculateCubic([1,2],[2,4],0,0);
			result.should.have.lengthOf(4);

			result.should.eql([[2],[0],[6],[-4]]);

		});


	});

});