---
layout: post
current: post
navigation: True
tags: [Csharp Design Patterns]
class: post-template
subclass: 'post design-patterns'
title: Iterator Pattern C#
description: The Iterator pattern in C# provides a way of accessing elements of a collection sequentially, without knowing how the collection is structured.
cover: "assets/images/iterator-pattern-csharp.jpg"
date: Wed Oct 16 21:23:04 2019
last_modified_at: Fri Oct 18 22:24:31 2019
author: shadman_kudchikar
comments: true
---



## Contents

- [What Is Iterator Pattern?](#what-is-iterator-pattern)
- [Iterator Design Pattern Example](#iterator-design-pattern-example)
- [C\# IEnumerator](#c-ienumerator)
- [C\# IEnumerable](#c-ienumerable)
- [C# Yield](#c-yield)
- [Where To Apply Iterator Pattern?](#where-to-apply-iterator-pattern)
- [Further Reading](#further-reading)


## What Is Iterator Pattern?

The Iterator pattern provides a way of accessing elements of a collection sequentially, without knowing how the collection is structured.

The idea is that an aggregate object such as an array or list will give you a way to access its elements without exposing its internal structure. 

Moreover, you might want to traverse the list in different ways, depending on what you want to accomplish. But you probably don't want to bloat the List interface with operations for different traversals, even if you could anticipate the ones you will need. You might also need to have more than one traversal pending on the same list.

The Iterator pattern lets you do all this. The key idea in this pattern is to take the responsibility for access and traversal out of the list object and put it into an iterator object.

<!--more-->

## Iterator Design Pattern Example

In the traditional design pattern approach, iterator pattern has an Aggregate interface for creating an Iterator object and the Iterator interface for traversing an Aggregate object.

Let's see a quick example,

```cs
class Program
{
    public class Weeks //Aggregate object
    {
        private string[] weeks = new string[]{
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
            };

        public IWeeksIterator GetWeeksIterator()
        {
            //creates an Iterator object
            return new WeeksIterator(weeks);
        }
    }

    public interface IWeeksIterator //Iterator interface
    {
        string Current { get; }

        bool MoveNext();
    }

    public class WeeksIterator : IWeeksIterator //Iterator object
    {
        private readonly string[] weeks;
        private int position;

        public WeeksIterator(string[] weeks)
        {
            this.weeks = weeks;
            this.position = -1;
        }

        public string Current => weeks[position];

        public bool MoveNext()
        {
            if (++position == weeks.Length) return false;
            return true;
        }
    }

    static void Main(string[] args)
    {
        var weeks = new Weeks();
        var iterator = weeks.GetWeeksIterator();
        while (iterator.MoveNext())
        {
            Console.WriteLine(iterator.Current);
        }
        Console.ReadLine();
    }
}
```

In the above code, we have created a collection class `Weeks` which is our Aggregate object, for the sake of simplicity we have not created an Aggregate interface, our `Weeks` class contains a private array of the string containing days in a week. Next, we have a `WeeksIterator` class, implementing the `IWeeksIterator` which is our Iterator interface, that traverse over this collection.

A sharp reader will wonder why we did not just loop through weeks. Like this,

```cs
class Program
{
    public class Weeks
    {
        private string[] weeks = new string[]{
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
            };

        public string[] Days => weeks;
    }

    static void Main(string[] args)
    {
        var days = new Weeks().Days;
        for (int i = 0; i < days.Length; i++)
        {
            Console.WriteLine(days[i]);
        }
    }
}
```
The reason is that weeks is declared not in the Client, but in its own collection class. Even without the benefits gained from separating iteration and enumeration, it would be a bad style for the Client to access weeks directly.

However, talking about benefits,

Iterators can also provide filters, transformations, and projections on the data.

Let's say we just want weekdays (all days of the week other than Sunday or Saturday) from the collection, in that case, we can create another iterator.

```cs
public class WeekDaysIterator : IWeeksIterator
{
    private readonly string[] weeks;
    private int position;

    public WeekDaysIterator(string[] weeks)
    {
        this.weeks = weeks;
        this.position = -1;
    }

    public string Current => weeks[position];

    public bool MoveNext()
    {
        if (++position == (weeks.Length -2)) return false;
        return true;
    }
}
```

Here only change I did is, `(weeks.Length -2)` in MoveNext method that just skips the last two values in the array that is Saturday and Sunday!

## C\# IEnumerator 
Iterators (also known as **Enumerators**) are responsible for producing the next element in a sequence defined by certain criteria. Such a sequence is said to be **Enumerable**. For example, the next Fibonacci number in the series. The iterator/enumerator is the means by which we loop over this sequence of elements from beginning to end.

From the early days of C# 1.0 and 2.0, C# supported the iterators. In C#, iterators are defined using the `IEnumertor` interface consisted of the methods for the basic elements of a loop: Current, MoveNext, and Reset. Similar to the interface we mentioned above.

Let's transform our above code to use C# `IEnumertor`. You will find the `IEnumertor` interface in `System.Collections` namespace

```cs
class Program
{
    public class Weeks
    {
        ...
        ...
    }

    public class WeeksIterator : IEnumerator
    {
        private readonly string[] weeks;
        private int position;

        public WeeksIterator(string[] weeks)
        {
            this.weeks = weeks;
            this.position = -1;
        }

        public object Current => weeks[position];

        public bool MoveNext()
        {
            if (++position == weeks.Length) return false;
            return true;
        }

        public void Reset()
        {
            this.position = -1;
        }
    }

    public class WeekDaysIterator : IEnumerator
    {
        private readonly string[] weeks;
        private int position;

        public WeekDaysIterator(string[] weeks)
        {
            this.weeks = weeks;
            this.position = -1;
        }

        public object Current => weeks[position];

        public bool MoveNext()
        {
            if (++position == (weeks.Length - 2)) return false;
            return true;
        }

        public void Reset()
        {
            this.position = -1;
        }
    }

    static void Main(string[] args)
    {
        ...
        ...
    }
}
```

Now the only thing we changed here is that instead of custom `IWeeksIterator` interface we use the .NET `IEnumerator` interface which has the same methods define as we defined for the `IWeeksIterator`. Now, the `IEnumerator` interface use object as the return type for `Current` property in the interface. Hence, we need to change the return type of our `Current` property as well:

```cs
public object Current => weeks[position];
```

Now, you would be wondering how this could be of any use at all. We can just use the `IWeeksIterator` or any custom interface. The real benefit is that .NET IEnumerator has some language support for the iterator pattern. Before that let's talk about the IEnumerable interface.

## C\# IEnumerable 

IEnumerable is an interface, in `System.Collections` namespace, defining a single method GetEnumerator() that returns an IEnumerator - the same interface we use to implement our iterators. 

Now, IEnumerable acts as an Aggregate interface that guarantees to return an iterator.

```cs
public interface IEnumerable
{
    IEnumerator GetEnumerator();
}
```

The thing is all collections in the .NET library implement IEnumerable (i.e., they each provide a conforming GetEnumerator method).

And,

The foreach statement in C# is a syntactic sugar that hides from you that you are using the GetEnumerator and MoveNext methods.

So,

By implementing the IEnumerable interface in an iterator (or any collection class) you can use them in a foreach loop. Let's see how,

```cs
class Program
{
    public class Weeks
    {
        ...
        ...

        public IEnumerable GetWeeksIterator()
        {
            return new WeeksIterator(weeks);
        }

        public IEnumerable GetWeekDaysIterator()
        {
            return new WeekDaysIterator(weeks);
        }
    }

    public class WeeksIterator : IEnumerator, IEnumerable
    {
        ...
        ...

        public IEnumerator GetEnumerator()
        {
            return this;
        }
    }

    public class WeekDaysIterator : IEnumerator, IEnumerable
    {
        ...
        ...


        public IEnumerator GetEnumerator()
        {
            return this;
        }
    }

    static void Main(string[] args)
    {
        var weeks = new Weeks();
        foreach (var item in weeks.GetWeeksIterator())
        {
            Console.WriteLine(item);
        }
        Console.ReadLine();
    }
}
```

The only thing I changed in the above code is that I implemented the IEnumerable interface in the iterators and return `this` object. And the other important thing we need to do is change the return type for GetWeeksIterator() and GetWeekDaysIterator() method, they need to return IEnumerable instead of IEnumerator as foreach statement looks for an IEnumerable (which ensures an IEnumerator is returned by the passed collection). 

Still not a major benefit right? What if I tell you that, you can super simplify the above code with the `yield` keyword.

## C# Yield

> *“Life is really simple, but we insist on making it complicated.”* ~ Confucius

Yield is a special keyword that can be used only in the context of iterators. It instructs the compiler to convert this regular code to a state machine (an enumerator). The auto-generated code keeps track of where you are in the collection and it implements methods such as MoveNext and Current. 

Yeah! that means we can write less and do more, i.e. we can remove the WeeksIterator and WeekDaysIterator class. Let's see how

```cs
class Program
{
    public class Weeks
    {
        private string[] weeks = new string[]{
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
            };

        public IEnumerable GetWeeksIterator()
        {
            foreach (var item in weeks)
            {
                yield return item;
            }
        }

        public IEnumerable GetWeekDaysIterator()
        {
            for (int i = 0; i < (weeks.Length - 2); i++)
            {
                yield return weeks[i];
            }
        }
    }

    static void Main(string[] args)
    {
        var weeks = new Weeks();
        foreach (var item in weeks.GetWeeksIterator())
        {
            Console.WriteLine(item);
        }
        Console.ReadLine();
    }
}
```

Using yield to define an iterator removes the need for an explicit extra class (the class that holds the state for an enumeration, WeeksIterator, and WeekDaysIterator in our case!) when you implement the IEnumerable and IEnumerator pattern for a custom collection type.

Also, remember that you can write [LINQ queries in C#](https://www.codeproject.com/Articles/286255/Using-LINQ-Queries) for any collection of objects that supports IEnumerable or the [generic IEnumerable\<T\>](/generics-in-csharp/#ienumerable-generic-c) interface. So that's the ultimate benefit you can get by implementing these interfaces.

> **Note:** You can learn more about Generic Types and Generic IEnumerable in my blog post [Generics In C#](/generics-in-csharp/).

Below is the final version of the `Weeks` class. Here we have implemented the `IEnumerable` interface in the `Weeks` class and used the `yield` keyword in the `GetEnumerator` method to define our iterator. Now, we can directly use weeks object in a foreach loop in the client code.

```cs
class Program
{
    public class Weeks : IEnumerable
    {
        private string[] weeks = new string[]{
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
            };


        public IEnumerator GetEnumerator()
        {
            foreach (var item in weeks)
            {
                yield return item;
            }
        }
    }

    static void Main(string[] args)
    {
        var weeks = new Weeks();
        foreach (var item in weeks)
        {
            Console.WriteLine(item);
        }
        Console.ReadLine();
    }
}
``` 

## Where To Apply Iterator Pattern?

- When you want to access a collection of objects without exposing its internal representation.

- When there are multiple traversals of objects need to be supported in the collection.

> **Note:** You can download the complete solution demo from my [github repository](https://github.com/kudchikarsk/iterator-pattern-csharp).

## Further Reading

- [Lazy LINQ and Enumerable Objects](https://odetocode.com/blogs/scott/archive/2008/10/01/lazy-linq-and-enumerable-objects.aspx) by [K. Scott Allen](https://odetocode.com/about/scott-allen) - In this blog post, Scott explains why LINQ operators return an IEnumerable<T> instead of something more useful, like a List<T>, and explains the Lazy Loading behavior of Enumerators.

- [Coroutines In Unity](https://docs.unity3d.com/Manual/Coroutines.html) - Coroutine is a Unity type that is used to create parallel actions returning an IEnumerator to do so. A coroutine is a [Unity Engine](https://unity.com/) class while IEnumerator belongs to the .NET. Knowing how the Unity engine uses IEnumerator will give you a different perspective to see an Enumerator.

- [The cost of enumerating in .NET](http://joeduffyblog.com/2008/09/21/the-cost-of-enumerating-in-net/) by [Joe Duffy](http://joeduffyblog.com/) - In this post, Joe discusses the enumeration pattern in .NET concerning performance and implies how enumeration pattern cause some overhead that makes it difficult to compete with ordinary for loops.

- [Async Streams with C# 8](https://csharp.christiannagel.com/2019/03/20/asyncstreams/) by [Christian Nagel](https://csharp.christiannagel.com/about/) - One of the many great features of C# 8 is async streams. Before C# 8, you could use the await keyword only to get a single result – when the asynchronous method returns the result. This changes with C# 8. Using await it’s now possible to get a stream of results. This was made possible by defining asynchronous iterator interfaces, and updates to the foreach loop and the yield statement. This article gives you more information about this!