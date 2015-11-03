#pragma once
#include <stdlib.h>
#include <stdint.h>
#include <sys/types.h>

typedef float v4sf __attribute__((__vector_size__(16)));
typedef int v4i __attribute__((__vector_size__(16)));

inline v4sf v4sf_load(const float* a) {
    return *((const v4sf*)a);
}

inline void v4sf_store(float* a, v4sf x) {
    *((v4sf*)a) = x;
}

inline v4sf v4sf_set1(float a) {
    return (v4sf) {a, a, a, a};
}

inline v4i v4i_set1(unsigned int a) {
    return (v4i) {a, a, a, a};
}

inline v4sf v4sf_macc(v4sf x, v4sf log2e, v4sf magicBias) {
    return x * log2e + magicBias;
}

inline v4sf v4sf_and(v4sf x, v4sf y) {
    return (v4sf) (((v4i) x) & ((v4i) y));
}

inline v4sf v4sf_andnot(v4sf x, v4i y) {
    return (v4sf) (~((v4i) x) & ((v4i) y));
}

inline v4sf v4sf_blendv(v4sf x, v4sf y, v4sf mask) {
    v4i imask = (v4i) mask;
    return (v4sf) ((((v4i) x) & ~imask) | (((v4i) y) & imask));
}

inline v4i v4i_blendv(v4i x, v4i y, v4i mask) {
    return (v4sf) ((x & ~mask) | (y & mask));
}

inline v4sf v4sf_max(v4sf x, v4sf y) {
    return v4sf_blendv(x, y, y > x);
}
inline v4i v4i_max(v4i x, v4i y) {
    return v4i_blendv(x, y, y > x);
}
inline v4sf v4sf_min(v4sf x, v4sf y) {
    return v4sf_blendv(x, y, x > y);
}

inline float v4sf_min_elem(v4sf x) {
    float min = x[0];
    for (int i = 1; i < 4; ++i) {
        min = x[i] < min ? x[i] : min;
    }
    return min;
}

inline float v4sf_max_elem(v4sf x) {
    float max = x[0];
    for (int i = 1; i < 4; ++i) {
        max = x[i] > max ? x[i] : max;
    }
    return max;
}
// inline v4sf v4sf_GET_INFINITY() {
//     return v4sf_set1(__builtin_inff());
// }
v4sf exp_v4sf(v4sf x);
v4sf log_v4sf(v4sf x);