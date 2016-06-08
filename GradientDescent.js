"use strict";

class GradientDecsent{
	constructor(ValueFunction, Values, options){

		this.alpha = options['LearningRate'] || 0.001;

		this.iterations = options['iterations'];
		this.endCondition = options['endCondition'];

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

		return Values;
	}

	optimize(initialPoint){
		initialPoint = initialPoint || this.getInitials();
		this.tried = [];

		this.onInteration = 1;
		this.onValues = initialPoint;

		this.lastValue = this.ValueFunction(this.onValues);
		this.tried[0] = {values: this.onValues, value: this.lastValue};

		while(!this.endConditionMet()){
			this.onValues = this.NextPoint();

			this.lastValue = this.ValueFunction(this.onValues);
			this.tried[iterations] = {values: this.onValues, value: this.lastValue};

			this.onInteration++;
		}


	}

	endConditionMet(){
		if(typeof(this.iterations) === "number") return this.onInteration >= this.iterations;
		if(typeof(this.endCondition) === "function") return this.endCondition(this.lastValue, this.iterations, this.onValues);
		return true;
	}

	NextPoint(){
		//Not enough for a gradient so twittle values
		if(this.tried.length <= this.Values.length){

		}

		//otherwise shift value with gradient
		//use most recent value mostly and slowly phase out previous values


		//place holder
		return this.onValues;
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
