"use strict";
// var math = require('mathjs');

class GradientDecsent{
	constructor(ValueFunction, Values, options){

		this.alpha = options['LearningRate'] || 1;

		this.iterations = options['iterations'];
		this.endCondition = options['endCondition'];

		this.ValueFunction = ValueFunction;

		this.Values = this.makeValuesValid(Values);

		this.phaseOutRate = options['phaseOutRate'] || 0.5;

		this.scanArea = this.Values.length;

		this.lastEffective = 0;
		this.prevEffective = 0;
		this.twittle = 0;

		//initialize gradient
		this.gradient = undefined;

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

				Values[i]['Step%'] = Values[i]['Step%'] || 0.001;

				var dist = Values[i]['upperBound'] - Values[i]['lowerBound'];
				var step = dist * Values[i]['Step%'];

				if (Values[i]['type'] == 'Integer') step = Math.round(step);

				//sets given step value, or with provided % value, or 1 (if others 0)
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
			this.onValues = this.NextPointDumbSearch();
			// console.log(this.onValues);

			this.lastValue = this.ValueFunction(this.onValues);
			this.tried.push({values: this.onValues, value: this.lastValue, gradient: this.gradient});

			this.onInteration++;
		}

		return this.findSmallest();
	}

	endConditionMet(){
		if(typeof(this.iterations) === "number") return this.onInteration >= this.iterations;
		if(typeof(this.endCondition) === "function") return this.endCondition(this.lastValue, this.iterations, this.onValues);
		return true;
	}


	NextPointDumbSearch(){

		//if bad gadient begin twittle 
		// console.log(this.lastValue, this.tried[this.lastEffective + 1].value)
		if(this.gradient && this.tried[this.prevEffective].value < this.tried[this.lastEffective].value){
			this.gradient = undefined;
			// console.log("test")
			// this.twittle = 0;
		}

		if(this.twittle == this.Values.length){
			//find gadient
			this.twittle = 0;
			var Delta = [];

			for (var i = 0; i < this.Values.length; i++){
				Delta.push(this.tried[this.lastEffective].value - this.tried[i+1].value);
			}

			var max = Delta.reduce((prev, curr)=>{
				if (Math.abs(prev) > Math.abs(curr))
					return prev;
				
				return curr;
			});

			var fgradient = Delta.map((val, index)=>{
				var delta = val / Math.abs(max) * this.Values[index].Step;

				// if (this.Values[index].type == "Integer")
				// 	return Math.round(delta);
				
				return delta;
			});

			this.gradient = fgradient.map((val, index)=>{

				if (this.Values[index].type == "Integer")
					return Math.round(val);
				
				return val;
			});

			if(this.gradient.every((val)=>{return val == 0;})){
				var maxI = -1;
				fgradient.reduce((prev, curr, index)=>{
					if(prev < Math.abs(curr)){
						maxI = index;
						return Math.abs(curr);
					}

					return curr;
				}, 0);

				if(maxI != -1){
					if(this.gradient[maxI] > 0)
						this.gradient[maxI] = 1;
					else
						this.gradient[maxI] = -1;
				}
				else{
					console.log("Zeros?!!?")
				}
			}

			return this.clampValues(this.addGradient(this.tried[this.lastEffective].values));
		}
		else if(!this.gradient){
			//if no graident find gradient with twittle

			var next = this.tried[this.lastEffective].values.slice();

			next[this.twittle] += this.Values[this.twittle].Step;

			this.twittle++;

			// console.log(this.tried[this.lastEffective], this.lastEffective);

			//return twittled value
			return next;
		}

		var output = this.clampValues(this.addGradient(this.tried[this.lastEffective].values));

		this.prevEffective = this.lastEffective;
		this.lastEffective = this.onInteration;

		return output;
		
	}

	//used potentially intelligent gradient searches
	NextPoint(){
		var currValue;
		//Not enough points for a gradient so twittle values
		if(this.Values.length >= this.tried.length){

			currValue = this.tried[0]['values'];

			currValue[this.tried.length - 1] += this.Values[this.tried.length - 1].Step;

			return this.clampValues(currValue);
		}
		//calculate a initial gradient
		else if(this.Values.length + 1 == this.tried.length){
			var Delta = [];

			// console.log(this.tried)
			//get Delta
			for (var i = 0; i < this.Values.length; i++){
				Delta.push(this.tried[0].value - this.tried[i+1].value);
			}


			var max = Delta.reduce((prev, curr)=>{
				if (Math.abs(prev) > Math.abs(curr)){
					return prev;
				}

				return curr;
			});

			this.gradient = Delta.map((val, index)=>{
				var delta = val / Math.abs(max) * this.Values[index].Step;
				if (this.Values[index].type == "Integer")
					return Math.round(delta);
				return delta;
			});



			// console.log(this.gradient)
			return this.clampValues(this.addGradient(this.tried[0].values));
		}


		//work on new gradient
		if(!this.gradient){
			currValue = this.tried[this.tried.length - 1].values;
		}
		//need to find a new gradient (hit an upslope)
		else if(this.tried[this.tried.length - 1].value > this.tried[this.tried.length - 2].value){
			// console.log(this.tried[this.tried.length - 1]);
			this.gradient = undefined;
			this.twittleFor = this.Values.length - 1;

			currValue = this.tried[this.tried.length - 1].values;
		}
		//we have a feasable gradient
		else{
			currValue = this.addGradient(this.tried[this.tried.length - 1].values);
			console.log(currValue);
		}

		return this.clampValues(currValue);
	}

	addGradient(values){
		return values.map((val, i)=>{
			return val + this.gradient[i];
		})
	}

	clampValues(values){
		for (var i = 0; i < values.length; i++){

			if(this.Values[i].type == "Integer"){
				values[i] = Math.round(values[i]);
			}

			if(values[i] > this.Values[i].upperBound){
				values[i] = this.Values[i].upperBound;
			}
			else if(values[i] < this.Values[i].lowerBound){
				values[i] = this.Values[i].lowerBound;
			}

		}

		return values;
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
