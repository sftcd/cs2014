#include <stdio.h>
#include <stdlib.h> // for abs
#include <string.h> // for strlen
#include <strings.h> // for strncasecmp

int validchar(char ch) {
  // we know the ascii table has these continuities
  if (ch >= 'A' && ch <= 'Z')
    return (0);
  if (ch >= 'a' && ch <= 'z')
    return (0);
  if (ch >= '0' && ch <= '9')
    return (0);
  if (ch == '.' || ch == '-' || ch == '_')
    return (0);
  return (1);
}

int checkDNSValid(char *str) {
  if (!str)
    return (1);
  if (strlen(str) == 0)
    return (2);
  if (strlen(str) > 255)
    return (2);
  // chars valid?
  for (char *ch = str; *ch; ch++)
    if (validchar(*ch))
      return (3);
  if (str[0] == '.' && strlen(str) != 1)
    return (4);
  if (str[0] == '.')
    return (5);
  // labels not too long?
  int labellen = 0;
  for (char *ch = str; *ch; ch++) {
    labellen++;
    if (*ch == '.') {
      if (*(ch - 1) == '.')
        return (6); // no two dots in a row
      // new label
      if (labellen > 63)
        return (7);
      labellen = 0;
    }
  }
  // last label
  char *ll = &str[strlen(str) - labellen];
  int shorty = 0;
  if ((strlen(str) - strlen(ll)) <= 4)
    shorty = 1;
  if (!shorty && ll[0] == 'x' && ll[1] == 'n' && ll[2] == '-' && ll[3] == '-')
    return (0);
  for (char *ch = ll; *ch; ch++) {
    if (*ch == '-' || *ch == '_' || (*ch >= '0' && *ch <= '9'))
      return (7);
  }
  return (0);
}

int compareDNSNames(char *str1, char *str2) {
  if (checkDNSValid(str1) || checkDNSValid(str2))
    return (8);
  int s1len = strlen(str1);
  int s2len = strlen(str2);
  if (s1len != s2len) {
    // only good option is one ends in a trailing dot and otherwwise same
    int shortlen = s1len;
    int longlen = s2len;
    if (s2len < s1len) {
      // swap
      shortlen = s2len;
      longlen = s1len;
    }
    if (abs(s1len - s2len) != 1)
      return (9);
    if (strncasecmp(str1, str2, shortlen))
      return (10);
    if (s2len < s1len) {
      if (str1[s1len - 1] != '.')
        return (11);
    } else {
      if (str2[s2len - 1] != '.')
        return (12);
    }
  } else {
    if (strncasecmp(str1, str2, s1len))
      return (11);
  }
  return (0);
}

int main(int argc, char *argv[]) {
  if (argc == 2) {
    int rv = checkDNSValid(argv[1]);
    printf("Checked %s - result: %d\n", argv[1], rv);
  }
  if (argc == 3) {
    int rv = compareDNSNames(argv[1], argv[2]);
    printf("Compared %s and %s - result: %d\n", argv[1], argv[2], rv);
  }
  return (0);
}
