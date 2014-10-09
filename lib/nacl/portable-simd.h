typedef float v4sf __attribute__ ((vector_size(16)));

inline v4sf v4sf_splat(float x) {
	return (v4sf) { x, x, x, x };
}

inline v4sf v4sf_load(const float* a) {
	return *((const v4sf*)a);
}

inline void v4sf_store(float* a, v4sf x) {
	*((v4sf*)a) = x;
}
