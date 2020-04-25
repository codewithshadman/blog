---
layout: post
current: post
navigation: True
tags: [Csharp Design Patterns]
class: post-template
subclass: 'post design-patterns'
title: Strategy Pattern C#
description: The Strategy pattern in C# lets the algorithm vary independently from clients that use it. The Strategy pattern enables a client to choose which algorithm to use from a family of algorithms and gives it a simple way to access it.
cover: "assets/images/strategy-pattern-csharp.jpg"
date: Sat Nov 16 14:15:53 2019
last_modified_at: Sun Nov 17 11:53:57 2019
author: shadman_kudchikar
comments: true
---



## Contents

- [What Is Strategy Pattern C# ?](#what-is-strategy-pattern-c)
- [Strategy Pattern C# Example](#strategy-pattern-c-example)
    - [Strategy Pattern Using Context Class](#strategy-pattern-using-context-class)
        - [Multiple uses of Context](#multiple-uses-of-context)
    - [Strategy Pattern Without Using A Context Class](#strategy-pattern-without-using-a-context-class)
    - [Strategy Pattern Using Service Class](#strategy-pattern-using-service-class)
    - [Strategy Pattern Using C# Delegates](#strategy-pattern-using-c-delegates)
- [Where To Apply Strategy Pattern?](#where-to-apply-strategy-pattern)
- [Further Reading](#further-reading)

## What Is Strategy Pattern C# ?

The Strategy pattern in C# lets the algorithm vary independently from clients that use it. 

There may be different algorithms (strategies) that apply to a given problem. If the algorithms are all kept in the client, messy code with lots of conditional statements will result.

Strategy pattern defines a family of algorithms, encapsulate each one, and make them interchangeable.

The Strategy pattern enables a client to choose which algorithm to use from a family of algorithms and gives it a simple way to access it.

<!--more-->

Below is the UML and sequence diagram of Strategy pattern from Wikipedia.

![Strategy pattern](/assets/images/Design_Strategy_Design_Pattern_UML.jpg)

## Strategy Pattern C# Example

### Strategy Pattern Using Context Class

Let's start with the problem statement,

Now, In our imaginary store we 25% discount on price of item for the months of July-December. And, we do not provide any discount for the months of Jan-June. 

Let's see how this fit in strategy pattern,

```cs
using System;
using System.Collections.Generic;

/* Interface for Strategy */
interface IOfferStrategy
{
    string Name { get; }
    double GetDiscountPercentage();
}

/* Concrete implementation of base Strategy */
class NoDiscountStrategy : IOfferStrategy
{
    public string Name => nameof(NoDiscountStrategy);

    public double GetDiscountPercentage()
    {
        return 0;
    }
}

/* Concrete implementation of base Strategy */
class QuarterDiscountStrategy : IOfferStrategy
{
    public string Name => nameof(QuarterDiscountStrategy);
    
    public double GetDiscountPercentage()
    {
        return 0.25;
    }
}
```

Here we declared two strategies, NoDiscountStrategy and QuarterDiscountStrategy, as per problem statement.


Let's continue with the example and implement the context,

```cs
class StrategyContext
{
    double price; // price for some item or air ticket etc.
    Dictionary<string, IOfferStrategy> strategyContext 
        = new Dictionary<string, IOfferStrategy>();
    public StrategyContext(double price)
    {
        this.price = price;
        strategyContext.Add(nameof(NoDiscountStrategy), 
                new NoDiscountStrategy());
        strategyContext.Add(nameof(QuarterDiscountStrategy), 
                new QuarterDiscountStrategy());
    }

    public void ApplyStrategy(IOfferStrategy strategy)
    {
        /*
        Currently applyStrategy has simple implementation. 
        You can Context for populating some more information,
        which is required to call a particular operation
        */
        Console.WriteLine("Price before offer :" + price);
        double finalPrice 
            = price - (price * strategy.GetDiscountPercentage());
        Console.WriteLine("Price after offer:" + finalPrice);
    }

    public IOfferStrategy GetStrategy(int monthNo)
    {
        /*
        In absence of this Context method, client has to import 
        relevant concrete Strategies everywhere.
        Context acts as single point of contact for the Client 
        to get relevant Strategy
        */
        if (monthNo < 6)
        {
            return strategyContext[nameof(NoDiscountStrategy)];
        }
        else
        {
            return strategyContext[nameof(QuarterDiscountStrategy)];
        }
    }
}
```

In strategy pattern context is optional. But if it is present, it acts as single point of contact for client.

Now, we can implement the client code,

```cs
static void Main(string[] args)
{
    StrategyContext context = new StrategyContext(100);
    Console.WriteLine("Enter month number between 1 and 12");
    var input = Console.ReadLine();
    int month = Convert.ToInt32(input);
    Console.WriteLine("Month =" + month);
    IOfferStrategy strategy = context.GetStrategy(month);
    context.ApplyStrategy(strategy);
    Console.ReadLine();
}
```

Above example shows the usage of Strategy pattern with Context. Context can be used as single point of contact for the Client.

As shown in the output below, you will get discount depending on the month you have entered.

```txt
output:
Enter month number between 1 and 12
Month =1
Price before offer :100.0
Price after offer:100.0
Enter month number between 1 and 12
Month =7
Price before offer :100.0
Price after offer:75.0
```

#### Multiple uses of Context
1. It can populate data to execute an operation of strategy
2. It can take independent decision on Strategy creation.
3. In absence of Context, client should be aware of concrete strategies. Context acts a
wrapper and hides internals
4. Code re-factoring will become easy

### Strategy Pattern Without Using A Context Class

The following is a simple example of using the strategy pattern without a context class.

```cs
using System;

class Program
{
    // The strategy interface
    public interface ITranslationStrategy
    {
        string Translate(string phrase);
    }
    // American strategy implementation
    public class AmericanTranslationStrategy : ITranslationStrategy
    {
        
        public string Translate(string phrase)
        {
            return phrase + ", bro";
        }
    }

    // Australian strategy implementation
    public class AustralianTranslationStrategy : ITranslationStrategy
    {
        
        public string Translate(string phrase)
        {
            return phrase + ", mate";
        }
    }

    // The main class which exposes a translate method
    public class EnglishTranslation
    {
        // translate a phrase using a given strategy
        public static string Translate(string phrase, 
                ITranslationStrategy strategy)
        {
            return strategy.Translate(phrase);
        }

        // example usage
        static void Main(string[] args)
        {
            // translate a phrase using the AustralianTranslationStrategy class
            string aussieHello = Translate("Hello", 
                    new AustralianTranslationStrategy());
            Console.WriteLine(aussieHello);
            // Hello, mate
            // translate a phrase using the AmericanTranslationStrategy class
            string usaHello = Translate("Hello", 
                    new AmericanTranslationStrategy());
            Console.WriteLine(usaHello);
            // Hello, bro

            Console.ReadLine();
        }
    }

}
```

Here we have two implementation strategies which implement the interface and solve the same problem in different ways. 

Users of the EnglishTranslation class can call the translate method and choose which strategy they would like to use for the translation, by specifying the desired strategy.

### Strategy Pattern Using Service Class

The purpose of this example is to show how we can implement Strategy pattern using a Service Class.

The example problem we using is a family of algorithms (strategies) that describe different ways to communicate over a distance.

The contract for our family of algorithms is defined by the following interface:

```cs
public interface ICommunicateInterface
{
    string Communicate(string destination);
}
```

Then we can implement a number of algorithms, as follows:

```cs
public class CommunicateViaPhone : ICommunicateInterface
{
    public string Communicate(string destination)
    {
        return "communicating " + destination + " via Phone..";
    }
}

public class CommunicateViaEmail : ICommunicateInterface
{
    public string Communicate(string destination)
    {
        return "communicating " + destination + " via Email..";
    }
}

public class CommunicateViaVideo : ICommunicateInterface
{
    public string Communicate(string destination)
    {
        return "communicating " + destination + " via Video..";
    }
}
```

These can be instantiated as follows:

```cs
CommunicateViaPhone communicateViaPhone = new CommunicateViaPhone();
CommunicateViaEmail communicateViaEmail = new CommunicateViaEmail();
CommunicateViaVideo communicateViaVideo = new CommunicateViaVideo();
```

Next, we implement a service that uses the strategy:

```cs
public class CommunicationService
{
    private ICommunicateInterface communcationMeans;
    public void SetCommuncationMeans(ICommunicateInterface communcationMeans)
    {
        this.communcationMeans = communcationMeans;
    }
    public void Communicate(string destination)
    {
        var communicate = communcationMeans.Communicate(destination);
        Console.WriteLine(communicate);
    }
}
```

Finally, we can use the different strategies as follows:

```cs
static void Main(string[] args)
{
    CommunicateViaPhone communicateViaPhone = new CommunicateViaPhone();
    CommunicateViaEmail communicateViaEmail = new CommunicateViaEmail();
    CommunicateViaVideo communicateViaVideo = new CommunicateViaVideo();

    CommunicationService communicationService = new CommunicationService();
    // via phone
    communicationService.SetCommuncationMeans(communicateViaPhone);
    communicationService.Communicate("1234567");
    // via email
    communicationService.SetCommuncationMeans(communicateViaEmail);
    communicationService.Communicate("hi@me.com");

    Console.ReadLine();

}
```

### Strategy Pattern Using C# Delegates

The contract of the different algorithm implementations does not need a dedicated interface.

Instead, we can describe it using .NET built-in generic delegate type [Func](https://docs.microsoft.com/en-us/dotnet/api/system.func-2?view=netframework-4.8). For more information on Delegates, see my blog post [Delegates And Events In C#](/delegates-and-events-in-csharp/) and [C# Generic Delegate](https://kudchikarsk.com/generics-in-csharp/#c-generic-delegate).

The different algorithms composing the family of algorithms can be expressed as lambda
expressions. This replaces the strategy classes and their instantiations.

```cs
string communicateViaEmail(string destination) 
    => "communicating " + destination + " via Email..";
string communicateViaPhone(string destination) 
    => "communicating " + destination + " via Phone..";
```

Next, we can code the "service" as follows:

```cs
public class CommunicationService
{
    private Func<string, string> communcationMeans;
    public void SetCommuncationMeans(Func<string, string> communcationMeans)
    {
        this.communcationMeans = communcationMeans;
    }
    public void Communicate(string destination)
    {
        var communicate = communcationMeans(destination);
        Console.WriteLine(communicate);
    }
}
```

Finally we use the strategies as follows:


```cs
CommunicationService communicationService = new CommunicationService();
// via phone
communicationService.SetCommuncationMeans(communicateViaPhone);
communicationService.Communicate("1234567");
// via email
communicationService.SetCommuncationMeans(communicateViaEmail);
communicationService.Communicate("hi@me.com");
```

Or even:

```cs
//via Video
communicationService.SetCommuncationMeans((string destination) 
        => "communicating " + destination + " via Video..");
communicationService.Communicate("1234567");
```

> **Note:** You can download the complete solution demo from my [github repository](https://github.com/kudchikarsk/strategy-pattern-csharp).

## Where To Apply Strategy Pattern?

- When many related classes differ only in their behavior. Strategies provide a
way to configure a class with one of many behaviors.

- You need different variants of an algorithm. For example, you might
define algorithms reflecting different space/time trade-offs. Strategies
can be used when these variants are implemented as a class hierarchy of
algorithms.

- An algorithm uses data that clients shouldn't know about. Use the Strategy
pattern to avoid exposing complex, algorithm-specific data structures.

- A class defines many behaviors, and these appear as multiple conditional
statements in its operations. Instead of many conditionals, move-related conditional branches into their Strategy class.

## Further Reading

-  [A simple example of the Open/Closed Principle](http://joelabrahamsson.com/a-simple-example-of-the-openclosed-principle/) by [Joel Abrahamsson](http://joelabrahamsson.com/about-joel/) - The Open/Closed principle says that we should strive to write code that doesn’t have to be changed every time the requirements change. Here's a simple example by Joel.

- [Keep it Simple with the Strategy Design Pattern](https://blog.bitsrc.io/keep-it-simple-with-the-strategy-design-pattern-c36a14c985e9) by [Chidume Nnamdi](https://blog.bitsrc.io/@kurtwanger40) - In this post, Chidume explains different examples of how to use the Strategy Pattern and discusses its benefits and drawbacks.

- [6 Ways To Implement The Strategy Pattern In C# (Basic To Advanced)](https://www.blog.jamesmichaelhickey.com/strategy-pattern-implementations/) by [James Hickey](https://www.blog.jamesmichaelhickey.com/) - In this post, James look at some different ways you could implement the strategy pattern in C#.

- [Applying The Strategy Pattern To Vary Data Access Methods In C#](https://www.carlserver.com/blog/post/applying-the-strategy-pattern-to-vary-data-access-methods-in-csharp) by [Carl Layton](https://www.carlserver.com/) - In this post, Carl explains how a data access layer can make good use of the strategy pattern because it can abstract out the implementation of the actual data access mechanism from the consumer of the data access layer.
