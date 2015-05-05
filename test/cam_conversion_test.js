var assert = require('assert');
var should = require('should');

var cubic = require("../calculate_cubic.js");
var linear = require("../calculate_linear.js");


describe('Cubic spline calculations', function(){
	describe('Should solve points (1,2),(2,4)', function(){

		it('Result with zero initial slopes should be [2,0,6,-4]', function (){
			var result=cubic.CalculateCubic([1,2],[2,4],0,0);
			result.should.have.lengthOf(4);

			result.should.eql([[2],[0],[6],[-4]]);

		});
		
		it('Result with s0=1, sf=2 should be [2,1,2,-1]', function (){
			var result=cubic.CalculateCubic([1,2],[2,4],1,2);
			result.should.have.lengthOf(4);
			result.should.eql([[2],[1],[2],[-1]]);

		});

	});

	describe('should solve points (0,2)(2,4)', function() {
		it('Result with s0=1, sf=2 should be [2,1,2,-1]', function (){
			var result=cubic.CalculateCubic([0,1],[2,4],1,2);
			result.should.have.lengthOf(4);
			result.should.eql([[2],[1],[2],[-1]]);

		});

		it('Result with s0=-1, sf=2 should be [2,1,6,-3]', function (){
			var result=cubic.CalculateCubic([0,1],[2,4],-1,2);
			result.should.have.lengthOf(4);
			result.should.eql([[2],[-1],[6],[-3]]);

		});

	});

	describe('should solve points (0,0),(1,0),(3,2),(4,2)', function() {
		it('Result with s0=1 and sf=0 should be [', function() {
			var result = cubic.CalculateCubic([0,1,3,4],[0,0,2,2],0,0);
			result.should.eql(
				[ [ 0, 0, 2 ],
				  [ 0, 0.4285714285714286, 0.4285714285714286 ],
				  [ -0.4285714285714286, 0.8571428571428572, -0.8571428571428572 ],
				  [ 0.4285714285714286, -0.28571428571428575, 0.4285714285714286 ] ]
				  )
		});
	});

});

describe("Linear interpolation", function() {
	describe('should solve points (0,2)(2,4)', function() {
		it('Result should be [[2,1]]', function() {
			var result=linear.CalculateLinear([0,2],[2,4]);
			result.should.have.lengthOf[1];
			result.should.eql([ [ 2, 1 ] ]);
		});
	});
	
	describe('should solve points (0,2)(2,4),(4,4)', function() {
		it('Result should be [ [ 2, 1 ], [ 4, 0 ] ]', function() {
			var result=linear.CalculateLinear([0,2,4],[2,4,4]);
			result.should.eql([ [ 2, 1,0,0 ], [ 4, 0,0,0 ] ]);
		});	
	});

	describe('should solve points (0,2)(2,4),(4,5)', function() {
		it('Result should be [ [ 2, 1 ], [ 3, 0.5 ] ]', function() {
			var result=linear.CalculateLinear([0,2,4],[2,4,5]);
			result.should.eql([ [ 2, 1,0,0 ], [ 3, 0.5,0,0 ] ]);
		});	
	});	
});