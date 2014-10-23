#include <stdint.h>
#include <malloc.h>
#include <stdlib.h>
#include <string.h>

#include <common/IdMap.h>

struct Entry {
#ifdef __native_client__
	int32_t instance;
#endif
	int32_t id;
	void* pointer;
};

int32_t FJS_ID_Allocations = 0;

static struct Entry* entriesBuffer = NULL;
static size_t entriesCount = 0;
static size_t entriesCapacity = 0;

static size_t computeExpansionCapacity(size_t capacity) {
	return capacity + 128;
}

static struct Entry* findEntry(
#ifdef __native_client__
	PP_Instance instance,
#endif
	int32_t id)
{
	for (struct Entry *currentEntry = entriesBuffer, *endEntry = &entriesBuffer[entriesCount]; currentEntry != endEntry; currentEntry++) {
		#ifdef __native_client__
			if ((currentEntry->id == id) && (currentEntry->instance == instance)) {
				return currentEntry;
			}
		#else
			if (currentEntry->id == id) {
				return currentEntry;
			}
		#endif
	}
	return NULL;
}

void* FJS_GetPointerFromId(
#ifdef __native_client__
	PP_Instance instance,
#endif
	int32_t id)
{
	#ifdef __native_client__
		const struct Entry* entry = findEntry(instance, id);
	#else
		const struct Entry* entry = findEntry(id);
	#endif
	if (entry == NULL) {
		return NULL;
	} else {
		return entry->pointer;
	}
}

void FJS_ReleaseId(
#ifdef __native_client__
	PP_Instance instance,
#endif
	int32_t id)
{
	#ifdef __native_client__
		struct Entry* releasedEntry = findEntry(instance, id);
	#else
		struct Entry* releasedEntry = findEntry(id);
	#endif
	if (releasedEntry != NULL) {
		struct Entry* beginMovableEntry = releasedEntry + 1;
		struct Entry* endMovableEntry = &entriesBuffer[entriesCount];
		const size_t movableEntriesSize = (endMovableEntry - beginMovableEntry) * sizeof(struct Entry);
		memmove(releasedEntry, beginMovableEntry, movableEntriesSize);
		entriesCount -= 1;
		FJS_ID_Allocations -= 1;
	}
}

void FJS_AllocateId(
#ifdef __native_client__
	PP_Instance instance,
#endif
	int32_t id,
	void* pointer)
{
	if (entriesCount + 1 > entriesCapacity) {
		entriesCapacity = computeExpansionCapacity(entriesCapacity);
		entriesBuffer = realloc(entriesBuffer, entriesCapacity * sizeof(struct Entry));
	}
	const struct Entry entry = {
#ifdef __native_client__
		.instance = instance,
#endif
		.id = id,
		.pointer = pointer
	};
	entriesBuffer[entriesCount] = entry;
	entriesCount += 1;
	FJS_ID_Allocations += 1;
}
