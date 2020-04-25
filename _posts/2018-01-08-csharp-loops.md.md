---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: C# Loops
description: In this article, we will look at C# loops. Loops can be used to repeat parts of a code a specified number of times or until a certain condition is met.
comments: true
permalink: /csharp-loops/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---


In C#, it is possible to manage the execution of code with different control structures. In this article, we will look at loops. Loops can be used to repeat parts of a code a specified number of times or until a certain condition is met.

## Contents

- [C\# While Loops](#c-while-loops)
- [C\# Do-While Loops](#c-do-while-loops)
- [C\# For Loops](#c-for-loops)
- [C\# Nested Loops](#c-nested-loops)
- [C\# Foreach Loops](#c-foreach-loops)
<!--more-->

## C\# While Loops
The syntax for a while loop is:

```cs
while (condition) 
{
	Statement
} 
```
	
	
The syntax can almost be directly translated into English: do something while a condition is met.

Let's look at a simple example:


```cs
class Program
{
    static void Main(string[] args)
    {
        int i = 1;
        while (i <= 10)
        {
            Console.WriteLine("This text is repeated 10 times");
            i = i + 1;
        }
        Console.ReadLine();
    }
}

/*
This example produces the following results:
This text is repeated 10 times
This text is repeated 10 times
This text is repeated 10 times
This text is repeated 10 times
This text is repeated 10 times
This text is repeated 10 times
This text is repeated 10 times
This text is repeated 10 times
This text is repeated 10 times
This text is repeated 10 times
*/
```
	
In the example, a variable named `i` is used. As you can see, variables in C# always start with a datatype int in our case.

Apart from that, the example is almost self-explanatory. First the variable `i` is set to be equal to 1. Then the loop asks the .NET to repeat the text while `i` is less or equal to 50. In each loop, the variable `i` will be increased by 1.

## C\# Do-While Loops

A 'do-while' loop is just like a 'while' loop except that the condition is evaluated after the block of code specified in the 'do' clause has been run. So even where the condition is initially false, the block runs once. For instance, the following code outputs '4':

```cs
int a = 4;
do
{
    System.Console.WriteLine(a);
    a++;
} while (a < 3);
```


## C# For Loops
Another way to make a loop is with for statement in the following form:

	
```txt
for (Initialization; Condition; Step) 
{
	 Statement
}
```
	
	
The statement is repeated as long as 'Initialization' + 'Step' meets the 'Condition'. If that doesn't make sense, look at this example:

```cs
class Program
{
    static void Main(string[] args)
    {
        for (int i = 0; i <= 50; i = i + 5) 
        {
            Console.WriteLine("variable i is now = "+ i );
        }
        Console.ReadLine();
    }
}

/*
This example produces the following results:
variable i is now = 0
variable i is now = 5
variable i is now = 10
variable i is now = 15
variable i is now = 20
variable i is now = 25
variable i is now = 30
variable i is now = 35
variable i is now = 40
variable i is now = 45
variable i is now = 50
*/
```
	
In the example above, `i` is growing with the value 5 in each loop. The loop will continue as long as `i` is below or equals 50. Also note how the value `i` is used as part of the sentence.

## C# Nested Loops

In principle, there are no limitations on how loops can be used. For instance, you can easily put loops inside loops and thereby create many repeats.

```cs
class Program
{
    static void Main(string[] args)
    {
        for (int i = 1; i <= 10; i++)
        {
            for (int j = 1; j <= 10; j++)
            {
                Console.Write( j + "X" + i + "=" +  j * i + "\t");
            }
            Console.WriteLine();
        }
        Console.ReadLine();
    }
}

/*
This example produces the following results:
1X1=1   2X1=2   3X1=3   4X1=4   5X1=5   6X1=6   7X1=7   8X1=8   9X1=9   10X1=10
1X2=2   2X2=4   3X2=6   4X2=8   5X2=10  6X2=12  7X2=14  8X2=16  9X2=18  10X2=20
1X3=3   2X3=6   3X3=9   4X3=12  5X3=15  6X3=18  7X3=21  8X3=24  9X3=27  10X3=30
1X4=4   2X4=8   3X4=12  4X4=16  5X4=20  6X4=24  7X4=28  8X4=32  9X4=36  10X4=40
1X5=5   2X5=10  3X5=15  4X5=20  5X5=25  6X5=30  7X5=35  8X5=40  9X5=45  10X5=50
1X6=6   2X6=12  3X6=18  4X6=24  5X6=30  6X6=36  7X6=42  8X6=48  9X6=54  10X6=60
1X7=7   2X7=14  3X7=21  4X7=28  5X7=35  6X7=42  7X7=49  8X7=56  9X7=63  10X7=70
1X8=8   2X8=16  3X8=24  4X8=32  5X8=40  6X8=48  7X8=56  8X8=64  9X8=72  10X8=80
1X9=9   2X9=18  3X9=27  4X9=36  5X9=45  6X9=54  7X9=63  8X9=72  9X9=81  10X9=90
1X10=10 2X10=20 3X10=30 4X10=40 5X10=50 6X10=60 7X10=70 8X10=80 9X10=90 10X10=100
*/
```
	
In this example, we have created a multiplication table from 1 to 10 you can easily change the value for variable i and j and extend the table.

## C\# Foreach Loops

The 'foreach' loop is used to iterate through the values contained by any object which implements the IEnumerable interface. When a 'foreach' loop runs, the given variable1 is set in turn to each value exposed by the object named by variable2. As we have seen previously, such loops can be used to access array values. So, we could loop through the values of an array in the following way:

```cs
int[] a = new int[]{1,2,3};
foreach (int b in a)
    System.Console.WriteLine(b);
```


The main drawback of 'foreach' loops is that each value extracted (held in the given example by the variable 'b') is read-only.

