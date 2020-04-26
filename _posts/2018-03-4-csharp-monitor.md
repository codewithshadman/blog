--- 
layout: post
current: post
navigation: True
tags: [Csharp Multithreading]
class: post-template
subclass: 'post csharp-multithreading'
title: C# Monitor
description: This article explains how to use Monitor Class in C#. Monitor and lock is the way to provide thread safety in a multithreaded application in C#. Monitor class is one of the wait based synchronization primitive that provides gated access to the shared resource.
cover: "assets/images/csharp-monitor.jpg"
course: multithreadingcsharp
comments: true
aside: multithreading_tutorial_aside.html
author: shadman_kudchikar
redirect_from:
  - /thread-synchronization-in-csharp/csharp-monitor/
--- 

## Contents

* [What is Monitor In C#?](#what-is-monitor-in-csharp)
* [Monitor Class Usage In C#](#monitor-class-usage-in-csharp)
* [Exception Aware Monitor Usage](#exception-aware-monitor-usage)
* [C# Lock Keyword](#csharp-lock-keyword)

## What is Monitor In C\#? {#what-is-monitor-in-csharp}

Monitor class is one of the [wait based synchronization primitive](/thread-synchronization-in-csharp/wait-based-synchronization-in-multithreading/) that provides gated access to the resource. It gates or throttles the access to the shared resource.

So,

Monitor assure that thread access the shared resource one thread at a time

Here is the code to use Monitor for shared resources to avoid the race condition

{% highlight csharp linenos %}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace _05_Monitor_Class_Usage
{
    class Program
    {
        private static int sum;
        private static object _lock = new object();

        static void Main(string[] args)
        {

            //create thread t1 using anonymous method
            Thread t1 = new Thread(() => {
                for (int i = 0; i < 10000000; i++)
                {
                    //acquire lock ownership
                    Monitor.Enter(_lock);

                    //increment sum value
                    sum++;

                    //release lock ownership
                    Monitor.Exit(_lock);
                }
            });

            //create thread t2 using anonymous method
            Thread t2 = new Thread(() => {
                for (int i = 0; i < 10000000; i++)
                {
                    //acquire lock ownership
                    Monitor.Enter(_lock);

                    //increment sum value
                    sum++;

                    //release lock ownership
                    Monitor.Exit(_lock);
                }
            });


            //start thread t1 and t2
            t1.Start();
            t2.Start();

            //wait for thread t1 and t2 to finish their execution
            t1.Join();
            t2.Join();

            //write final sum on screen
            Console.WriteLine("sum: " + sum);

            Console.WriteLine("Press enter to terminate!");
            Console.ReadLine();
        }
    }
}
{% endhighlight %}

Here, `sum++` is considered as the critical section, as this operation should be done in a thread-safe manner we use the monitor to carry out this operation as one thread at a time.

As you saw Monitor use Enter and Exit method which accepts an object to associate with lock primitive

Why?

locks are created by CLR only when you use monitor API to get acquisition of a lock (for performance reasons), so basically they are maintained as a table of the lock by CLR.

So,

When you pass this object in monitor method this object stores the index of the lock object created by CLR in their header as information to use this lock for gated access to the resource.

In short, this object is not the actual lock but stores reference to the lock object use by monitor class to access the resource in wait based manner.

Basically, you can use any type of object to associate with a lock. However, the recommended method is to use private objects and always avoid string as lock objects as the issue they cause due to their implementation method in CLR

## Monitor Class Usage In C\# {#monitor-class-usage-in-csharp}

- So Monitor has the same wait based technique usage. When you call the `Monitor.Enter` method you get the ownership of the lock, then you perform your thread-safe operation and then release the lock using `Monitor.Exit`.

- Always remember this is the programmer understanding to use wait based technique thoughtfully at the required places as there are no physical restrictions on how you access the resource or implement the model. It's just you deciding how to implement the flow of multithreading program and shared resources.

## Exception Aware Monitor Usage {#exception-aware-monitor-usage}

Now,

Consider the same example code above and there are two threads trying to acquire the lock X and Y now thread X got the ownership and Y got blocked until X releases the ownership.

However,

Before releasing the lock thread X threw some runtime exception error hence it will exit the code before releasing the lock, as a result, thread Y will get blocked forever.

We want to throw the exception but also want to release the lock.

So,

To overcome this problem we have to use proper try-finally construct to manage the exception (not handle it). Let's see the code how to do it,

{% highlight csharp linenos %}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace _06_Exception_Aware_Monitor
{
    class Program
    {
        private static int sum;
        private static object _lock = new object();

        static void Main(string[] args)
        {

            //create thread t1 using anonymous method
            Thread t1 = new Thread(() => {
                for (int i = 0; i < 10000000; i++)
                {
                    //acquire lock ownership
                    Monitor.Enter(_lock);
                    try
                    {
                        //increment sum value
                        sum++;
                    }
                    finally
                    {
                        //release lock ownership
                        Monitor.Exit(_lock);
                    }                    
                }
            });

            //create thread t2 using anonymous method
            Thread t2 = new Thread(() => {
                for (int i = 0; i < 10000000; i++)
                {
                    //acquire lock ownership
                    Monitor.Enter(_lock);
                    try
                    {
                        //increment sum value
                        sum++;
                    }
                    finally
                    {
                        //release lock ownership
                        Monitor.Exit(_lock);
                    }
                }
            });


            //start thread t1 and t2
            t1.Start();
            t2.Start();

            //wait for thread t1 and t2 to finish their execution
            t1.Join();
            t2.Join();

            //write final sum on screen
            Console.WriteLine("sum: " + sum);

            Console.WriteLine("Press enter to terminate!");
            Console.ReadLine();
        }
    }
}
{% endhighlight %}

## C\# Lock Keyword {#csharp-lock-keyword}

Some high level languages have syntactic sugar which reduces the amount of code that must be written in some common situation like above.

C# has this lock syntax for the same code we wrote above. Here is the code

{% highlight csharp linenos %}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace _07_Lock_Keyword
{
    class Program
    {
        private static int sum;
        private static object _lock = new object();

        static void Main(string[] args)
        {

            //create thread t1 using anonymous method
            Thread t1 = new Thread(() => {
                for (int i = 0; i < 10000000; i++)
                {
                    lock (_lock)
                    {
                        //increment sum value
                        sum++;
                    }
                }
            });

            //create thread t2 using anonymous method
            Thread t2 = new Thread(() => {
                for (int i = 0; i < 10000000; i++)
                {
                    lock(_lock)
                    {
                        //increment sum value
                        sum++;
                    }
                }
            });


            //start thread t1 and t2
            t1.Start();
            t2.Start();

            //wait for thread t1 and t2 to finish their execution
            t1.Join();
            t2.Join();

            //write final sum on screen
            Console.WriteLine("sum: " + sum);

            Console.WriteLine("Press enter to terminate!");
            Console.ReadLine();
        }
    }
}
{% endhighlight %}

so we simply use the lock keyword syntax and write critical section code in its body and compiler will generate the Exception Aware Monitor code for us. Sweet!

In the next post [C# Task](/tasks-in-csharp/csharp-task/), we will learn more about Tasks in C#. Tasks provide a sophisticated way to handle async or parallel operation. Task object typically executes asynchronously on a thread pool thread.
