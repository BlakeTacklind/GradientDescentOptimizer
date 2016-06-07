"use strict";

class GradientDecsent{
	constructor(ValueFunction, Values, LearningRate, iterations){
		this.alpha = LearningRate || 0.001;

		this.iterations = iterations || 1000;

		this.ValueFunction = ValueFunction;

		this.Values = Values;

	}

	optimize(initialPoint){
		

		
	}

}


module.exports = GradientDecsent;
