--- 
layout: post
current: post
navigation: True
tags: [Csharp Multithreading]
class: post-template
subclass: 'post csharp-multithreading'
title: Race Condition C# 
description: This article explains what is Race Condition and Shared Resources in a multithreaded program and how much it is critical to synchronize a multithreaded program having shared resources. Thread Synchronization is a mechanism which ensures that two or more concurrent process or threads do not execute some particular section of program especially critical section at the same time. 
cover: "assets/images/race-condition-csharp.jpg"
course: multithreadingcsharp
comments: true
aside: multithreading_tutorial_aside.html
author: shadman_kudchikar
redirect_from:
  - /thread-synchronization-in-csharp/thread-synchronization-and-race-condition/
---

 A race condition occurs when two or more threads are able to access shared data and they try to change it at the same time. To fully understand a race condition we will first talk about shared resources and than discuss about what is a race condition in threading.

## Contents

* [Shared Resources ](#shared-resources)
* [What Is Race Condition?](#what-is-race-condition)

## Shared Resources

Not all resources are meant to be used concurrently. Resources like integers and collection must be handled carefully when accessed through multiple threads, resources that are accessed and updated within multiple threads are known as Shared Resources. Let's see an example,

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace _01_Shared_Resources
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
                    //increment sum value
                    sum++;
                }
            });

            //create thread t2 using anonymous method
            Thread t2 = new Thread(() => {
                for (int i = 0; i < 10000000; i++)
                {
                    //increment sum value
                    sum++;
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
```

However,

There is really some problem with the code above because every time we run it we see different output.

To truly understand the problem we must first understand what is a Race condition.

## What Is Race Condition? {#what-is-race-condition}

Race Condition is a scenario where the outcome of the program is affected because of timing.

A race condition occurs when two or more threads can access shared data and they try to change it at the same time. Because the thread scheduling algorithm can swap between threads at any time, you don't know the order in which the threads will attempt to access the shared data. Therefore, the result of the change in data is dependent on the thread scheduling algorithm, i.e. both threads are "racing" to access/change the data.

In our case, the line which is causing race condition is sum++, though this line seems to single line code and must not affect with concurrency but this single line of code gets transformed into multiline processor level instructions by JIT at the time of execution, below is the example

```txt
mov eax, dword ptr [sum]
inc eax
mov dword ptr [sum], eax
```

So what happens when our multiple threads execute this part of the code.

Let's assume there is this thread X and thread Y.

Suppose thread X reads the value of some variable and store in register X.eax for increment but after doing increment from value 0 to 1, X thread got suspended by Thread scheduler and Y thread start executing this part of the code where Y thread also reads the value of variable sum in register Y.eax and does the increment from value 0 to 1 and now after doing this increment both thread will update sum variable to 1 thus its value will be 1 even though both the threads incremented the value.

So in simple words, it's just the race between threads X and Y to read and update the value of variable sum and thus cause the race condition.

But we can overcome this kind of problems using some of the thread synchronization techniques that are,

*   Atomic Update
*   Data Partitioning
*   Wait-Based Technique

In the next post [C# Thread Synchronization](/thread-synchronization-in-csharp/thread-synchronization-techniques/), we will learn more about these thread synchronization techniques .
