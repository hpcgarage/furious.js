#pragma once
#include <stdlib.h>
#include <stdint.h>
#include <sys/types.h>
#include <math.h>
#define V4UI_TRUE  (v4ui_set1(0xffffffff))
#define V4UI_FALSE  (v4ui_set1(0x0))
#define FLOAT_INFINITY (0x7f800000)
typedef float v4sf __attribute__((__vector_size__(16)));
typedef unsigned int v4ui __attribute__((__vector_size__(16)));
// typedef unsigned __int128 u_v4sf_128;
inline v4sf v4sf_load(const float* a) {
    return *((const v4sf*)a);
}

inline void v4sf_store(float* a, v4sf x) {
    *((v4sf*)a) = x;
}

inline v4sf v4sf_set1(float a) {
    return (v4sf) {a, a, a, a};
}

inline v4ui v4ui_set1(unsigned int a) {
    return (v4sf) {a, a, a, a};
}

inline v4sf v4sf_set(float a, float b, float c, float d) {
    return (v4sf) {a, b, c, d};
}

inline v4sf v4sf_macc(v4sf x, v4sf log2e, v4sf magicBias) {
    return x * log2e + magicBias;
}

inline v4sf v4sf_and(v4sf x, v4ui y) {
    v4ui ans = (*((v4ui *)(&x)) & *((v4ui *)(&y)));
    return *((v4sf*) &ans);
}

inline v4sf v4sf_andnot(v4sf x, v4ui y) {
    v4ui ans = ~(*((v4ui *)(&x)) & *((v4ui *)(&y)));
    return *((v4sf*) &ans);
}

inline v4sf v4sf_max(v4sf x, v4sf y) {
    v4ui xLarger = x > y;
    v4ui ans = (*((v4ui *)(&x)) & xLarger) | (*((v4ui *)(&x)) & ~xLarger);
    return *((v4sf*) &ans);
}

inline v4sf v4sf_min(v4sf x, v4sf y) {
    v4ui xSmaller = x < y;
    v4ui ans = (*((v4ui *)(&x)) & xSmaller) | (*((v4ui *)(&x)) & ~xSmaller);
    return *((v4sf*) &ans);
}

inline v4sf v4sf_GET_INFINITY() {
    v4ui ans = v4ui_set1(FLOAT_INFINITY);
    return *((v4sf *)(& ans));
}

inline v4sf v4sf_slli(v4sf x, v4sf y) {
    unsigned int* x_ptr = (unsigned int*) &x;
    unsigned int* y_ptr = (unsigned int*) &y;
    return (v4sf) {x_ptr[0] << y_ptr[0], x_ptr[1] << y_ptr[1], x_ptr[2] << y_ptr[2], x_ptr[3] << y_ptr[3]};
    //The code below doesn't work for some reason...
    // v4ui ans = (*((v4ui *)(&x)) << *((v4ui *)(&y)));
    // return *((v4sf*) &ans);
    //
    //Error Message:
    //Not handled: float undef
    //LLVM ERROR: FlattenGlobals: Constant type not handled for reloc
    //ninja: build stopped: subcommand failed.

}

inline v4sf v4sf_permute2(v4sf x, v4sf y, v4sf control) {
    float* x_ptr = (float*) &x;
    float* y_ptr = (float*) &y;
    v4ui mask = v4ui_set1(0x7);
    v4ui sel = *((v4ui*) &control) & mask;
    int * sel_ptr = (int*) &sel;
    int a = *sel_ptr;
    int b = *(sel_ptr+1);
    int c = *(sel_ptr+2);
    int d = *(sel_ptr+3);
    return (v4sf) {a < 4 ? *(x_ptr + a) : *(y_ptr + a - 4)
                  ,b < 4 ? *(x_ptr + b) : *(y_ptr + b - 4)
                  ,c < 4 ? *(x_ptr + c) : *(y_ptr + c - 4)
                  ,d < 4 ? *(x_ptr + d) : *(y_ptr + d - 4)};
}

inline v4sf v4sf_cmplt(v4sf x, v4sf y) {
    v4ui xSmaller = x < y;
    v4ui ans = (V4UI_TRUE & xSmaller) | (V4UI_FALSE & ~xSmaller);
    return *((v4sf*) &ans);
}

inline v4sf v4sf_cmpgt(v4sf x, v4sf y) {
    v4ui xLarger = x > y;
    v4ui ans = (V4UI_TRUE & xLarger) | (V4UI_FALSE & ~xLarger);
    return *((v4sf*) &ans);
}

inline v4sf v4sf_cmpeq(v4sf x, v4sf y) {
    v4ui xEqualsY = x == y;
    v4ui ans = (V4UI_TRUE & xEqualsY) | (V4UI_FALSE & ~xEqualsY);
    return *((v4sf*) &ans);
}

inline v4sf v4sf_blendv(v4sf x, v4sf y, v4sf mask) {
    v4ui mask_isPos = (*((v4ui *)(&mask)) > V4UI_FALSE);
    v4ui ans = ((*(v4ui *)(&x)) & mask_isPos) | ((*(v4ui *)(&y)) & ~mask_isPos);
    return *((v4sf*) &ans);
}
v4sf exp_v4sf(v4sf x);