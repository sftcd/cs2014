#include <iostream>
using namespace std;

double &biggest (double &r, double &s)
{
   if (r > s) return r;
   else       return s;
}

int main ()
{
   double k = 3;
   double m = 7;

   cout << "k: " << k << endl;
   cout << "m: " << m << endl;
   cout << endl;

   biggest (k, m) = 10;

   cout << "k: " << k << endl;
   cout << "m: " << m << endl;
   cout << endl;

   biggest (k, m) ++;

   cout << "k: " << k << endl;
   cout << "m: " << m << endl;
   cout << endl;

   return 0;
}

