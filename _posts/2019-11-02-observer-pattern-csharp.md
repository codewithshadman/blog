---
layout: post
current: post
navigation: True
tags: [Csharp Design Patterns]
class: post-template
subclass: 'post design-patterns'
title: Observer Pattern C#
description: Observer in C# is a behavioral design pattern that allows one object to notify other objects about changes in their state. In this article, you'll learn how to implement the Observer in C#.
cover: "assets/images/observer-pattern-csharp.jpg"
date: Sat Nov  2 21:15:03 2019
last_modified_at: Wed Nov  6 21:14:36 2019
author: shadman_kudchikar
comments: true
---


## Contents

- [What is Observer Pattern?](#what-is-observer-pattern)
- [Observer Pattern Example](#observer-pattern-example)
- [Push And Pull Mechanism Observer Pattern](#push-and-pull-mechanism-observer-pattern)
    - [Push](#push)
    - [Pull](#pull)
    - [Reactive Extensions for .NET](#reactive-extensions-for-net)
- [Delegates And Events In C\#](#delegates-and-events-in-c)
- [Where To Apply Observer Pattern?](#where-to-apply-observer-pattern)
- [Further Reading](#further-reading)


## What is Observer Pattern?

Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

In this pattern, there are many observers (objects) that are observing a particular subject (also an object). Observers want to be notified when there is a change made inside
the subject. So, they register themselves for that subject. When they lose interest in the
subject, they simply unregister from the subject.

<!--more-->

## Observer Pattern Example

Let's start with the problem statement,

The below code is a stock simulator that contains a list of dummy stock data. Each stock contains a name and price that we can monitor.

Now you don’t have to know the code for the stock simulator, it’s only going to be here to prove a point.

```cs
using System;
using System.Collections;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        
        var stockSimulator = new StockSimulator();
        foreach (var stock in stockSimulator)
        {
            //The below code that checks for Microsoft stock and 
            //displays its changed price
            if (stock.Name == "Microsoft")
                Console.WriteLine($"Microsoft new price is {stock.Price}");

            //The below code looks for google stock and check if 
            //its reached the target price and display the price 
            //when it reaches the target price.
            if (stock.Name == "Google" && stock.Price > 50)
                Console.WriteLine($"Google reached target price {stock.Price}");
        }
        Console.ReadLine();
    }

    public class StockSimulator : IEnumerable<Stock>
    {
        Random random;
        string[] names = new string[3] { "Microsoft", "Google", "Apple" };

        public StockSimulator()
        {
            random = new Random(1024);
        }

        public IEnumerator<Stock> GetEnumerator()
        {
            for (int i = 0; i < 20; i++)
            {
                yield return new Stock(names[random.Next(0, 3)], 
                    random.Next(1, 100));
            }
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }

    public class Stock
    {
        public Stock(string name, int value)
        {
            Name = name;
            Price = value;
        }

        public string Name { get; }
        public int Price { get; }
    }
}
```

Here’s my problem, if look at the program we can say that we have two different activity. One activity is checking for the Microsoft price and the other is checking for the google price. 

Although they both are independent of each other they are occurring in the same program. If for some reason we want to monitor a new stock we have to update the main program and add some lines like below code,

```cs
if (stock.Name == "Apple")
    Console.WriteLine($"Apple new price is {stock.Price}");
```

Now, The observer pattern that allows us to do is separate the monitoring aspect of the stock data from the action of reading the stock data from the stock simulator.

Let's go step by step and implement the observer pattern for the above problem,

First, we will define a generic interface for observers (subscribers) specifying how they should be updated. In traditional observer pattern, the Update method doesn't specify any parameters and observers keep a reference of the observable (publisher). But, this approach usually creates a problem like memory leak if we do not clean our observers and observables properly. Hence the below code!

```cs
public interface IObserver<T>
{
    void Update(T data);           
}
```

Secondly, we will define a generic observable (subject/publisher) class that uses a generic parameter `T` as a subject. In traditional observer pattern, usually observable is defined as interface first and then get implemented by concrete subjects. However, by using generics this can be simplified in a single type.

```cs
public class Observable<T>
{
    private List<IObserver<T>> observers = new List<IObserver<T>>();
    private T subject;

    public T Subject
    {
        get => subject;
        set 
        {
            subject = value;
            Notify();
        }
    }

    public void Register(IObserver<T> observer)
    {
        observers.Add(observer);
    }

    public void Unregister(IObserver<T> observer)
    {
        observers.Remove(observer);
    }

    public void Notify()
    {
        foreach (var observer in observers)
        {
            observer.Update(subject);
        }
    }
}
```

And, finally, we will create our concrete observers for Microsoft and Google stock.

```cs
public class GoogleStockObserver : IObserver<Stock>
{
    public void Update(Stock data)
    {
        if (data.Name == "Google" && data.Price > 50)
            Console.WriteLine($"Google reached target price {data.Price}");
    }
}

public class MicrosoftStockObserver : IObserver<Stock>
{
    public void Update(Stock data)
    {
        if (data.Name == "Microsoft")
            Console.WriteLine($"Microsoft new price is {data.Price}");
    }
}
```

Now our main program can be written in the following way:

```cs
static void Main(string[] args)
{
    //This is our Observable also known as publisher that notifies about change
    var stockObservable = new Observable<Stock>();

    //observer that monitors microsoft stock
    var microsoftObserver = new MicrosoftStockObserver();
    //here microsoftObserver gets register with stockObservable 
    //as microsoftObserver wants to get notified when there is a 
    //change made inside the subject.
    stockObservable.Register(microsoftObserver);

    //observer that monitors google stock
    var googleObserver = new GoogleStockObserver();
    //here googleObserver gets register with stockObservable 
    //as googleObserver wants to get notified when there is a 
    //change made inside the subject.
    stockObservable.Register(googleObserver);

    //our same old simulator
    var stockSimulator = new StockSimulator();
    //code that updates the subject
    foreach (var stock in stockSimulator)
        stockObservable.Subject = stock; //this will cause for 

    Console.ReadLine();
}
```

Let's see everything together,

```cs
using System;
using System.Collections;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        //This is our Observable also known as publisher 
        //that notifies about change
        var stockObservable = new Observable<Stock>();

        //observer that monitors microsoft stock
        var microsoftObserver = new MicrosoftStockObserver();
        //here microsoftObserver gets register with stockObservable 
        //as microsoftObserver wants to get notified when there is a 
        //change made inside the subject.
        stockObservable.Register(microsoftObserver);

        //observer that monitors google stock
        var googleObserver = new GoogleStockObserver();
        //here googleObserver gets register with stockObservable 
        //as googleObserver wants to get notified when there is a 
        //change made inside the subject.
        stockObservable.Register(googleObserver);

        //our same old simulator
        var stockSimulator = new StockSimulator();
        //code that updates the subject
        foreach (var stock in stockSimulator)
            stockObservable.Subject = stock; //this will cause for 

        Console.ReadLine();
    }

    public class GoogleStockObserver : IObserver<Stock>
    {
        public void Update(Stock data)
        {
            if (data.Name == "Google" && data.Price > 50)
                Console.WriteLine($"Google reached target price {data.Price}");
        }
    }

    public class MicrosoftStockObserver : IObserver<Stock>
    {
        public void Update(Stock data)
        {
            if (data.Name == "Microsoft")
                Console.WriteLine($"Microsoft new price is {data.Price}");
        }
    }

    //An generic interface for Observers specifying how they should be updated
    public interface IObserver<T>
    {
        void Update(T data);           
    }

    public class Observable<T>
    {
        private List<IObserver<T>> observers = new List<IObserver<T>>();
        private T subject;

        public T Subject
        {
            get => subject;
            set 
            {
                subject = value;
                Notify();
            }
        }

        public void Register(IObserver<T> observer)
        {
            observers.Add(observer);
        }

        public void Unregister(IObserver<T> observer)
        {
            observers.Remove(observer);
        }

        public void Notify()
        {
            foreach (var observer in observers)
            {
                observer.Update(subject);
            }
        }
    }

    public class StockSimulator : IEnumerable<Stock>
    {
        Random random;
        string[] names = new string[3] { "Microsoft", "Google", "Apple" };

        public StockSimulator()
        {
            random = new Random(1024);
        }

        public IEnumerator<Stock> GetEnumerator()
        {
            for (int i = 0; i < 20; i++)
            {
                yield return new Stock(names[random.Next(0, 3)],
                    random.Next(1, 100));
            }
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }

    public class Stock
    {
        public Stock(string name, int value)
        {
            Name = name;
            Price = value;
        }

        public string Name { get; }
        public int Price { get; }
    }
}
```

Now, We have discussed before that when observers lose interest in the
subject, they simply unregister from the subject. To implement this all we need to do is update our `Subscribe` method to return an object that will help us to unregister the passed `observer`.

```cs
public Unsubscriber<T> Subscribe(IObserver<T> observer)
{
    if(!observers.Contains(observer))
        observers.Add(observer);
    return new Unsubscriber<T>(observers, observer);
}
```

Now, here the `Unsubscriber<T>` is a generic type that maintains the list of observers and the observer to be unsubscribed from the list, i.e the observer we want to remove from the list. Below is the code for the same,

```cs
public class Unsubscriber<T> : IDisposable
{
    private List<IObserver<T>> observers;
    private IObserver<T> observer;

    public Unsubscriber(List<IObserver<T>> observers, IObserver<T> observer)
    {
        this.observers = observers;
        this.observer = observer;
    }

    public void Dispose()
    {
        observers.Remove(observer);
    }
}
```

The action of removing the observer from the list of observers unsubscribe the observer from the subject as our subject has reference to the same list. 

Also, the code, of removing the observer from the list, is written within the dispose method. This enables us to use the using statement if we want to unsubscribe more elegantly when the operation defined within the using scope is completed.

After making the above changes, our `Observable<T>` class will look like the code below.

```cs
public class Observable<T>
{
    private List<IObserver<T>> observers = new List<IObserver<T>>();
    private T subject;

    public T Subject
    {
        get => subject;
        set
        {
            subject = value;
            Notify();
        }
    }

    public Unsubscriber<T> Subscribe(IObserver<T> observer)
    {
        if(!observers.Contains(observer))
            observers.Add(observer);
        return new Unsubscriber<T>(observers, observer);
    }

    public void Notify()
    {
        foreach (var observer in observers)
        {
            observer.Update(subject);
        }
    }
}

public class Unsubscriber<T> : IDisposable
{
    private List<IObserver<T>> observers;
    private IObserver<T> observer;

    public Unsubscriber(List<IObserver<T>> observers, IObserver<T> observer)
    {
        this.observers = observers;
        this.observer = observer;
    }

    public void Dispose()
    {
        observers.Remove(observer);
    }
}
```

We can go one step further and provide unsubscribe functionality to our observers too. As this will require some implementation we will make our observer as an abstract class instead of an interface. 

```cs
public abstract class Observer<T>
{
    private Unsubscriber<T> cancellation;

    public abstract void Update(T data);
    public void Subscribe(Observable<T> provider)
    {
        cancellation = provider.Subscribe(this);
    }

    public virtual void Unsubscribe()
    {
        cancellation.Dispose();
    }
}
```
Here all we did is created a `Subscribe` method that takes an observable and pass current observer object to its `Subscribe` method and keep a reference of the cancellation object returned by the method, then we use this object in `Unsubscribe` method to unsubscribe with the provider.

Now,  we can write the client code in the following manner:

```cs
var stockObservable = new Observable<Stock>();

var microsoftObserver = new MicrosoftStockObserver();
microsoftObserver.Subscribe(stockObservable); //this is more intuitive
```

above code is more intuitive, instead of,

```cs
var stockObservable = new Observable<Stock>();

var microsoftObserver = new MicrosoftStockObserver();
stockObservable.Subscribe(microsoftObserver); //this is Ok too :p
```

Also, we can now do this in the client code,

```cs
static void Main(string[] args)
{
    var stockObservable = new Observable<Stock>();

    var microsoftObserver = new MicrosoftStockObserver();
    microsoftObserver.Subscribe(stockObservable);

    var googleObserver = new GoogleStockObserver();
    googleObserver.Subscribe(stockObservable);

    stockObservable.Subject = new Stock("Microsoft", 10);
    microsoftObserver.Unsubscribe();
    stockObservable.Subject = new Stock("Microsoft", 20);
    stockObservable.Subject = new Stock("Microsoft", 30);
    microsoftObserver.Subscribe(stockObservable);
    stockObservable.Subject = new Stock("Microsoft", 40);
    stockObservable.Subject = new Stock("Google", 60);
    googleObserver.Unsubscribe();
    stockObservable.Subject = new Stock("Google", 70);
    stockObservable.Subject = new Stock("Google", 80);
    googleObserver.Subscribe(stockObservable);
    stockObservable.Subject = new Stock("Google", 90);

    Console.ReadLine();
}
```


## Push And Pull Mechanism Observer Pattern

Now,

When implementing the Observer pattern, there are two main approaches to consider: the 'push' model and the 'pull' model.

In the 'push' model, the subject (i.e. the Observable) sends the observer on notification all the data it will need. The observer doesn't need to query the subject for information. In the 'pull' model, the subject merely notifies the observer that something happened, and the observer queries the subject based to get the information it needs.

Please note,

In both mechanisms, it is always the responsibility of an Observable object to notify all the subscribed observers, the difference lies whether the observer gets the exact data it wants (Push) or it has to extract the required data (Pull).

Let's discuss the pros and cons of both approaches:

### Push

The main advantage of the 'push' model is the lower coupling between the observer and the subject. The observer doesn't need to know anything about the subject to query it. If it needed to, we'd need to do one of the following: A- do downcast on the side of the observer to invoke class-specific get methods on the subject. This is bad. B- make the Observable interface more class-specific, offering specific get methods, thus making the relationship between the observer and subject less general and making things more coupled.

By implementing the 'push' model, we avoid all of this.

However, the disadvantage is less flexibility: the subject may not always know what exact information the observers need to send it to them. This will often mean more specific Observer interfaces, such as AgeObserver that are notified when the 'age' of the subject is changed, and HeightObserver which are sent the current height of the subject on the notification.

This is one option. The other is the subject sending a whole lot of information encapsulated in an Info object of some sort and have the observers query it from there. But again, we can't be sure we're sending the correct info. So it's either this or forcing the observers to implement more specific Observer interfaces, which tightens the coupling on the observer's side.

### Pull

The main disadvantages of the 'pull' model are that the observers would have to know things about the subject to query the right information, which leads A- to downcasting (ugly), or B- favorably to more specific Observable interfaces, that offer more specific accessor methods. For example AgeObservable offers a getAge() method.

The advantage of this is more flexibility. Each observer can decide for itself what to query, without relying on the subject to send the correct information.

### Reactive Extensions for .NET

The push model implemented by [Reactive Extensions for .NET](https://github.com/dotnet/reactive) and is represented by the two interfaces `IObservable<T>` and `IObserver<T>`. These interfaces are provided by .NET Framework 4.0 base class library.

You can implement them too in our existing classes like this:

```cs
public abstract class Observer<T> : IObserver<T>
{
    private Unsubscriber<T> cancellation;

    public void Subscribe(Observable<T> provider)
    {
        cancellation = provider.Subscribe(this);
    }

    public virtual void Unsubscribe()
    {
        cancellation.Dispose();
    }

    public abstract void OnNext(T value);

    public abstract void OnError(Exception error);

    public abstract void OnCompleted();
}

public class Observable<T> : IObservable<T>
{
    private List<Observer<T>> observers = new List<Observer<T>>();
    private T subject;

    public T Subject
    {
        get => subject;
        set
        {
            subject = value;
            Notify();
        }
    }

    public void Notify()
    {
        foreach (var observer in observers)
        {
            observer.OnNext(subject);
        }
    }

    public Unsubscriber<T> Subscribe(Observer<T> observer)
    {
        if (!observers.Contains(observer))
            observers.Add(observer);
        return new Unsubscriber<T>(observers, observer);
    }

    IDisposable IObservable<T>.Subscribe(IObserver<T> observer)
    {
        return Subscribe(observer as Observer<T>);
    }

    public void Completed()
    {
        foreach (var observer in observers)
            observer.OnCompleted();
    }

    public void Error(Exception e)
    {
        foreach (var observer in observers)
            observer.OnError(e);
    }
}
```
From the above code, you may have noticed, instead of `Notify` method IObserver relies on `OnNext` method. The thing is reactive programming represents asynchronous and event-based programs using observable sequences. Reactive Extensions also represents data sequences as observable sequences. An application can subscribe to these observable sequences to receive asynchronous notifications as new data arrive. 

In addition to implementing the observer design pattern, you may love to explore libraries that are built using the `IObservable<T>` and `IObserver<T>` interfaces. For example, [Reactive Extensions for .NET](https://github.com/dotnet/reactive) consist of a set of extension methods and LINQ standard sequence operators to support asynchronous programming.

> **Note:** Typically, a Observable implements the `Subscribe` method by adding a particular observer to a subscriber list that is represented by a collection object, and it implements the `Dispose` method by removing a particular observer from the subscriber list. So, It could happen that the provider and observer may both try to remove the same member from the list. Because of this [possibility](/thread-synchronization-in-csharp/thread-synchronization-and-race-condition/), both the Subscribe and Dispose methods should be [thread-safe](/thread-synchronization-in-csharp/thread-synchronization-techniques/). Typically, this involves using a concurrent collection or a [lock](/thread-synchronization-in-csharp/csharp-monitor/). Implementations that are not thread-safe should explicitly document that they are not.


## Delegates And Events In C\#

Now, In C# you can implement the same idea of observer pattern using Delegates and Events which is really more concise and elegant way of writing this pattern.

Here, [Delegate](/delegates-and-events-in-csharp/#delegates-in-csharp) form the basis for the [event system](/delegates-and-events-in-csharp/#events-in-csharp) in C#. For more information, see my blog post [Delegates And Events In C#](/delegates-and-events-in-csharp/).

An event is a special kind of delegate that facilitates event-driven programming. Events are class members that cannot be called outside of the class regardless of their access specifier. So, for example, an event declared to be public would allow other classes the use of += and -= on the event, but firing the event (i.e. invoking the delegate) is only allowed in the class containing the event.

Typically, an event is created in the subject/observables and registration of observers is made through the delegate callback mechanism. Observers provide the delegate callback implementation that would be called by the subject when the event is raised. 

Let's see the example,

```cs
using System;
using System.Collections;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        var stockObservable = new StockObservable();
        var microsoftObserver = new MicrosoftStockObserver(stockObservable);
        var googleObserver = new GoogleStockObserver(stockObservable);

        var stockSimulator = new StockSimulator();
        foreach (var stock in stockSimulator)
            stockObservable.Subject = stock;
        Console.ReadLine();
    }

    public class StockObservable
    {
        private Stock subject;

        /*
        an event declared to be public would allow other classes the use of += and -= on
        the event, but firing the event (i.e. invoking the delegate) is only allowed in 
        the class containing the event.

        The EventHandler delegate is a predefined delegate that specifically represents
        an event handler method for an event that generate data of type define in generic
        argument EventHandler<TEventArgs> delegate class.
        */
        public event EventHandler<StockChangeEventArgs> StockChangeEvent = delegate { };

        public Stock Subject
        {
            get => subject;
            set
            {
                subject = value;

                //invoking the delegate
                StockChangeEvent(this, new StockChangeEventArgs(subject));
            }
        }
    }

    //This class represents the data generated by the above event
    public class StockChangeEventArgs : EventArgs
    {
        public StockChangeEventArgs(Stock stock)
        {
            Stock = stock;
        }

        public Stock Stock { get; }
    }

    public class GoogleStockObserver
    {
        public GoogleStockObserver(StockObservable stockTicker)
        {
            /*
            GoogleStockObserver can subscribe to the event by adding 
            StockChange method to the event delegate
            */
            stockTicker.StockChangeEvent += StockChange;
        }

        private void StockChange(object sender, StockChangeEventArgs e)
        {
            var data = e.Stock; //gets the data from the event
            if (data.Name == "Google" && data.Price > 50)
                Console.WriteLine($"Google reached target price {data.Price}");
        }
    }

    public class MicrosoftStockObserver
    {
        public MicrosoftStockObserver(StockObservable stockTicker)
        {
            stockTicker.StockChangeEvent += StockChange;
        }

        private void StockChange(object sender, StockChangeEventArgs e)
        {
            var data = e.Stock;
            if (data.Name == "Microsoft")
                Console.WriteLine($"Microsoft new price is {data.Price}");
        }
    }

    public class StockSimulator : IEnumerable<Stock>
    {
        Random random;
        string[] names = new string[3] { "Microsoft", "Google", "Apple" };

        public StockSimulator()
        {
            random = new Random(1024);
        }

        public IEnumerator<Stock> GetEnumerator()
        {
            for (int i = 0; i < 20; i++)
            {
                yield return new Stock(names[random.Next(0, 3)],
                    random.Next(1, 100));
            }
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }

    public class Stock
    {
        public Stock(string name, int value)
        {
            Name = name;
            Price = value;
        }

        public string Name { get; }
        public int Price { get; }
    }

}
```

You can also read my article [Publish Subscribe Design Pattern In C#](/publish-subscribe-design-pattern-in-csharp/) for more in-depth knowledge of this concept.

## Where To Apply Observer Pattern?

- When an abstraction has two aspects, one dependent on the
other. Encapsulating these aspects in separate objects lets you vary
and reuse them independently.

- When a change to one object requires changing others, and you don't know
how many objects need to be changed.

- When an object should be able to notify other objects without
making assumptions about who these objects are. In other words, you don't want
these objects tightly coupled.

> **Note:** You can download the complete solution demo from my [github repository](https://github.com/kudchikarsk/observer-pattern-csharp).

## Further Reading

- [Observer Design Pattern Best Practices](https://docs.microsoft.com/en-us/dotnet/standard/events/observer-design-pattern-best-practices) - In the .NET Framework, the observer design pattern is implemented using the `IObservable<T>` and `IObserver<T>` interfaces. This post describes the best practices that developers should follow when implementing the observer design pattern using these interfaces.

- [Lesson 07.3: Sending Messages from the ViewModel to the View](https://scottlilly.com/build-a-cwpf-rpg/lesson-07-3-sending-messages-from-the-viewmodel-to-the-view/) by [Scott Lilly](https://scottlilly.com/) - This is a lesson from Scott's tutorial - 'Learn C# by Building a Simple RPG'. In this lesson, Scott creates a way to send messages from the GameSession (ViewModel), to the UI (View). He does this by having the ViewModel “raise an event”, and have the View “subscribe” to that event.

- [Observer](https://gameprogrammingpatterns.com/observer.html) by [Bob Nystrom](http://journal.stuffwithstuff.com/) - This is a chapter from Bob's book 'Game Programming Patterns' that explains the Observer pattern from a game developer perspective. 

[post-image]: /assets/images/observer-pattern-csharp.jpg "Observer Pattern C#"