#include <stdio.h>
#include <string.h>

void createArrayData64(double *arr, size_t size, double *buf) {
	memcpy(arr, buf, 8 * size);
}

void createArrayData32(float *arr, size_t size, float *buf) {
	memcpy(arr, buf, 4 * size);
}
