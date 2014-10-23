#pragma once

#include <stdint.h>
#ifdef __native_client__
#include <ppapi/c/pp_instance.h>
#endif

extern void* FJS_GetPointerFromId(
#ifdef __native_client__
	PP_Instance instance,
#endif
	int32_t id);
extern void FJS_ReleaseId(
#ifdef __native_client__
	PP_Instance instance,
#endif
	int32_t id);
extern void FJS_AllocateId(
#ifdef __native_client__
	PP_Instance instance,
#endif
	int32_t id,
	void* pointer);

extern int32_t FJS_ID_Allocations;
