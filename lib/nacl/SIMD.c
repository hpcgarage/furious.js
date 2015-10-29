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
    const v4sf plusInf = v4sf_set1(__builtin_inff());

    const v4sf c2 = v4sf_set1(0x1.FFFFFCp-2f);
    const v4sf c3 = v4sf_set1(0x1.55548Cp-3f);
    const v4sf c4 = v4sf_set1(0x1.555834p-5f);
    const v4sf c5 = v4sf_set1(0x1.123CFEp-7f);
    const v4sf c6 = v4sf_set1(0x1.6ADCAEp-10f);

    const v4i minExponent = v4i_set1(-126 << 23);
    const v4i maxExponent = v4i_set1(127 << 23);
    const v4i defaultExponent = v4i_set1(0x3F800000u);

    v4sf t = v4sf_macc(x, log2e, magicBias);
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

    /* Fixup underflow to zero */
    f = v4sf_andnot(x < zeroCutoff, f);
    /* Fixup overflow */
    f = v4sf_blendv(f, plusInf, x > infCutoff);
    /* Fixup NaN */
    f = v4sf_blendv(x, f, x == x);
    return f;
}

v4sf log_v4sf(v4sf x) {
    const v4sf one   = v4sf_set1(0x1.000000p+0);
    const v4sf sqrt2 = v4sf_set1(0x1.6A09E6p+0);

    //const v4sf c1  = v4sf_set1( 0x1.000000p+0f);
    const v4sf c2  = v4sf_set1(-0x1.FFFFF2p-2f);
    const v4sf c3  = v4sf_set1( 0x1.55571Ep-2f);
    const v4sf c4  = v4sf_set1(-0x1.0006B2p-2f);
    const v4sf c5  = v4sf_set1( 0x1.98CB06p-3f);
    const v4sf c6  = v4sf_set1(-0x1.530B6Ap-3f);
    const v4sf c7  = v4sf_set1( 0x1.317FD6p-3f);
    const v4sf c8  = v4sf_set1(-0x1.26F724p-3f);
    const v4sf c9  = v4sf_set1( 0x1.6A66D0p-4f);

    const v4sf ln2_hi = v4sf_set1( 0x1.62E430p-1f);
    const v4sf ln2_lo = v4sf_set1(-0x1.05C610p-29f);

    const v4sf mantissaMask = __builtin_convertvector(v4i_set1(0x007FFFFF), v4sf);
    const v4i minExponent   = v4i_set1(0x00800000);

    const v4sf nan = v4sf_set1(__builtin_nanf(""));
    const v4sf plusInf = v4sf_set1(__builtin_inff());
    //const v4sf minusInf = v4sf_set1(-__builtin_inff());

    const v4i denormalizedPointOffset = v4i_set1(127 + 32 - 7) - ((v4i)(__builtin_convertvector(x, v4sf)) >> v4i_set1(23));

    const v4i denormalizedExponent = v4i_set1(-126) - denormalizedPointOffset;
    const v4i denormalizedMantissa = (v4i) x << (v4i) mantissaMask;

    const v4i normalizedExponent = ((v4i)(x - one)) << v4i_set1(23);
    const v4sf normalizedMantissa = (v4sf)((v4i)x & (v4i)mantissaMask);


    const v4i denormalizedMask = (v4i)x < minExponent;
    v4i exponent = v4sf_blendv(normalizedExponent, denormalizedExponent, denormalizedMask);
    v4i mantissa = v4sf_blendv(normalizedMantissa, denormalizedMantissa, denormalizedMask);
    x = mantissa | (v4i) one;

    /* TODO: use integer comparison */
    const v4i aboveSqrt2Mask = x >= sqrt2;
    exponent = exponent - aboveSqrt2Mask;
    x = x - (v4sf)(aboveSqrt2Mask & minExponent);
    const v4sf t = x - one;
    const v4sf fexp = __builtin_convertvector(exponent, v4sf);
    v4sf f = v4sf_macc(fexp, ln2_hi,
        v4sf_macc(fexp, ln2_lo,
        v4sf_macc(t, t * v4sf_macc(t
            , v4sf_macc(t, v4sf_macc(t, v4sf_macc(t, v4sf_macc(t, v4sf_macc(t, v4sf_macc(t, c9, c8), c7), c6), c5), c4), c3), c2), t)));
    /* Fixup negative numbers */
    f = v4sf_blendv(f, nan, x);
    /* Fixup positive zero */
    f = v4sf_blendv(f, plusInf, x == v4sf_set1(0x0));
    /* Fixup NaN and +Inf */
    f = v4sf_blendv(x, f, x < plusInf);

    return f;
}