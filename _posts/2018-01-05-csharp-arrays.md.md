---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: C# Array
description: In this article, we will look at what an C# array is, how it is used, and what it can do.
comments: true
permalink: /csharp-array/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---

In this article, we will look at what an array is, how it is used, and what it can do.

Understanding arrays can be a little difficult in the beginning. But give it a try anyway... I have tried to make it as easy as possible.

<!--more-->

What is an array?
An array is a set of indexed elements where each has its own, unique identification number.

Sound confusing? It's actually not that complicated.

Imagine a list of words separated by commas. It is called a comma-separated list, and it could, for example, look like this:


```txt
apples, pears, bananas, oranges, lemons
```
	
	
Then try to imagine dividing the list at each comma. Next, give each section a unique identification number like this:

apples (0), pears (1), bananas (2), oranges (3), lemons (4)
What you see is an array. We can, for example, name the array "fruits". The idea is that we can access the array with a number and get a value back, like this:

fruits(0) = apples
fruits(1) = pears
fruits(2) = bananas
fruits(3) = oranges
fruits(4) = lemons

This is the idea behind arrays. Let us try to use it in practice.

## Contents
- [C# Single-Dimensional Arrays](#c-single-dimensional-arrays)
    - [C# Loop Through An Array](#c-loop-through-an-array)
    - [C# Foreach Loop](#c-foreach-loop)
- [C# Rectangular Arrays](#c-rectangular-arrays)
- [C# Jagged Arrays](#c-jagged-arrays)

## C\# Single-Dimensional Arrays

How do you use an array?

We will continue with the fruit example. Step by step, we will make it work as a real array. First, we set a string variable equal to the list of fruits:


```cs
string fruitlist = "apples,pears,bananas,oranges,lemons";
```
	
	
Next, we use the string method `Split` to split the list at each comma:


```cs
string fruitlist = "apples,pears,bananas,oranges,lemons";	 
string[] arrFruits = fruitlist.Split(',');
```
	
	
Voila! `arrFruits` is now an array!

Notice that we called the method Split with one argument:

the delimiter - i.e., the character used to split (in this case a comma) - in single quotation marks: ','.
Here we use a comma as a delimiter, but you can use any character or word as a delimiter.

Let us try to comment the script and display it into our console:


```cs
class Program
{
    static void Main(string[] args)
    {
        // Comma separated list
        string fruitlist = "apples,pears,bananas,oranges,lemons";
        // Create an array by splitting the list (with comma as delimiter)
        string[] arrFruits = fruitlist.Split(',');

        // Write the values from our array
        Console.WriteLine("The list of fruits:");
        Console.WriteLine(arrFruits[0]);
        Console.WriteLine(arrFruits[1]);
        Console.WriteLine(arrFruits[2]);
        Console.WriteLine(arrFruits[3]);
        Console.WriteLine(arrFruits[4]);

        Console.ReadLine();
    }
}
```
	
This example is very simple, and it might be a bit difficult to see the advantage of using an array for this particular task. But just wait... arrays can be used for many very useful things.

### C\# Loop Through An Array
In previous lessons you learned about loops. Now we will look at how you can loop through an array.

When you know how many elements an array contains, it is not a problem defining the loop. You simply start with 0 and let the loop continue to the number of items available. In the example with the fruits, you would loop through the array like this:


```cs
class Program
{
    static void Main(string[] args)
    {
        // Comma separated list
        string fruitlist = "apples,pears,bananas,oranges,lemons";
        // Create an array by splitting the list (with comma as delimiter)
        string[] arrFruits = fruitlist.Split(',');

        // Write the values from our array
        Console.WriteLine("The list of fruits:");
        for (int i = 0; i <= 4; i++) 
        {
            Console.WriteLine(arrFruits[i]);
        }

        Console.ReadLine();
    }
}
```
	
As you can see, the variable `i` (which increases from 0 to 4 in the loop) was used to call the array.

How to find the size of an array
But what if we add another fruit to the list? Then our array will contain one element more - which will get the identification number 5. Do you see the problem? Then we need to change the loop, so it runs from 0 to 5, or else not all of the elements will be included.

Wouldn't it be nice if we automatically could find out how many elements an array contains?

That's exactly what we can do with the Length property. Now we can make a loop that works regardless of the number of elements:

### C\# Foreach Loop
```cs
foreach (string fruit in arrFruits)
{
    Console.WriteLine(fruit);
}
```
	
This loop will work regardless of how many or few elements the array contains.

Another example
Below is another example of how you can use an array to write the name of the month:


```cs
class Program
{
    static void Main(string[] args)
    {
        // Creates array with each month.
        // Creates array with the months. 
        //Note the comma before January - because there 
        //is no month with the number 0
        string[] arrMonths = new string[] { "",
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December" };

        // Call the array with the number of the month - write to the client
        Console.WriteLine(arrMonths[DateTime.Now.Month]);
        Console.ReadLine();
    }
}
```

Notice that we use the new keyword instead of the Split method to create an array.

The type of each array declared is given firstly by the type of basic elements it can hold, and secondly by the number of dimensions it has. Arrays have a single dimension (ie, are of rank 1). They are declared using square brackets, eg:

```cs
int[] i = new int[100];
```

This line of code declares variable i to be an integer array of size 100. It contains space for 100 integer elements, ranging from i[0] to i[99].

To populate an array one can simply specify values for each element, as in the following code:

```cs
int[] i = new int[2];
i[0] = 1;
i[1] = 2;
```
One can also run together the array declaration with the assignment of values to elements using

```cs
int[] i = new int[] {1,2};
```
or the even shorter version of this:

```cs
int[] i = {1,2};
```

By default, as we have seen, all arrays start with their lower bound as 0 (and we would recommend that you stick with this default). However, using the .NET framework's System.Array class it is possible to create and manipulate arrays with an alternative initial lower bound.

The (read-only) Length property of an array holds the total number of its elements across all of its dimensions. As single-dimensional arrays have just one dimension, this property will hold the length of the single dimension. For instance, given the definition of array i above, i.Length is 2.

## C\# Rectangular Arrays

C# supports two types of multidimensional arrays: rectangular and jagged. A rectangular array is a single array with more than one dimension, with the dimensions' sizes fixed in the array's declaration. The following code creates a 2 by 3 multi-dimensional array:

```cs
int[,] squareArray = new int[2,3];
```
As with single-dimensional arrays, we learned before, rectangular arrays can be filled at the time they are declared. For instance, the code

```cs
int[,] squareArray = { {1, 2, 3}, {4, 5, 6} };
```


creates a 2 by 3 array with the given values. It is, of course, important that the given values do fill out exactly a rectangular array.

The System.Array class includes a number of methods for determining the size and bounds of arrays. These include the methods GetUpperBound(int i) and GetLowerBound(int i), which return, respectively, the upper and lower subscripts of dimension i of the array (note that i is zero based, so the first array is actually array 0).

For instance, since the length of the second dimension of squareArray is 3, the expression

```cs
squareArray.GetLowerBound(1)
```
returns 0, and the expression

```cs
squareArray.GetUpperBound(1)
```
returns 2.

`System.Array` also includes the method GetLength(int i), which returns the number of elements in the ith dimension (again, zero based).

The following piece of code loops through squareArray and writes out the value of its elements (loops are covered in lesson 9).

```cs
for(int i = 0; i < squareArray.GetLength(0); i++)
    for (int j = 0; j < squareArray.GetLength(1); j++)
        Console.WriteLine(squareArray[i,j]);
```


A foreach loop can also be used to access each of the elements of an array in turn, but using this construction one doesn't have the same control over the order in which the elements are accessed.

## C\# Jagged Arrays

Using jagged arrays, one can create multidimensional arrays with irregular dimensions. This flexibility derives from the fact that multidimensional arrays are implemented as arrays of arrays. The following piece of code demonstrates how one might declare an array made up of a group of 4 and a group of 6 elements:

```cs
int[][] jag = new int[2][];
jag[0] = new int [4];
jag[1] = new int [6];
```

The code reveals that each of jag[0] and jag[1] holds a reference to a single-dimensional int array. To illustrate how one accesses the integer elements: the term jag[0][1] provides access to the second element of the first group.

To initialise a jagged array whilst assigning values to its elements, one can use code like the following:

```cs
int[][] jag = new int[][] {new int[] {1, 2, 3, 4}, new int[] {5, 6, 7, 8, 9, 10}};
```

Be careful using methods like GetLowerBound, GetUpperBound, GetLength, etc. with jagged arrays. Since jagged arrays are constructed out of single-dimensional arrays, they shouldn't be treated as having multiple dimensions in the same way that rectangular arrays do.

To loop through all the elements of a jagged array one can use code like the following:

```cs
for (int i = 0; i < jag.GetLength(0); i++)
    for (int j = 0; j < jag[i].GetLength(0); j++)
        Console.WriteLine(jag[i][j]);
```

or

```cs
for (int i = 0; i < jag.Length; i++)
    for (int j = 0; j < jag[i].Length; j++)
        Console.WriteLine(jag[i][j]);
```

