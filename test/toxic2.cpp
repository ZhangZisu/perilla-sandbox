#include <cstdio>
#include <unistd.h>
#include <cstring>
#include <cstdlib>

int main()
{
    if (!fork()) // child
    {
        while (1)
        {
            fork();
        }
    }
    puts("hello, world");
    int *a = (int*)malloc(1024 * 1024 * 10);
    a[0] = 456;
    a[1024 * 1024 * 100 / sizeof(int) - 1] = 123;
    return 233;
}