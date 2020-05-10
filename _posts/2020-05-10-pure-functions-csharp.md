---
layout: post
current: post
navigation: True
tags: [Csharp Functional Programming]
class: post-template
subclass: 'post csharp-functional-programming'
title: Pure Functions C#
description: This article explains what are FP Functions or Pure Functions in C# functional programming and why they matter.
cover: "assets/images/pure-functions-csharp.jpg"
date: Sat May  9 23:08:04 2020
last_modified_at: Sat May  9 23:08:06 2020
author: shadman_kudchikar
comments: true
---

As software becomes more and more complex, it is more and more important to structure it well. Well-structured software is easy to write and to debug and provides a collection of modules that can be reused to reduce future programming costs. This all can be achieved through functional programming.

In my series of post on [functional programming](/tag/csharp-functional-programming/) I will try to demonstrate the significance of functional programming, that will help C# programmers to exploit its advantages.

## Contents

- [Is C# Functional Language?](#is-c-functional-language)
- [Benefits Of Functional Programming](#benefits-of-functional-programming)
- [What Are FP Functions / Pure Functions?](#what-are-fp-functions--pure-functions)
    - [A Pure Function Is A Map Between Two Sets](#a-pure-function-is-a-map-between-two-sets)
    - [The Output Of A Pure Function Is Determined Exclusively By Its Input](#the-output-of-a-pure-function-is-determined-exclusively-by-its-input)
    - [Domain And Codomain Constitute A Function’s Interface](#domain-and-codomain-constitute-a-functions-interface)
- [How You Can Define Functions In C#](#how-you-can-define-functions-in-c)
    - [Methods](#methods)
    - [Delegates](#delegates)
    - [Lambda Expressions](#lambda-expressions)
    - [Dictionaries](#dictionaries)
- [Why Function Purity Matters?](#why-function-purity-matters)

## Is C# Functional Language?

We tend to see the introduction of more functional features with every new release of C# language, enabling a multiparadigm programming style in the language, for example:

- C# 2.0 also allows programmers to pass and returns functions as values for higher-order functions using [delegates](/delegates-and-events-in-csharp/), and has limited support for anonymous delegates.

- C# 3.0 and 3.5 improved support anonymous functions for true closures.

- LINQ can be considered C#'s own flavor of [Haskell's list comprehensions](https://wiki.haskell.org/List_comprehension); Haskell is a statically typed, purely functional programming language with type inference and lazy evaluation; which somewhat LINQ and C# type inference represent.

- Anonymous types look like an approximation of [ML records](https://en.wikibooks.org/wiki/Standard_ML_Programming/Types#Records). ML is a general-purpose functional programming language.

I wouldn't necessarily consider some of those features mentioned above as exclusive to functional programming languages, but it's pretty clear that the C# developers have taken a lot of inspiration from functional programming languages in the past few years.

For a more in-depth explanation see [Is C#7 starting to look like a functional language?](https://hackernoon.com/is-c-7-starting-to-look-like-a-functional-language-d4326b427aaa).

However, the adoption of functional programming in the C# community has been slow. 

This adoption is slow as most of the books and articles explain functional
techniques and concepts with examples from the domains of mathematics or computer
science. However, most programmers work on business applications and this creates a domain gap.

However, 

Let's see why Functional Programming matters and you should try to adopt it,

## Benefits Of Functional Programming

- Functional programming (FP) is more [declarative in style](/declarative-programming/).

- We know for sure what a piece of code does and doesn’t do, thus we can change our code with more confidence. 

- The other major benefit is concurrency, which is easier to do with functional programming because a program written in the imperative style may work well in a single-threaded implementation but cause all sorts of bugs, like [race condition](/thread-synchronization-and-race-condition/), when concurrency comes in. Functional code offers much better guarantees in concurrent scenarios.

- There is no hidden state (private fields or static fields) or any kind of dependency on the outside world. This fact alone is going to make testing much easier because we don’t have to worry about Mocking dependency or other hacks to prepare the functionality for the test.

- In Functional Programming, by looking at functions we immediately receive a lot of information about what a function does just by looking at its signature. Sometimes that is all we need to know about a function and that’s far more clear and faster than the behavior methods in Object-oriented style.

To understand these benefits we must first understand what are "FP Functions" / "Pure Functions" in functional programming and why they matter?

## What Are FP Functions / Pure Functions?

### A Pure Function Is A Map Between Two Sets

In mathematics, and also in functional programming, a function is a map between two sets, respectively called the domain and codomain. That is, given an element from its domain, a function yields an element from its codomain.

{% highlight csharp linenos %}
public static class Math
{
    public static int Add(int a, int b)
    {
        return a+b;
    }
}
{% endhighlight %}

In the above example our domain and codomain both are Integers i.e. they are range from -2,147,483,648 to 2,147,483,647. This is easy to write as the validation is already done by the language itself but this is not always the case when you write business logic. Let's see a different kind of example:

{% highlight csharp linenos %}
public static string GetDomains(string email)
{
    if (email is null)
    {
        throw new ArgumentNullException(nameof(email));
    }

    return email.Split('@').LastOrDefault();
}
{% endhighlight %}

In the above example the method has two possible outcomes actually three it can return a string, a null object, or throws an exception. And this will be the case for every function that operates on email. One way to improve this program is creating a data object that represents our domain. Let's see how

{% highlight csharp linenos %}
using System;
using System.Text.RegularExpressions;

namespace Example1
{
    public class Email
    {
        public string Value { get; }
        public Email(string email)
        {
            if (email is null)
            {
                throw new ArgumentNullException(nameof(email));
            }

            if (!IsValidEmailAddress(email))
            {
                throw new ArgumentException(nameof(email));
            }

            Value = email;
        }

        public static bool IsValidEmailAddress(string email)
        {
            var regex = new Regex(@"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
            return regex.IsMatch(email);
        }
    }
}
{% endhighlight %}

In this implementation, Email still uses a string in its underlying representation, but the constructor ensures that Email can only be instantiated with a valid value.

The Email type is being created precisely to represent the domain of the GetDomains function, which can now be rewritten as follows:

{% highlight csharp linenos %}
public static string GetDomains(Email email) => email.Value.Split('@').LastOrDefault();
{% endhighlight %}

This new implementation has several advantages. You’re guaranteeing that only valid values can be given; GetDomains no longer causes runtime errors; and the concern of validating the email value is captured in the constructor of the Email type, removing the need for duplicating validation wherever an Email is processed.

### The Output Of A Pure Function Is Determined Exclusively By Its Input

The value that a function yield is determined exclusively by its input. You’ll see that this isn’t always the case with functions in programming. Let's see why

{% highlight csharp linenos %}
using System;

namespace Common
{
    public class Person
    {
        public string Name { get; set; }
        public string Email { get; set; }

        public DateTime DateOfBirth { get; set; }

        public bool IsMinor()
        {
            var timespan = DateTime.Now - DateOfBirth;
            var age = (int)timespan.TotalDays / 365;
            return age < 18; 
        }

        public override string ToString()
        {
            return $"Name:{Name}";
        }
    }
}

{% endhighlight %}

Is the IsMinor method pure? The result of IsMinor will depend on the current date, so, clearly, the answer is no! What kind of side effect are we facing here? It’s I/O: DateTime.Now queries the system clock, which is not in the context of the program.

Functions that perform I/O are difficult to test. For example, the following test passes as I’m writing this, but it will start to fail on the 16th of December, 2019:

{% highlight csharp linenos %}
var john = new Person()
{
    Name = "John Doe",
    Email = "john@yahoo.com",
    DateOfBirth = DateTime.ParseExact("12/15/2001",
    "MM/dd/yyyy", CultureInfo.CurrentCulture)
};

Assert.AreEqual(true, john.IsMinor());
{% endhighlight %}
You can address this issue in the following manner:

{% highlight csharp linenos %}
public bool IsMinor(DateTime on)
{
    var timespan = on - DateOfBirth;
    var age = (int)timespan.TotalDays / 365.2425; 
    return age < 18; 
}
{% endhighlight %}
Now the implementation of IsMinor is pure (because today is not mutable). You’ve effectively pushed the side effect of reading the current date outwards.

However, still, our method is dependent on a hidden field. The programming constructs we use to
represent functions all have access to a “context”: an instance method has
access to instance fields.

As we discussed Pure functions closely resemble mathematical functions: they do nothing other than computing an output value based on their input values. They never mutate global state—“Global” here means any state that’s visible outside of the function’s scope.

A private instance field is considered global because it’s visible from all methods within the class.

So we can even further refactor our code to attend true purity.

{% highlight csharp linenos %}
public static class DateTimeExtension
{
    public static bool IsMinor(this DateTime dob, DateTime on)
    {
        var timespan = on - dob;
        var age = (int)timespan.TotalDays / 365.2425;
        return age < 18;
    }
}
{% endhighlight %}

Now we can write the test case as follows:

{% highlight csharp linenos %}
var john = new Person()
{
    Name = "John Doe",
    Email = "john@yahoo.com",
    DateOfBirth = DateTime.ParseExact("12/15/2001",
    "MM/dd/yyyy", CultureInfo.CurrentCulture)
};

var on = DateTime.ParseExact("12/14/2019",
    "MM/dd/yyyy", CultureInfo.CurrentCulture);

Assert.AreEqual(true, john.DateOfBirth.IsMinor(on));
{% endhighlight %}

And client can use the code in following manner:

{% highlight csharp linenos %}
foreach (var person in people.Where(p=>p.DateOfBirth.IsMinor(DateTime.Now)))
{
    Console.WriteLine(person);
}
{% endhighlight %}

### Domain And Codomain Constitute A Function’s Interface

The types for the domain and codomain constitute a function’s interface, also called its type or signature. You can think of this as a contract: a function signature declares that, given an element from the domain, it will yield an element from the codomain. 

In the above example, we defined this using return type of method and type for parameters

{% highlight csharp linenos %}
public static int Add(int a, int b)
{% endhighlight %}

Here both our domain and codomain are defined as int type.

{% highlight csharp linenos %}
public static string GetDomains(Email email) => email.Value.Split('@').LastOrDefault();
{% endhighlight %}
Here our domain is define by a custom type Email and its codamain is a .NET build in type string.

{% highlight csharp linenos %}
public static bool IsMinor(this DateTime dob, DateTime on)
{% endhighlight %}

Here our domain represents .NET `DateTime` type while codomain will always be a boolean value true or false.

## How You Can Define Functions In C#

There are several language constructs in C# that you can use to represent functions:

### Methods

Methods are the most common and idiomatic representation for functions in C#. For example,
the System.Math class includes methods representing many common mathematical functions.

Methods can represent functions, but they also fit into the object-oriented paradigm—they can be used to implement interfaces, they can be overloaded, and so on.

The constructs that really enable you to program in a functional style are delegates and lambda expressions.

### Delegates

Delegates are type-safe function pointers. Type-safe here means that a delegate is strongly typed: the types of the input and output values of the function are known at compile-time, and
consistency is enforced by the compiler.


#### The Func And Action Delegates

The .NET framework includes a couple of delegate “families” that can represent pretty much any
function type:

- `Func<R>` represents a function that takes no arguments and returns a result of type R.
- `Func<T1, R>` represents a function that takes an argument of type T1 and returns a result of
type R.
- `Func<T1, T2, R>` represents a function that takes a T1 and a T2 and returns an R.

And so on. 

Since the introduction of Func, it has become rare to use custom delegates. For example, instead

of declaring a custom delegate like this,

{% highlight csharp linenos %}
delegate Greeting Greeter(Person p);
{% endhighlight %}

you can just use the type:

{% highlight csharp linenos %}
Func<Person, Greeting>
{% endhighlight %}
The type of Greeter in the preceding example is equivalent to, or “compatible with,” `Func<Person,Greeting>`. In both cases, it’s a function that takes a Person and returns a Greeting.

There’s a similar delegate family to represent actions—functions that have no return value, such as void methods:

- `Action` represents an action with no input arguments.
- `Action<T1>` represents an action with an input argument of type T1.
- `Action<T1, T2>` and so on represent an action with several input arguments.

The evolution of .NET has been away from custom delegates, in favor of the more general Func
and Action delegates. 

### Lambda Expressions

Lambda expressions, called lambdas for short, are used to declare a function inline. For example, sorting a list of numbers alphabetically can be done with a lambda like so.

{% highlight csharp linenos %}
var list = Enumerable.Range(1, 10).Select(i => i * 3).ToList();
list // => [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
list.Sort((l, r) => l.ToString().CompareTo(r.ToString()));
list // => [12, 15, 18, 21, 24, 27, 3, 30, 6, 9]
{% endhighlight %}

If your function is short and you don’t need to reuse it elsewhere, lambdas offer the most
attractive notation. Also notice that in the preceding example, the compiler not only infers the types of x and y to be int, it also converts the lambda to the delegate type `Comparison<int>` expected by the Sort method, given that the provided lambda is compatible with this type.

### Dictionaries
Dictionaries are fittingly also called maps (or hashtables); they’re data structures that provide a very direct representation of a function. They literally contain the association of keys (elements from the domain) to values (the corresponding elements from the codomain).

We normally think of dictionaries as data, so it’s enriching to change perspectives for a moment and consider them as functions. Dictionaries are appropriate for representing functions that are completely arbitrary, where the mappings can’t be computed but must be stored exhaustively.

## Why Function Purity Matters?

The deterministic nature of Pure functions / FP functions (that is, the fact that they always return the same output for the same input) has some interesting consequences. 

Pure functions are easy to test and to reason about. Furthermore, the fact that outputs only depend on inputs means that the order of evaluation isn’t important. Whether you evaluate the result of a function now or later, the result will not change. 

This means that the parts of your program that consist entirely of pure functions can be optimized in a number of ways using techniques such as [Parallelization](/task-parallelism-c/), [Lazy evaluation](https://blogs.msdn.microsoft.com/pedram/2007/06/02/lazy-evaluation-in-c/), [Memoization](https://www.infoq.com/news/2007/01/CSharp-memory/). Using these techniques with impure functions can lead to nasty bugs. For these reasons, FP advocates that pure functions should be preferred whenever possible.

Let’s see what happens if we naively apply parallelization with the impure function:

Let's say you want to format a list of strings, like below one, as a numbered list; and you want to use the parallel features of .NET along with it.

{% highlight csharp linenos %}

var names = new List<string>
            {
                "Lorena Villagomez",
                "Jennine Beaty",
                "Paulina Vannatter",
                "Sherell Hoots",
                "Rosalee Fleurant",
                "Ervin Hamel",
                "Ulysses Adkisson",
                "Tawanna Winward",
                "Brigette Masterson",
                "Joelle Ranieri",
                ...
            };

{% endhighlight %}

{% highlight text %}
1) Lorena Villagomez
2) Jennine Beaty
3) Paulina Vannatter
4) Sherell Hoots
5) Rosalee Fleurant
6) Ervin Hamel
7) Ulysses Adkisson
8) Tawanna Winward
9) Brigette Masterson
10) Joelle Ranier
...
{% endhighlight %}

To do this, you’ll write a program something like this,

{% highlight csharp linenos %}
var count = 0;
var list = names.AsParallel().Select(item => 
{
    count++;
    return $"{count}) {item}";
});
WriteLine(String.Join("\n", list));
{% endhighlight %}

Here `AsParallel()` enables parallelization of a query. This method binds the query to PLINQ. PLINQ can achieve significant performance improvements over legacy code for certain kinds of queries, often just by adding the AsParallel query operation to the data source.
 For more information, see [Parallel LINQ (PLINQ)](https://docs.microsoft.com/en-us/dotnet/standard/parallel-programming/parallel-linq-plinq?view=netcore-3.1).

Now,

Because the line no 4 in the above program increments the counter variable, and the parallel version will have multiple threads reading and updating the counter. As is well known, ++ is not an atomic operation, and because there’s no locking in place, we’ll lose some of the updates and end up with an incorrect result.

If you test this approach with a large enough input list, you’ll get a result like this:

{% highlight text %}
1) Lorena Villagomez
2) Jennine Beaty
3) Paulina Vannatter
4) Sherell Hoots
5) Rosalee Fleurant
6) Ervin Hamel
7) Ulysses Adkisson
8) Tawanna Winward
9) Brigette Masterson
10) Joelle Ranieri
11) Min Turlington
12) Ruthanne Trueblood
13) Adele Feather
39) Melva Piedra
14) Rema Carpino
27) Kareen Mcalexander
40) Joesph Rabun
15) Takako Danz
...
{% endhighlight %}

You can see that the numbering is improper after the 13th item.

This will look [pretty familiar](/thread-synchronization-and-race-condition/) if you have some multithreading experience. Because multiple processes are reading and writing to the counter at the same time, some of the updates are lost.

Now, the thing is

Here, our select method violates the pure function rule: "The output of a pure function is determined exclusively by its input". 

{% highlight csharp %}
var list = names.AsParallel().Select(item => 
{
    count++;
    return $"{count}) {item}";
});
{% endhighlight %}

As our select lambda expression depends on an external closed-over variable count it makes our lambda function impure.

You probably know that this could be fixed by using a lock or the Interlocked class when incrementing the counter. But locking is an imperative construct that we’d rather avoid when coding functionally.

One possible way to avoid the pitfalls of concurrent updates is to remove the problem at the
source: don’t use the shared state, to begin with. How this can be done will vary with each scenario,

but I’ll show you a solution for the current scenario that will enable us to format the list in parallel.

What if instead of updating a running counter, you generate a list of all the counter values you need, and then pair items from the given list with items from the list of counters?

For the list of integers, you can use Range, a convenience method on Enumerable. And, the operation of pairing two parallel lists is a common operation in FP, and it’s called Zip.

Using Range and Zip, you can rewrite the list as follows.

{% highlight csharp linenos %}
var linenos = Range(1, names.Count());
var list = linenos.AsParallel()
    .Zip(names.AsParallel(), (lineno, item) => $"{lineno}) {item}");
WriteLine(String.Join("\n", list));
{% endhighlight %}

In this case, ParallelEnumerable does all the heavy lifting, and you can easily resolve the problem by reducing this specific scenario to the more common scenario of zipping two parallel sequences—a scenario common enough that it’s addressed in the framework.

In this scenario, it was possible to enable parallel execution by removing state updates altogether, but this isn’t always the case, nor is it always this easy. But the ideas you’ve seen so far already put you in a better position when tackling issues related to parallelism, and more generally concurrency.

That’s all for now, join me in the next article by subscribing to my newsletter using the form below.