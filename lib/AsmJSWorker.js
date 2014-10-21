var util = require("./../util");
var jsmath = require("./jsmath");
var MaybeNDArray = require("./MaybeNDArray");
var DataType = require("./../DataType");
var requests = require("./../requests.pb");
var Request = requests.Request;
var EmptyArrayRequest = requests.EmptyArrayRequest;
var DataArrayRequest = requests.DataArrayRequest;
var ConstArrayRequest = requests.ConstArrayRequest;
var LinspaceRequest = requests.LinspaceRequest;
var ReshapeRequest = requests.ReshapeRequest;
var RepeatRequest = requests.RepeatRequest;
var DeallocateRequest = requests.DeallocateRequest;
var FetchRequest = requests.FetchRequest;
var BinaryOperationRequest = requests.BinaryOperationRequest;
var BinaryConstOperationRequest = requests.BinaryConstOperationRequest;
var UnaryOperationRequest = requests.UnaryOperationRequest;
var ReductionRequest = requests.ReductionRequest;
var AxisReductionRequest = requests.AxisReductionRequest;
var DotOperationRequest = requests.DotOperationRequest;
var responses = require("./../responses.pb");
var Response = responses.Response;
var FetchResponse = responses.FetchResponse;
var ErrorResponse = responses.ErrorResponse;
var InitResponse = responses.InitResponse;
var InfoResponse = responses.InfoResponse;

function printOutcome(returnVal) {
	if (returnVal == 1) {
		console.log("Success");
	} else if (returnVal == 0) {
		console.log("Failed");
	}

}
function storeEmptyArray(requestId, idOut, shape, dataType) {
	shape = util.checkShape(shape);
	dataType = util.checkDataType(dataType);
	var length = util.computeLength(shape);
	var offset = Module._malloc(length * dataType.size);
	var createEmptyArray = Module.cwrap('createEmptyArray','number',['number','number','number','number']);
	printOutcome(createEmptyArray(length,idOut,offset,dataType));
	Module._free(offset);
}

function storeConstArray(requestId, idOut, shape, dataType, fillValue) {
	shape = util.checkShape(shape);
	dataType = util.checkDataType(dataType);
	var length = util.computeLength(shape);
	if (arrayOut.hasData()) {
		if (fillValue !== 0.0) {
			var offset = Module._malloc(8 * length);
			var createConstArray = Module.cwrap('createConstArray','number',['number','number','number','number']);
			printOutcome(createConstArray(idOut,offset,dataType,fillValue));
			Module._free(offset);
		}
	}
}

/**
 * 
 */
function storeDataArray(requestId, idOut, shape, dataType, dataBuffer) {
	shape = util.checkShape(shape);
	dataType = util.checkDataType(dataType);
	var length = util.computeLength(shape);
	var data = new dataType.arrayType(dataBuffer.byteLength);
	var shapeOffset = Module._malloc(length * dataType.size);
	var dataBufferOffset = Module._malloc(length * data.size);
	var createDataArray = Module.cwrap('createDataArray', 'number', ['number','number','number','number']);
	printOutcome(createDataArray(idout,shapeOffset,dataType,dataBufferOffset));
	Module._free(shapeOffset);
	Module._free(dataBufferOffset);
}

function fetchArray(idOut) {
	var fetchArray = Module.cwrap('retrieveArray','number', ['number']);
	var pointer=fetchArray(idOut);
	return getValue(pointer,'i8');
}

function storeIdentityMatrix(requestId, idOut, rows, columns, diagonal, dataType) {
	dataType = util.checkDataType(dataType);
	var storeIdentityMatrix = Module.cwrap('createIdentityMatrix', 'number', ['number','number','number','number','number']);
	printOutcome(createIdentityMatrix(idOut,rows,columns,diagonal,dataType));
}

function deallocate(requestId, idA) {
	var deallocateArray = Module.cwrap('deallocate', 'number', ['number']);
	printOutcome(deallocateArray(idA));
}

function barrier(requestId) {
	var response = new Response();
	response.id = requestId;
	response.type = Response.Type.BARRIER;
	var message = response.encodeAB();
	self.postMessage(message, [message]);
}

function init() {
	var response = new Response();
	response.id = 0;
	response.type = Response.Type.INIT;
	var initResponse = new InitResponse();
	response.initResponse = initResponse;
	var message = response.encodeAB();
	self.postMessage(message, [message]);
}

function onMessage(event) {
	var message = event.data;
	var request = Request.decode(message);
	switch (request.type) {
		case Request.Type.EMPTY_ARRAY:
			var emptyArrayRequest = request.emptyArrayRequest;
			createEmptyArray(request.id,
				emptyArrayRequest.idOut,
				emptyArrayRequest.shape,
				dataTypeMap[emptyArrayRequest.dataType]);
			break;
		case Request.Type.DATA_ARRAY:
			var dataArrayRequest = request.dataArrayRequest;
			createDataArray(request.id,
				dataArrayRequest.idOut,
				dataArrayRequest.shape,
				dataTypeMap[dataArrayRequest.dataType],
				dataArrayRequest.dataBuffer.toArrayBuffer());
			break;
		case Request.Type.CONST_ARRAY:
			var constArrayRequest = request.constArrayRequest;
			createConstArray(request.id,
				constArrayRequest.idOut,
				constArrayRequest.shape,
				dataTypeMap[constArrayRequest.dataType],
				constArrayRequest.fillValue);
			break;
		case Request.Type.IDENTITY_MATRIX:
			var identityMatrixRequest = request.identityMatrixRequest;
			createIdentityMatrix(request.id,
				identityMatrixRequest.idOut,
				identityMatrixRequest.rows,
				identityMatrixRequest.columns,
				identityMatrixRequest.diagonal,
				dataTypeMap[identityMatrixRequest.dataType]);
			break;
		case Request.Type.LINSPACE:
			var linspaceRequest = request.linspaceRequest;
			linspace(request.id,
				linspaceRequest.idOut,
				linspaceRequest.start,
				linspaceRequest.stop,
				linspaceRequest.samples,
				linspaceRequest.closed,
				dataTypeMap[linspaceRequest.dataType]);
			break;
		case Request.Type.RESHAPE:
			var reshapeRequest = request.reshapeRequest;
			reshape(request.id,
				reshapeRequest.idA,
				reshapeRequest.idOut,
				reshapeRequest.shapeOut);
			break;
		case Request.Type.REPEAT:
			var repeatRequest = request.repeatRequest;
			repeat(request.id,
				repeatRequest.idA,
				repeatRequest.idOut,
				repeatRequest.axis,
				repeatRequest.repeats);
			break;
		case Request.Type.DEALLOCATE:
			var deallocateRequest = request.deallocateRequest;
			deallocate(request.id,
				deallocateRequest.idA);
			break;
		case Request.Type.FETCH:
			var fetchRequest = request.fetchRequest;
			fetch(request.id,
				fetchRequest.idA);
			break;
		case Request.Type.BARRIER:
			barrier(request.id);
			break;
		case Request.Type.INFO:
			break;
		case Request.Type.BINARY_OPERATION:
			var binaryOperationRequest = request.binaryOperationRequest;
			binaryOperation(request.id,
				binaryOperationRequest.type,
				binaryOperationRequest.idA,
				binaryOperationRequest.idB,
				binaryOperationRequest.idOut);
			break;
		case Request.Type.BINARY_CONST_OPERATION:
			var binaryConstOperationRequest = request.binaryConstOperationRequest;
			binaryConstOperation(request.id,
				binaryConstOperationRequest.type,
				binaryConstOperationRequest.idA,
				binaryConstOperationRequest.valueB,
				binaryConstOperationRequest.idOut);
			break;
		case Request.Type.UNARY_OPERATION:
			var unaryOperationRequest = request.unaryOperationRequest;
			unaryOperation(request.id,
				unaryOperationRequest.type,
				unaryOperationRequest.idA,
				unaryOperationRequest.idOut);
			break;
		case Request.Type.REDUCTION_OPERATION:
			var reductionRequest = request.reductionRequest;
			reduction(request.id,
				reductionRequest.type,
				reductionRequest.idA,
				reductionRequest.idOut);
			break;
		case Request.Type.AXIS_REDUCTION_OPERATION:
			var axisReductionRequest = request.axisReductionRequest;
			axisReduction(request.id,
				axisReductionRequest.type,
				axisReductionRequest.idA,
				axisReductionRequest.axis,
				axisReductionRequest.idOut);
			break;
		case Request.Type.DOT_OPERATION:
			var dotOperationRequest = request.dotOperationRequest;
			dotOperation(request.id,
				dotOperationRequest.type,
				dotOperationRequest.idA,
				dotOperationRequest.idB,
				dotOperationRequest.idOut);
			break;
		case Request.Type.CHOLESKY_DECOMPOSITION:
			var choleskyDecompositionRequest = request.choleskyDecompositionRequest;
			choleskyDecomposition(request.id,
				choleskyDecompositionRequest.idA,
				choleskyDecompositionRequest.aType,
				choleskyDecompositionRequest.idOut);
			break;
		case Request.Type.SOLVE_TRIANGULAR:
			var solveTriangularRequest = request.solveTriangularRequest;
			solveTriangular(request.id,
				solveTriangularRequest.idA,
				solveTriangularRequest.aType,
				solveTriangularRequest.aTransposition,
				solveTriangularRequest.unitDiagonal,
				solveTriangularRequest.idY,
				solveTriangularRequest.idX);
			break;
	}
}

self.addEventListener("message", onMessage, false);
init();
