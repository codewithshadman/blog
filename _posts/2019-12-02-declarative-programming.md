---
layout: post
current: post
navigation: True
tags: [Programming]
class: post-template
subclass: 'post programming'
title: Declarative Programming
description: In this article, I will introduce you to an alternative style of programming called declarative programming. Proper declarative programs are easier to read, understand, and maintain.
cover: "assets/images/declarative-programming.jpg"
date: Mon Dec  2 21:43:12 2019
last_modified_at: Tue Dec  3 22:20:28 2019
author: shadman_kudchikar
comments: true
---

Most developers are very familiar with writing imperative programs (even though they may not know it by that name). In this article, I will introduce you to an alternative style of programming called declarative programming. Proper declarative programs are easier to read, understand, and maintain.

As professionals, we should be striving to write better programs each day. If you cannot look at programs you wrote three months ago with a critical eye and notice things that could be better, then you have not improved and are not challenging yourself. I challenge you to write programs that are easier to read and understand by using declarative programs.

## Contents

- [What Is An Imperative Programming?](#what-is-an-imperative-programming)
- [What Is A Declarative Programming?](#what-is-a-declarative-programming)
- [Declarative Programming Examples](#declarative-programming-examples)
- [Further Reading ](#further-reading)


First, it is important to understand what declarative programs are and how it relates to imperative programs.

To understand this we have to first understand what is imperative programming.

## What Is An Imperative Programming?

In computer science, imperative programming is a programming paradigm that uses statements that change a program's state. In much the same way that the imperative mood in natural languages expresses commands, an imperative program consists of commands for the computer to perform.

Imperative programs describe how something is done whereas declarative programs describe what is being done.

Imperative programs are generally difficult to read and understand. For example:

{% highlight csharp linenos %}

using System;

class Example
{
    static void Main()
    {
        var sum = 0;
        for (var i = 0; i < 100; i++)
        {
            if (i % 2 == 0)
            {
                sum += i;
            }
        }
        Console.WriteLine(sum);
    }
}
{% endhighlight %}

It is not immediately apparent what this program does. Only through careful examination can we deduce that it prints the sum of all even numbers between 0 and 99.

Now, let us see how declarative programming will help us out here,

## What Is A Declarative Programming?

In computer science, declarative programming is a programming paradigm—a style of building the structure and elements of computer programs—that expresses the logic of a computation without describing its control flow.

This is how the above program would be implemented using a declarative style:

{% highlight csharp linenos %}

using System;
using System.Linq;

class Example
{
    static void Main()
    {
        var sum = Enumerable.Range(0, 99)
                      .Where(i => i % 2 == 0)
                      .Sum();
        Console.WriteLine(sum);
    }
}
{% endhighlight %}

Obviously, the second example is different, but is it better? I believe it is. We have condensed the example into a single expression and the expression is significantly easier to understand. The name of each method is used to express the intention of that portion of the program. Rather than looping with a classic for-loop I have used the newer `Enumerable.Range` method. This not only better expresses my intentions but also gives me a starting place from which I can easily stream the numbers through a filter (the Where method) and finally aggregate them with Sum.

But I still think this code could be better. Let me do one last thing to make our program even more declarative:

{% highlight csharp linenos %}

using System;
using System.Linq;

class Example
{
    static void Main()
    {
        var sum = Enumerable.Range(0, 99)
                      .Where(isEven)
                      .Sum();
        Console.WriteLine(sum);
    }

    static bool isEven(int number)
    {
        return number % 2 == 0;
    }
}
{% endhighlight %}

This change is subtle but important. We have moved the somewhat cryptic expression that tests for evenness into its own method. Since this method has a single responsibility and is clearly named, it is ideal for inclusion in our declarative expression. It is important to understand that declarative programs don’t necessarily mean fewer lines of code. Declarative programs are characterized by how expressive it is. By moving the test for evenness into its own method we may have increased the line count of the program, but we have also greatly improved the readability of the programs as well.


Declarative programming is nice because it can help simplify your mental model* of code, and because it might eventually be more scalable.

I am a .NET developer and if you are too, you will find this kind of programming style everywhere in .NET.

For example, let's say you have a function that does something to each element in an array or list. Traditional code would look like this:

{% highlight csharp linenos %}

foreach (object item in MyList)
{
   DoSomething(item);
}
{% endhighlight %}

No big deal there. But what if you use the more-declarative syntax and instead define `DoSomething()` as an Action? Then you can say it this way:

{% highlight csharp linenos %}

MyList.ForEach(DoSometing);
{% endhighlight %}

This is, of course, more concise.

## Declarative Programming Examples

Below are some examples I found from my peers:

### Javascript Example

Imperative:

{% highlight js linenos %}

var today = new Date();
var decimalDate = today.getHours() + (today.getMinutes() / 60);

var timeOptions = [...Array(48).keys()].map(n=> n * 0.5)
.filter(n=>n > decimalDate)
.map(n=>n*60)
.map(time_convert);    
                
timeOptions.push('23:59');

console.log(timeOptions) 
/* 
display:
["22:00",
"22:30",
"23:00",
"23:30",
"23:59"]
*/

function time_convert(num)
{ 
  var hours = Math.floor(num / 60);  
  var minutes = num % 60;
  minutes=parseInt(Math.ceil(minutes));
  if(minutes < 10) minutes = `${minutes}0`;
  return hours + ":" + minutes;         
}
{% endhighlight %}

Declarative:

{% highlight js linenos %}

var decimalHours = [...Array(48).keys()].map(n=> n * 0.5);
var timeOptions = decimalHours
.filter(isTimeInFuture)
.map(decimalToSeconds)
.map(secondsToTimeFormat);      
                
timeOptions.push('23:59');

console.log(timeOptions);
/* 
display:
["22:00",
"22:30",
"23:00",
"23:30",
"23:59"]
*/

function decimalToSeconds(decimalTime) 
{
  return decimalTime * 60
}

function isTimeInFuture(decimalTime) 
{
  var now = new Date();
  var decimalNow = now.getHours() + (now.getMinutes() / 60);
  return decimalTime > decimalNow
}

function secondsToTimeFormat(num)
{ 
  var hours = Math.floor(num / 60);  
  var minutes = num % 60;
  minutes=parseInt(Math.ceil(minutes));
  if(minutes < 10) minutes = `${minutes}0`;
  return hours + ":" + minutes;         
}
{% endhighlight %}


I hope that I have shown how you can improve your programs by making it more declarative. If you strive to write more declarative programs you will end up with better software that is easier to read, understand, and maintain.

If you are already doing it do send me your declarative style examples in the comment below and I will love to add those up in my article.

## Further Reading 

- [What is Functional Programming?](https://sookocheff.com/post/fp/what-is-functional-programming/) by [Kevin Sookocheff](https://sookocheff.com/) - This article explains functional programming paradigm and explains how functional programming is a form of declarative programming that expresses a computation directly as a pure functional transformation of data.

- [What the Heck is Declarative Programming, Anyways?](https://dev.to/brewsterbhg/what-the-heck-is-declarative-programming-anyways-2bj2) by [Keith Brewster](https://dev.to/brewsterbhg/what-the-heck-is-declarative-programming-anyways-2bj2) - This article discusses about declarative programming in the form of lessons that answer the most common question regarding declarative programming.


