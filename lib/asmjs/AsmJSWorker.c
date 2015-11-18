#include <stdio.h>
#include <string.h>

#define MIN(a,b) (a < b ? a : b)
#define MAX(a,b) (a > b ? a : b)

/**
 * DataType Enum:
 *     Float32: 1
 *     Float64: 2
 */

void createConstArray(void *a, size_t type, size_t n, double fill ) {
	if (type == 1) {
		float *arr = (float*) a;	
		for (size_t i = 0; i < n; i++) arr[i] = fill;
	} else if (type == 2) {
		double *arr = (double*) a;
		for (size_t i = 0; i < n; i++) arr[i] = fill;
	}
}

void fillDiag(void *a, size_t type, size_t r, size_t c, int d, double fill) {
	if (!d) {
		size_t imax = MIN(r,c);
		if (type == 1) {
			float *arr = (float*) a;
			for (size_t i = 0; i < imax; i++) arr[i*c+i] = fill;
		} else if (type == 2) {
			double *arr = (double*) a;
			for (size_t i = 0; i < imax; i++) arr[i*c+i] = fill;
		}
	} else if (d > 0) {
		size_t imax = MIN(r,c-d);
		imax = 1;
		if (type == 1) {
			float *arr = (float*) a;
			for (size_t i = 0; i < imax; i++) arr[i*c+i+d] = fill;
		} else if (type == 2) {
			double *arr = (double*) a;
			for (size_t i = 0; i < imax; i++) arr[i*c+i+d] = fill;
		}
	} else {
		size_t imax = MIN(r+d,c);
		if (type == 1) {
			float *arr = (float*) a;
			for (size_t i = 0; i < imax; i++) arr[(i-d)*c+i] = fill;
		} else if (type == 2) {
			double *arr = (double*) a;
			for (size_t i = 0; i < imax; i++) arr[(i-d)*c+i] = fill;
		}
	}
}

void linspace(void *a, size_t type, double start, double stop, size_t n, size_t closed) {
	double step = (stop - start) / (closed ? n - 1 : n);
	if (type == 1) {
		float *arr = (float*) a;
		for (size_t i = 0; i < n; i++) arr[i] = start + step * i;
	} else if (type == 2) {
		double *arr = (double*) a;
		for (size_t i = 0; i < n; i++) arr[i] = start + step * i;
	}
}


void add(void *a, void *b, void *c, size_t type, size_t n) {
	if (type == 1) {
		float *arrA = (float*) a;
		float *arrB = (float*) b;
		float *out  = (float*) c;
		for (size_t i = 0; i < n; i++) out[i] = arrA[i] + arrB[i];
	} else if (type == 2) {
		double *arrA = (double*) a;
		double *arrB = (double*) b;
		double *out  = (double*) c;
		for (size_t i = 0; i < n; i++) out[i] = arrA[i] + arrB[i];
	}
}

void sub(void *a, void *b, void *c, size_t type, size_t n) {
	if (type == 1) {
		float *arrA = (float*) a;
		float *arrB = (float*) b;
		float *out  = (float*) c;
		for (size_t i = 0; i < n; i++) out[i] = arrA[i] - arrB[i];
	} else if (type == 2) {
		double *arrA = (double*) a;
		double *arrB = (double*) b;
		double *out  = (double*) c;
		for (size_t i = 0; i < n; i++) out[i] = arrA[i] - arrB[i];
	}

}

void mul(void *a, void *b, void *c, size_t type, size_t n) {
	if (type == 1) {
		float *arrA = (float*) a;
		float *arrB = (float*) b;
		float *out  = (float*) c;
		for (size_t i = 0; i < n; i++) out[i] = arrA[i] * arrB[i];
	} else if (type == 2) {
		double *arrA = (double*) a;
		double *arrB = (double*) b;
		double *out  = (double*) c;
		for (size_t i = 0; i < n; i++) out[i] = arrA[i] * arrB[i];
	}
}

void mdiv(void *a, void *b, void *c, size_t type, size_t n) {
	if (type == 1) {
		float *arrA = (float*) a;
		float *arrB = (float*) b;
		float *out  = (float*) c;
		for (size_t i = 0; i < n; i++) out[i] = arrA[i] / arrB[i];
	} else if (type == 2) {
		double *arrA = (double*) a;
		double *arrB = (double*) b;
		double *out  = (double*) c;
		for (size_t i = 0; i < n; i++) out[i] = arrA[i] / arrB[i];
	}
}

void addConst(void *a, double value, void *c, size_t type, size_t n) {
	if (type == 1) {
		float *arr = (float*) a;
		float *out  = (float*) c;
		for (size_t i = 0; i < n; i++) out[i] = arr[i] + value;
	} else if (type == 2) {
		double *arr = (double*) a;
		double *out =  (double*) c;
		for (size_t i = 0; i < n; i++) out[i] = arr[i] + value;
	}
}

void subConst(void *a, double value, void *c, size_t type, size_t n) {
	if (type == 1) {
		float *arr = (float*) a;
		float *out  = (float*) c;
		for (size_t i = 0; i < n; i++) out[i] = arr[i] - value;
	} else if (type == 2) {
		double *arr = (double*) a;
		double *out =  (double*) c;
		for (size_t i = 0; i < n; i++) out[i] = arr[i] - value;
	}
}

void subRevConst(void *a, double value, void *c, size_t type, size_t n) {
	if (type == 1) {
		float *arr = (float*) a;
		float *out  = (float*) c;
		for (size_t i = 0; i < n; i++) out[i] = value - arr[i];
	} else if (type == 2) {
		double *arr = (double*) a;
		double *out =  (double*) c;
		for (size_t i = 0; i < n; i++) out[i] = value - arr[i];
	}
}

void mulConst(void *a, double value, void *c, size_t type, size_t n) {
	if (type == 1) {
		float *arr = (float*) a;
		float *out  = (float*) c;
		for (size_t i = 0; i < n; i++) out[i] = arr[i] * value;
	} else if (type == 2) {
		double *arr = (double*) a;
		double *out =  (double*) c;
		for (size_t i = 0; i < n; i++) out[i] = arr[i] * value;
	}
}

void divConst(void *a, double value, void *c, size_t type, size_t n) {
	if (type == 1) {
		float *arr = (float*) a;
		float *out  = (float*) c;
		for (size_t i = 0; i < n; i++) out[i] = arr[i] / value;
	} else if (type == 2) {
		double *arr = (double*) a;
		double *out =  (double*) c;
		for (size_t i = 0; i < n; i++) out[i] = arr[i] / value;
	}
}

void divRevConst(void *a, double value, void *c, size_t type, size_t n) {
	if (type == 1) {
		float *arr = (float*) a;
		float *out  = (float*) c;
		for (size_t i = 0; i < n; i++) out[i] = value / arr[i];
	} else if (type == 2) {
		double *arr = (double*) a;
		double *out =  (double*) c;
		for (size_t i = 0; i < n; i++) out[i] = value / arr[i];
	}
}
