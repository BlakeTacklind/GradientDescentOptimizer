"use strict";

class GradientDecsent{
	constructor(ValueFunction, Values, options){

		this.alpha = options['LearningRate'] || 1;

		this.iterations = options['iterations'];
		this.endCondition = options['endCondition'];

		this.ValueFunction = ValueFunction;

		this.Values = this.makeValuesValid(Values);

		this.phaseOutRate = options['phaseOutRate'] || 0.5;

		this.scanArea = this.Values.length;

		//initialize gradient
		this.gradient = [];
		for(var i = 0; i < this.Values.length; i++)
			this.gradient.push(0);
		
		this.calculatedGradient = false;

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

				Values[i]['Step%'] = Values[i]['Step%'] || 0.1;

				var dist = Values[i]['upperBound'] - Values[i]['lowerBound'];
				var step = dist * Values[i]['Step%'];

				if (Values[i]['type'] == 'Integer') step = Math.round(step);

				Values[i]['Step'] = Values[i]['Step'] || (step || 1);
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
		this.tried.push({values: this.onValues, value: this.lastValue});

		while(!this.endConditionMet()){
			this.onValues = this.NextPoint();

			this.lastValue = this.ValueFunction(this.onValues);
			this.tried.push({values: this.onValues, value: this.lastValue});

			this.onInteration++;
		}

		return this.findSmallest();
	}

	endConditionMet(){
		if(typeof(this.iterations) === "number") return this.onInteration >= this.iterations;
		if(typeof(this.endCondition) === "function") return this.endCondition(this.lastValue, this.iterations, this.onValues);
		return true;
	}

	NextPoint(){
		var currValue;
		//Not enough for a gradient so twittle values
		if(this.scanArea != 0){

			currValue = this.findSmallest(this.Values.length - this.scanArea)['values'];

			currValue[this.tried.length - 1] += this.Values[this.tried.length - 1].Step;

			this.gradient[this.Values.length - this.scanArea] = currValue[this.tried.length - 1].value

			this.scanArea--;

			if(this.scanArea == 0){
				//calculate a new gradient


			}
		}
		else if(this.tried[this.tried.length - 1] > this.tried[this.tried.length - 2]){
			this.scanArea = this.Values.length;
			this.calculatedGradient = false;
		}
		else{
			//go in gradient direction
			currValue = this.tried[this.tried.length - 1]['values'] + this.gradient * this.alpha;


		}

		return currValue;
	}

	findSmallest(ofLast){
		ofLast = ofLast || this.tried.length;

		var index = this.tried.length - 1;
		var smallest = this.tried[index];

		for(index--; index >= (this.tried.length - ofLast); index--){
			if(smallest.value > this.tried[index].value){
				smallest = this.tried[index];
			}
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
