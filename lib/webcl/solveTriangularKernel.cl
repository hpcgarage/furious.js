kernel void solveTriangular_f32(
	global float* A,
	global float* Y,
	global float* X,
	uint colsX,
	uint rows)
{
	const uint col = get_global_id(0);

	for (uint i = 0; i < rows; i++) {
		float Xii = Y[i*colsX + col];
		for (uint j = 0; j < i; j++) {
			Xii -= A[i*rows + j] * Y[j*colsX + col];
		}
		X[i * colsX + col] = (Xii / A[i*rows + i]);
	}

}



kernel void solveTriangular_f64(
	global double* A,
	global double* Y,
	global double* X,
	uint colsX,
	uint rows)
{
	const uint col = get_global_id(0);

	for (uint i = 0; i < rows; i++) {
		double Xii = Y[i*colsX + col];
		for (uint j = 0; j < i; j++) {
			Xii -= A[i*rows + j] * Y[j*colsX + col];
		}
		X[i * colsX + col] = (Xii / A[i*rows + i]);
	}

}