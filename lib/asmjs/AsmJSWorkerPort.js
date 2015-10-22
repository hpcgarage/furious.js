var idPtrMap = {};

function createEmptyArray(requestId, idOut, shape, dataType) {
	
}

function get(requestId, idOut, shape, dataType) {
	if (!(idOut in idPtrMap)) {
		throw new Error("Invalid output ID");
	}
	var retptr = idPtrMap[idOut];
	var retarray = Module.HEAP32.subarray(arr1/4, arr1/4+8);
	if (idOut < 0) idPtrMap[idOut] = null;
	console.log(126);	
	return retarray;
}
