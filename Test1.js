var gd = require("./GradientDescent.js");

TestObject = {
	P: 8,
	I: 0,
	D: 0
}

ValueFunction = function (values){
	TestObject.P = values[0];
	TestObject.I = values[1];
	TestObject.D = values[2];

	Tested++;

	return Math.pow(TestObject.P-200, 2) + Math.pow(TestObject.I-100, 2) + Math.pow(TestObject.D-60, 2);
}


var Values = [
	{name: "P", type: "Integer", lowerBound: 0, upperBound: 255, Initial: 8},
	{name: "I", type: "Integer", lowerBound: 0, upperBound: 255, Initial: 0},
	{name: "D", type: "Integer", lowerBound: 0, upperBound: 255, Initial: 0},
];

var Tested = 0;

LearningRate = 0.001;

//Should end be defined by a number of iterations?
iterations = 1000;

var g = new gd(ValueFunction, Values, {iterations, LearningRate});

console.log(g.optimize(), Tested);



//Should there be an ending fucntions?
// var endFunction = function (values){
// 	return ValueFunction(values) == 0;
// }

// var gd = new gd(ValueFunction, Values, LearningRate, endFunction);

// console.log(gd.optimize());
