const calcXRange = (minX, maxX, fx, step) => {
	let counter = 0,
		maxCount = 10
	let currentMin = minX,
		currentMax = maxX
	while (Math.abs(Math.abs(fx(currentMin)) - Math.abs(fx(currentMax))) > 10) {

		if (counter++ > maxCount) {
			currentMin = minX
			currentMax = maxX
			console.log('break')
			break
		}

		if (Math.abs(fx(currentMin)) < Math.abs(fx(currentMax))) {
			currentMin--
		} else {
			currentMax++
		}

	}

	return currentMin, currentMax

}

const quadraticSolve = (a, b, c) => {
	let result = [],
		delta = b * b - 4 * a * c

	if (a == 0 && b != 0)
		result.push(0)

	else if (delta > 0) {
		result.push(-(b - Math.sqrt(delta)) / (2.0 * a))
		result.push(-(b + Math.sqrt(delta)) / (2.0 * a))
	}

	return result

}

const solveCubic = (a, b, c, d) => {
	if (Math.abs(a) < 1e-8) { 
		a = b;
		b = c;
		c = d;
		if (Math.abs(a) < 1e-8) { 
			a = b;
			b = c;
			if (Math.abs(a) < 1e-8) 
				return [];
			return [-b / a];
		}

		var D = b * b - 4 * a * c;
		if (Math.abs(D) < 1e-8)
			return [-b / (2 * a)];
		else if (D > 0)
			return [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)];
		return [];
	}

	var p = (3 * a * c - b * b) / (3 * a * a);
	var q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
	var roots;

	if (Math.abs(p) < 1e-8) { 
		roots = [Math.cbrt(-q)];
	} else if (Math.abs(q) < 1e-8) { 
		roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
	} else {
		var D = q * q / 4 + p * p * p / 27;
		if (Math.abs(D) < 1e-8) { 
			roots = [-1.5 * q / p, 3 * q / p];
		} else if (D > 0) { 
			var u = Math.cbrt(-q / 2 - Math.sqrt(D));
			roots = [u - p / (3 * u)];
		} else { 
			var u = 2 * Math.sqrt(-p / 3);
			var t = Math.acos(3 * q / p / u) / 3; 
			var k = 2 * Math.PI / 3;
			roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)];
		}
	}

	for (var i = 0; i < roots.length; i++)
		roots[i] -= b / (3 * a);

	return roots;
}

const XoAxis = {

	type: 'line',
	scaleID: 'x',
	borderWidth: 1,
	borderColor: 'black',
	value: 0,
	label: {
		position: 'start',
		content: 'X',
		enabled: false
	}
}

const YoAxis = {
	type: 'line',
	scaleID: 'y',
	borderWidth: 1,
	borderColor: 'black',
	value: 0,
	label: {
		position: 'end',
		content: 'Y',
		enabled: false
	}
}

export { calcXRange, quadraticSolve, solveCubic, XoAxis, YoAxis };