"use strict";

var WebWorkerContext = require("./WebWorkerContext");

function AsmJSContext(options, callback) {
	var self = this;
	this._worker = new Worker(AsmJSContext.getWorkerURL(options.baseUrl));
	this._worker.addEventListener("message", function(e) {
		self._messagingContext._onMessage(e);
	}, true);
	this._messagingContext = new WebWorkerContext(options, function(message) {
		self._worker.postMessage(message);
	}, callback);
	document.body.appendChild(this._worker);
}

AsmJSContext.isSupported = function() {
	try {
		var userAgent = window.navigator.userAgent;
		var userAgentComponents = userAgent.split(/\s+/);
		var firefoxRegexp = /[Ff]irefox\/(\d+)/g;
		for (var i = 0; i < userAgentComponents.length; ++i) {
			var component = userAgentComponents[i];
			var match = firefoxRegexp.exec(component);
			if (match !== null) {
				var firefoxVersion = parseInt(match[1]);
				return firefoxVersion >= 29;
			}
		}
		return false;
	} catch (e) {
	}
	return false;
};

AsmJSContext.getWorkerURL = function(baseUrl) {
	if (baseUrl) {
		return baseUrl + "AsmJSWorker.js";
	} else {
		return "AsmJSWorker.js";
	}
};

AsmJSContext.prototype.empty = function(shape, dataType) {
	return this._messagingContext.empty(shape, dataType);
};

AsmJSContext.prototype.zeros = function(shape, dataType) {
	return this._messagingContext.zeros(shape, dataType);
};

AsmJSContext.prototype.ones = function(shape, dataType) {
	return this._messagingContext.ones(shape, dataType);
};

AsmJSContext.prototype.eye = function(rows, columns, diagonal, dataType) {
	return this._messagingContext.eye(rows, columns, diagonal, dataType);
};

AsmJSContext.prototype.array = function(data, dataType) {
	return this._messagingContext.array(data, dataType);
};

AsmJSContext.prototype.linspace = function(start, stop, samples, closed) {
	return this._messagingContext.linspace(start, stop, samples, closed);
};

AsmJSContext.prototype.reshape = function(a, shape) {
	return this._messagingContext.reshape(a, shape);
};

AsmJSContext.prototype.repeat = function(a, repeats, axis, out) {
	return this._messagingContext.repeat(a, repeats, axis, out);
};

AsmJSContext.prototype._invalidate = function(array) {
	return this._messagingContext._invalidate(array);
};

AsmJSContext.prototype.fetch = function() {
	this._messagingContext.fetch.apply(this._messagingContext, arguments);
};

AsmJSContext.prototype.get = function() {
	this._messagingContext.get.apply(this._messagingContext, arguments);
};

AsmJSContext.prototype.info = function(callback) {
	this._messagingContext.info(callback);
};

AsmJSContext.prototype.barrier = function(callback) {
	this._messagingContext.barrier(callback);
};

AsmJSContext.prototype.add = function(a, b, out) {
	return this._messagingContext.add(a, b, out);
};

AsmJSContext.prototype.sub = function(a, b, out) {
	return this._messagingContext.sub(a, b, out);
};

AsmJSContext.prototype.mul = function(a, b, out) {
	return this._messagingContext.mul(a, b, out);
};

AsmJSContext.prototype.div = function(a, b, out) {
	return this._messagingContext.div(a, b, out);
};

AsmJSContext.prototype.neg = function(a, out) {
	return this._messagingContext.neg(a, out);
};

AsmJSContext.prototype.abs = function(a, out) {
	return this._messagingContext.abs(a, out);
};

AsmJSContext.prototype.exp = function(a, out) {
	return this._messagingContext.exp(a, out);
};

AsmJSContext.prototype.log = function(a, out) {
	return this._messagingContext.log(a, out);
};

AsmJSContext.prototype.sqrt = function(a, out) {
	return this._messagingContext.sqrt(a, out);
};

AsmJSContext.prototype.square = function(a, out) {
	return this._messagingContext.square(a, out);
};

AsmJSContext.prototype.min = function(a, axis) {
	return this._messagingContext.min(a, axis);
};

AsmJSContext.prototype.max = function(a, axis) {
	return this._messagingContext.max(a, axis);
};

AsmJSContext.prototype.sum = function(a, axis) {
	return this._messagingContext.sum(a, axis);
};

AsmJSContext.prototype.dot = function(a, b, out) {
	return this._messagingContext.dot(a, b, out);
};

AsmJSContext.prototype.solveTriangular = function(a, b, triangularKind, transposeKind, unitDiagonal, out) {
	return this._messagingContext.solveTriangular(a, b, triangularKind, transposeKind, unitDiagonal, out);
};

AsmJSContext.prototype.cholesky = function(a, kind, out) {
	return this._messagingContext.cholesky(a, kind, out);
};

module.exports = AsmJSContext;