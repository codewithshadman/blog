---
layout: post
current: post
navigation: True
tags: [Csharp Design Patterns]
class: post-template
subclass: 'post design-patterns'
title: State Pattern C#
description: State Pattern in C# allow an object to alter its behavior when its internal state changes. This is achieved by an object variable changing its subclass, within a hierarchy.
cover: "assets/images/state-pattern-csharp.jpg"
date: Sun Nov 24 12:25:23 2019
last_modified_at: Sun Nov 24 12:52:45 2019
author: shadman_kudchikar
comments: true
---


## Contents

- [What Is State Pattern C#?](#what-is-state-pattern-c)
- [State Pattern C# Example](#state-pattern-c-example)
- [Benefit Of The State Pattern](#benefit-of-the-state-pattern)
- [Where To Apply State Pattern?](#where-to-apply-state-pattern)
- [Further Reading](#further-reading)

## What Is State Pattern C\#?

State Pattern in C# allow an object to alter its behavior when its internal state changes.

The State pattern, can be seen as a dynamic version of the [Strategy pattern](/strategy-pattern-csharp/). When the state inside an object changes, it can change its behavior by switching to a set of different operations. 

<!--more-->

This is achieved by an object variable changing its subclass, within a hierarchy.

Below is the UML and sequence diagram of State pattern from Wikipedia.

![State pattern](/assets/images/State_Design_Pattern_UML.jpg)

Let's us see an example to better understand this concept.

## State Pattern C\# Example

Let's take a look at an example of Work Item Tracking. Work Item Tracking is simply the bug tracking systems that we have all used such as Team Foundation Server. They all have in common that the work items or bugs go through a transition process. In each step of the transition they change states, and along with the change of state, the behavior of the work item also changes.

Let's take a look at an implementation of this simple example. 

`Program.cs`

```cs
using System;
using System.Linq;

namespace Example_1
{
    class Program
    {
        static void Main(string[] args)
        {
            var workItemRepository = new WorkItemRepository();
            WorkItem.Init(workItemRepository);
            string title = null, desc = null;
            string command;
            int id;
            try
            {
                command = args[0].ToLower();
                id = int.Parse(args[1]);

                if (args.Count() > 2)
                {
                    title = args[2];
                    desc = args[3];
                }
            }
            catch (Exception)
            {
                PrintUsage();
                return;
            }

            try
            {
                WorkItem workItem;
                switch (command)
                {
                    case "create":
                        workItem = WorkItem.Create(id);
                        workItem.Edit(title, desc);
                        workItem.Print();
                        break;

                    case "update":
                        workItem = WorkItem.FindById(id);
                        workItem.Edit(title, desc);
                        workItem.Print();
                        break;

                    case "open":
                        workItem = WorkItem.FindById(id);
                        workItem.Open();
                        break;

                    case "resolve":
                        workItem = WorkItem.FindById(id);
                        workItem.Resolve();
                        break;

                    case "close":
                        workItem = WorkItem.FindById(id);
                        workItem.Close();
                        break;

                    case "delete":
                        workItem = WorkItem.FindById(id);
                        workItem.Delete();
                        break;

                    case "print":
                        workItem = WorkItem.FindById(id);
                        workItem.Print();
                        break;
                }

                workItemRepository.Save();
            }
            catch (Exception)
            {
                PrintUsage();
            }
        }

        private static void PrintUsage()
        {
            Console.WriteLine("create   [id] [title] [description]");
            Console.WriteLine("update   [id] [title] [description]");
            Console.WriteLine("resolve  [id]");
            Console.WriteLine("close    [id]");
            Console.WriteLine("delete   [id]");
            Console.WriteLine("print    [id]");
        }
    }
}
```

`WorkItem.cs`

```cs
using System;

namespace Example_1
{
    public enum StateEnum { Proposed, Active, Resolved, Closed }

    public class WorkItem
    {
        public static WorkItemRepository WorkItemRepository { get; set; }

        public static void Init(WorkItemRepository workItemRepository)
        {
            WorkItemRepository = workItemRepository;
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public StateEnum State { get; set; }

        public static WorkItem Create(int id)
        {
            var workItem = new WorkItem() 
            { 
                Id = id, 
                State = StateEnum.Proposed 
            };
            WorkItemRepository.Add(workItem);
            return workItem;
        }

        public static WorkItem FindById(int id)
        {
            return WorkItemRepository.FindById(id);
        }

        public void Edit(string title, string description)
        {
            Title = title;
            Description = description;
        }

        public void Open()
        {
            switch (State)
            {
                case StateEnum.Proposed:
                    this.State = StateEnum.Active;
                    break;
                case StateEnum.Active:
                    Console.WriteLine("Work Item is already active.");
                    break;
                case StateEnum.Resolved:
                    Console.WriteLine("Work Item is already resolved.");
                    break;
                case StateEnum.Closed:
                    Console.WriteLine("Work Item is closed and cannot be modified.");
                    break;
            }
        }

        public void Resolve()
        {
            switch (State)
            {
                case StateEnum.Proposed:
                    Console.WriteLine("Work Item is in proposed state and cannot be directly resolved.");
                    break;
                case StateEnum.Active:
                    this.State = StateEnum.Resolved;
                    break;
                case StateEnum.Resolved:
                    Console.WriteLine("Work Item is already resolved.");
                    break;
                case StateEnum.Closed:
                    Console.WriteLine("Work Item is closed and cannot be modified.");
                    break;
            }
        }

        public void Delete()
        {
            switch (State)
            {
                case StateEnum.Proposed:
                    WorkItemRepository.Delete(this);
                    break;
                case StateEnum.Active:
                    Console.WriteLine("Work Item is already active and cannot be deleted.");
                    break;
                case StateEnum.Resolved:
                    Console.WriteLine("Work Item is already resolved and cannot be deleted.");
                    break;
                case StateEnum.Closed:
                    WorkItemRepository.Delete(this);
                    break;
            }
        }

        public void Close()
        {
            switch (State)
            {
                case StateEnum.Proposed:
                    Console.WriteLine("Work Item is in proposed state and cannot be closed.");
                    break;
                case StateEnum.Active:
                    Console.WriteLine("Work Item is in active state and cannot be closed.");
                    break;
                case StateEnum.Resolved:
                    this.State = StateEnum.Closed;
                    break;
                case StateEnum.Closed:
                    Console.WriteLine("Work Item is already closed.");
                    break;
            }
        }

        public void Print()
        {
            Console.WriteLine($"Id: {Id}");
            Console.WriteLine($"Title: {Title}");
            Console.WriteLine($"State: {State}");
            Console.WriteLine($"Description: {Description}");

        }
    }
}
```

`WorkItemRepository.cs`

```cs
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Example_1
{
    public class WorkItemRepository
    {
        private readonly ICollection<WorkItem> workItems;
        private readonly string filename = "workitems.json";

        public WorkItemRepository()
        {
            workItems = LoadData();
            if (workItems == null)
            {
                workItems = new List<WorkItem>();
                SaveData();
            }
        }

        

        public void Add(WorkItem workItem)
        {
            workItems.Add(workItem);
            SaveData();
        }

        public void Update(WorkItem workItem)
        {
            SaveData();
        }

        public bool Delete(WorkItem workItem)
        {
            var @return = workItems.Remove(workItem);
            SaveData();
            return @return;
        }

        public long Count()
        {
            return workItems.Count;
        }

        public WorkItem FindById(int id)
        {
            return workItems.FirstOrDefault(w=>w.Id == id);
        }

        public void Save()
        {
            SaveData();
        }

        private void SaveData()
        {
            var data = JsonConvert.SerializeObject(workItems);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), filename);
            File.WriteAllText(filePath, data);
        }

        private ICollection<WorkItem> LoadData()
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), filename);
            if (!File.Exists(filePath)) return null;
            var jsonData = File.ReadAllText(filePath);
            return JsonConvert.DeserializeObject<List<WorkItem>>(jsonData);
        }
    }
}
```

I have here our command line interface of a work item tracking system that is using the basic CMMI approach that TFS uses with four states to the work items. There's Proposed, Active, Resolved, and Closed. 

On a work item, you typically can create a work item, edit the title and the description. We can open the work item, which essentially moves it from Proposed to Active, we resolve it, moving it from Active to Resolved, we close it, moving it from Resolved to Closed, and we also can print details about it.

![State Pattern Example Console Program](/assets/images/state-pattern-examples/example1.png)


As we can see, there are some issues with the Simple or Naive approach. 


- No extensibility, all of the states are hard-coded in the program. To add a new state, we must go to each method and add a new case to all of the switches. 

- Mixed Concerns, all of the actions for a particular state are spread throughout the code. A change in one action for one state may have an effect on the other states, which means we need to test it, but these are difficult to unit test. 

- Each method has a large number of permutations for the inputs and the corresponding outputs. This leads to a lack of testing and possibly complicated unit tests. All of these issues lead to a maintenance problem.

State pattern can help us to solve all these issues.

So what is the intent of the State Pattern? Well the intent is to change the behavior of the object with each change in the state. As I change the state of the object, I expect all of the actions that go with that state to also change. 

I want to, though, encapsulate that logic of each state into a single object, something that is in one area that I can test by itself.

In the current application in the simple or naive approach, we had all of the states in the code, but the State Pattern can allow for the dynamic discovery of new states and the program should be able to integrate them into the process. 

And, of course, with all of this we want to make unit testing easier.


Let's take a look at the implementation of the State Pattern. 

In the Main Program, the structure will be pretty much the same. The program starts by creating a repository, parsing the command lines, and then executing the commands on the WorkItems.

However,

The WorkItem has been modified. On the WorkItem I've implemented the ICommands interface and I've added two new instance variables, one for the State and one for the command. The WorkItem now implements each method of the `ICommand` interface, and each method in the ICommand interface is implemented by shuttling the method call to the command object's methods. 


`ICommand.cs`

```cs
namespace Example_2
{
    public interface ICommand
    {
        void Open();
        void Resolve();
        void Close();
        bool Delete();
        void Print();
    }
}
```

`WorkItem.cs`

```cs
using Example_2.States;

namespace Example_2
{
    public enum StateEnum { Proposed, Active, Resolved, Closed }

    public class WorkItem : ICommand
    {
        public static WorkItemRepository WorkItemRepository { get; set; }

        public static void Init(WorkItemRepository workItemRepository)
        {
            WorkItemRepository = workItemRepository;
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public StateEnum State 
        { 
            get => state; 
            set
            {
                state = value;
                switch (state)
                {
                    case StateEnum.Proposed:
                        command = new Proposed(this);
                        break;
                    case StateEnum.Active:
                        command = new Active(this);
                        break;
                    case StateEnum.Resolved:
                        command = new Resolved(this);
                        break;
                    case StateEnum.Closed:
                        command = new Closed(this);
                        break;
                }
            }
        }

        private ICommand command;
        private StateEnum state;

        public static WorkItem Create(int id)
        {
            var workItem = new WorkItem()
            {
                Id = id,
                State = StateEnum.Proposed
            };
            WorkItemRepository.Add(workItem);
            return workItem;
        }

        public static WorkItem FindById(int id)
        {
            return WorkItemRepository.FindById(id);
        }

        public void Edit(string title, string description)
        {
            Title = title;
            Description = description;
        }

        public void Open()
        {
            command.Open();
        }

        public void Resolve()
        {
            command.Resolve();
        }

        public void Close()
        {
            command.Close();
        }

        public bool Delete()
        {
            if (command.Delete())
            {
                WorkItemRepository.Delete(this);
                return true;
            }

            return false;
        }        

        public void Print()
        {
            command.Print();
        }
    }
}
```

So all of this is pretty simple, but when the state changes, the `command` object that provides the actual work also needs to change. This is done by implementing the state property. So in the state property, we see here that the value of the state being set is stored in the instance variable, and when the state changes, the state properly will also instantiate a new command object based on the state value and passes in a reference to the WorkItem. 

As noted in the code, this does not strictly separate the state from the WorkItems, but you can see here how that functionality can quickly be added so that the WorkItem itself may not know anything about the states in the future. 

What you do notice is that apart from the state change, there is no longer any case statements in each method of the WorkItem.

The states themselves have been broken up into a separate class for each state. 

`Proposed.cs`

```cs
using System;

namespace Example_2.States
{
    public class Proposed : BaseState, ICommand
    {
        private readonly WorkItem owner;

        public Proposed(WorkItem owner) : base(owner)
        {
            this.owner = owner;
        }

        public void Open()
        {
            owner.State = StateEnum.Active;
        }

        public void Resolve()
        {
            Console.WriteLine("Work Item is in proposed state and cannot be directly resolved.");
        }

        public void Close()
        {
            Console.WriteLine("Work Item is in proposed state and cannot be closed.");
        }

        public bool Delete()
        {
            return true;
        }
    }
}

```

`Active.cs`

```cs
using System;

namespace Example_2.States
{
    public class Active : BaseState, ICommand
    {
        private readonly WorkItem owner;

        public Active(WorkItem owner) : base(owner)
        {
            this.owner = owner;
        }

        public void Open()
        {
            Console.WriteLine("Work Item is already active.");
        }

        public void Resolve()
        {
            owner.State = StateEnum.Resolved;
        }

        public void Close()
        {
            Console.WriteLine("Work Item is in active state and cannot be closed.");
        }

        public bool Delete()
        {
            Console.WriteLine("Work Item is already active and cannot be deleted.");
            return false;
        }
    }
}

```

`Resolved.cs`

```cs
using System;

namespace Example_2.States
{
    public class Resolved : BaseState, ICommand
    {
        private readonly WorkItem owner;

        public Resolved(WorkItem owner) : base(owner)
        {
            this.owner = owner;
        }

        public void Open()
        {
            Console.WriteLine("Work Item is already resolved.");
        }

        public void Resolve()
        {
            Console.WriteLine("Work Item is already resolved.");
        }

        public void Close()
        {
            owner.State = StateEnum.Closed;
        }

        public bool Delete()
        {
            Console.WriteLine("Work Item is already resolved and cannot be deleted.");
            return false;
        }
    }
}
```

`Closed.cs`

```cs
using System;

namespace Example_2.States
{
    public class Closed : BaseState, ICommand
    {
        private readonly WorkItem owner;

        public Closed(WorkItem owner) : base(owner)
        {
            this.owner = owner;
        }

        public void Open()
        {
            Console.WriteLine("Work Item is closed and cannot be modified.");
        }

        public void Resolve()
        {
            Console.WriteLine("Work Item is closed and cannot be modified.");
        }

        public void Close()
        {
            Console.WriteLine("Work Item is already closed.");
        }

        public bool Delete()
        {
            return true;
        }
    }
}

```

`BaseState.cs`

```cs
using System;

namespace Example_2.States
{
    public abstract class BaseState
    {
        private WorkItem owner;
        public BaseState(WorkItem owner)
        {
            this.owner = owner;
        }

        public void Print()
        {
            Console.WriteLine($"Id: {owner.Id}");
            Console.WriteLine($"Title: {owner.Title}");
            Console.WriteLine($"State: {owner.State}");
            Console.WriteLine($"Description: {owner.Description}");
        }
    }
}
```


If we look at the active state, we see how the Active class is inherited from the BaseState and implements the ICommands interface. 

The inheritance from a BaseState is not required, but it shows that we can still leverage commonality in the states as long as they all implement the ICommand's interface so they can have a relationship back with the WorkItem. 

Notice that in the construction of the Active class, the reference to the WorkItem is captured as the owner. This allows the states themselves to pass information back to the WorkItem or use the WorkItem in one of the method calls. We see this in the execution of the Print method. 

A difficult method to implement is the Delete method. In this case, the Delete method of a particular state needs to determine if the WorkItem can be deleted, and send that information back to the WorkItem. The reason is, this WorkItem is part of a collection, it doesn't really know how it's being stored. So in this case, I would go back to the original program. 

## Benefit Of The State Pattern

The benefit of the State Pattern should be obvious by now. One of the immediate benefits is the Separation of Concerns. 

Whereas the WorkItem used to contain all of the logic about creation, the data, the state, and all of the method behaviors, it is now dedicated to simply the creation of the WorkItems and the data they contain. 

The method behaviors have been abstracted away and are localized to the specific state of the object.

The state objects themselves can be reused. This is where other design patterns such as the Flyweight Pattern can be used so that only a few instantiations of the state objects are created at any time. 

Often, the state objects will only have a single representation implemented by the Singleton Pattern and will be reused throughout the application. 

All of this provides a way to simplify the program. This allows for a clearer understanding and easier testing, which all leads to greater maintainability.

## Where To Apply State Pattern?

- When an object's behavior depends on its state, and it must change its behavior
at run-time depending on that state.

- When object contains large number of operations with multipart conditional statements that depend on the object's state. This state is usually represented by one or more enumerated constants.

> **Note:** You can download the complete solution demo from my [github repository](https://github.com/kudchikarsk/state-pattern-csharp).

## Further Reading

- [Strategy Pattern C#](/strategy-pattern-csharp/) - Strategy pattern is one of the most useful design patterns in OOP. It lets you select an algoritm’s implementation at runtime. In this article, you'll learn how to implement the Strategy pattern in C#.

- [How to Create a Simple Circuit Breaker in C#](https://patrickdesjardins.com/blog/how-to-create-a-simple-circuit-breaker-in-c) by [Patrick Desjardins](https://patrickdesjardins.com/blog/) - Circuit Breaker pattern is named from house circuit breaker — something fail, it opens the circuit, thus does not do any damage. With code, the circuit breaker pattern is useful when we access a resource that can slow down the system. In this article Patrick demonstrates how to create a simple Circuit Breaker in C#. The interesting thing is Circuit Breaker pattern implements State pattern to handle Circuit Breaker states. 

- [Stateless 3.0 - A State Machine library for .NET Core](https://www.hanselman.com/blog/Stateless30AStateMachineLibraryForNETCore.aspx) by [Scott Hanselman](https://www.hanselman.com/)- In this post, Scott introduces "Stateless" which is a simple library for creating state machines in C# code. You can use state machines for anything. You can certainly describe high-level business state machines, but you can also easily model IoT device state, user interfaces, and more.

- [State](https://gameprogrammingpatterns.com/state.html)  by [Bob Nystrom](http://journal.stuffwithstuff.com/) - This is a chapter from Bob's book 'Game Programming Patterns' that explains the State pattern from a game developer perspective. 

