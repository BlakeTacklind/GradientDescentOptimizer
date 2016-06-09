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

				var init = (Values[i]['upperBound'] + Values[i]['lowerBound'])/2;
				if (Values[i]['type'] == 'Integer') init = Math.round(init);
				if(typeof(Values[i]['Initial']) !== 'number') Values[i]['Initial'] = (init || 0);

				// console.log(Values[i]['Initial'])

				Values[i]['step%'] = Values[i]["step%"] || 0.1;

				var dist = (Values[i]['upperBound'] - Values[i]['lowerBound']);
				var step = (dist * Values[i]["step%"]);

				if (Values[i]['type'] == 'Integer') step = Math.round(step);
				Values[i]['step'] = Values[i]['step'] || step || 1;
			}
			else{

				console.log("Unknown Value Type! "+ typeof(Values[i]));
			}
		}

		// console.log(Values);
		return Values;
	}

	optimize(initialPoint){
		initialPoint = initialPoint || this.getInitials();
		this.tried = [];

		this.onInteration = 1;
		this.onValues = initialPoint;

		this.lastValue = this.ValueFunction(this.onValues);
		this.tried.push({values: this.onValues, value: this.lastValue});

		while(!this.endConditionMet()){
			// console.log(this.onInteration);
			this.onValues = this.NextPoint();

			this.lastValue = this.ValueFunction(this.onValues);
			this.tried.push({values: this.onValues, value: this.lastValue});

			this.onInteration++;
		}

		return this.getSmallest();
	}

	endConditionMet(){
		if(typeof(this.iterations) === "number") return this.onInteration >= this.iterations;
		if(typeof(this.endCondition) === "function") return this.endCondition(this.lastValue, this.iterations, this.onValues);
		return true;
	}

	NextPoint(){
		var valueCpy = this.onValues;

		//Not enough for a gradient so twittle values
		if(this.tried.length <= this.Values.length){
			// console.log(valueCpy);

			//Find lowest value element in list
			valueCpy = this.getSmallest()['values'];


			//from smallest twiddle a value to start gradient search
			valueCpy[this.tried.length - 1] += this.Values[this.tried.length - 1].step
		}
		else{
			//otherwise shift value with gradient
			//use most recent value mostly and slowly phase out previous values

		}

		//place holder
		return valueCpy;
	}

	getSmallest(){
		var index = 0;

		var smallest = this.tried[index];
		
		for (var i = 1; i < this.tried.length; i++){
			if (this.tried[i]['value'] < smallest['value'])
				smallest = this.tried[i];
		}

		return smallest;
	}

	getInitials(){
		var intials = [];
		
		for (var i = 0; i < this.Values.length; i++){
			intials.push(this.Values[i]['Initial']);
		}

		return intials;
	}
}


module.exports = GradientDecsent;
