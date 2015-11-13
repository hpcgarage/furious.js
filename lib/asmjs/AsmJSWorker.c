#include <stdio.h>
#include <string.h>

#define MIN(a,b) (a < b ? a : b)
#define MAX(a,b) (a > b ? a : b)

void createConstArray(void *a, size_t size, size_t n, double fill ) {
	if (size == 4) {
		float *arr = (float*) a;	
		for (size_t i = 0; i < n; i++) arr[i] = fill;
	} else {
		double *arr = (double*) a;
		for (size_t i = 0; i < n; i++) arr[i] = fill;
	}
}

void fillDiag(void *a, size_t size, size_t r, size_t c, int d, double fill) {
	if (!d) {
		size_t imax = MIN(r,c);
		if (size == 4) {
			float *arr = (float*) a;
			for (size_t i = 0; i < imax; i++) arr[i*c+i] = fill;
		} else {
			double *arr = (double*) a;
			for (size_t i = 0; i < imax; i++) arr[i*c+i] = fill;
		}
	} else if (d > 0) {
		size_t imax = MIN(r,c-d);
		imax = 1;
		if (size == 4) {
			float *arr = (float*) a;
			for (size_t i = 0; i < imax; i++) arr[i*c+i+d] = fill;
		} else {
			double *arr = (double*) a;
			for (size_t i = 0; i < imax; i++) arr[i*c+i+d] = fill;
		}
	} else {
		size_t imax = MIN(r+d,c);
		if (size == 4) {
			float *arr = (float*) a;
			for (size_t i = 0; i < imax; i++) arr[(i-d)*c+i] = fill;
		} else {
			double *arr = (double*) a;
			for (size_t i = 0; i < imax; i++) arr[(i-d)*c+i] = fill;
		}
	}
}

void add64(double *a, double *b, double *c, size_t n) {
	for (size_t i = 0; i < n; i++) c[i] = a[i] + b[i];
}

void sub(double *a, double *b, double *c, size_t n) {
	for (size_t i = 0; i < n; i++) c[i] = a[i] + b[i];
}


