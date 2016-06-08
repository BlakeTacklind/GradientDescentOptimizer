var gd = require("./GradientDescent.js");

var Values = [
	{name: "A", type: "Integer", lowerBound: 0, upperBound: 65535, Initial: 1},
	//Should create a real with number with a generated sequential name
	//with no bounds initialized to 0
	0,
	//Should create a real with a lower bound and upper bound and generated name 
	//initialize to between the two values
	{type: "Real", lowerBound: -1000, upperBound: -1},
];

endCondition = function(value, iterations, values){

}

ValueFunction = function(values){

}

var g = new gd(ValueFunction, Values, endCondition);

console.log(g.optimize());
