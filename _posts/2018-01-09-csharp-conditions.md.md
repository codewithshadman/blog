---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: C# Conditions
description: In this article, we will look at C# conditional statements. Conditions are used to execute part of a code only if some predefined conditions are fulfilled.
comments: true
permalink: /csharp-conditions/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---

Conditions are used to execute part of a code only if some predefined requirements (conditions) are fulfilled. For example, a condition could be that a date must be after January 1, 2012 or that a variable is greater than 7.

## Contents

- [C\# If Condition](#c-if-condition)
- [C\# If-Else Condition](#c-if-else-condition)
- [C\# If-Else Ladder](#c-if-else-ladder)
- [C\# Switch Case](#c-switch-case)
- [C\# Jump Statements](#c-jump-statements)
- [C\# Break](#c-break)
- [C\# Continue](#c-continue)
- [C\# Goto](#c-goto)

<!--more-->

## C\# If Condition

The first type of condition we will look at is if-condition, which has the following syntax:

{% highlight csharp linenos %}

if (condition) 
{
   statement
}
{% endhighlight %}
	
Again, the syntax is very close to ordinary English: If a condition is met, then execute something. Let's look at a simple example:

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {
        int i = 2;

        if (i > 1) {
            Console.WriteLine("variable i is greater than 1");
        }

        Console.ReadLine();
    }
}	 
{% endhighlight %}
	
## C\# If-Else Condition

The next type of condition will want to look at is else , which may be presented in the following form:
	
{% highlight csharp linenos %}

if (condition) 
{
	statement
}
else 
{
	statement
}
{% endhighlight %}

	
Again, the syntax is very close to ordinary English: if a condition is met execute something or else execute something else.

In previous chapter, you learned how to find the number of a month. In the following example, we will use the month number in an if-else condition to find out what season it is:


{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {
        var today = DateTime.Now;
        if (today.Month == 3)
        {
            Console.WriteLine("Now it's spring!");
        }
        else
        {
            Console.WriteLine("I do not know what season it is!");
        }

        Console.ReadLine();
    }
}
{% endhighlight %}
	
As you can see, this condition is not a particularly smart condition - it only works when it's March!

However, there are plenty of ways to improve the condition and make it more precise. Below are listed comparison operators that can be used in the condition:

Operators | Description
== | Equals
&lt; | Less than
&gt; | Greater than
&lt;= | Less than or equal to
&gt;= | Greater than or equal to
!= | Not equal to

In addition, there are some logical operators:

Operators | Description
&& | And
&#124; &#124; | Or
! | Not

The operators can be used to develop more precise conditions, so now we can expand the above example to include all the spring months:


{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {
        var today = DateTime.Now;
        if (today.Month >= 3 && today.Month <= 5)
        {
            Console.WriteLine("Now it's spring!");
        }
        else
        {
            Console.WriteLine("Now it's either winter, summer or autumn!");
        }

        Console.ReadLine();
    }
}
{% endhighlight %}

	
	
Let's take a closer look at the extended condition:

{% highlight csharp linenos %}

today.Month >= 3 && today.Month <= 5
{% endhighlight %}
	
The condition can be translated into:


{% highlight csharp linenos %}

If the month is greater than or equal to 3,
	and the month is less than or equal to 5
{% endhighlight %}
	
	
Smart, eh? Operators play a significant role in many different parts of C#.

But it still only works with March, April and May. All other months are not yet covered by the condition. So let's try to develop the condition a little more.

## C\# If-Else Ladder

Using else-if, we can expand the condition and make it work for all months:


{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {
        var today = DateTime.Now;
        if (today.Month >= 3 && today.Month <= 5)
        {
            Console.WriteLine("Now it's spring!");
        }
        else if (today.Month >= 6 && today.Month <= 8)
        {
            Console.WriteLine("Now it's summer!");
        }
        else if (today.Month >= 9 && today.Month <= 11)
        {
            Console.WriteLine("Now it's autumn!");
        }
        else
        {
            Console.WriteLine("Now is winter!");
        }
        Console.ReadLine();
    }
}
{% endhighlight %}

To write conditions is all about thinking logically and being methodical. The example above is pretty straightforward, but conditions can get very complex.

## C\# Switch Case
Another way of writing conditions is to use the switch method:

{% highlight csharp linenos %}

switch (expression) 
{ 
    case 1: 
       statement
       break;	
    case 2: 
       statement
       break; 
    default:
       statement
       break;
}
{% endhighlight %}
	
	
This method is based on an expression and then lists different "answers" or "values" with related statements. The easiest way to explain the method is to show an example.

As you may remember from lesson 4, the function date("w") returns the current weekday. This can be used in an example where we write the name of the day (instead of a number):


{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {
        var today = DateTime.Now;
        switch (today.Day)
        {
            case 1:
                Console.WriteLine("Now it's Monday");
                break;
            case 2:
                Console.WriteLine("Now it's Tuesday");
                break;
            case 3:
                Console.WriteLine("Now it's Wednesday");
                break;
            case 4:
                Console.WriteLine("Now it's Thursday");
                break;
            case 5:
                Console.WriteLine("Now it's Friday");
                break;
            case 6:
                Console.WriteLine("Now it's Saturday");
                break;
            default:
                Console.WriteLine("Now it's Sunday");
                break;

        }
        Console.ReadLine();
    }
}
{% endhighlight %}

Often switch can be a good alternative to if-else conditions. What you should use in a given situation depends on which method you find easiest and most logical. Making your scripts logical and clear can be a great challenge.

## C\# Jump Statements

The jump statements include:
- break
- continue
- goto
- return (covered in later lessons)
- throw (covered in later lessons)
- break

## C\# Break
The 'break' statement breaks out of the 'while' and 'for' loops covered in previous lesson, and the 'switch' statements covered before in this lesson. The following code gives an example - albeit a very inefficient one - of how it could be used. The output of the loop is the numbers from 0 to 4.

{% highlight csharp linenos %}

int a = 0;
while (true)
{
    System.Console.WriteLine(a);
    a++;
    if (a == 5)
        break;
}
{% endhighlight %}


## C\# Continue

The 'continue' statement can be placed in any loop structure. When it executes, it moves the program counter immediately to the next iteration of the loop. The following code example uses the 'continue' statement to count the number of values between 1 and 100 inclusive that are not multiples of seven. At the end of the loop the variable y holds the required value.

{% highlight csharp linenos %}

int y = 0;
for (int x=1; x<101; x++)
{
    if ((x % 7) == 0)
        continue;
    y++;
}
{% endhighlight %}


## C\# Goto

The 'goto' statement is used to make a jump to a particular labelled part of the program code. It is also used in the 'switch' statement described below. We can use a 'goto' statement to construct a loop, as in the following example (but again, this usage is not recommended):

{% highlight csharp linenos %}

int a = 0;
start:
System.Console.WriteLine(a);
a++;
if (a < 5)
    goto start;
{% endhighlight %}