#include <stdlib.h>

/*!
 * @brief: determine the size of a file
 * @input: fname is the file name
 * @input: fsize is a pointer to a size_t for the file size result
 * @return: zero for success, non-zero otherwise
 */
int getfsize(char *fname, size_t *fsize);

