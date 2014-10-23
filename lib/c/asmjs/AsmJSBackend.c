#include "NDArray.h"
#include "Error.h"
#include "DataType.h"
#include "Commands.h"
#include "IdMap.h"
#include "Util.h"

typedef void (*ConstInitFunction)(uint32_t, double, void*);
static void initConstF32(uint32_t length, double fillValue, float dataOut[restrict static length]);
static void initConstF64(uint32_t length, double fillValue, double dataOut[restrict static length]);

typedef void (*StepInitFunction)(uint32_t, double, double, void*);
static void initLinearF32(uint32_t samples, double start, double step, float dataOut[restrict static samples]);
static void initLinearF64(uint32_t samples, double start, double step, double dataOut[restrict static samples]);

typedef void (*IdentityInitFunction)(uint32_t, uint32_t, int32_t, void*, double);
static void initIdentityF32(uint32_t rows, uint32_t columns, int32_t diagonal, float data[restrict static rows*columns], double diagonalValue);
static void initIdentityF64(uint32_t rows, uint32_t columns, int32_t diagonal, double data[restrict static rows*columns], double diagonalValue);

static const ConstInitFunction constInitFunctions[] = {
	[FJS_DataType_F64] = (ConstInitFunction) initConstF64,
	[FJS_DataType_F32] = (ConstInitFunction) initConstF32
};

static const StepInitFunction stepInitFunctions[] = {
	[FJS_DataType_F64] = (StepInitFunction) initLinearF64,
	[FJS_DataType_F32] = (StepInitFunction) initLinearF32
};

static const IdentityInitFunction identityInitFunctions[] = {
	[FJS_DataType_F64] = (IdentityInitFunction) initIdentityF64,
	[FJS_DataType_F32] = (IdentityInitFunction) initIdentityF32
};


int createEmptyArray(uint32_t length, uint32_t idOut, uint32_t* shape, enum FJS_DataType dataType) {
	struct FJS_Shape newShape;
	newShape.dimensions = length;
	newShape.buffer = shape;
	return FJS_Execute_CreateEmptyArray(idOut, newShape, dataType);
}

int createConstArray(uint32_t idOut, uint32_t* shape, enum FJS_DataType dataType, uint32_t fillValue) {
	int length = sizeof(shape)/(sizeof(uint32_t));
	struct FJS_Shape newShape;
	newShape.dimensions = length;
	newShape.buffer = shape;
	return FJS_Execute_CreateConstArray(idOut, newShape, dataType, fillValue);
}

int createDataArray(uint32_t idOut, uint32_t* shape, enum FJS_DataType dataType, uint32_t* data) {
	int length = sizeof(shape)/(sizeof(uint32_t));
	struct FJS_Shape newShape;
	newShape.dimensions = length;
	newShape.buffer = shape;
	int size = sizeof(data)/(sizeof(uint32_t));
	struct FJS_Buffer newBuffer;
	newBuffer.pointer = data;
	newBuffer.size = size;
	return FJS_Execute_CreateDataArray(idOut, newShape, dataType, newBuffer);
}

void * retrieveArray(uint32_t idOut) {
//	Entry* entry = findEntry(int32_t id);
	
	return array;
}

int createIdentityMatrix(
	uint32_t idOut,
	uint32_t rows,
	uint32_t columns,
	int32_t diagonal,
	enum FJS_DataType dataType) 
{
	return FJS_Execute_CreateIdentityMatrix(idOut,rows,columns,diagonal,dataType);
}

int deallocate(int32_t idA) {
	return FJS_Execute_DeAllocate(idA);
}

// int FJS_Execute_DeAllocate(int32_t idA) {
// 	struct NDArray* array = FJS_GetPointerFromId(instance, idA);
// 	if (array == NULL) {
// 		return 0;
// 	} else {
// 		FJS_NDArray_Delete(array);
// 		FJS_ReleaseId(instance, idA);
// 		return 1;
// 	}
// }

// int FJS_Execute_CreateEmptyArray(
// 	uint32_t idOut,
// 	struct FJS_Shape shape,
// 	enum FJS_DataType dataType)
// {
// 	const uint32_t elementSize = FJS_DataType_GetSize(dataType);
// 	if (elementSize == 0) {
// 		return 0;
// 	}
// 	uint32_t length = 1;
// 	for (uint32_t dimension = 0; dimension < shape.dimensions; dimension++) {
// 		const uint32_t measure = shape.buffer[dimension];
// 		if (measure < 1) {
// 			return 0;
// 		}
// 		/* This multiplication can easily overflow */
// 		if (!FJS_Util_Mul32u(length, measure, &length)) {
// 			return 0;
// 		}
// 	}
// 	uint32_t size;
// 	if (!FJS_Util_Mul32u(length, elementSize, &size)) {
// 		return 0;
// 	}

// 	struct NDArray* array = FJS_NDArray_Create(shape.dimensions, length, shape.buffer, dataType);
// 	if (array == NULL) {
// 		return 0;
// 	}

// 	FJS_AllocateId(instance, idOut, array);
// 	return 1;
// }

// int FJS_Execute_CreateConstArray(
// 	uint32_t idOut,
// 	struct FJS_Shape shape,
// 	enum FJS_DataType dataType,
// 	double fillValue)
// {
// 	const uint32_t elementSize = FJS_DataType_GetSize(dataType);
// 	if (elementSize == 0) {
// 		return 0;
// 	}
// 	uint32_t length = 1;
// 	for (uint32_t dimension = 0; dimension < shape.dimensions; dimension++) {
// 		const uint32_t measure = shape.buffer[dimension];
// 		if (measure < 1) {
// 			return 0;
// 		}
// 		/* This multiplication can easily overflow */
// 		if (!FJS_Util_Mul32u(length, measure, &length)) {
// 			return 0;
// 		}
// 	}
// 	uint32_t size;
// 	if (!FJS_Util_Mul32u(length, elementSize, &size)) {
// 		return 0;
// 	}

// 	if ((uint32_t) dataType >= FJS_DataType_Max) {
// 		return 0;
// 	}
// 	const ConstInitFunction initFunction = constInitFunctions[dataType];
// 	if (initFunction == NULL) {
// 		return 0;
// 	}

// 	struct NDArray* arrayOut = FJS_NDArray_Create(shape.dimensions, length, shape.buffer, dataType);
// 	if (arrayOut == NULL) {
// 		return 0;
// 	}

// 	void* dataOut = FJS_NDArray_GetData(arrayOut);
// 	initFunction(length, fillValue, dataOut);

// 	FJS_AllocateId(instance, idOut, arrayOut);
// 	return 1;
// }

// int FJS_Execute_CreateDataArray(
// 	uint32_t idOut,
// 	struct FJS_Shape shape,
// 	enum FJS_DataType dataType,
// 	struct FJS_Buffer dataBuffer)
// {
// 	if (shape.dimensions == 0) {
// 		return 0;
// 	}
// 	const uint32_t elementSize = FJS_DataType_GetSize(dataType);
// 	if (elementSize == 0) {
// 		return 0;
// 	}
// 	uint32_t length = 1;
// 	for (uint32_t dimension = 0; dimension < shape.dimensions; dimension++) {
// 		const uint32_t measure = shape.buffer[dimension];
// 		if (measure < 1) {
// 			return 0;
// 		}
// 		/* This multiplication can easily overflow */
// 		if (!FJS_Util_Mul32u(length, measure, &length)) {
// 			return 0;
// 		}
// 	}
// 	uint32_t size;
// 	if (!FJS_Util_Mul32u(length, elementSize, &size)) {
// 		return 0;
// 	}
// 	if (size != dataBuffer.size) {
// 		return 0;
// 	}

// 	struct NDArray* arrayOut = FJS_NDArray_Create(shape.dimensions, length, shape.buffer, dataType);
// 	if (arrayOut == NULL) {
// 		return 0;
// 	}

// 	void* dataOut = FJS_NDArray_GetData(arrayOut);
// 	memcpy(dataOut, dataBuffer.pointer, dataBuffer.size);

// 	FJS_AllocateId(instance, idOut, arrayOut);
// 	return 1;
// }

// int FJS_Execute_CreateIdentityMatrix(
// 	uint32_t idOut,
// 	uint32_t rows,
// 	uint32_t columns,
// 	int32_t diagonal,
// 	enum FJS_DataType dataType)
// {
// 	/* Validate the shape of the new array */
// 	if (rows == 0) {
// 		return 0;
// 	}
// 	if (columns == 0) {
// 		return 0;
// 	}

// 	/* Validate the diagonal argument */
// 	if ((diagonal > 0) && ((uint32_t) diagonal >= columns)) {
// 		return 0;
// 	}
// 	if ((diagonal < 0) && ((uint32_t) (-diagonal) >= rows)) {
// 		return 0;
// 	}

// 	/* Check that the data type is supported and choose the initialization function for this data type */
// 	IdentityInitFunction initFunction;
// 	switch (dataType) {
// 		case FJS_DataType_F64:
// 		case FJS_DataType_F32:
// 			initFunction = identityInitFunctions[dataType];
// 			break;
// 		case FJS_DataType_Invalid:
// 		default:
// 			return 0;
// 	}

// 	/* Define parameters for the output array */
// 	const uint32_t lengthOut = rows * columns;
// 	const uint32_t shapeOut[2] = { rows, columns };
// 	const uint32_t dimensionsOut = 2;

// 	/* Create output array */
// 	struct NDArray* arrayOut = FJS_NDArray_Create(dimensionsOut, lengthOut, shapeOut, dataType);
// 	if (arrayOut == NULL) {
// 		return 0;
// 	}

// 	/* Associate the output array with its id */
// 	FJS_AllocateId(instance, idOut, arrayOut);

// 	/* Do the initialization */
// 	void* dataOut = FJS_NDArray_GetData(arrayOut);
// 	memset(dataOut, 0, lengthOut * FJS_DataType_GetSize(dataType));
// 	initFunction(rows, columns, diagonal, dataOut, 1.0);

// 	return 1;
// }
