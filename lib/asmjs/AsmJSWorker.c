#include <stdio.h>
#include <string.h>

size_t i;

void add64(double *a, double *b, double *c, size_t n) {
	for (i = 0; i < n; i++) c[i] = a[i] + b[i];
}

void sub(double *a, double *b, double *c, size_t n) {
	for (i = 0; i < n; i++) c[i] = a[i] + b[i];
}


