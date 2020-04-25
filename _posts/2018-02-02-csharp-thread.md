---
layout: post
current: post
navigation: True
tags: [Csharp Multithreading]
class: post-template
subclass: 'post csharp-multithreading'
title: "C# Thread"
description: "This article is a complete introduction to threading. It explains what is a thread and why it is used in programming. Threading enables your C# program to perform concurrent processing so that you can do more than one operation at a time."
cover: "assets/images/csharp-thread.jpg"
course: multithreadingcsharp
comments: true
aside: multithreading_tutorial_aside.html
redirect_from: "/multithreading-in-csharp/csharp-thread-lifetime-and-thread-shutdown-methods/"
author: shadman_kudchikar
redirect_from:
  - /multithreading-in-csharp/csharp-thread/
  - /multithreading-in-csharp/threads-in-csharp-overview/
  - /multithreading-in-csharp/getting-started-with-thread-class-in-csharp/
  - /multithreading-in-csharp/csharp-thread-lifetime-and-thread-shutdown-methods/
---

## Contents
* [What Are Threads In C#?](#what-are-threads-in-csharp)
* [When To Use Thread In C#?](#when-to-use-thread-in-csharp)
* [Limitations Of Threads In C#](#limitations-of-threads-in-csharp)
* [C# Start New Thread](#csharp-start-new-thread)
* [Difference Between Foreground And Background Thread In C# ](#difference-between-foreground-and-background-thread-in-csharp)
* [C# Start Thread With Parameters](#csharp-start-thread-with-parameters)
* [Thread Life Cycle In C#](#thread-life-cycle-in-csharp)
* [C# Stop Thread](#csharp-stop-thread)
* [Further Reading](#further-reading)

## What Are Threads in C\#? {#what-are-threads-in-csharp}

In CLR or Windows environment each program you run creates a virtual address space and known as process. Contents of a process is not addressable directly to another process.

Each process has its own thread(s) and this thread has access to all data in that process, But if we are .Net programmers and so we are, we have managed code and we can say that this thread as managed thread which has access to all data in that process's app domain which is subdivision of process



Know more what is the difference in managed and unmanaged code, memory and size [here](https://stackoverflow.com/questions/3368802/what-is-the-difference-in-managed-and-unmanaged-code-memory-and-size).



So a process in its execution lifetime has this main thread that runs execution starting from the main method and in during this execution it may create one or more thread. This thread can execute code of the same executable or code defined in other dll in the same process

In Windows world, if a process does not have a thread it gets terminate.

## When To Use Thread In C\#? {#when-to-use-thread-in-csharp}

You can use threads in the following cases:

- Scalability (Be parallel) - If you have long running CPU bound operations, like to compute if 80 digit number is prime or not, you can scale this operation by paralleling this operation to multiple threads

- Responsive - You can keep client application responsive by keeping off lengthy operations from main thread (like CPU bound operation) and thus can also leverage the benefit of canceling the task

- Leverage asynchronous technique - If you have IO bound operation such reading a web content it may require some time in order of minutes, so you can leverage another thread to wait for this operation while you perform other task and thus even keep UI responsive

However,

C# provides async await syntax for this kind of asynchronous technique.

Also,

Being asynchronous is not parallel it just keeps the application responsive. Asynchronous means not waiting for an operation to finish, but registering a listener instead.

In general, use parallel threads (using [Thread class](/multithreading-in-csharp/getting-started-with-thread-class-in-csharp/) and [Task class](/tasks-in-csharp/csharp-task/) in C#) or asynchronous technique (using [C# async await](/tasks-in-csharp/async-await-c/) keyword) depending upon whether the problem is CPU bound or IO bound respectively.

**Thumb rule is to use threads for CPU bound operation and async for IO bound operation for a client application, and always use async for a server application.**

You can find some serious examples of CPU bound and non-CPU bound problems [here](https://www.quora.com/What-are-some-examples-of-CPU-bound-and-non-CPU-bound-problems-What-would-be-the-best-programming-language-to-tackle-each-situation).


## Limitations Of Threads In C\# {#limitations-of-threads-in-csharp}

- Multithreading leads to complex code thus reduce readability. It also increases the difficulty of debugging and testing. However, you can overcome this with good programming practice and commented code.

- Also in single core processor machine, Threads increase execution time (a little) than a sequential program, due to context switching. But still for scalability its good to use threads because when it will run on multi-core processor machine it will scale better.

Bottom line, Ignore all these limitations.

## C# Start New Thread {#csharp-start-new-thread}

Threads in C# are modelled by Thread Class. When a process starts (you run a program) you get a single thread (also known as the main thread) to run your application code. To explicitly start another thread (other than your application main thread) you have to create an instance of thread class and call its Start method to run the thread using C#, Let's see an example

```csharp
 using System;
 using System.Diagnostics;
 using System.Threading;

 public class Example
 {
     public static void Main()
     {
         //initialize a thread class object 
         //And pass your custom method name to the constructor parameter
         Thread t = new Thread(SomeMethod);

         //start running your thread
         t.Start();

         //while thread is running in parallel 
         //you can carry out other operations here        

         Console.WriteLine("Press Enter to terminate!");
         Console.ReadLine();
     }

     private static void SomeMethod()
     {
         //your code here that you want to run parallel
         //most of the time it will be a CPU bound operation

         Console.WriteLine("Hello World!");
     }
 }      
```

When you run this program you may see _Press Enter to terminate!_ message first and then _Hello World!_ as they both run in parallel, so it is not guaranteed which execute first.

So,

We can use Thread's `Join()` method to halt our main thread until reference thread (that is "t" variable in our case) is truly shutdown.

Another method to do this would be by using boolean `IsAlive` property of thread which gives instantaneous snapshot of thread's state whether it is running or not. Like this,

```csharp
while ( t.IsAlive ) { } 
```

However, `t.Join()` is the recommended method.

Here is an example

```csharp
using System;
using System.Diagnostics;
using System.Threading;

public class Example
{
    public static void Main()
    {
        //initialize a thread class object 
        //And pass your custom method name to the constructor parameter
        Thread t = new Thread(SomeMethod);

        //start running your thread
        t.Start();

        //while thread is running in parallel 
        //you can carry out other operations here

        //wait until Thread "t" is done with its execution.
        t.Join();

        Console.WriteLine("Press Enter to terminate!");
        Console.ReadLine();
    }

    private static void SomeMethod()
    {
        //your code here that you want to run parallel
        //most of the time it will be a CPU bound operation

        Console.WriteLine("Hello World!");
    }
}
```

Now,

Thread doesn't start running until you call `thread.Start()` method, So before calling this Start method you can set some properties of a thread like its name and priority. Setting name of the thread will only help you in debugging, by setting name you can easily point out your thread in Visual Studio Thread window, Let's see an example

```csharp
Thread t = new Thread(SomeMethod);

t.Name="My Parallel Thread";

t.Priority=ThreadPriority.BelowNormal;

//start running your thread
t.Start();
```


## Difference Between Foreground And Background Thread In C\# {#difference-between-foreground-and-background-thread-in-csharp}

There is also this another thread property IsBackground. If set to true your thread will be a background thread otherwise it will be a foreground thread, by default its false so it will always be a foreground thread, Let's see an example

```csharp
Thread t = new Thread(SomeMethod);

//set thread object as a background thread
t.IsBackground = true;

//start running your thread
t.Start();
```

Suppose if a foreground thread is the only thread (your main thread is done with execution and terminated) in your process, so your process is about to exit. However, it won't, your process will wait for foreground thread to complete its execution. Thus, It will prevent application to exit until the foreground thread is done with the execution.

However,

Background thread will exit as soon as your process exits even though background thread is not completely done with the execution.

Learn more about how foreground & background threads work in C# .NET [here](https://docs.microsoft.com/en-us/dotnet/standard/threading/foreground-and-background-threads).


## C# Start Thread With Parameters {#csharp-start-thread-with-parameters}

As you saw in example before that we pass method name to thread constructor parameter like this,

```csharp
Thread t = new Thread(SomeMethod);
```

We able to do this because this thread contructor takes delegate as parameter. Its supports two type of delegates, Here is the definition of first delegate

```csharp
public delegate void ThreadStart()
```

this we already saw in the above example, other is

```csharp
public delegate void ParameterizedThreadStart(object obj)
```

If your custom method takes argument you can pass a ParameterizedThreadStart delegate to constructor, Let's see an example

```csharp
using System;
using System.Diagnostics;
using System.Threading;

public class Example
{
    public static void Main()
    {
        //initialize a thread class object 
        //And pass your custom method name to the constructor parameter
        Thread t = new Thread(Speak);

        //start running your thread
        //dont forget to pass your parameter for the Speak method 
        //in Thread's Start method below
        t.Start("Hello World!");

        //wait until Thread "t" is done with its execution.
        t.Join();

        Console.WriteLine("Press Enter to terminate!");
        Console.ReadLine();
    }

    private static void Speak(object s)
    {
        //your code here that you want to run parallel
        //most of the time it will be a CPU bound operation

        string say = s as string;
        Console.WriteLine(say);

    }
}
```

Did you notice now we need to pass the Speak method argument to Start method.

So far we have used only static method. However, you can also use instance methods as a thread constructor parameter, Let's see an example

```csharp
using System;
using System.Diagnostics;
using System.Threading;

public class Example
{
    public static void Main()
    {
        Person person = new Person();

        //initialize a thread class object 
        //And pass your custom method name to the constructor parameter
        Thread t = new Thread(person.Speak);

        //start running your thread
        //dont forget to pass your parameter for 
        //the Speak method in Thread's Start method below
        t.Start("Hello World!");

        //wait until Thread "t" is done with its execution.
        t.Join();

        Console.WriteLine("Press Enter to terminate!");
        Console.ReadLine();
    }
}

public class Person
{
    public void Speak(object s)
    {
        //your code here that you want to run parallel
        //most of the time it will be a CPU bound operation

        string say = s as string;
        Console.WriteLine(say);

    }
}
```
In the above example, we used ParameterizedThreadStart delegate however same applies to ThreadStart delegate, both of them can be used with an instance method.

## Thread Life Cycle In C\# {#thread-life-cycle-in-csharp}

So now we know how thread class models a thread. This thread, however, doesn't stay for infinity and has lifespan which is up to the return of the thread delegate method, Let's see an example

```csharp
using System;
using System.Diagnostics;
using System.Threading;

public class Example
{
    public static void Main()
    {
        //initialize a thread class object 
        //And pass your custom method name to the constructor parameter

        Thread t = new Thread(Speak);

        //start running your thread
        //dont forget to pass your parameter for the Speak method in 
        //Thread's Start method below
        t.Start("Hello World!");

        //wait until Thread "t" is done with its execution.
        t.Join();

        Console.WriteLine("Press Enter to terminate!");
        Console.ReadLine();
    }

    private static void Speak(object s)
    {
        //your code here that you want to run parallel
        //most of the time it will be a CPU bound operation

        string say = s as string;
        Console.WriteLine(say);

    } // <-- this line is where thread exit and shutdown
}
```

Here, line no 33 will be the last execution statement after which thread will be shutdown.

Some other reasons of thread shutdown are as follows:

### Synchronous exception

Thread also gets exit if it runs into an unhandled exception. This exception is considered as synchronous exception which occurs in normal sequential program like IndexOutOfRangeExecption.

### Asynchronous exception

This exception is an explicit exception raised by calling thread's Abort or Interrupt method in the running thread by some other thread which has reference to the running thread. This exception also exits thread execution. However, this is not a recommended method to shutdown a thread as it leaves the program to some improper state.

## C\# Stop Thread {#csharp-stop-thread}

Lets start with an example this time,

```csharp
using System;
using System.Diagnostics;
using System.Threading;

public class Example
{
    //set to volatile as its liable to change so we JIT to don't cache the value
    private static volatile bool _cancel = false;

    public static void Main()
    {
        //initialize a thread class object 
        //And pass your custom method name to the constructor parameter

        Thread t = new Thread(Speak);

        //start running your thread
        //dont forget to pass your parameter for the 
        //Speak method (ParameterizedThreadStart delegate) in Start method
        t.Start("Hello World!");

        //wait for 5 secs while Speak method print Hello World! for multiple times
        Thread.Sleep(5000);

        //signal thread to terminate
        _cancel = true;


        //wait until CLR confirms that thread is shutdown
        t.Join();
    }

    private static void Speak(object s)
    {

        while (!_cancel)
        {
            string say = s as string;
            Console.WriteLine(say);
        }

    }
}
```

Here we used a boolean field to signal another thread Speak method to stop running when `_cancel` is set to true.

Did you notice how we need to set the `_cancel` field as volatile. JIT usually cache this kind of fields as it doesn't seem to change within Speak method in the loop. By setting it to volatile we are signaling JIT not to cache this field because it is liable to change.

You can use your own communication mechanism to tell the ThreadStart method to finish, which is recommended method. Alternatively the Thread class has in-built support for instructing the thread to stop. The two principle methods are `Thread.Interrupt()` and `Thread.Abort()`, which is not recommended.

In the next post we will learn about [C# Threadpool](/thread-pool-in-csharp/). A thread pool is a collection of threads that can be used to perform several tasks in the background. This leaves the primary thread free to perform other tasks asynchronously.

## Further Reading

- [C# Threadpool](/thread-pool-in-csharp/) - This article explains how to use C# Threadpool. A thread pool is a collection of threads that can be used to perform several tasks in the background. This leaves the primary thread free to perform other tasks asynchronously.

- [C# Task](/csharp-task/) - C# Task is one of the central elements of the task-based asynchronous pattern first introduced in the .NET Framework 4. This article serves to be a quick guide for using Tasks in C#. It discusses different methods to create tasks and handle their execution.

- [Async And Await In C#](/async-await-c/) - In this article, you’ll learn what are async and await keywords in C#, and how to use async-await feature along with Task for asynchronous programming. You will also learn about the application of this asynchronous principle across .Net Applications.
