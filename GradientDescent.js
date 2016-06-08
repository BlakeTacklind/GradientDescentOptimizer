"use strict";

class GradientDecsent{
	constructor(ValueFunction, Values, iterations, LearningRate){
		this.alpha = LearningRate || 0.001;

		this.iterations = iterations || 1000;

		this.ValueFunction = ValueFunction;

		this.Values = this.makeValuesValid(Values);

	}

	//Takes values data and converts it into a standard format for use
	makeValuesValid(Values){
		for(var i = 0; i < Values.length; i++){
			if(typeof(Values[i]) === "number"){
				Values[i] = {Initial:Values[i]};
			}

			if(typeof(Values[i]) === "object"){
				Values[i]['name'] = Values[i]['name'] || "Variable "+(i+1);
				Values[i]['type'] = Values[i]['type'] || "Real";
				if(typeof(Values[i]['lowerBound']) !== 'number') Values[i]['lowerBound'] = NaN;
				if(typeof(Values[i]['upperBound']) !== 'number') Values[i]['upperBound'] = NaN;
				var init = (Values[i]['upperBound'] + Values[i]['lowerBound'])/2
				if (Values[i]['type'] == 'Integer') init = Math.round(init);
				if(typeof(Values[i]['Initial']) !== 'number') Values[i]['Initial'] = (init || 0);
			}
			else{

				console.log("Unknown Value Type! "+ typeof(Values[i]));
			}
		}

		console.log(Values);
		return Values;
	}

	optimize(initialPoint){
		initialPoint = initialPoint || this.getInitials();

		
	}

	getInitials(){
		var intials = [];
		
		for (var i = 0; i < this.Values; i++){
			intials.push(this.Values.Initial);
		}

		return intials;
	}
}


module.exports = GradientDecsent;
