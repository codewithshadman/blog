--- 
layout: post
current: post
navigation: True
tags: [Csharp Multithreading]
class: post-template
subclass: 'post csharp-multithreading'
title: C# Thread Synchronization 
description: This article explains techniques to tackle the thread synchronization problems and race condition. Thread synchronization refers to the act of shielding against multithreading issues such as data races, deadlocks and starvation.
cover: "assets/images/thread-synchronization-techniques.jpg"
course: multithreadingcsharp
comments: true
aside: multithreading_tutorial_aside.html
redirect_from: "/thread-synchronization-in-csharp/wait-based-synchronization-in-multithreading/"
author: shadman_kudchikar
redirect_from:
  - /thread-synchronization-in-csharp/thread-synchronization-techniques/
  - /thread-synchronization-in-csharp/wait-based-synchronization-in-multithreading/
---

Thread synchronization refers to the act of shielding against multithreading issues such as data races, deadlocks and starvation. 

This article explains techniques to tackle the thread synchronization problems and race condition. 

## Contents

Below are the techniques to tackle the thread synchronization problems and race condition. Let's see them all,

* [C# Interlocked](#csharp-interlocked)
* [Data Partitioning](#data-partitioning)
* [Wait Based Synchronization](#wait-based-synchronization)
* [Wait Based Primitives in CLR](#wait-based-primitives-in-clr)
    - [C# Monitor Class](#csharp-monitor-class)
    - [C# Mutex Class](#csharp-mutex-class)
    - [C# ReaderWriterLock Class](#csharp-readerwriterlock-class)

## C\# Interlocked {#csharp-interlocked}

So as we saw in [previous chapter](/thread-synchronization-in-csharp/thread-synchronization-and-race-condition/) processor increments the variable, written in a single line of C# code in three steps (three line of code) in processor-specific language, that is read, increment and update the variable

One way to tackle this problem is to carry out all this three operation in one single atomic operation. This can be done only on data that is word-sized. Here, by atomic I mean uninterruptable and word-sized means value that can fit in a register for the update, which is a single integer in our case.

However,

Today's processors already provide lock feature to carry out an atomic update on word-sized data. However, we can't use this processor specific instruction directly in C# code but there is Interlocked Class in DotNet Framework that is a wrapper around this processor-level instruction that can be used to carry out atomic operations like increment and decrement on a word-sized data.

Let's see an updated version of the buggy code we saw in the previous chapter,

{% highlight csharp linenos %}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace _03_Atomic_Update
{
    class Program
    {
        private static int sum;

        static void Main(string[] args)
        {
            //create thread t1 using anonymous method
            Thread t1 = new Thread(() => {
                for (int i = 0; i < 10000000; i++)
                {
                    //use threading Interlocked class for atomic update
                    Interlocked.Increment(ref sum);
                }
            });

            //create thread t2 using anonymous method
            Thread t2 = new Thread(() => {
                for (int i = 0; i < 10000000; i++)
                {
                    //use threading Interlocked class for atomic update
                    Interlocked.Increment(ref sum);
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

## Data Partitioning {#data-partitioning}

Data Partitioning is actually kind of strategy where you decide to process data by partitioning it for multiples threads. Its kind of "you do that and I will do that" strategy.

To use data partitioning you must have some domain-specific knowledge of data (such as an array or multiple files manipulation), where you decide that one thread will process just one slice of data while other thread will work on another slice. Let's see an example,

{% highlight csharp linenos %}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace _04_Data_Partitioning
{
    /// <summary>
    /// This program calculate the sum of array elements using 
    /// data partition technique. Here we split the data into 
    /// two halves and calculate the sum1 and sum2 for each half 
    /// in thread t1 and t2 respectively, then finally we print 
    /// the final sum on screen by adding sum1 and sum2.
    /// </summary>
    class Program
    {
        private static int[] array;
        private static int sum1;
        private static int sum2;

        static void Main(string[] args)
        {
            //set length for the array size
            int length = 1000000;
            //create new array of size lenght
            array = new int[length];

            //initialize array element with value of their respective index
            for (int i = 0; i < length; i++)
            {
                array[i] = i;
            }

            //index to split on
            int dataSplitAt = length / 2;

            //create thread t1 using anonymous method
            Thread t1 = new Thread(() =>
            {
                //calculate sum1
                for (int i = 0; i < dataSplitAt; i++)
                {
                    sum1 = sum1 + array[i];
                }
            });


            //create thread t2 using anonymous method
            Thread t2 = new Thread(() =>
            {
                //calculate sum2
                for (int i = dataSplitAt; i < length; i++)
                {
                    sum2 = sum2 + array[i];
                }
            });


            //start thread t1 and t2
            t1.Start();
            t2.Start();

            //wait for thread t1 and t2 to finish their execution
            t1.Join();
            t2.Join();

            //calculate final sum
            int sum = sum1 + sum2;

            //write final sum on screen
            Console.WriteLine("Sum:" + sum);

            Console.WriteLine("Press enter to terminate!");
            Console.ReadLine();
        }
    }
}
{% endhighlight %}

However,

This technique can't be adapted for every scenario there may be a situation where one slice of data depends on the output of the previous slice of data one example of this scenario is Fibonacci series where, data[n]=data[n-1]+data[n-2] in such a situation data partitioning can't be adopted.

## Wait Based Synchronization {#wait-based-synchronization}

Now,

The third technique is a Wait-Based technique which is a very sophisticated way to handle the race condition, used in a situation where above two methods can't be adopted that easily. In this technique, a thread is blocked until someone decides its safe for them to proceed. 

Suppose there are two threads namely X and Y and both want to access some resource R

Now to protect this resource we choose some lock primitive or synchronization primitive as LR (primitive here is some primitive type like int or array)

Now when thread X want to access resource R it will first acquire the lock ownership of LR, once this thread got ownership of LR it can access the resource R safely. As long as thread X has this ownership no other thread can access the LR ownership

While X has ownership if Y request to acquire the ownership of lock LR it requests will get block until thread X releases its ownership.

## Wait Based Primitives in CLR {#wait-based-primitives-in-clr}

.Net has following Wait Based Primitives that you can use to apply Wait-Based technique.

They all share the same basic usage

*   Access the lock ownership
*   Manipulate the protected resource
*   Release the lock ownership

### C# Monitor Class {#csharp-monitor-class}

The Monitor class allows you to synchronize access to a region of code by taking and releasing a lock on a particular object by calling the Monitor.Enter, Monitor.TryEnter, and Monitor.Exit methods. Object locks provide the ability to restrict access to a block of code, commonly called a critical section. While a thread owns the lock for an object, no other thread can acquire that lock. You can also use the Monitor class to ensure that no other thread is allowed to access a section of application code being executed by the lock owner unless the other thread is executing the code using a different locked object.

### C# Mutex Class {#csharp-mutex-class}

You can use a Mutex object to provide exclusive access to a resource. The Mutex class uses more system resources than the Monitor class, but it can be marshaled across application domain boundaries, it can be used with multiple waits, and it can be used to synchronize threads in different processes. For a comparison of managed synchronization mechanisms, see Overview of Synchronization Primitives.

### C# ReaderWriterLock Class {#csharp-readerwriterlock-class}

The ReaderWriterLockSlim class addresses the case where a thread that changes data, the writer, must have exclusive access to a resource. When the writer is not active, any number of readers can access the resource. When a thread requests exclusive access, subsequent reader requests block until all existing readers have exited the lock, and the writer has entered and exited the lock.

For a comparison of managed synchronization mechanisms, see [Overview of Synchronization Primitives.](https://docs.microsoft.com/en-us/dotnet/standard/threading/overview-of-synchronization-primitives)

In the next post [C# Monitor](/csharp-monitor/), we will learn how to use `Monitor` class along with C# `lock` keyword .
