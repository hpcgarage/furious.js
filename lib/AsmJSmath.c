#include <stdio.h>
#include <math.h>

#define MIN(a,b) (((a)<(b))?(a):(b))
#define MAX(a,b) (((a)>(b))?(a):(b))
#define ABS(a) (((a)<(0))?(-a):(a))

#define int *idMap = malloc(100*sizeof(double*))

void addArray(int idOut, int length, double[] array) {
	int array = malloc(length * sizeof(double));
	int *id = &array;
	*(arrays + idMap) = id;
}

int inIdMap(int idOut) {
	if (*(idMap + idOut) == NULL) {
		return 0;
	} else {
		return 1;
	}
}

void fill(double *data, double value, int length) {
	for (int i= 0; i < length; ++i) {
		data[i] = value;
	}
}

void fillDiagonal(double *data, int rows, int columns, int diagonal, double value) {
	if (diagonal == 0) {
		int imax = MIN(rows,column);
		for (int i = 0; i < imax; ++i) {
			data[i*columns+i] = value;
		}
	} else if (diagonal > 0) {
		int imax = MIN(rows,column - diagonal);
		for (int i = 0; i < imax; ++i) {
			data[i*columns+i+diagonal] = value;
		}
	} else {
		int imax = MIN(rows+diagonal, column);
		for (int i = 0; i < imax; ++i) {
			data[(i - diagonal)*columns+i] = value;
		}
	}
}

void add(double *dataA, double[] dataB, double *dataOut, int length) {
	for (int i= 0; i < length; ++i) {
		dataOut[i] = dataA[i] + dataB[i];
	}
}

void addConst(double *dataA, double valueB, double *dataOut, int length) {
	for (int i = 0; i< length; ++i) {
		dataOut[i] = dataA[i] + valueB;
	}
}

void sub(double *dataA, double[] dataB, double *dataOut, int length) {
	for (int i= 0; i < length; ++i) {
		dataOut[i] = dataA[i] - dataB[i];
	}
}

void subConst(double *dataA, double valueB, double *dataOut, int length) {
	for (int i = 0; i< length; ++i) {
		dataOut[i] = dataA[i] - valueB;
	}
}

void subRevConst(double *dataA, double valueB, double *dataOut, int length) {
	for (int i = 0; i< length; ++i) {
		dataOut[i] = valueB - dataA[i];
	}
}

void mul(double *dataA, double *dataB, double *dataOut, int length) {
	for (int i= 0; i < length; ++i) {
		dataOut[i] = dataA[i] * dataB[i];
	}
}

void mulConst(double *dataA, double valueB, double *dataOut, int length) {
	for (int i = 0; i< length; ++i) {
		dataOut[i] = dataA[i] * valueB;
	}
}

void div(double *dataA, double *dataB, double *dataOut, int length) {
	for (int i= 0; i < length; ++i) {
		dataOut[i] = dataA[i]/dataB[i];
	}
}

void divConst(double *dataA, double valueB, double *dataOut, int length) {
	for (int i = 0; i< length; ++i) {
		dataOut[i] = dataA[i] / valueB;
	}
}

void divRevConst(double *dataA, double valueB, double *dataOut, int length) {
	for (int i = 0; i< length; ++i) {
		dataOut[i] = valueB/dataA[i];
	}
}

void neg(double *dataA, double *dataOut, int length) {
	for (int i = 0; i< length; ++i) {
		dataOut[i] = -dataA[i];
	}
}

void abs(double *dataA, double *dataOut, int length) {
	for (int i = 0; i< length; ++i) {
		dataOut[i] = ABS(dataA[i]);
	}
}

void exp(double *dataA, double *dataOut, int length) {
	for (int i = 0; i< length; ++i) {
		dataOut[i] = exp(dataA[i]);
	}
}

void log(double *dataA, double *dataOut, int length) {
	for (int i = 0; i< length; ++i) {
		dataOut[i] = log(dataA[i]);
	}
}

void sqrt(double *dataA, double *dataOut, int length) {
	for (int i = 0; i< length; ++i) {
		dataOut[i] = sqrt(dataA[i]);
	}
}

void square(double *dataA, double *dataOut, int length) {
	for (int i = 0; i< length; ++i) {
		dataOut[i] = pow(dataA[i],2);
	}
}

void min(double *dataA, double *dataOut, int length) {
	double result = dataA[0];
	for (int i = 0; i< length; ++i) {
		result = MIN(dataA[i],result);
	}
	dataOut[0] = result;
}

void max(double *dataA, double *dataOut, int length) {
	double result = dataA[0];
	for (int i = 0; i< length; ++i) {
		result = MAX(dataA[i],result);
	}
	dataOut[0] = result;
}

void sum(double *dataA, double *dataOut, int length) {
	double result = 0;
	for (int i = 0; i< length; ++i) {
		result += dataA[i];
	}
	dataOut[0] = result;
}

void axisSum(double *dataA, double *dataOut, int outerStride, int innerStride, int reductionDim) {
	for (int i = 0; i < outerStride; ++i) {
		for (int k = 0; k < innerStride; ++k) {
			int offset = i * reductionDim * innerStride + k;
			double currentSum = dataA[offset];
			for (int j = 1; j < reductionDim; ++j) { 
				offset += innerStride;
				currentSum += dataA[offset];
			}
			dataOut[i * innerStride + k] = currentSum;
		}
	}
}

void dot(double *dataA, double *dataB, double *dataOut, int strideA, int outerStrideB, int innerStrideB, int reductionDim) {
	for (int i = 0; i < strideA; ++i) {
		for (int j = 0; j < reductionDim; ++j) {
			for (int k = 0; k < outerStrideB; ++k) {
				for (int l = 0; l < innerStrideB; ++l) {
					dataOut[(i*outerStrideB + k) * innerStrideB + l] += dataA[i*reductionDim+j] * dataB[(k*reductionDim+j)*innerStrideB+l];
				}
			}
		}
	}
}

void repeat(double *dataA, double *dataOut, int outerStride, int innerStride, int expansionDim, int repeats) {
	if (innerStride < repeats) {
		for (int i = 0; i < outerStride; ++i) {
			for (int j = 0; j < expansionDim; ++j) {
				for (int k = 0; k < innerStride; ++k) {
					int valueA = dataA[(i * expansionDim + j) * innerStride + k];
					for (int c = 0; c < repeats; ++c) {
						dataOut[((i * expansionDim + j) * repeats + c) * innerStride + k] = valueA;
					}
				}
			}
		}
	} else {
		for (int i = 0; i < outerStride; ++i) {
			for (int j = 0; j < expansionDim; ++j) {
				int rowA[((i * expansionDim + j + 1) * innerStride) - ((i * expansionDim + j) * innerStride)];
				for (int k = (i * expansionDim + j) * innerStride; k < (i * expansionDim + j + 1) * innerStride; k++) {
					rowA[k - ((i * expansionDim + j) * innerStride)] = dataA[k];
				}
				for (var c = 0; c < repeats; ++c) {
					dataOut.set(rowA, ((i * expansionDim + j) * repeats + c) * innerStride);
				}
			}
		}
	}
}

void repeatTriangular(double *dataA, double *dataB, int rows, int columns, int transpose, int lower, int unitDiagonal) {
	if (lower) {
		if (transpose) {
			for (int i = rows - 1; i >= 0; --i) {
				for (int k = 0; k < columns; ++k){
					double Xii = dataB[i*columns+k];
					for (int j = rows - 1; j > i; --j) {
						Xii -= dataA[j*rows+i] * dataB[j*columns+k];
					}
					dataB[i*columns+k] = unitDiagonal ? Xii : Xii / dataA[i*rows+i];
				}
			}
		} else {
			for (int i = 0; i < rows; ++i) {
				for (int k = 0; k < columns; ++k){
					double Xii = dataB[i*columns+k];
					for (int j = 0; j < i; ++j) {
						Xii -= dataA[i*rows+j] * dataB[j*columns+k];
					}
					dataB[i*columns+k] = unitDiagonal ? Xii : Xii / dataA[i*rows+i];
				}
			}
		}
	} else {
		if (transpose) {
			for (int i = 0; i < rows; ++i) {
				for (int k = 0; k < columns; ++k){
					double Xii = dataB[i*columns+k];
					for (int j = 0; j < i; ++j) {
						Xii -= dataA[j*rows+i] * dataB[j*columns+k];
					}
					dataB[i*columns+k] = unitDiagonal ? Xii : Xii / dataA[i*rows+i];
				}
			}
		} else {
			for (int i = rows - 1; i >= 0; --i) {
				for (int k = 0; k < columns; ++k){
					double Xii = dataB[i*columns+k];
					for (int j = rows - 1; j > i; --j) {
						Xii -= dataA[i*rows+j] * dataB[j*columns+k];
					}
					dataB[i*columns+k] = unitDiagonal ? Xii : Xii / dataA[i*rows+i];
				}
			}
		}
	}
}

void cholesky(double *data, int n, int lower) {
	for (int i = 0; i < n; ++i) {
		/* Compute the diagonal value */
		double Lii = sqrt(data[i*n+i]);
		data[i*n+i] = Lii;
		/* Update the ith column */
		for (int j = i + 1; j < n; ++j) {
			data[j*n+i] /= Lii;
		}
		/* Update the ith row */
		for (int j = i + 1; j < n; ++j) {
			data[i*n+j] /= Lii;
		}
		/* Compute Schur complement */
		for (int j = i + 1; j < n; ++j) {
			for (int k = i + 1; k < n; ++k) {
				data[j*n+k] -= data[j*n+i] * data[i*n+k];
			}
		}
	}
	if (lower) {
		/* Zero-out the upper sub-diagonals */
		for (int i = 0; i < n; ++i) {
			for (int j = i + 1; j < n; ++j) {
				data[i*n+j] = 0.0;
			}
		}
	} else {
		/* Zero-out the lower sub-diagonals */
		for (int i = 0; i < n; ++i) {
			for (int j = 0; j < i; ++j) {
				data[i*n+j] = 0.0;
			}
		}
	}
}












