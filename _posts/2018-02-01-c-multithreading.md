---
layout: post
current: post
navigation: True
tags: [Csharp Multithreading]
class: post-template
subclass: 'post csharp-multithreading'
title: "C# Multithreading"
description: "Multithreading in C# is a process in which multiple threads work simultaneously. It is a process to achieve multitasking. It saves time because multiple tasks are being executed at a time."
cover: "assets/images/csharp_threading.jpg"
course: multithreadingcsharp
comments: true
aside: multithreading_tutorial_aside.html
redirect_from: "/c-threading-tutorial/"
author: shadman_kudchikar
redirect_from:
  - /thread-synchronization-in-csharp/
  - /thread-synchronization-in-csharp/
  - /tasks-in-csharp/
  - /c-threading-tutorial/
---

Multithreading in C# is a process in which multiple threads work simultaneously. It is a process to achieve multitasking. It saves time because multiple tasks are being executed at a time. To create multithreaded application in C#, we need to use `System.Threading` namespace.

The `System.Threading` namespace contains classes and interfaces to provide the facility of multithreaded programming. It also provides classes to synchronize the thread resource.

In the series of articles on [C# Multithreading](/tag/csharp-multithreading/), you will learn how to take advantage of Thread Class provided by C# in `System.Threading` namespace to create robust applications that are responsive and parallel.

Further, we will discuss the issue in terms of program correctness in a multithreaded program. And then we'll take a look at some of the Thread synchronization techniques that are available to you as a .NET programmer.

Finally, we're going to look at Task-based approach provided by C# for async and parallel programming.


## C# Multithreading Articles

- [C# Thread](/csharp-thread/) - This article is a complete introduction to threading. It explains what is a thread and why it is used in programming. Threading enables your C# program to perform concurrent processing so that you can do more than one operation at a time.

- [C# Threadpool](/thread-pool-in-csharp/) - This article explains how to use C# Threadpool. A thread pool is a collection of threads that can be used to perform several tasks in the background. This leaves the primary thread free to perform other tasks asynchronously.

- [Race Condition C#](/thread-synchronization-and-race-condition/) - This article explains what is Race Condition and Shared Resources in a multithreaded program and how much it is critical to synchronize a multithreaded program having shared resources.

- [C# Thread Synchronization](/thread-synchronization-techniques/) - This article explains techniques to tackle the thread synchronization problems and race condition. Thread synchronization refers to the act of shielding against multithreading issues such as data races, deadlocks and starvation.

- [C# Monitor](/csharp-monitor/) - This article explains how to use Monitor Class in C#. Monitor and lock is the way to provide thread safety in a multithreaded application in C#. Monitor class is one of the wait based synchronization primitive that provides gated access to the shared resource.

- [C# Task](/csharp-task/) - This article serves to be a quick guide for using Tasks in C#. It discusses different methods to create tasks and handle their execution.

- [Async Await C#](/async-await-c/) - In this article, you'll learn what are async and await keywords in C#, and how to use async-await feature along with Task for asynchronous programming.

- [Task Parallelism C#](/task-parallelism-c/) - In this article we will be discussing different methods to achieve parallelism using Tasks in C#.

## What You Will Learn

* How to model threads using C# thread class.
* Control thread lifetime and coordinate thread shutdown.
* Using thread pool to queue your work item.
* What is thread synchronization and a race condition.
* Thread synchronization techniques.
* What is wait based synchronization in multithreading.
* How to use Monitor class in C#.
* What is task?
* Task exectuion model.
* Harvesting result from task.
* Task handling techniques.

## Requirements

* You will need Visual Studio IDE (for programming in C# .NET) to get started with this tutorial.
* All demos in this tutorial are built using Visual Studio and complete solution demo is available here:
	- [Solution 1](https://github.com/kudchikarsk/multithreading-in-csharp-demo)
	- [Solution 2](https://github.com/kudchikarsk/thread-synchronization-in-csharp)
	- [Solution 3](https://github.com/kudchikarsk/tasks-in-csharp)
	- [Solution 4](https://github.com/kudchikarsk/csharp-task)

## Issues

* You can use the Comments section at the bottom of each module to ask a question or report a problem.



[Instagram]: https://www.instagram.com/kudchikarsk
[LinkedIn]: https://linkedin.com/in/kudchikarsk