--- 
layout: post
current: post
navigation: True
tags: [Csharp Multithreading]
class: post-template
subclass: 'post csharp-multithreading'
title: Task Parallelism C#
description: In this article we will be discussing different methods to achieve parallelism using Tasks in C#.
cover: "assets/images/task-parallelism-c.jpg"
course: multithreadingcsharp
comments: true
aside: multithreading_tutorial_aside.html
author: shadman_kudchikar
redirect_from:
  - /tasks-in-csharp/task-parallelism-c/
---

Task parallelism is the process of running tasks in parallel. Task parallelism divides tasks and allocates those tasks to separate threads for processing. It is based on unstructured parallelism. It means the parallel work unit may start and finish in places scattered according to the execution of the program.
 
In this article, we will be discussing different methods to achieve parallelism using Tasks in C#.

> **Note:** If you are not familiar with Tasks in C#, you can learn more about it in my blog post [C# Task](/csharp-task/).

## Content
- [Attaching Child Tasks To A Parent Task](#attaching-child-tasks-to-a-parent-task)
- [C# TaskFactory](#c-taskfactory)
- [C# Task.WaitAll](#c-task-waitall)
- [C# Task.WaitAny](#c-task-waitany)
- [C# Parallel Class](#c-parallel-class)
- [C# Parallel.For and Parallel.Foreach](#c-parallel-for-and-parallel-foreach)
- [C# Parallel.Break](#c-parallel-break)

## Attaching Child Tasks To A Parent Task {#attaching-child-tasks-to-a-parent-task}

A Task can have several child Tasks. The parent Task finishes when all the child tasks are ready. Below code shows how this works.

{% highlight csharp linenos %}

using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void Main(string[] args)
    {
        Task<int[]> parent = new Task<int[]>(() =>
        {
            var results = new int[3];
            new Task(() => {
                Thread.Sleep(15000);
                results[0] = 0;
            },
            TaskCreationOptions.AttachedToParent).Start();
            new Task(() => results[1] = 1,
            TaskCreationOptions.AttachedToParent).Start();
            new Task(() => results[2] = 2,
            TaskCreationOptions.AttachedToParent).Start();
            return results;
        });
        parent.Start();
        var finalTask = parent.ContinueWith(
        parentTask => {
            foreach (int i in parentTask.Result)
                Console.WriteLine(i);
        });
        finalTask.Wait();
        Console.ReadLine();
    }
}
{% endhighlight %}

The finalTask runs only after the parent Task is finished, and the parent Task finishes when all three children are finished. You can use this to create quite complex Task hierarchies that will go through all the steps you specified.

> **Note:** Task.Run explicitly forbids having child tasks. Task.Run is the equivalent of Task.Factory.StartNew with the default scheduler and most importantly, TaskCreationOptions.DenyChildAttach. So any child task that attempts to execute as an attached child task (that is, it is created with the AttachedToParent option) will not be able to attach to the parent task and will execute instead as a detached child task.

## C# TaskFactory {#c-taskfactory}

In the previous example, you had to create three Tasks all with the same options. To make the process easier, you can use a TaskFactory. A TaskFactory is created with a certain configuration and can then be used to create Tasks with that configuration. Below code shows how you can simplify the previous example with a factory.

{% highlight csharp linenos %}

using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void Main(string[] args)
    {
        Task<int[]> parent = new Task<int[]>(() =>
        {
            var results = new int[3];
            TaskFactory tf = new TaskFactory(TaskCreationOptions.AttachedToParent,
            TaskContinuationOptions.ExecuteSynchronously);
            tf.StartNew(() => {
                Thread.Sleep(15000);
                results[0] = 0;
            });
            tf.StartNew(() => results[1] = 1);
            tf.StartNew(() => results[2] = 2);
            return results;
        });
        parent.Start();
        var finalTask = parent.ContinueWith(
        parentTask => {
            foreach (int i in parentTask.Result)
                Console.WriteLine(i);
        });
        finalTask.Wait();
        Console.ReadLine();
    }
}
{% endhighlight %}

## C# Task.WaitAll {#c-task-waitall}

You can also use the method WaitAll to wait for multiple Tasks to finish before continuing execution. These are similar to Task.Wait, except they wait for multiple tasks to all complete. 

Below code shows how to use this.

{% highlight csharp linenos %}

using System;
using System.Threading;
using System.Threading.Tasks;

namespace Program_7
{
    class Program
    {
        static void Main(string[] args)
        {
            Task[] tasks = new Task[3];
            tasks[0] = Task.Run(() => {
                Thread.Sleep(1000);
                Console.WriteLine("1");
                return 1;
            });
            tasks[1] = Task.Run(() => {
                Thread.Sleep(1000);
                Console.WriteLine("2");
                return 2;
            });
            tasks[2] = Task.Run(() => {
                Thread.Sleep(1000);
                Console.WriteLine("3");
                return 3;
            }
            );
            Task.WaitAll(tasks);
            Console.ReadLine();
        }
    }
}
{% endhighlight %}

In this case, all three Tasks are executed simultaneously, and the whole run takes approximately 1000ms instead of 3000. Next to WaitAll, you also have a WhenAll method that you can use to schedule a continuation method after all Tasks have finished.

Task.WaitAll should be very rarely used. It is occasionally useful when working with Delegate Tasks, but even this usage is rare. Developers writing parallel code should first attempt [data parallelism](/thread-synchronization-in-csharp/thread-synchronization-techniques/#data-partitioning); and even if task parallism is necessary, then [parent/child tasks](#attaching-child-tasks-to-a-parent-task) may result in cleaner code than Task.WaitAll method.

## C# Task.WaitAny {#c-task-waitany}

You can also use the WaitAny method to wait until one of the tasks is finished. 

We can use Task.WaitAny when we have a collection of tasks, but we only interested in the first finished task. It can happen for example when we have a couple of async API that all of them do the same thing. But we want to receive the result from the one that returns the result first.

Also, you can create a WaitAllOneByOne pattern using the WaitAny method. It is useful when we would like to wait till all tasks finish, but process results as each one complete.

Below code shows how this works.

{% highlight csharp linenos %}

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
namespace Chapter1
{
    public static class Program
    {
        public static void Main()
        {
            Task<int>[] tasks = new Task<int>[3];
            tasks[0] = Task.Run(() => { Thread.Sleep(2000); return 1; });
            tasks[1] = Task.Run(() => { Thread.Sleep(1000); return 2; });
            tasks[2] = Task.Run(() => { Thread.Sleep(3000); return 3; });
            while (tasks.Length > 0)
            {
                int i = Task.WaitAny(tasks);
                Task<int> completedTask = tasks[i];
                Console.WriteLine(completedTask.Result);
                var temp = tasks.ToList();
                temp.RemoveAt(i);
                tasks = temp.ToArray();
            }
            Console.ReadLine();
        }
    }
}
{% endhighlight %}

In this example, you process a completed Task as soon as it finishes. By keeping track of which Tasks are finished, you don't have to wait until all Tasks have completed.

## C# Parallel Class {#c-parallel-class}

The System.Threading.Tasks namespace also contains another class that can be used for parallel processing. The Parallel class has a couple of static methods—For, ForEach, and Invoke—that you can use to parallelize work.

Parallelism involves taking a certain task and splitting it into a set of related tasks that can be executed concurrently. This also means that you shouldn't go through your code to replace all your loops with parallel loops. You should use the Parallel class only when your code doesn't have to be executed sequentially.

Increasing performance with parallel processing happens only when you have a lot of work to be done that can be executed in parallel. For smaller work sets or for work that has to synchronize access to resources, using the Parallel class can hurt performance.

The best way to know whether it will work in your situation is to measure the results.

Below code shows an example of using Parallel.For and Parallel.ForEach.

## C# Parallel.For and Parallel.Foreach {#c-parallel-for-and-parallel-foreach}

{% highlight csharp linenos %}

using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Example9
{
    class Program
    {
        static void Main(string[] args)
        {
            Parallel.For(0, 10, i =>
            {
                Thread.Sleep(1000);
            });
            var numbers = Enumerable.Range(0, 10);
            Parallel.ForEach(numbers, i =>
            {
                Thread.Sleep(1000);
            });
            Console.ReadLine();
        }
    }
}
{% endhighlight %}


You can cancel the loop by using the ParallelLoopState object. You have two options to do this: Break or Stop. Break ensures that all iterations that are currently running will be finished. Stop just terminates everything. Here is an example:

## C# Parallel.Break {#c-parallel-break}

{% highlight csharp linenos %}

using System;
using System.Threading.Tasks;

namespace Example10
{
    class Program
    {
        static void Main(string[] args)
        {
            ParallelLoopResult result = Parallel.
            For(0, 1000, (int i, ParallelLoopState loopState) =>
            {
                if (i == 500)
                {
                    Console.WriteLine("Breaking loop");
                    loopState.Break();
                }
                return;
            });
            Console.ReadLine();
        }
    }
}
{% endhighlight %}

When breaking the parallel loop, the result variable has an IsCompleted value of false and a LowestBreakIteration of 500. When you use the Stop method, the LowestBreakIteration is null.
