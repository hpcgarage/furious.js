#pragma once
#include <stdlib.h>
#include <stdint.h>
#include <math.h>
#include <sys/types.h>

typedef float v4sf __attribute__((__vector_size__(16)));
typedef unsigned int uv4s __attribute__((__vector_size__(16)));
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

inline uv4s uv4s_set1(unsigned int a) {
    return (v4sf) {a, a, a, a};
}

inline v4sf v4sf_set(float a, float b, float c, float d) {
    return (v4sf) {a, b, c, d};
}

inline v4sf v4sf_macc(v4sf x, v4sf log2e, v4sf magicBias) {
    return x * log2e + magicBias;
}

inline v4sf v4sf_and(v4sf x, uv4s y) {
    unsigned int* x_ptr = (unsigned int*) &x;
    unsigned int* y_ptr = (unsigned int*) &y;
    return (v4sf) {*x_ptr & *y_ptr
                ,*(x_ptr+1) & *(y_ptr + 1)
                ,*(x_ptr+2) & *(y_ptr + 2)
                ,*(x_ptr+3) & *(y_ptr + 3)};
}

inline v4sf v4sf_andnot(v4sf x, uv4s y) {
    unsigned int* x_ptr = (unsigned int*) &x;
    unsigned int* y_ptr = (unsigned int*) &y;
    return (v4sf) {~(*x_ptr & *y_ptr)
                ,~(*(x_ptr+1) & *(y_ptr + 1))
                ,~(*(x_ptr+2) & *(y_ptr + 2))
                ,~(*(x_ptr+3) & *(y_ptr + 3))};
}

inline v4sf v4sf_max(v4sf x, v4sf y) {
    v4sf xLarger = x > y;
    float* xLarger_ptr = (float*)&xLarger;
    float* x_ptr = (float*)&x;
    float* y_ptr = (float*)&y;
    return (v4sf){*xLarger_ptr ? *x_ptr : *y_ptr
                ,*(xLarger_ptr + 1) ? *(x_ptr + 1) : *(y_ptr + 1)
                ,*(xLarger_ptr + 2) ? *(x_ptr + 2) : *(y_ptr + 2)
                ,*(xLarger_ptr + 3) ? *(x_ptr + 3) : *(y_ptr + 3)};
}

inline v4sf v4sf_min(v4sf x, v4sf y) {
    v4sf xLarger = x > y;
    float* xLarger_ptr = (float*)&xLarger;
    float* x_ptr = (float*)&x;
    float* y_ptr = (float*)&y;
    return (v4sf){*xLarger_ptr ? *y_ptr : *x_ptr
                ,*(xLarger_ptr + 1) ? *(y_ptr + 1) : *(x_ptr + 1)
                ,*(xLarger_ptr + 2) ? *(y_ptr + 2) : *(x_ptr + 2)
                ,*(xLarger_ptr + 3) ? *(y_ptr + 3) : *(x_ptr + 3)};
}

inline v4sf v4sf_slli(v4sf x, v4sf y) {
    unsigned int* x_ptr = (unsigned int*) &x;
    unsigned int* y_ptr = (unsigned int*) &y;
    return (v4sf) {(*x_ptr << *y_ptr)
                ,(*(x_ptr+1) << *(y_ptr + 1))
                ,(*(x_ptr+2) << *(y_ptr + 2))
                ,(*(x_ptr+3) << *(y_ptr + 3))};
}

inline v4sf v4sf_permute2(v4sf x, v4sf y, v4sf control) {
    float* x_ptr = (float*) &x;
    float* y_ptr = (float*) &y;
    uv4s mask = uv4s_set1(0x7);
    uv4s sel = *((uv4s*) &control) & mask;
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
    float* x_ptr = (float*) &x;
    float* y_ptr = (float*) &y;
    return (v4sf) {*x_ptr < *y_ptr ? 0xffffffff : 0x0
                  ,*(x_ptr + 1) < *(y_ptr + 1) ? 0xffffffff : 0x0
                  ,*(x_ptr + 2) < *(y_ptr + 2) ? 0xffffffff : 0x0
                  ,*(x_ptr + 3) < *(y_ptr + 3) ? 0xffffffff : 0x0};
}

inline v4sf v4sf_cmpgt(v4sf x, v4sf y) {
    float* x_ptr = (float*) &x;
    float* y_ptr = (float*) &y;
    return (v4sf) {*x_ptr > *y_ptr ? 0xffffffff : 0x0
                  ,*(x_ptr + 1) > *(y_ptr + 1) ? 0xffffffff : 0x0
                  ,*(x_ptr + 2) > *(y_ptr + 2) ? 0xffffffff : 0x0
                  ,*(x_ptr + 3) > *(y_ptr + 3) ? 0xffffffff : 0x0};
}

inline v4sf v4sf_cmpeq(v4sf x, v4sf y) {
    float* x_ptr = (float*) &x;
    float* y_ptr = (float*) &y;
    return (v4sf) {*x_ptr == *y_ptr ? 0xffffffff : 0x0
                  ,*(x_ptr + 1) == *(y_ptr + 1) ? 0xffffffff : 0x0
                  ,*(x_ptr + 2) == *(y_ptr + 2) ? 0xffffffff : 0x0
                  ,*(x_ptr + 3) == *(y_ptr + 3) ? 0xffffffff : 0x0};
}

inline v4sf v4sf_blendv(v4sf x, v4sf y, v4sf mask) {
    int* mask_ptr = (int*)&mask;
    int* x_ptr = (int*)&x;
    int* y_ptr = (int*)&y;
    return (v4sf){(*mask_ptr & 0x80000000) ? *y_ptr : *x_ptr
                ,(*(mask_ptr + 1) & 0x80000000) ? *(y_ptr + 1) : *(x_ptr + 1)
                ,(*(mask_ptr + 2) & 0x80000000) ? *(y_ptr + 2) : *(x_ptr + 2)
                ,(*(mask_ptr + 3) & 0x80000000) ? *(y_ptr + 3) : *(x_ptr + 3)};
}
v4sf exp_v4sf(v4sf x);