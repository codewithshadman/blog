---
layout: post
current: post
navigation: True
tags: [Csharp Design Patterns]
class: post-template
subclass: 'post design-patterns'
title: Mediator Pattern C#
description: The Mediator pattern in C# enables objects to communicate, without knowing each other's identities. It also encapsulates a protocol that objects can follow.
cover: "assets/images/mediator-pattern-csharp.jpg"
date: Wed Nov  6 21:23:20 2019
last_modified_at: Sat Nov  9 12:47:16 2019
author: shadman_kudchikar
comments: true
---



## Contents

- [What Is Mediator Pattern?](#what-is-mediator-pattern)
- [Mediator Pattern Example](#mediator-pattern-example)
- [Where To Apply Mediator Pattern?](#where-to-apply-mediator-pattern)
- [Further Reading](#further-reading)

## What Is Mediator Pattern?

The Mediator pattern in C# enables objects to communicate, without knowing each other's identities. It also encapsulates a protocol that objects can follow.

You can think of a Mediator object as a kind of a coordinator; that handles traffic between appropriate parties based on its own logic.

Mediator promotes loose coupling by keeping objects from referring to each other explicitly, and it lets you vary their interaction independently.

<!--more-->

## Mediator Pattern Example

Let's start with the problem statement,

You are maintaining a network of computers in Mesh topology.

A mesh network is a network topology in which each node relays data for the network. All mesh nodes cooperate in the distribution of data in the network.

If a new computer is added or an existing computer is removed, all other computers in that network should know about these two events.

Let's see how the Mediator pattern fits into it.

{% highlight csharp linenos %}

using System;

class Program
{
    static void Main(string[] args)
    {
        IMediator mediator = new NetworkMediator();
        ComputerColleague colleague1 = new ComputerColleague("Eagle");
        ComputerColleague colleague2 = new ComputerColleague("Ostrich");
        ComputerColleague colleague3 = new ComputerColleague("Penguin");
        mediator.Register(colleague1);
        mediator.Register(colleague2);
        mediator.Register(colleague3);
        mediator.Unregister(colleague1);
        Console.ReadLine();

        /*
        Output:
        New Computer register event with name:Ostrich: received @Eagle
        New Computer register event with name:Penguin: received @Eagle
        New Computer register event with name:Penguin: received @Ostrich
        Computer left unregister event with name:Eagle:received @Ostrich
        Computer left unregister event with name:Eagle:received @Penguin
        */
    }

    /* Define the contract for communication between Colleagues.
    Implementation is left to ConcreteMediator */
    interface IMediator
    {
        void Register(Colleague colleague);
        void Unregister(Colleague colleague);
    }


    /* Act as a central hub for communication between different Colleagues.
     Notifies all Concrete Colleagues on the occurrence of an event
    */
    class NetworkMediator : IMediator
    {
        public event EventHandler<ColleagueArgs> RegisterNotification = delegate { };
        public event EventHandler<ColleagueArgs> UnRegisterNotification = delegate { };
        public NetworkMediator()
        {
        }
        public void Register(Colleague colleague)
        {
            RegisterNotification(this, new ColleagueArgs(colleague));
            RegisterNotification += colleague.ReceiveRegisterNotification;
            UnRegisterNotification += colleague.ReceiveUnRegisterNotification;
        }
        public void Unregister(Colleague colleague)
        {
            RegisterNotification -= colleague.ReceiveRegisterNotification;
            UnRegisterNotification -= colleague.ReceiveUnRegisterNotification;
            UnRegisterNotification(this, new ColleagueArgs(colleague));
        }
    }

    public class ColleagueArgs : EventArgs
    {
        public ColleagueArgs(Colleague colleague)
        {
            Colleague = colleague;
        }

        public Colleague Colleague { get; }
    }

    /* Define the contract for notification events from Mediator.
     Implementation is left to ConcreteColleague
    */
    public abstract class Colleague
    {
        private String name;
        public Colleague(String name)
        {
            this.name = name;
        }
        public override String ToString()
        {
            return name;
        }
        public abstract void ReceiveRegisterNotification(
            object sender, ColleagueArgs colleagueArgs);
        public abstract void ReceiveUnRegisterNotification(
            object sender, ColleagueArgs colleagueArgs);
    }

    /* Process notification event raised by other Colleague through Mediator.
    */
    class ComputerColleague : Colleague
    {
        public ComputerColleague(string name) : base(name)
        {
        }

        public override void ReceiveRegisterNotification(
            object sender, ColleagueArgs colleagueArgs)
        {
            Console.WriteLine("New Computer register event with name:" 
                + colleagueArgs.Colleague + ": received @" + this);
            // Send further messages to this new Colleague from now onwards
        }

        public override void ReceiveUnRegisterNotification(
            object sender, ColleagueArgs colleagueArgs)
        {
            Console.WriteLine("Computer left unregister event with name:" 
                + colleagueArgs.Colleague + ":received @" + this);
            // Do not send further messages to this Colleague from now onwards
        }
    }
}
{% endhighlight %}

In the above example `IMediator` defines the contract for communication between Colleagues. This communication is implemented in `NetworkMediator` using delegates and events.

`RegisterNotification` and `UnRegisterNotification` are the two delegates that keep the track for the Colleague methods. 

Here, [Delegate](/delegates-and-events-in-csharp/#delegates-in-csharp) form the basis for the [event system](/delegates-and-events-in-csharp/#events-in-csharp) in C#. For more information, see my blog post [Delegates And Events In C#](/delegates-and-events-in-csharp/).

Although the example shows a very simple Mediator, it is possible that
the mediator can have very complex logic. For example, messages can only be sent between colleagues of the same department.

Also, 

`ComputerColleague` class can maintain a private reference to the `NetworkMediator` and thus register or unregister itself for notification. Let's see the code example,

{% highlight csharp linenos %}

class ComputerColleague : Colleague
{
    private readonly NetworkMediator mediator;

    public ComputerColleague(string name, NetworkMediator mediator) : base(name)
    {
        this.mediator = mediator;
        this.mediator.RegisterNotification += ReceiveRegisterNotification;
        this.mediator.UnRegisterNotification += ReceiveUnRegisterNotification;
        
    }

    public void UnRegister()
    {
        mediator.RegisterNotification -= ReceiveRegisterNotification;
        mediator.UnRegisterNotification -= ReceiveUnRegisterNotification;
    }

    ...
    ...
}
{% endhighlight %}

The Mediator pattern makes provisions for more than one mediator. For example,
there may be many different departments in a company. Each department
may have a different moderator, different rules of engagement, and a different list of
users, but the structure of the lists is identical. Therefore, creating a new Mediator is
merely an instantiation operation and does not require subclassing or an interface.

## Where To Apply Mediator Pattern?

- When a set of objects communicate in well-defined but complex ways. The resulting
interdependencies are unstructured and difficult to understand.

- When reusing an object is difficult because it refers to and communicates with
many other objects.

- When a behavior that's distributed between several classes should
be customizable without a lot of subclassing.

> **Note:** You can download the complete solution demo from my [github repository](https://github.com/kudchikarsk/mediator-pattern-csharp).

## Further Reading

- [Observer Pattern C#](/observer-pattern-csharp/) - The observer design pattern enables a subscriber to register with and receive notifications from a provider. It is suitable for any scenario that requires push-based notification. The pattern defines a provider (also known as a subject or an observable) and zero, one, or more observers.

- [Publish Subscribe Design Pattern In C#](/publish-subscribe-design-pattern-in-csharp/) - Publish Subscribe or Pub-Sub is a design pattern that allows loose coupling between the application components. This post explains the implementation detail of Pub-Sub using Delegates, EventHandlers and Event keyword in C#.

- [Using the event aggregator pattern to communicate between view models](https://blog.magnusmontin.net/2014/02/28/using-the-event-aggregator-pattern-to-communicate-between-view-models/) by [Magnus Montin](https://blog.magnusmontin.net/about/) - In this post, Magnus explains how by introducing an event aggregator in between the publishers and subscribers, you can remove tight coupling between them. The subscriber observes the event aggregator instead of the publisher and the publisher knows only about the event aggregator and not about the subscribers. This pattern is much similar to the mediator pattern.

