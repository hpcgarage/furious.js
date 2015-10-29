"use strict";

/**
 * JavaScript implementation of computational methods
 *
 * @private
 * @class JSMath
 */

/**
 * Sets all array elements to the specified value.
 *
 * @param {ArrayBufferView} data - the array data buffer.
 * @param {Number} value - the constant to fill the buffer with.
 *
 * @private
 * @static
 * @method fill
 */
exports.fill = function(data, value) {
	var n = data.length;
	for (var i = 0; i < n; ++i) {
		data[i] = value;
	}
};

/**
 * Sets diagonal elements to the specified value
 *
 * @param {ArrayBufferView} data - the array data buffer.
 * @param {Number} rows - the number of rows in the array.
 * @param {Number} columns - the number of columns in the array.
 * @param {Number} diagonal - offset of the diagonal to operate on.
 * @param {Number} value - the constant to fill the diagonal with.
 *
 * @private
 * @static
 * @method fillDiagonal
 */
exports.fillDiagonal = function(data, rows, columns, diagonal, value) {
	if (diagonal === 0) {
		var imax = Math.min(rows, columns);
		for (var i = 0; i < imax; ++i) {
			data[i*columns+i] = value;
		}
	} else if (diagonal > 0) {
		var imax = Math.min(rows, columns - diagonal);
		for (var i = 0; i < imax; ++i) {
			data[i*columns+i+diagonal] = value;
		}
	} else {
		var imax = Math.min(rows + diagonal, columns);
		for (var i = 0; i < imax; ++i) {
			data[(i - diagonal)*columns+i] = value;
		}
	}
};

/**
 * Adds two arrays.
 *
 * @param {ArrayBufferView} dataA - the input augend array.
 * @param {ArrayBufferView} dataB - the input addend array.
 * @param {ArrayBufferView} dataOut - the output sum array.
 *
 * @private
 * @static
 * @method add
 */
exports.add = function(dataA, dataB, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = dataA[i] + dataB[i];
	}
};

/**
 * Adds a constant to an array.
 *
 * @param {ArrayBufferView} dataA - the input augend array.
 * @param {Number} valueB - the addend constant.
 * @param {ArrayBufferView} dataOut - the output sum array.
 *
 * @private
 * @static
 * @method addConst
 */
exports.addConst = function(dataA, valueB, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = dataA[i] + valueB;
	}
};

/**
 * Subtracts two arrays.
 *
 * @param {ArrayBufferView} dataA - the input minuend array.
 * @param {ArrayBufferView} dataB - the input subtrahend array.
 * @param {ArrayBufferView} dataOut - the output difference array.
 *
 * @private
 * @static
 * @method sub
 */
exports.sub = function(dataA, dataB, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = dataA[i] - dataB[i];
	}
};

/**
 * Subtracts a constant from an array.
 *
 * @param {ArrayBufferView} dataA - the input minuend array.
 * @param {Number} valueB - the subtrahend constant.
 * @param {ArrayBufferView} dataOut - the output difference array.
 *
 * @private
 * @static
 * @method subConst
 */
exports.subConst = function(dataA, valueB, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = dataA[i] - valueB;
	}
};

/**
 * Subtracts an array from a constant.
 *
 * @param {ArrayBufferView} dataA - the input subtrahend array.
 * @param {Number} valueB - the minuend constant.
 * @param {ArrayBufferView} dataOut - the output difference array.
 *
 * @private
 * @static
 * @method subRevConst
 */
exports.subRevConst = function(dataA, valueB, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = valueB - dataA[i];
	}
};

/**
 * Multiplies two arrays.
 *
 * @param {ArrayBufferView} dataA - the input multiplicand array.
 * @param {ArrayBufferView} dataB - the input multiplier array.
 * @param {ArrayBufferView} dataOut - the output product array.
 *
 * @private
 * @static
 * @method mul
 */
exports.mul = function(dataA, dataB, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = dataA[i] * dataB[i];
	}
};

/**
 * Multiplies an array by a constant.
 *
 * @param {ArrayBufferView} dataA - the input multiplicand array.
 * @param {Number} valueB - the multiplier constant.
 * @param {ArrayBufferView} dataOut - the output product array.
 *
 * @private
 * @static
 * @method mulConst
 */
exports.mulConst = function(dataA, valueB, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = dataA[i] * valueB;
	}
};

/**
 * Divides two arrays.
 *
 * @param {ArrayBufferView} dataA - the input dividend array.
 * @param {ArrayBufferView} dataB - the input divisor array.
 * @param {ArrayBufferView} dataOut - the output quotient array.
 *
 * @private
 * @static
 * @method div
 */
exports.div = function(dataA, dataB, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = dataA[i] / dataB[i];
	}
};

/**
 * Divides an array by a constant.
 *
 * @param {ArrayBufferView} dataA - the input dividend array.
 * @param {Number} valueB - the divisor constant.
 * @param {ArrayBufferView} dataOut - the output quotient array.
 *
 * @private
 * @static
 * @method divConst
 */
exports.divConst = function(dataA, valueB, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = dataA[i] / valueB;
	}
};

/**
 * Divides a constant by an array.
 *
 * @param {ArrayBufferView} dataA - the input divisor array.
 * @param {Number} valueB - the dividend constant.
 * @param {ArrayBufferView} dataOut - the output quotient array.
 *
 * @private
 * @static
 * @method divRevConst
 */
exports.divRevConst = function(dataA, valueB, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = valueB / dataA[i];
	}
};

//oops
exports.matrixPower = function(dataA, dataB, dataOut) { return dataA; };

//what every matrixpower needs to map to
exports.matrixPowerConst = function(dataA, valueB, dataOut) {
	//need stride values, reimplement as non-binary func
};
//oops again
exports.matrixPowerRevConst = function(dataA, dataB, dataOut) { return dataA; };

//map all to roundConst
exports.round = function(dataA, dataB, dataOut) { return dataA; };
exports.roundRevConst = function(dataA, valueB, dataOut) { return dataA; };
exports.roundConst = function(dataA, valueB, dataOut) {
	var n = dataOut.length;
	var offset = Math.pow(10, valueB);
	for(var i = 0; i < n; ++i) {
		dataOut[i] = Math.round(dataA[i] * offset)/offset;
	}
};

exports.logaddexp = function(dataA, dataB, dataOut) {
	var n = dataOut.length;
	for(var i = 0; i  < n; ++i) {
		dataOut[i] = Math.log(Math.exp(dataA[i] + dataB[i]));
	}
};

exports.laeConst = function(dataA, valueB, dataOut) {
	var n = dataOut.length;
	for(var i = 0; i < n; ++i) {
		dataOut[i] = Math.log(Math.exp(dataA[i] + Math.exp(valueB)));
	}
};
//remove
exports.laeRevConst = function(dataA, valueB, dataOut) { return dataA; };

exports.logaddexp2 = function(dataA, dataB, dataOut) {
	var n = dataOut.length;
	for(var i = 0; i < n; ++i) {
		dataOut[i] = Math.log(Math.exp(dataA[i] + dataB[i]))/Math.log(2);
	}
};

exports.lae2Const = function(dataA, valueB, dataOut) {
	var n = dataOut.length;
	for(var i = 0; i < n; ++i){
		dataOut[i] = Math.log(Math.exp(dataA[i] + Math.exp(valueB)))/Math.log(2);
	}
};

/**
 * Negates an array.
 *
 * @param {ArrayBufferView} dataA - the input array.
 * @param {ArrayBufferView} dataOut - the output array.
 *
 * @private
 * @static
 * @method neg
 */
exports.neg = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = -dataA[i];
	}
};

/**
 * Computes absolute value of array elements.
 *
 * @param {ArrayBufferView} dataA - the input array.
 * @param {ArrayBufferView} dataOut - the output array.
 *
 * @private
 * @static
 * @method abs
 */
exports.abs = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.abs(dataA[i]);
	}
};

/**
 * Exponentiates array elements.
 *
 * @param {ArrayBufferView} dataA - the input array.
 * @param {ArrayBufferView} dataOut - the output array.
 *
 * @private
 * @static
 * @method exp
 */
exports.exp = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.exp(dataA[i]);
	}
};

var expm1ES5 = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.exp(dataA[i]) - 1;
	}
};

var expm1ES6 = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.expm1(dataA[i]);
	}
};

exports.expm1 = function(dataA, dataOut) {
	if (typeof Math.expm1 !== "undefined") {
		expm1ES6(dataA, dataOut);
	} else {
		expm1ES5(dataA, dataOut);
	}
};

exports.exp2 = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.pow(2, dataA[i]);
	}
};

/**
 * Computes logarithm of array elements.
 *
 * @param {ArrayBufferView} dataA - the input array.
 * @param {ArrayBufferView} dataOut - the output array.
 *
 * @private
 * @static
 * @method log
 */
exports.log = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.log(dataA[i]);
	}
};

var log10ES5 = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.log(dataA[i]) / Math.LN10;
	}
};

var log10ES6 = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.log10(dataA[i]);
	}
};

exports.log10 = function(dataA, dataOut) {
	if (typeof Math.log10 !== "undefined") {
		log10ES6(dataA, dataOut);
	} else {
		log10ES5(dataA, dataOut);
	}
};

var log2ES5 = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.log(dataA[i]) / Math.LN2;
	}
};

var log2ES6 = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.log2(dataA[i]);
	}
};

exports.log2 = function(dataA, dataOut) {
	if (typeof Math.log2 !== "undefined") {
		log2ES6(dataA, dataOut);
	} else {
		log2ES5(dataA, dataOut);
	}
};

var log1pES5 = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = 1.0 + Math.log(dataA[i]);
	}
};

var log1pES6 = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.log1p(dataA[i]);
	}
};

exports.log1p = function(dataA, dataOut) {
	if (typeof Math.log1p !== "undefined") {
		log1pES6(dataA, dataOut);
	} else {
		log1pES5(dataA, dataOut);
	}
};

/**
 * Computes square root of array elements.
 *
 * @param {ArrayBufferView} dataA - the input array.
 * @param {ArrayBufferView} dataOut - the output array.
 *
 * @private
 * @static
 * @method sqrt
 */
exports.sqrt = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.sqrt(dataA[i]);
	}
};

/**
 * Squares array elements.
 *
 * @param {ArrayBufferView} dataA - the input array.
 * @param {ArrayBufferView} dataOut - the output array.
 *
 * @private
 * @static
 * @method square
 */
exports.square = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		var a = dataA[i];
		dataOut[i] = a * a;
	}
};

exports.sin = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.sin(dataA[i]);
	}
};

exports.cos = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.cos(dataA[i]);
	}
};

exports.tan = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.tan(dataA[i]);
	}
};

exports.arcsin = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.asin(dataA[i]);
	}
};

exports.arccos = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.acos(dataA[i]);
	}
};

exports.arctan = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.atan(dataA[i]);
	}
};

exports.degrees = function(dataA, dataOut) {
	var n = dataOut.length;
	var factor = 180.0 / Math.PI;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = dataA[i] * factor;
	}
};

exports.radians = function(dataA, dataOut) {
	var n = dataOut.length;
	var factor = Math.PI / 180.0;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = dataA[i] * factor;
	}
};

exports.rint = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.round(dataA[i]);
	}
};

exports.floor = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.floor(dataA[i]);
	}
};

exports.ceil = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.ceil(dataA[i]);
	}
};

var truncES5 = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		var a = dataA[i];
		dataOut[i] = a < 0.0 ? Math.ceil(a) : Math.floor(a);
	}
};

var truncES6 = function(dataA, dataOut) {
	var n = dataOut.length;
	for (var i = 0; i < n; ++i) {
		dataOut[i] = Math.trunc(dataA[i]);
	}
};

exports.trunc = function(dataA, dataOut) {
	if (typeof Math.trunc !== "undefined") {
		truncES6(dataA, dataOut);
	} else {
		truncES5(dataA, dataOut);
	}
};

exports.fix = exports.trunc;

/**
 * Computes the minimum value of elements in an array.
 *
 * @param {ArrayBufferView} dataA - the input array to compute minimum on.
 * @param {ArrayBufferView} dataOut - the output array to store the minimum at.
 *
 * @private
 * @static
 * @method min
 */
exports.min = function(dataA, dataOut) {
	/* Computation of all-array min */
	var lengthA = dataA.length;
	var result = dataA[0];
	for (var i = 1; i < lengthA; ++i) {
		result = Math.min(result, dataA[i]);
	}
	dataOut[0] = result;
};

/**
 * Computes the maximum value of elements in an array.
 *
 * @param {ArrayBufferView} dataA - the input array to compute maximum on.
 * @param {ArrayBufferView} dataOut - the output array to store the maximum at.
 *
 * @private
 * @static
 * @method max
 */
exports.max = function(dataA, dataOut) {
	/* Computation of all-array min */
	var lengthA = dataA.length;
	var result = dataA[0];
	for (var i = 1; i < lengthA; ++i) {
		result = Math.max(result, dataA[i]);
	}
	dataOut[0] = result;
};

/**
 * Computes the sum of elements in an array.
 *
 * @param {ArrayBufferView} dataA - the input array with elements to sum up.
 * @param {ArrayBufferView} dataOut - the output array to store the sum at.
 *
 * @private
 * @static
 * @method min
 */
exports.sum = function(dataA, dataOut) {
	var lengthA = dataA.length;
	var result = 0.0;
	for (var i = 0; i < lengthA; ++i) {
		result += dataA[i];
	}
	dataOut[0] = result;
};

/**
 * Computes the minimum value of elements along an axis.
 *
 * @param {ArrayBufferView} dataA - the input array to compute minima on.
 * @param {ArrayBufferView} dataOut - the output array to store the minima at.
 * @param {Number} outerStride - the product of input array dimensions preceeding the reduction dimension.
 * @param {Number} innerStride - the product of input array dimensions following the reduction dimension.
 * @param {Number} reductionDim - the length of input array along the reduction dimension.
 *
 * @private
 * @static
 * @method axisMin
 */
exports.axisMin = function(dataA, dataOut, outerStride, innerStride, reductionDim) {
	for (var i = 0; i < outerStride; ++i) {
		for (var k = 0; k < innerStride; ++k) {
			var offset = i * reductionDim * innerStride + k;
			var currentMin = dataA[offset];
			for (var j = 1; j < reductionDim; ++j) {
				offset += innerStride;
				currentMin = Math.min(currentMin, dataA[offset]);
			}
			dataOut[i * innerStride + k] = currentMin;
		}
	}
};

/**
 * Computes the maximum value of elements along an axis.
 *
 * @param {ArrayBufferView} dataA - the input array to compute maxima on.
 * @param {ArrayBufferView} dataOut - the output array to store the maxima at.
 * @param {Number} outerStride - the product of input array dimensions preceeding the reduction dimension.
 * @param {Number} innerStride - the product of input array dimensions following the reduction dimension.
 * @param {Number} reductionDim - the length of input array along the reduction dimension.
 *
 * @private
 * @static
 * @method axisMax
 */
exports.axisMax = function(dataA, dataOut, outerStride, innerStride, reductionDim) {
	for (var i = 0; i < outerStride; ++i) {
		for (var k = 0; k < innerStride; ++k) {
			var offset = i * reductionDim * innerStride + k;
			var currentMax = dataA[offset];
			for (var j = 1; j < reductionDim; ++j) {
				offset += innerStride;
				currentMax = Math.max(currentMax, dataA[offset]);
			}
			dataOut[i * innerStride + k] = currentMax;
		}
	}
};

/**
 * Computes the sum of elements along an axis.
 *
 * @param {ArrayBufferView} dataA - the input array to sum up.
 * @param {ArrayBufferView} dataOut - the output array to store the sums at.
 * @param {Number} outerStride - the product of input array dimensions preceeding the reduction dimension.
 * @param {Number} innerStride - the product of input array dimensions following the reduction dimension.
 * @param {Number} reductionDim - the length of input array along the reduction dimension.
 *
 * @private
 * @static
 * @method axisSum
 */
exports.axisSum = function(dataA, dataOut, outerStride, innerStride, reductionDim) {
	for (var i = 0; i < outerStride; ++i) {
		for (var k = 0; k < innerStride; ++k) {
			var offset = i * reductionDim * innerStride + k;
			var currentSum = dataA[offset];
			for (var j = 1; j < reductionDim; ++j) {
				offset += innerStride;
				currentSum += dataA[offset];
			}
			dataOut[i * innerStride + k] = currentSum;
		}
	}
};

/**
 * Computes the dot product of two N-dimensional arrays.
 *
 * @param {ArrayBufferView} dataA - an input multiplicand array.
 * @param {ArrayBufferView} dataB - an input multiplier array.
 * @param {ArrayBufferView} dataOut - the output product array.
 * @param {Number} strideA - the product of the the multiplicand dimensions preceeding the reduction dimension.
 * @param {Number} outerStrideB - the product of the multiplier dimensions preceeding the reduction dimension.
 * @param {Number} innerStrideB - the product of the multiplier dimensions following the reduction dimension.
 * @param {Number} reductionDim - the length of inputs arrays along the reduction dimension.
 *
 * @private
 * @static
 * @method dot
 */
exports.dot = function(dataA, dataB, dataOut, strideA, outerStrideB, innerStrideB, reductionDim) {
	for (var i = 0; i < strideA; ++i) {
		for (var j = 0; j < reductionDim; ++j) {
			for (var k = 0; k < outerStrideB; ++k) {
				for (var l = 0; l < innerStrideB; ++l) {
					dataOut[(i*outerStrideB + k) * innerStrideB + l] += dataA[i*reductionDim+j] * dataB[(k*reductionDim+j)*innerStrideB+l];
				}
			}
		}
	}
};

/**
 * Replicates array elements along an axis.
 *
 * @param {ArrayBufferView} dataA - the input array.
 * @param {ArrayBufferView} dataOut - the output array for repeated elements.
 * @param {Number} outerStride - the product of input array dimensions preceeding the expansion dimension.
 * @param {Number} innerStride - the product of input array dimensions following the expansion dimension.
 * @param {Number} expansionDim - the length of input array along the expansion dimension.
 * @param {Number} repeats - the number of times each element will be replicated.
 *
 * @private
 * @static
 * @method repeat
 */
exports.repeat = function(dataA, dataOut, outerStride, innerStride, expansionDim, repeats) {
	if (innerStride < repeats) {
		for (var i = 0; i < outerStride; ++i) {
			for (var j = 0; j < expansionDim; ++j) {
				for (var k = 0; k < innerStride; ++k) {
					var valueA = dataA[(i * expansionDim + j) * innerStride + k];
					for (var c = 0; c < repeats; ++c) {
						dataOut[((i * expansionDim + j) * repeats + c) * innerStride + k] = valueA;
					}
				}
			}
		}
	} else {
		for (var i = 0; i < outerStride; ++i) {
			for (var j = 0; j < expansionDim; ++j) {
				var rowA = dataA.subarray((i * expansionDim + j) * innerStride, (i * expansionDim + j + 1) * innerStride);
				for (var c = 0; c < repeats; ++c) {
					dataOut.set(rowA, ((i * expansionDim + j) * repeats + c) * innerStride);
				}
			}
		}
	}
};

/**
 * Solves a triangular system of equations.
 *
 * @param {ArrayBufferView} dataA - the NxN triangular matrix that defines the system.
 * @param {ArrayBufferView} dataB - the NxM matrix of right-hand sides.
 * @param {Number} rows - the number of rows (*N*) in the matrices.
 * @param {Number} columns - the number of columns (*M*) in the right-hand sides matrix.
 * @param {Boolean} transpose - indicator of whether the matrix **a** must be transposed.
 * @param {Boolean} lower - indicator of whether a lower or upper decomposition is to be computed.
 * @param {Boolean} unitDiagonal - specifies if the diagonal elements are implied to equal 1.
 *
 * @private
 * @static
 * @method solveTriangular
 */
exports.solveTriangular = function(dataA, dataB, rows, columns, transpose, lower, unitDiagonal) {
	if (lower) {
		if (transpose) {
			for (var i = rows - 1; i >= 0; --i) {
				for (var k = 0; k < columns; ++k){
					var Xii = dataB[i*columns+k];
					for (var j = rows - 1; j > i; --j) {
						Xii -= dataA[j*rows+i] * dataB[j*columns+k];
					}
					dataB[i*columns+k] = unitDiagonal ? Xii : Xii / dataA[i*rows+i];
				}
			}
		} else {
			for (var i = 0; i < rows; ++i) {
				for (var k = 0; k < columns; ++k){
					var Xii = dataB[i*columns+k];
					for (var j = 0; j < i; ++j) {
						Xii -= dataA[i*rows+j] * dataB[j*columns+k];
					}
					dataB[i*columns+k] = unitDiagonal ? Xii : Xii / dataA[i*rows+i];
				}
			}
		}
	} else {
		if (transpose) {
			for (var i = 0; i < rows; ++i) {
				for (var k = 0; k < columns; ++k){
					var Xii = dataB[i*columns+k];
					for (var j = 0; j < i; ++j) {
						Xii -= dataA[j*rows+i] * dataB[j*columns+k];
					}
					dataB[i*columns+k] = unitDiagonal ? Xii : Xii / dataA[i*rows+i];
				}
			}
		} else {
			for (var i = rows - 1; i >= 0; --i) {
				for (var k = 0; k < columns; ++k){
					var Xii = dataB[i*columns+k];
					for (var j = rows - 1; j > i; --j) {
						Xii -= dataA[i*rows+j] * dataB[j*columns+k];
					}
					dataB[i*columns+k] = unitDiagonal ? Xii : Xii / dataA[i*rows+i];
				}
			}
		}
	}
};


/**
 * Computes upper or lower LUP decomposition.
 *
 * @param {ArrayBufferView} data - the matrix to be factored. Also where L matrix will be output.
 * @param {ArrayBufferView} outU - Where to output U matrix.
 * @param {ArrayBufferView} outP - Where to output P matrix.
 * @param {Number} n - the number of rows and columns in the arrays.
 * @param {Boolean} lower - indicator of whether a lower or upper decomposition is to be computed.
 *
 * @private
 * @static
 * @method lupdecomposition
 */
exports.lupdecomposition = function(data, outU, outP, n) {
	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			outU[i*n + j] = 0;
			outP[i*n + j] = 0;
		}
		outP[i*n + i] = 1;
	}

	for (var i = 0; i < n; i++) {
		var jMax = i;
		for (var j = i; j < n; j++) {
			if (Math.abs(data[j*n + i]) > Math.abs(data[jMax*n + i])) 
				jMax = j;
		}
		if (jMax != i) {
			for (var k = 0; k < n; k++) {
				var tmp = outP[i*n + k];
				outP[i*n + k] = outP[jMax*n + k];
				outP[jMax*n + k] = tmp;
			}
		}
	}

	var Aprime = [];
	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			Aprime[i*n + j] = 0;
			for (var k = 0; k < n; k++) {
				Aprime[i*n + j] += outP[i*n + k] * data[k*n + j];
			}
		}
	}
 
	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			data[i*n + j] = 0;
		}
		data[i*n + i] = 1;
	}

	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			var s;
			if (j <= i) {
				s = 0;
				for (var k = 0; k < j; k++) {
					s += data[j*n + k] * outU[k*n + i];
				}
				outU[j*n + i] = Aprime[j*n + i] - s;
			}
			if (j >= i) {
				s = 0;
				for (var k = 0; k < j; k++) {
					s += data[j*n + k] * outU[k*n + i];
				}
				data[j*n + i] = (Aprime[j*n + i] - s) / outU[i*n + i];
			}
		}
	}
};


/**
 * Computes upper or lower cholesky decomposition.
 *
 * @param {ArrayBufferView} data - the matrix to be factored.
 * @param {Number} n - the number of rows and columns in the arrays.
 * @param {Boolean} lower - indicator of whether a lower or upper decomposition is to be computed.
 *
 * @private
 * @static
 * @method cholesky
 */
exports.cholesky = function(data, n, lower) {
	for (var i = 0; i < n; ++i) {
		/* Compute the diagonal value */
		var Lii = Math.sqrt(data[i*n+i]);
		data[i*n+i] = Lii;
		/* Update the ith column */
		for (var j = i + 1; j < n; ++j) {
			data[j*n+i] /= Lii;
		}
		/* Update the ith row */
		for (var j = i + 1; j < n; ++j) {
			data[i*n+j] /= Lii;
		}
		/* Compute Schur complement */
		for (var j = i + 1; j < n; ++j) {
			for (var k = i + 1; k < n; ++k) {
				data[j*n+k] -= data[j*n+i] * data[i*n+k];
			}
		}
	}
	if (lower) {
		/* Zero-out the upper sub-diagonals */
		for (var i = 0; i < n; ++i) {
			for (var j = i + 1; j < n; ++j) {
				data[i*n+j] = 0.0;
			}
		}
	} else {
		/* Zero-out the lower sub-diagonals */
		for (var i = 0; i < n; ++i) {
			for (var j = 0; j < i; ++j) {
				data[i*n+j] = 0.0;
			}
		}
	}
};

