kernel void eye_f32(
    uint rows,
    uint columns,
    int diagonal,
    global float* out)
{
    const uint i = get_global_id(0);
    const uint j = get_global_id(1);
    if (diagonal > 0) {
        if (j-i == diagonal && (i <= rows - diagonal || columns > rows)) {
            out[columns * i + j] = 1.0f;
        } else {
            out[columns * i + j] = 0.0f;
        }
    } else if (diagonal < 0) {
        if (j - i == diagonal && (i >= diagonal * -1)) {
            out[columns * i + j] = 1.0f;
        } else {
            out[columns * i + j] = 0.0f;
        }
    } else {
        if (j == i) {
            out[columns * i + j] = 1.0f;
        } else {
            out[columns * i + j] = 0.0f;
        }
    }
}

kernel void eye_f64(
    uint rows,
    uint columns,
    int diagonal,
    global double* out) 
{
    const uint i = get_global_id(0);
    const uint j = get_global_id(1);
    if (diagonal > 0) {
        if (j-i == diagonal && (i <= rows - diagonal || columns > rows)) {
            out[columns * i + j] = 1.0;
        } else {
            out[columns * i + j] = 0.0;
        }
    } else if (diagonal < 0) {
        if (j - i == diagonal && (i >= diagonal * -1)) {
            out[columns * i + j] = 1.0;
        } else {
            out[columns * i + j] = 0.0;
        }
    } else {
        if (j == i) {
            out[columns * i + j] = 1.0;
        } else {
            out[columns * i + j] = 0.0;
        }
    }

}


