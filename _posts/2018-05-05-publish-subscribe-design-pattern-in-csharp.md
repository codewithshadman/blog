---
layout: post
current: post
navigation: True
tags: [Csharp Design Patterns]
class: post-template
subclass: 'post design-patterns'
title:  "Publish Subscribe Design Pattern In C#"
description: "Publish Subscribe or Pub-Sub is a design pattern that allows loose coupling between the application components. This post explains the implementation detail of Pub-Sub using Delegates, EventHandlers and Event keyword in C#."
cover: "assets/images/pub-sub-design-pattern.jpg"
date: Sat May  5 12:45:49 2018
last_modified_at: Sat Jun  8 12:44:16 2019
author: shadman_kudchikar
comments: true
---


## Contents

* [What is Pub-Sub?](#what-is-pub-sub)
* [Pub-Sub Using Delegate](#pub-sub-using-delegate)
* [Pub-Sub Using Event Keyword](#pub-sub-using-event-keyword)
* [Pub-Sub Using EventHandlers](#pub-sub-using-eventhandlers)
* [Exception Aware Event Raise](#exception-aware-event-raise)
* [Where To Apply Publish Subscribe Pattern?](#where-to-apply-publish-subscribe-pattern)
* [Further Reading](#further-reading)

## What is Pub-Sub? {#what-is-pub-sub}

Publish-Subscribe or Pub-Sub is a design pattern that allows loose coupling between the application components.

Here senders of messages, called publishers, do not program the messages to be sent directly to specific receivers, called subscribers. Messages are published without the knowledge of what or if any subscriber of that knowledge exists. Delegate form the basis of this design pattern in C#.

<!--more-->

There is also another design pattern which is much similar to pub-sub that is the [Observer pattern](/observer-pattern-csharp/).

However,

The major difference in Pub-Sub design is the event channel that publisher generates to notify changes to its subscriber without any knowledge of subscriber existence.

Delegates, EventHandlers and Event keyword plays a special role in this event handling mechanism. Let's see how they are used in Pub-Sub.

> **Note:** You can learn more about C# delegates in my blog post [Delegates And Events In C#][csharp-delegates].

## Pub-Sub Using Delegate {#pub-sub-using-delegate}

First, let's see the implementation of Pub-Sub pattern in C# using Action delegate defined in .NET Framework.

An Action delegate is nothing but a built-in delegate with return type as void.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//Define publisher class as Pub
public class Pub
{
    //OnChange property containing all the 
    //list of subscribers callback methods
    public Action OnChange { get; set; }

    public void Raise()
    {
        //Check if OnChange Action is set before invoking it
        if(OnChange!=null)
        {
            //Invoke OnChange Action
            OnChange();
        }
    }
}

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
```

In above code, we created a publisher and subscribe to its events using two anonymous methods sharing the signature of Action delegate.

We able to use += on the OnChange property because of the multicast feature provided by delegates.

> **Note:** You can learn more about multicast feature in delegates in my blog post [Multicast Delegates In C#][multicast-delegate].

Although the programs look good there is some weakness in the program.

If you use = instead of += you will effectively remove the first subscriber from the OnChange property.

Also,

As OnChange is a public property any outside user of the class can raise the event by just calling `p.OnChange()`.

## Pub-Sub Using Event Keyword {#pub-sub-using-event-keyword}

Let's see the same code using event keyword,

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
```
As you can see in above code, with the use of event keyword we are using OnChange as a field instead of property. I know its still public.

But,

By using event keyword compiler protects our field from unwanted access.

And,

It does not permit the use of = (direct assignment of a delegate). Hence, your code is now safe from the risk of removing previous subscribers by using = instead of +=.

Also, you may have noticed special syntax of initializing the OnChange field to an empty delegate like this `delegate { }`. This ensures that our OnChange field will never be null. Hence, we can remove the null check before raising the event, if no other members of the class making it null.

## Pub-Sub Using EventHandlers {#pub-sub-using-eventhandlers}

In Pub-Sub, the publisher and subscriber don’t know about the existence of one another. There is a third component, called broker or message broker or event bus, which is known by both the publisher and subscriber, which filters all incoming messages and distributes them accordingly.

Here EventHandler is our that third component that acts as event bus between publisher and subscriber.

So instead of using Action delegate, we have to use EventHandler which is defined as the following delegate:

```csharp
public delegate void EventHandler(
    object sender,
    EventArgs e
)
```

By default, EventHandler takes sender object and some event argument as a parameter. Here sender is the same object which raises the event, which is publisher in our case.

Let's see an example

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//Define event argument you want to send while raising event.
public class MyEventArgs:EventArgs
{
    public int Value { get; set; }

    public MyEventArgs(int value)
    {
        Value = value;
    }
}


//Define publisher class as Pub
public class Pub
{
    //OnChange property containing all the 
    //list of subscribers callback methods.

    //This is generic EventHandler delegate where 
    //we define the type of argument want to send 
    //while raising our event, MyEventArgs in our case.
    public event EventHandler<MyEventArgs> OnChange = delegate { };

    public void Raise()
    {
        //Invoke OnChange Action
        //Lets pass MyEventArgs object with some random value
        OnChange(this,new MyEventArgs(33));
    }
}

class Program
{
    static void Main(string[] args)
    {
        //Initialize pub class object
        Pub p = new Pub();

        //register for OnChange event - Subscriber 1
        p.OnChange += (sender,e) => Console.WriteLine("Subscriber 1! Value:" + e.Value);
        //register for OnChange event - Subscriber 2
        p.OnChange += (sender,e) => Console.WriteLine("Subscriber 2! Value:" + e.Value);

        //raise the event
        p.Raise();

        //After this Raise() method is called
        //all subscribers callback methods will get invoked

        Console.WriteLine("Press enter to terminate!");
        Console.ReadLine();
    }
}
```

Here the pub class uses generic EventHandler, which specifies the type of event argument you need to pass to the while raising the EventHandler OnChange, MyArgs in our case

## Exception Aware Event Raise {#exception-aware-event-raise}

Let's start with code this time

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//Define event argument you want to send while raising event.
public class MyEventArgs : EventArgs
{
    public int Value { get; set; }

    public MyEventArgs(int value)
    {
        Value = value;
    }
}


//Define publisher class as Pub
public class Pub
{
    //OnChange property containing all the 
    //list of subscribers callback methods.

    //This is generic EventHandler delegate where 
    //we define the type of argument want to send 
    //while raising our event, MyEventArgs in our case.
    public event EventHandler<MyEventArgs> OnChange = delegate { };

    public void Raise()
    {
        //Invoke OnChange Action
        //Lets pass MyEventArgs object with some random value
        OnChange(this, new MyEventArgs(33));
    }
}

class Program
{
    static void Main(string[] args)
    {
        //Initialize pub class object
        Pub p = new Pub();

        //register for OnChange event - Subscriber 1
        p.OnChange += (sender, e) => Console.WriteLine("Subscriber 1! Value:" + e.Value);
        //register for OnChange event - Subscriber 2
        p.OnChange += (sender, e) => { throw new Exception(); };
        //register for OnChange event - Subscriber 3
        p.OnChange += (sender, e) => Console.WriteLine("Subscriber 3! Value:" + e.Value);

        //raise the event
        p.Raise();

        //After this Raise() method is called
        //all subscribers callback methods will get invoked

        Console.WriteLine("Press enter to terminate!");
        Console.ReadLine();
    }
}
```

When you run this code you will find that the first subscriber is executed successfully and the second one throws an exception and the third one is never called.

If this not the behavior you want, you need to manually raise the event and handle the exception. This can be achieved by using the GetInvoctionList method defined in Delegate base class.

Let's see the code example

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//Define event argument you want to send while raising event.
public class MyEventArgs : EventArgs
{
    public int Value { get; set; }

    public MyEventArgs(int value)
    {
        Value = value;
    }
}


//Define publisher class as Pub
public class Pub
{
    //OnChange property containing all the 
    //list of subscribers callback methods.

    //This is generic EventHandler delegate where 
    //we define the type of argument want to send 
    //while raising our event, MyEventArgs in our case.
    public event EventHandler<MyEventArgs> OnChange = delegate { };

    public void Raise()
    {
        //Initialize MyEventArgs object with some random value
        MyEventArgs eventArgs = new MyEventArgs(33);

        //Create list of exception
        List<Exception> exceptions = new List<Exception>();

        //Invoke OnChange Action by iterating on all subscribers event handlers
        foreach (Delegate handler in OnChange.GetInvocationList())
        {
            try
            {
                //pass sender object and eventArgs while
                handler.DynamicInvoke(this, eventArgs);
            }
            catch (Exception e)
            {
                //Add exception in exception list if occured any
                exceptions.Add(e);
            }
        }

        //Check if any exception occured while 
        //invoking the subscribers event handlers
        if(exceptions.Any())
        {
            //Throw aggregate exception of all exceptions 
            //occured while invoking subscribers event handlers
            throw new AggregateException(exceptions);
        }
    }
}

class Program
{
    static void Main(string[] args)
    {
        //Initialize pub class object
        Pub p = new Pub();

        //register for OnChange event - Subscriber 1
        p.OnChange += (sender, e) => Console.WriteLine("Subscriber 1! Value:" + e.Value );
        //register for OnChange event - Subscriber 2
        p.OnChange += (sender, e) => { throw new Exception(); };
        //register for OnChange event - Subscriber 3
        p.OnChange += (sender, e) => Console.WriteLine("Subscriber 3! Value:" + e.Value );

        //raise the event
        p.Raise();

        //After this Raise() method is called
        //all subscribers callback methods will get invoked

        Console.WriteLine("Press enter to terminate!");
        Console.ReadLine();
    }
}
```

## Where To Apply Publish Subscribe Pattern?

- When you want loose coupling between objects that interact with each other.

- When you want to specify the kind of notification you want to send, by defining a number of events, to a subscriber depending on the type or scope of change. The subscriber will thus be able to choose to subscribe a specific notifications that matters.

> **Note:** You can download the complete solution demo from my [github repository](https://github.com/kudchikarsk/publisher-subscriber-design-pattern).

## Further Reading {#further-reading}

- [Observer Pattern C#](/observer-pattern-csharp/) - The observer design pattern enables a subscriber to register with and receive notifications from a provider. It is suitable for any scenario that requires push-based notification. The pattern defines a provider (also known as a subject or an observable) and zero, one, or more observers.

- [Observer vs Pub-Sub pattern][observable-design-pattern] by [Ahmed Shamim Hassan](https://hackernoon.com/@me_shaon) - Despite the differences between these patterns, some might say that Publisher-Subscriber pattern is a variation of Observer pattern because of the conceptual similarity between them. However, Ahmed Shamim explains how they are different from each other in a very illustrative way!


[post-image]: /assets/images/pub-sub-design-pattern.jpg "Publish Subscribe Design Pattern In C#"
[observable-design-pattern]: https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c
[csharp-delegates]: /delegates-and-events-in-csharp/#delegates-in-csharp
[multicast-delegate]: /delegates-and-events-in-csharp/#multicast-delegates