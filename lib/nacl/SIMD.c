#include <stdio.h>
#include "SIMD.h"
//TODO:
//epi: signed
//m128i: int
//m128:  float
//cast doesn't change bits
//x > y if larger 1111, if not larger 0000
//just use signed integer
v4sf exp_v4sf(v4sf x) {
    const v4sf magicBias = v4sf_set1(0x1.800000p+23f);
    const v4sf zeroCutoff = v4sf_set1(-0x1.9FE368p+6f); /* The smallest x for which expf(x) is non-zero */
    const v4sf infCutoff = v4sf_set1(0x1.62E42Ep+6f); /* The largest x for which expf(x) is finite */
    const v4sf log2e  = v4sf_set1(0x1.715476p+0f);
    const v4sf minusLn2_hi = v4sf_set1(-0x1.62E400p-1f);
    const v4sf minusLn2_lo = v4sf_set1(-0x1.7F7D1Cp-20f);
    const v4sf plusInf = v4sf_GET_INFINITY();

    const v4sf c2 = v4sf_set1(0x1.FFFFFCp-2f);
    const v4sf c3 = v4sf_set1(0x1.55548Cp-3f);
    const v4sf c4 = v4sf_set1(0x1.555834p-5f);
    const v4sf c5 = v4sf_set1(0x1.123CFEp-7f);
    const v4sf c6 = v4sf_set1(0x1.6ADCAEp-10f);

    const v4i minExponent = v4i_set1(-126 << 23);
    const v4i maxExponent = v4i_set1(127 << 23);
    const v4i defaultExponent = v4i_set1(0x3F800000u);

    v4sf t = v4sf_macc(x, log2e, magicBias);
    v4i intT = (v4i) t;
    fprintf(stderr, "t = [%f, %f, %f, %f] (float)\n    [0x%x, 0x%x, 0x%x, 0x%x](hex)\n", t[0], t[1], t[2], t[3], intT[0], intT[1], intT[2], intT[3]);
    v4i e1 = ((v4i) t) << v4i_set1(23);
    v4i e2 = e1;
    e1 = v4sf_min(v4i_max(e1, minExponent), maxExponent);
    e2 = e2 - e1;

    const v4sf s1 = e1 + defaultExponent;
    const v4sf s2 = e2 + defaultExponent;

    t = t - magicBias;
    const v4sf rx = v4sf_macc(t, minusLn2_lo, v4sf_macc(t, minusLn2_hi, x));
    const v4sf rf = v4sf_macc(rx, rx * v4sf_macc(rx, v4sf_macc(rx, v4sf_macc(rx, v4sf_macc(rx, c6, c5), c4), c3), c2), rx);
    v4sf f = s2 * v4sf_macc(s1, rf, s1);
    fprintf(stderr, "f = [%f, %f, %f, %f] (float)\n", f[0], f[1], f[2], f[3]);

    // v4i intF = (v4i) f;
    //fprintf(stderr, "f = [%f, %f, %f, %f] (float)\n    [0x%x, 0x%x, 0x%x, 0x%x](hex)\n", f[0], f[1], f[2], f[3], intF[0], intF[1], intF[2], intF[3]);
    /* Fixup underflow to zero */
    //f = v4sf_andnot(x < zeroCutoff, f);
    /* Fixup overflow */
    //f = v4sf_blendv(plusInf, f, x > infCutoff);
    /* Fixup NaN */
    //f = v4sf_blendv(f, x, x == x);
    return f;
}