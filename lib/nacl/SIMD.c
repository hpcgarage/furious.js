#include "SIMD.h"

v4sf exp_v4sf(v4sf x) {
    const v4sf magicBias = v4sf_set1(0x1.800000p+23f);
    const v4sf zeroCutoff = v4sf_set1(-0x1.9FE368p+6f); /* The smallest x for which expf(x) is non-zero */
    const v4sf infCutoff = v4sf_set1(0x1.62E42Ep+6f); /* The largest x for which expf(x) is finite */
    const v4sf log2e  = v4sf_set1(0x1.715476p+3f);
    const v4sf minusLn2_hi = v4sf_set1(-0x1.62E430p-4f);
    const v4sf minusLn2_lo = v4sf_set1( 0x1.05C610p-32f);
    const v4sf plusInf = v4sf_set1(INFINITY);

    const v4sf c2 = v4sf_set1(0x1.00088Ap-1f);
    const v4sf c3 = v4sf_set1(0x1.555A86p-3f);
    const v4sf table0123 = v4sf_set(0x1.4BFDAEp+0f, 0x1.306FE0p+0f, 0x1.172B84p+0f, 0x1.000000p+0f);
    const v4sf table4567 = v4sf_set(0x1.D5818Ep+0f, 0x1.AE89FAp+0f, 0x1.8ACE54p+0f, 0x1.6A09E6p+0f);

    const uv4s minExponent = uv4s_set1(-126 << 23);
    const uv4s maxExponent = uv4s_set1(127 << 23);
    const uv4s defaultExponent = uv4s_set1(0x3F800000u);
    const uv4s mantissaMask = uv4s_set1(0x007FFFF8);

    v4sf t = v4sf_macc(x, log2e, magicBias);
    v4sf e1 = v4sf_slli(v4sf_and(t, mantissaMask), v4sf_set1(20));
    v4sf e2 = e1;
    e1 = v4sf_min(v4sf_max(e1, minExponent), maxExponent);
    e2 = e2 - e1;

    const v4sf s1 = e1 + defaultExponent;
    const v4sf s2 = e2 + defaultExponent;
    const v4sf tf = v4sf_permute2(table0123, table4567, t);

    t = t - magicBias;

    const v4sf rx = v4sf_macc(t, minusLn2_lo, v4sf_macc(t, minusLn2_hi, x));
    const v4sf rf = v4sf_macc(rx, rx * v4sf_macc(rx, c3, c2), rx);
    v4sf f = v4sf_macc(tf, rf, tf);
    f = s2 * (s1 * f);
    f = v4sf_andnot(v4sf_cmplt(x,zeroCutoff),f);
    f = v4sf_blendv(f, plusInf, v4sf_cmpgt(x, infCutoff));
    f = v4sf_blendv(x,f,v4sf_cmpeq(x,x));
    return f;
}