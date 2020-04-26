---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: C# Variable Types
description: In this article you will learn about defining types and declaring variables in C#.
comments: true
permalink: /csharp-variable-types/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---

C# is a type-safe language. Variables are declared as being of a particular type, and each variable is constrained to hold only values of its declared type.

Variables can hold either value types or reference types, or they can be pointers. This lesson covers the first two options; pointers are discussed in then next lesson.

Here's a quick overview of the difference between value types and reference types.

- where a variable v contains a value type, it directly contains an object with some value. No other variable v\' can directly contain the object contained by v (although v\' might contain an object with the same value).

- where a variable v contains a reference type, what it directly contains is something which refers to an object. Another variable v\' can contain a reference to the same object refered to by v.

## Contents
- [C\# Value Types](#c-value-types)
- [C\# Reference Types](#c-reference-types)
- [C\# String](#c-string)
- [Boxing And Unboxing In C\#](#boxing-and-unboxing-in-c)

## C\# Value Types

A data type is a value type if it holds a data value within its own memory space. It means variables of these data types directly contain their values.

In the following lines of code, two variables are declared and set with integer values.

{% highlight csharp linenos %}

int x = 10;
int y = x;
y = 20; // after this statement x holds value 10 and y holds value 20
{% endhighlight %}

![A picture illustrating a value type object](/assets/images/value_type.png)

It is possible in C# to define your own value types by declaring [enumerations](https://docs.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/enums) or [structs](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/structs). These user-defined types are mostly treated in exactly the same way as C#'s predefined value types, although compilers are optimised for the latter. 

The following table lists, and gives information about, the predefined value types. Because in C# all of the apparently fundamental value types are in fact built up from the (actually fundamental) object type, the list also indicates which System types in the .Net framework correspond to these pre-defined types.

C# Type	| .Net Framework (System) type | Signed? | Bytes Occupied | Possible Values
sbyte | System.Sbyte | Yes | 1 | -128 to 127
short | System.Int16 | Yes | 2 | -32768 to 32767
int | System.Int32 | Yes | 4 | -2147483648 to 2147483647
long | System.Int64 | Yes | 8 | -9223372036854775808 to 9223372036854775807
byte | System.Byte | No | 1 | 0 to 255
ushort | System.Uint16 | No | 2 | 0 to 65535
uint | System.UInt32 | No | 4 | 0 to 4294967295
ulong | System.Uint64 | No | 8 | 0 to 18446744073709551615
float | System.Single | Yes | 4 | Approximately ±1.5 x 10-45 to ±3.4 x 1038 with 7 significant figures
double | System.Double | Yes | 8 | Approximately ±5.0 x 10-324 to ±1.7 x 10308 with 15 or 16 significant figures 
decimal | System.Decimal | Yes | 12 | Approximately ±1.0 x 10-28 to ±7.9 x 1028 with 28 or 29 significant figures
char | System.Char | N/A | 2 | Any Unicode character (16 bit)
bool | System.Boolean | N/A | 1 / 2 | true or false


## C\# Reference Types

Reference types actually hold the value of a memory address occupied by the object they reference. Consider the following piece of code, in which two variables are given a reference to the same object (for the sake of the example, this object is taken to contain the numeric property 'myValue').

{% highlight csharp linenos %}

object x = new object();
x.myValue = 10;
object y = x;
y.myValue = 20; // after this statement both x.myValue and y.myValue equal 20
{% endhighlight %}

This code illustrates how changing a property of an object using a particular reference to it is reflected in all other references to it. 

![A picture illustrating a reference type object](/assets/images/reference_type.png)

The pre-defined reference types are object and string, where object - is the ultimate base class of all other types. 

New reference types can be defined using [class](/csharp-object-oriented-programming/#c-classes-and-types), [interface](/csharp-object-oriented-programming/#c-interfaces), and [delegate](/delegates-and-events-in-csharp/) declarations.


## C\# String

However, that although strings are reference types, they work rather more like value types. When one string is set to the value of another, eg

{% highlight csharp linenos %}

string s1 = "hello";
string s2 = s1;
{% endhighlight %}
Then s2 does at this point reference the same string object as s1. However, when the value of s1 is changed, for instance with

{% highlight csharp linenos %}

s1 = "goodbye";
{% endhighlight %}
what happens is that a new string object is created for s1 to point to. Hence, following this piece of code, s1 equals "goodbye", whereas s2 still equals "hello".

The reason for this behaviour is that string objects are 'immutable'. That is, the properties of these objects can't themselves change. So in order to change what a string variable references, a new string object must be created.

You can learn more about c# strings [here](/c-string/).

## Boxing And Unboxing In C\#
C# allows you convert any value type to a corresponding reference type, and to convert the resultant 'boxed' type back again. The following piece of code demonstrates boxing. 

When the second line executes, an object is initiated as the value of 'box', and the value held by i is copied across to this object. It is interesting to note that the runtime type of box is returned as the boxed value type; the 'is' operator thus returns the type of box below as 'int'.

{% highlight csharp linenos %}

int i = 123;
object box = i; // boxing happens here
if (box is int)
{
	Console.Write("Box contains an int"); // this line is printed
} 
int x = (int)box; // unboxing happens here
{% endhighlight %}

The important difference between a value type and a reference type is that the value type
stores its value directly. A reference type stores a reference that points to an object on the heap that contains the value.

So boxing is the process of taking a value type, putting it inside a new object on the heap, and storing a reference to it on the stack. Unboxing is the exact opposite: It takes the item from the heap and returns a value type that contains the value from the heap.

If you execute an invalid unbox operation, the runtime will throw an InvalidCastException. You won’t see the error at compile time because the compiler trusts you in making the right call. At runtime, however, the conversion fails, and an exception is thrown.

The only other important thing to know is that when boxing and unboxing happen (as shown in the above example, unboxing is clear), you need to explicitly cast your object from a reference to a value type. 

Boxing, on the other hand, is not that obvious. For example, calling GetType always boxes your value type because GetType is defined only on an object and can’t be overridden.

{% highlight csharp linenos %}

int i = 3;
Type t = i.GetType();
{% endhighlight %} 

Boxing occurs in other situations, too. One that can come as a surprise is that a value type is boxed when you use it as an interface. This snippet boxes the value 3 so you can use it as an interface.

{% highlight csharp linenos %}

IFormattable x = 3;
{% endhighlight %}

There are some performance implications with each box and unbox operation. When using the nongeneric collections to store a value type, you have a lot of those operations. The boxing and unboxing operations can hurt performance; however, now that you have generic support in the .NET Framework, this is less of an issue because you can store value types in a collection without boxing them.
