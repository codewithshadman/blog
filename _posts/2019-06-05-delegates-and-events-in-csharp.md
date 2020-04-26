---
layout: post
current: post
navigation: True
tags: [Csharp Intermediate]
class: post-template
subclass: 'post csharp-intermediate'
title:  "Delegates And Events In C#"
description: "In C#, delegates form the basic building blocks for events. This post explains the implementation detail of Delegates and Events in C# .NET."
cover: "assets/images/delegates-and-events-in-csharp.jpg"
date: Wed Jun  5 12:45:49 2019
last_modified_at: Sun Nov 24 14:43:23 2019
author: shadman_kudchikar
comments: true
aside: csharp_tutorial_aside.html
---


## Contents
- [What Are Events In C#?](#events-in-csharp)
- [Understanding Delegates In C#](#delegates-in-csharp)
	- [Using A Delegate In C#](#using-a-delegate-in-csharp)
	- [Multicast Delegates In C#](#multicast-delegates)
	- [Covariance and Contravariance In C#](#covariance-and-contravariance-in-csharp)
		- [Covariance With Delegates](#covariance-with-delegates)
		- [Contravariance With Delegates](#contravariance-with-delegates)
- [Lambda Expressions In C#](#lambda-expressions-in-csharp)
- [Events In C#](#create-and-raise-events-in-csharp)
- [Further Reading](#further-reading)
- [References](#references)

## What Are Events In C\#? {#events-in-csharp}
An **event** can be used to provide notifications. You can subscribe to an **event** if you are interested in those notifications. You can also create your own **events** and raise them to provide notifications when something interesting happens. The .NET Framework offers built-in types that you can use to create **events**. By using **delegates**, **lambda expressions**, and **anonymous methods**, you can create and use **events** in a comfortable way.

<!--more-->

## Understanding Delegates In C\# {#delegates-in-csharp}
In **C#**, **delegates** form the basic building blocks for **events**. A **delegate** is a type that defines a method signature. In C++, for example, you would do this with a function pointer. In **C#** you can instantiate a **delegate** and let it point to another method. You can invoke the method through the **delegate**.

Below is an example of declaring a **delegate** and calling a method through it.

### Using A Delegate In C\# {#using-a-delegate-in-csharp}

{% highlight csharp linenos %}

class Program
{
    public delegate double MathDelegate(double value1, double value2);

    public static double Add(double value1, double value2)
    {
        return value1 + value2;
    }
    public static double Subtract(double value1, double value2)
    {
        return value1 - value2;
    }

    public static void Main()
    {
        MathDelegate mathDelegate = Add;
        var result = mathDelegate(5, 2);
        Console.WriteLine(result);
        // output: 7

        mathDelegate = Subtract;
        result = mathDelegate(5, 2);
        Console.WriteLine(result);
        // output: 3

        Console.ReadLine();
    }

}
{% endhighlight %}

As you can see, we use the **delegate** keyword to tell the compiler that we are creating a **delegate** type.

Instantiating **delegates** is easy with the automatic creation of a new **delegate** type. 

You can also use the new keyword method of instantiating a delegate

{% highlight csharp linenos %}

MathDelegate mathDelegate = new MathDelegate(Add);
{% endhighlight %}

An instantiated **delegate** is an object; you can pass it around and give it as an argument to other methods.

### Multicast Delegates In C\# {#multicast-delegates}
Another great feature of **delegates** is that you can combine them together. This is called multicasting. You can use the `+` or `+=` operator to add another method to the invocation list of an existing **delegate** instance. Similarly, you can also remove a method from an invocation list by using the decrement assignment operator (`-` or `-=`). This feature forms the base for **events** in **C#**. Below is a multicast **delegate** example.

{% highlight csharp linenos %}

class Program
{
    static void Hello(string s)
    {
        Console.WriteLine("  Hello, {0}!", s);
    }

    static void Goodbye(string s)
    {
        Console.WriteLine("  Goodbye, {0}!", s);
    }

    delegate void Del(string s);

    static void Main()
    {
        Del a, b, c, d;

        // Create the delegate object a that references 
        // the method Hello:
        a = Hello;

        // Create the delegate object b that references 
        // the method Goodbye:
        b = Goodbye;

        // The two delegates, a and b, are composed to form c: 
        c = a + b;

        // Remove a from the composed delegate, leaving d, 
        // which calls only the method Goodbye:
        d = c - a;

        Console.WriteLine("Invoking delegate a:");
        a("A");
        Console.WriteLine("Invoking delegate b:");
        b("B");
        Console.WriteLine("Invoking delegate c:");
        c("C");
        Console.WriteLine("Invoking delegate d:");
        d("D");


        /* Output:
        Invoking delegate a:
          Hello, A!
        Invoking delegate b:
          Goodbye, B!
        Invoking delegate c:
          Hello, C!
          Goodbye, C!
        Invoking delegate d:
          Goodbye, D!
        */

        Console.ReadLine();
    }
}
{% endhighlight %}

All this is possible because **delegates** inherit from the `System.MulticastDelegate` class that in turn inherits from `System.Delegate`. Because of this, you can use the members that are defined in those base classes on your **delegates**.

For example, to find out how many methods a multicast **delegate** is going to call, you can  use the following code:

{% highlight csharp linenos %}

int invocationCount = d.GetInvocationList().GetLength(0);
{% endhighlight %}

### Covariance and Contravariance In C\# {#covariance-and-contravariance-in-csharp}
When you assign a method to a **delegate**, the method signature does not have to match the **delegate** exactly. This is called covariance and contravariance. Covariance makes it possible that a method has a return type that is more derived than that defined in the **delegate**. Contravariance permits a method that has parameter types that are less derived than those in the **delegate** type.

#### Covariance With Delegates {#covariance-with-delegates}
Here is an example of covariance,
{% highlight csharp linenos %}

class Program
{
    public delegate TextWriter CovarianceDel();

    public static StreamWriter MethodStream() { return null;  }
    public static StringWriter MethodString() { return null;  }

    static void Main()
    {
        CovarianceDel del;

        del = MethodStream;
        del = MethodString;

        Console.ReadLine();
    }
}
{% endhighlight %}

Because both `StreamWriter` and `StringWriter` inherit from `TextWriter`, you can use the `CovarianceDel` with both methods. 

#### Contravariance With Delegates {#contravariance-with-delegates}
Below is an example of contravariance.
{% highlight csharp linenos %}

class Program
{
    public static void DoSomething(TextWriter textWriter) { }
    public delegate void ContravarianceDel(StreamWriter streamWriter);

    static void Main()
    {
        ContravarianceDel del = DoSomething;

        Console.ReadLine();
    }
}
{% endhighlight %}

Because the method `DoSomething` can work with a TextWriter, it surely can also work with a StreamWriter. Because of contravariance, you can call the **delegate** and pass an instance of StreamWriter to the `DoSomething` method

You can learn more about this concept [here][covariance-and-contravariance].

## Lambda Expressions In C\# {#lambda-expressions-in-csharp}
Sometimes the whole signature of a method can be more code than the body of a method. There are also situations in which you need to create an entire method only to use it in a **delegate**.

For these cases, Microsoft added some new features to **C#**, 2.0 **anonymous methods** were added. In **C#** 3.0, things became even better when **lambda expressions** were added. **Lambda expression** is the preferred way to go when writing new code.

Below is an example of newer **lambda syntax**.

{% highlight csharp linenos %}

class Program
{
    public delegate double MathDelegate(double value1, double value2);

    public static void Main()
    {
        MathDelegate mathDelegate = (x,y) => x + y;
        var result = mathDelegate(5, 2);
        Console.WriteLine(result);
        // output: 7

        mathDelegate = (x, y) => x - y; ;
        result = mathDelegate(5, 2);
        Console.WriteLine(result);
        // output: 3

        Console.ReadLine();
    }

}
{% endhighlight %}

When reading this code, you can say go or goes to for the special **lambda syntax**. For example, the first **lambda expression** in the above example is read as "x and y goes to adding x and y".

The **lambda function** has no specific name as the methods. Because of this, **lambda functions** are called **anonymous functions**. You also don't have to specify a return type explicitly. The compiler infers this automatically from your lambda. And in the case of the above example, the types of parameters x and y are also not specified explicitly.

You can create lambdas that span multiple statements. You can do this by adding curly braces around the statements that form the lambda as below example shows.

{% highlight csharp linenos %}

MathDelegate mathDelegate = (x,y) => 
            {
                Console.WriteLine("Add");
                return x + y;
            };
{% endhighlight %}

Sometimes declaring a **delegate** for an **event** feels a bit cumbersome. Because of this, the .NET Framework has a couple of built-in **delegates** types that you can use when declaring **delegates**. For the MathDelegate examples, you have used the following **delegate**:

{% highlight csharp linenos %}

public delegate double MathDelegate(double value1, double value2);
{% endhighlight %}

You can replace this **delegate** with one of the built-in types namely ```Func<int, int, int>```. 

like this,

{% highlight csharp linenos %}

class Program
    {
        public static void Main()
        {
            Func<int, int, int> mathDelegate = (x,y) => 
            {
                Console.WriteLine("Add");
                return x + y;
            };

            var result = mathDelegate(5, 2);
            Console.WriteLine(result);
            // output: 7

            mathDelegate = (x, y) => x - y; ;
            result = mathDelegate(5, 2);
            Console.WriteLine(result);
            // output: 3

            Console.ReadLine();
        }

    }
{% endhighlight %}

The `Func<...>` types can be found in the `System` namespace and they represent **delegates** that return a type and take 0 to 16 parameters. All those types inherit from `System.MulticaseDelegate` so you can add multiple methods to the invocation list.

If you want a **delegate** type that doesn't return a value, you can use the System.Action types. They can also take 0 to 16 parameters, but they don't return a value. 

Here is an example of using the Action type,

{% highlight csharp linenos %}

class Program
    {
        public static void Main()
        {
            Action<int, int> mathDelegate = (x,y) => 
            {
                Console.WriteLine(x + y);
            };

            mathDelegate(5, 2);
            // output: 7

            mathDelegate = (x, y) => Console.WriteLine(x - y) ;
            mathDelegate(5, 2);
            // output: 3

            Console.ReadLine();
        }

    }
{% endhighlight %}

You can learn more about .NET built-in delegates [here][built-in-delegates].

Things start to become more complex when your **lambda function** starts referring to variables declared outside of the **lambda expression** or to this reference. Normally when control leaves the scope of the variable, the variable is no longer valid. But what if a **delegate** refers to a local variable. To fix this, the compiler generates code that makes the life of the captured variable at least as long as the longest-living **delegate**. This is called a closure. 

You can learn more about closure [here][closure].

## Events In C\# {#create-and-raise-events-in-csharp}

A popular design pattern is application development is that of publish-subscribe. You can subscribe to an **event** and then you are notified when the publisher of the **event** raises a new **event**. This is used to establish loose coupling between components in an application.

Delegate form the basis for the **event** system in **C#**.

An event is a special kind of delegate that facilitates event-driven programming. Events are class members that cannot be called outside of the class regardless of its access specifier. So, for example, an event declared to be public would allow other classes the use of += and -= on the event, but firing the event (i.e. invoking the delegate) is only allowed in the class containing the event. Let's see an example,

{% highlight csharp linenos %}

//Define publisher class as Pub
public class Pub
{
    //OnChange property containing all the 
    //list of subscribers callback methods
    public event Action OnChange = delegate { };

    public void Raise()
    {
        //Invoke OnChange Action
        OnChange();
    }
}
{% endhighlight %}

A method in another class can then subscribe to the event by adding one of its methods to the event delegate:

Below example shows how a class can expose a public **delegate** and raise it.

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {
        //Initialize pub class object
        Pub p = new Pub();

        //register for OnChange event - Subscriber 1
        p.OnChange += () => Console.WriteLine("Subscriber 1!");
        //register for OnChange event - Subscriber 2
        p.OnChange += () => Console.WriteLine("Subscriber 2!");

        //raise the event
        p.Raise();

        //After this Raise() method is called
        //all subscribers callback methods will get invoked

        Console.WriteLine("Press enter to terminate!");
        Console.ReadLine();
    }
}
{% endhighlight %}

Even though the event is declared public, it cannot be directly fired anywhere except in the class containing it.

By using `event` keyword compiler protects our field from unwanted access.

And,

It does not permit the use of = (direct assignment of a delegate). Hence, your code is now safe from the risk of removing previous subscribers by using = instead of +=.

Also, you may have noticed special syntax of initializing the OnChange field to an empty delegate like this `delegate { }`. This ensures that our OnChange field will never be null. Hence, we can remove the null check before raising the event, if no other members of the class making it null.

When you run the above program, your code creates a new instance of Pub, subscribes to the **event** with two different methods and raises the **event** by calling p.Raise. The Pub class is completely unaware of any subscribers. It just raises the **event**.

You can also read my article [Publish Subscribe Design Pattern In **C#**][pub-sub-post] for more in-depth knowledge of this concept.


## Further Reading

- [Publish Subscribe Design Pattern In C#](/publish-subscribe-design-pattern-in-csharp/) - Publish Subscribe or Pub-Sub is a design pattern that allows loose coupling between the application components. This post explains the implementation detail of Pub-Sub using Delegates, EventHandlers and Event keyword in C#.

- [C# Generic Delegates Func, Action, and Predicate](https://www.c-sharpcorner.com/blogs/c-sharp-generic-delegates-func-action-and-predicate) - C# 3.0 includes built-in generic delegate types Func, Action, and Predicate, so that you don't need to define custom delegates. In this post, you will learn about these built-in delegates in C#.

- [C# 7.0 Expression Bodied Members](https://csharp.christiannagel.com/2017/01/25/expressionbodiedmembers/) by [Christian Nagel](https://csharp.christiannagel.com/about/) - C# 6 introduced expression bodied members with methods and properties. This feature has been enhanced with C# 7.0 to allow expression bodied members with constructors, destructors, and also property accessors. This article gives a review on expression bodied members with C# 6, and shows the new options with C# 7.0. This is much similar to Lambda Expressions we discussed in the post before.

- [Understanding Delegates and Higher-Order Functions in C#](http://codinghelmet.com/articles/understanding-delegates-and-higher-order-functions-in-cs) by [Zoran Horvat](http://codinghelmet.com/articles) - One of the core concepts of functional programming is functions and the ability of using, manipulating and passing functions as if they were objects. C# delegates allows us to create types to store functions with a specific signature. This post introduces Functional programming concepts using C# Delegates.

## References {#references}
- [https://www.c-sharpcorner.com/blogs/c-sharp-generic-delegates-func-action-and-predicate](https://www.c-sharpcorner.com/blogs/c-sharp-generic-delegates-func-action-and-predicate)
- [https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/covariance-contravariance/](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/covariance-contravariance/)
- [https://web.archive.org/web/20150707082707/http://diditwith.net/PermaLink,guid,235646ae-3476-4893-899d-105e4d48c25b.aspx](https://web.archive.org/web/20150707082707/http://diditwith.net/PermaLink,guid,235646ae-3476-4893-899d-105e4d48c25b.aspx)

[post-image]: /assets/images/delegates-and-events-in-csharp.jpg "Delegates And Events In C#"
[pub-sub-post]: /publish-subscribe-design-pattern-in-csharp/
[closure]: https://web.archive.org/web/20150707082707/http://diditwith.net/PermaLink,guid,235646ae-3476-4893-899d-105e4d48c25b.aspx
[built-in-delegates]: https://www.c-sharpcorner.com/blogs/c-sharp-generic-delegates-func-action-and-predicate
[covariance-and-contravariance]: https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/covariance-contravariance/

