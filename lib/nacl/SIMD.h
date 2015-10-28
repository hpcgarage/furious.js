#pragma once
#include <stdlib.h>
// #include <stdio.h>
#include <stdint.h>
// #include <string.h>
#include <sys/types.h>

// #include "ppapi/c/pp_errors.h"
// #include "ppapi/c/pp_module.h"
// #include "ppapi/c/pp_var.h"
// #include "ppapi/c/ppb.h"
// #include "ppapi/c/ppb_core.h"
// #include "ppapi/c/ppb_instance.h"
// #include "ppapi/c/ppb_messaging.h"
// #include "ppapi/c/ppb_var.h"
// #include "ppapi/c/ppp.h"
// #include "ppapi/c/ppp_instance.h"
// #include "ppapi/c/ppp_messaging.h"
// #include "error_handling/error_handling.h"

typedef float v4sf __attribute__((__vector_size__(16)));
typedef unsigned int v4ui __attribute__((__vector_size__(16)));

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
    return (v4ui) {a, a, a, a};
}

inline v4sf v4sf_macc(v4sf x, v4sf log2e, v4sf magicBias) {
    return x * log2e + magicBias;
}

inline v4sf v4sf_and(v4sf x, v4sf y) {
    return (v4sf) (((v4ui) x) & ((v4ui) y));
}

inline v4sf v4sf_andnot(v4sf x, v4ui y) {
    return (v4sf) (~((v4ui) x) & ((v4ui) y));
}

inline v4sf v4sf_blendv(v4sf x, v4sf y, v4sf mask) {
    v4ui imask = (v4ui) mask;
    return (v4sf) ((((v4ui) x) & ~imask) | (((v4ui) y) & imask));
}

inline v4sf v4sf_max(v4sf x, v4sf y) {
    return v4sf_blendv(x, y, y > x);
}

inline v4sf v4sf_min(v4sf x, v4sf y) {
    return v4sf_blendv(x, y, x > y);
}

inline v4sf v4sf_GET_INFINITY() {
    return v4sf_set1(__builtin_inff());
}

inline v4sf v4sf_cmplt(v4sf x, v4sf y) {
    return x < y;
}

inline v4sf v4sf_cmpgt(v4sf x, v4sf y) {
    return x > y;
}

inline v4sf v4sf_cmpeq(v4sf x, v4sf y) {
    return x == y;
}

v4sf exp_v4sf(v4sf x);
// void PostMessage(const char* str);