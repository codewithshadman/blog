---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: C# Operator
description: C# Operators are symbols that tells the .NET CLR to perform specific operations on operands for producing the final result. This tutorial explains the arithmetic, relational, logical, bitwise, assignment, and other c# operators one by one.
comments: true
permalink: /csharp-operator/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---

C# Operators are symbols that tells the .NET CLR to perform specific operations on operands for producing the final result. C# has a number of standard operators, taken from C, C++ and Java. Most of these should be quite familiar to programmers. 

The table below lists the standard operators. Note that when writing classes it is possible to change the default behaviour of some of these operators (ie to 'overload' the operator), although this should only be done where the resultant semantics makes sense. The below table also indicates which of the operators are overloadable.

## Contents
- [C\# Primary Operators](#c-primary-operators)
- [C\# Unary Operators](#c-unary-operators)
- [C\# Type Operators](#c-type-operators)
- [C\# Arithmetic Operators](#c-arithmetic-operators)
- [C\# Relational And Logical Operators](#c-relational-and-logical-operators)
- [C\# Operator Overloading](#c-operator-overloading)


## C\# Primary Operators

 Name | Syntax Example | Overloadable?
 Grouping | `(a+b)` | No
 Member | `A.B` | No
 Struct pointer member access | `A->B` | No
 Method call | `f(x)` | No
 Post increment | `c++` | Yes
 Post decrement | `c--` | Yes
 Constructor call | `c = new Coord();` | No
 Array stack allocation | `int* c = stackalloc int[10]` | No
 Struct size retrieval | `sizeof (int)` | No
 Arithmetic check on | `checked {byte c = (byte) d;}` | No
 Arithmetic check off | `unchecked {byte c = (byte) d;}` | No

## C\# Unary Operators

 Name | Syntax Example | Overloadable?
 Positive value | `+10` | Yes
 Negative value | `-10` | Yes
 Not | `!(c==d)` | Yes
 Bitwise complement | `~(int x)` | Yes
 Pre increment | `++c` | Yes
 Pre decrement | `--c` | Yes
 Type cast | `(myType)c` | No
 Value at address | `int* c = d;` | No
 Address value of | `int* c = &d;` | No

## C\# Type Operators

 Name | Syntax Example | Overloadable?
 Type equality / compatibility | `a is String` | No
 Type retrieval | `typeof (int)` | No


## C\# Arithmetic Operators

 Name | Syntax Example | Overloadable?
 Multiplication | `c*d` | Yes
 Division | `c/d` | Yes
 Remainder | `c%d` | Yes
 Addition | `c+d` | Yes
 Subtraction | `c-d` | Yes
 Shift bits right | `c>>3` | Yes
 Shift bits left | `c<<3` | Yes

## C\# Relational And Logical Operators

 Name | Syntax Example | Overloadable?
 Less than | `c<d` | Yes
 Greater than | `c>d` | Yes
 Less than or equal to | `c<=d` | Yes
 Greater than or equal to | `c>=d` | Yes
 Equality | `c==d` | Yes
 Inequality | `c!=d` | Yes
 Bitwise and | `c&d` | Yes
 Bitwise or | `c|d` | Yes
 Logical and | `c&&d` | No
 Logical or | `c||d` | No
 Conditional | `int c=(d<10) ? 5:15` | No

## C\# Operator Overloading

To overload an operator in a class, one defines a method using the 'operator' keyword. For instance, the following code overloads the equality operator. <!--(see lesson 13 for details about methods).-->

{% highlight csharp linenos %}

public static bool operator == (Value a, Value b)
{
	return a.Int == b.Int
}
{% endhighlight %}

Where an operator is one of a logical pair, both operators should be overwritten if any one is. These pairs are the following:

{% highlight text linenos %}

== and !=
< and >
<= and >=
{% endhighlight %}