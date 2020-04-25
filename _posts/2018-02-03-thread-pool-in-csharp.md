---
layout: post
current: post
navigation: True
tags: [Csharp Multithreading]
class: post-template
subclass: 'post csharp-multithreading'
title: "C# Threadpool"
description: "This article explains how to use C# Threadpool. A thread pool is a collection of threads that can be used to perform several tasks in the background. This leaves the primary thread free to perform other tasks asynchronously."
cover: "assets/images/csharp-threadpool.jpg"
course: multithreadingcsharp
comments: true
aside: multithreading_tutorial_aside.html
author: shadman_kudchikar
redirect_from:
  - /multithreading-in-csharp/thread-pool-in-csharp/
---


## Contents

* [What Is C# Threadpool?](#what-is-thread-pool-in-csharp)
* [C# Thread Pool Queue](#csharp-thread-pool-queue)
* [Limitations To Thread Pool Queue](#limitations-to-thread-pool-queue)
* [Further Reading](#further-reading)

## What is C# Threadpool? {#what-is-thread-pool-in-csharp}

As we learned in previous chapter thread shutdown after its work is done which is a great thing, CLR clears the resource after thread shutdown and thus free up space for smooth program execution without you to write any code for thread management and garbage collection.

However,

Creation of thread is something that costs time and resource and thus will be difficult to manage when dealing with a large number of threads. Thread pool is used in this kind of scenario. When you work with thread pool from .NET you queue your work item in thread pool from where it gets processed by an available thread in the thread pool.

But,

After work is done this thread doesn't get shutdown. Instead of shutting down this thread get back to thread pool where it waits for another work item. The creation and deletion of this threads are managed by thread pool depending upon the work item queued in the thread pool. If no work is there in the thread pool it may decide to kill those threads so they no longer consume the resources.

## C# Thread Pool Queue {#csharp-thread-pool-queue}

ThreadPool.QueueUserWorkItem is a static method that is used to queue the user work item in the thread pool. Just like you pass a delegate to a thread constructor to create a thread you have to pass a delegate to this method to queue your work.

Here is an example,

```csharp
using System;
using System.Threading;

class Example1
{
    public static void Main()
    {
        // call QueueUserWorkItem to queue your work item
        ThreadPool.QueueUserWorkItem(Speak);

        Console.WriteLine("Press Enter to terminate!");
        Console.ReadLine();
    }

    //your custom method you want to run in another thread
    public static void Speak(object stateInfo)
    {
        // No state object was passed to QueueUserWorkItem, so stateInfo is null.
        Console.WriteLine("Hello World!");
    }
}
```

as you can see we can directly pass this Speak method name to the QueueUserWorkItem method as it takes WaitCallback delegate as a parameter.

Here is the definition of this delegate,

```cs
public delegate void WaitCallback(object state);
```

See how it share the same signature like our Speak method with void as return type and take object as parameter.

QueueUserWorkItem also has overload for parameterised method like this,

```txt
QueueUserWorkItem(WaitCallback, Object)
```

Here the first parameter is your method name and the second parameter is the object that you want to pass to your method.

Here is an example,

```csharp
using System;
using System.Threading;

class Example1
{
    public static void Main()
    {
        // call QueueUserWorkItem to queue your work item
        ThreadPool.QueueUserWorkItem(Speak, "Hello World!");

        Console.WriteLine("Press Enter to terminate!");
        Console.ReadLine();
    }

    //your custom method you want to run in another thread
    public static void Speak(object s)
    {
        string say = s as string;
        Console.WriteLine(say);
    }
}
```

Did you notice how we passed our required parameter for Speak method to QueueUserWorkItem as the second parameter.

## Limitations To Thread Pool Queue {#limitations-to-thread-pool-queue}

ThreadPool.QueueUserWorkItem is really easy way to schedule your work into thread pool however it has its limitation, like you cannot tell whether a particular work operation is finished and also it does not return a value.

However,

A Task is something that you can use in place of ThreadPool.QueueUserWorkItem. It tells whether an operation is completed and also returns a value after the task is completed. For more information, see my blog post [C# Task](/csharp-task/)

In the next post [C# Race Condition](/thread-synchronization-in-csharp/thread-synchronization-and-race-condition/), we'll learn what is a Race Condition in a multithreaded program and how much it is critical to synchronize a multithreaded program having Shared Resources.

## Further Reading

- [C# Race Condition](/thread-synchronization-in-csharp/thread-synchronization-and-race-condition/) - This article explains what is Race Condition and Shared Resources in a multithreaded program and how much it is critical to synchronize a multithreaded program having shared resources. Thread Synchronization is a mechanism which ensures that two or more concurrent process or threads do not execute some particular section of program especially critical section at the same time.

- [C# Task](/csharp-task/) - C# Task is one of the central elements of the task-based asynchronous pattern first introduced in the .NET Framework 4. This article serves to be a quick guide for using Tasks in C#. It discusses different methods to create tasks and handle their execution.