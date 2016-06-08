var gaussian = require('gaussian');

module.exports = {
	Sink: function(variables, center, depth, width, vertshift){
		if (center.length != variables) return;
		if (width.length != variables) return;

		return function(values){
			if (values.length != variables) return NaN;

			exponent = 0;

			for(var i = 0; i < variables; i++){
				exponent += Math.pow(((values[i] - center[i]) * Math.E / width[i]), 2);
			}

			return -depth * Math.pow(Math.E, -exponent) + vertshift;
		}
	},

	Noise: function(mean, variance, range){
		var dist = gaussian(mean, variance);
		console.log(typeof(range));
		if (typeof(range) == "array"){
			if(range[0] > range[1]){
				var temp = range[0];
				range[0] = range[1];
				range[1] = temp;
			}
		}

		return function(values){
			var number = dist.ppf(Math.random());

			if (typeof(range) == "array"){
				if(number < range[0]) return range[0];
				if(number > range[1]) return range[1];
			}
				return number;
		};
	},
}
