---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: C# Pointer
description: A pointer is a variable that holds the memory address of another type. In C#, pointers can only be declared to hold the memory addresses of value types. This article gives a brief overview of pointers and their use in C#.
comments: true
permalink: /csharp-pointer/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---

This article gives a brief overview of pointers and their use in C#. Pointers are only really needed in C# where execution speed is highly important.

A pointer is a variable that holds the memory address of another type. In C#, pointers can only be declared to hold the memory addresses of value types (except in the case of arrays - see below).

## Contents

- [Declaring A C\# Pointer Type](#declaring-a-c-pointer-type)
- [C\# Pointers & Structures](#c-pointers-and-structures)
- [C\# Unsafe Code](#c-unsafe-code)
- [C\# Pointers, Methods and Arrays](#c-pointers-methods-and-arrays)

## Declaring A C\# Pointer Type

Pointers are declared implicitly, using the 'dereferencer' symbol `*`, as in the following example:

{% highlight csharp linenos %}

int *p;
{% endhighlight %}
Note that some coders place the dereferencer symbol immediately after the type name, eg.

{% highlight csharp linenos %}

int* p;
{% endhighlight %}
This variation appears to work just as well as the previous one.

This declaration sets up a pointer `p`, which will point to the initial memory address of an integer (stored in four bytes).

The combined syntactical element `*p` (`p` prefixed by the dereferencer symbol `*`) is used to refer to the type located at the memory location held by p. Hence given its declaration, `*p` can appear in integer assignments like the following:

{% highlight csharp linenos %}

*p = 5;
{% endhighlight %}

This code gives the value 5 to the integer that was initialised by the declaration. It is important, however, not to confuse such an assignment with one in which the derefencer symbol is absent, e.g.

{% highlight csharp linenos %}

p = 5;
{% endhighlight %}

The effect of this assignment is to change the memory location held by p. It doesn't change the value of the integer initialised by the original declaration; it just means that p no longer points to that integer. In fact, p will now point to the start of the four bytes present at memory location 5.

Another important symbol for using pointers is the operator &, which in this context returns the memory address of the variable it prefixes. To give an example of this symbol, the following code sets up p to point to integer i's memory location:

{% highlight csharp linenos %}

int i = 5;
int *p;
p = &i;
{% endhighlight %}

Given the above, the code

{% highlight csharp linenos %}

*p = 10;
{% endhighlight %}
changes the value of i to 10, since `*p` can be read as 'the integer located at the memory value held by p'.

## C\# Pointers & Structures {#c-pointers-and-structures}

There is another important piece of notation for pointers. Pointers can be declared for [structs](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/structs), as in the following example (which uses the 'Coords' struct defined further below):

{% highlight csharp linenos %}

Coords x = new Coords();
Coords *y = &x;
{% endhighlight %}

One can then use the declared pointer y to access a public field of x (say z). This would be done using either the expression

{% highlight csharp linenos %}

(*y).z
{% endhighlight %}

or the equivalent expression, which uses the -> string:

{% highlight csharp linenos %}

y -> z
{% endhighlight %}

## C\# Unsafe Code

A major problem with using pointers in C# is that C# operates a background garbage collection process. In freeing up memory, this garbage collection is liable to change the memory location of a current object without warning. 

So any pointer which previously pointed to that object will no longer do so. Such a scenario leads to two potential problems. Firstly, it could compromise the running of the C# program itself. Secondly, it could affect the integrity of other programs.

Because of these problems, the use of pointers is restricted to code which is explicitly marked by the programmer as 'unsafe'. Because of the potential for malicious use of unsafe code, programs which contain unsafe code will only run if they have been given full trust.

To address the problem of garbage collection, one can declare a pointer within a 'fixed' expression. This 'pins' the location of the type pointed to - the memory location of the type therefore remains static, safe from garbage collection. Note that the fixed statement can only be used within the context of unsafe code.

There is a further quirk to learn. Any value types declared within unsafe code are automatically 'fixed', and will generate compile-time errors if used within fixed expressions. The same is not true of reference types, however (for the difference between value and reference types see [C# Variable Types](/csharp-variable-types/)).

The following code gives an example of a method marked 'unsafe'. From the previous paragraph it follows that the pointer p cannot be declared within a 'fixed' statement on line 9, because `p` is set up to point to the struct `c` (a value type) which is declared within the unsafe code

{% highlight csharp linenos %}

using System;
public struct Coords
{
    int x;
    int y;
    unsafe public static void Main()
    {
        Coords c = new Coords();
        Coords *p = &c;
        {
            p->y = 6;
            (*p).x = 5;
        }
        Console.WriteLine(c.y);
        Console.WriteLine(c.x);
    }
}
{% endhighlight %}


Compare this with the following code, in which the pointer `p` on line 8 must be declared within a 'fixed' statment, because it is set up to point to a type which is not declared within the unsafe block of code:

{% highlight csharp linenos %}

using System;
public struct Coords
{
    int x;
    int y;
    unsafe public static void notMain(ref Coords c)
    {
        fixed (Coords *p = &c)
        {
            p->y = 6;
            (*p).x = 5;
        }
        Console.WriteLine(c.y);
        Console.WriteLine(c.x);
    }
}
{% endhighlight %}


In the examples given above, 'unsafe' is included as a method modifier. However, it can also be used within a code block, as in the following code fragment:

{% highlight csharp linenos %}

using System;
public static void Main()
{
    unsafe
    {
        Coords c = new Coords();
        [...]
    }
}
{% endhighlight %}

## C\# Pointers, Methods and Arrays

Although we stated above that pointers can only be used with value types, an exception to this involves arrays (some authors state that the same exception applies to strings, but we have never been able to make this work).

A pointer can be declared in relation to an array, as in the following:

{% highlight csharp linenos %}

int[] a = {4, 5};
int *b = a;
{% endhighlight %}

What happens in this case is that the memory location held by b is the location of the first type held by a. This first type must, as before, be a value type. The code beneath shows that it is possible to step through the values of an array using a pointer, but explaining this further goes beyond the scope of this tutorial.

{% highlight csharp linenos %}

using System;
public class Tester
{
    public static void Main()
    {
        int[] a = {4, 5};
        changeVal(a);
        Console.WriteLine(a[0]);
        Console.WriteLine(a[1]);
    }
    
    public unsafe static void changeVal(int[] a)
    {
        fixed (int *b = a)
        {
            *b = 5;
            *(b + 1) = 7;
        }
    }
}
{% endhighlight %}

This article only scratches the surface of a complicated topic, however, so if you are new to pointers it is recommended that you do further reading before using them in your code.