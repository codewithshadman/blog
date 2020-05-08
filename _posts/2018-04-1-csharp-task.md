--- 
layout: post
current: post
navigation: True
tags: [Csharp Multithreading]
class: post-template
subclass: 'post csharp-multithreading'
title: C# Task
description: This article serves to be a quick guide for using Tasks in C#. It discusses different methods to create tasks and handle their execution.
cover: "assets/images/csharp-task.jpg"
course: multithreadingcsharp
comments: true
aside: multithreading_tutorial_aside.html
redirect_from: "/tasks-in-csharp/getting-started-with-csharp-task/"
author: shadman_kudchikar
redirect_from:
  - /tasks-in-csharp/csharp-task/
  - /tasks-in-csharp/getting-started-with-csharp-task/
  - /tasks-in-csharp/introduction-to-parallel-programming-using-csharp-tasks/
  - /tasks-in-csharp/programming-for-responsiveness/
---

C# Task is one of the central elements of the task-based asynchronous pattern first introduced in the .NET Framework 4.

C# Task object typically executes asynchronously on a thread pool thread rather than synchronously on the main application thread.

Although, we can directly offload the work to [thread pool](/thread-pool-in-csharp/) using the queue user work item method. However, this method has its weaknesses as we can't tell whether the operation has finished or what a return value is.

This is where a C# Task can be helpful. The C# Task can tell you if the work is completed and if the operation returns a result. A Task is an object that represents some work that should be done.

C# Tasks provide a sophisticated way to handle async or parallel operation by providing various options like,

- Ability to cancel an ongoing operation
- Return resulting value from operation (like a method functions)
- Easy Exception Handling
- High-Level constructs like a parallel loop
- task continuation

We will understand this concept better once we dive deep and look at some examples. Let's get started.

## Content
- [Using C\# Tasks](#using-c-tasks)
    - [C\# Task Example](#csharp-task-example)
    - [Execution Model Of A Task](#execution-model-of-a-task)
- [C# Task That Returns A Value](#c-task-that-returns-a-value)
- [How To Avoid Blocking Of Current Thread? How To Be Responsive?](#how-to-avoid-blocking-of-current-thread-how-to-be-responsive)
- [Adding A Continuation](#adding-a-continuation)
- [Scheduling Different Continuation Tasks](#scheduling-different-continuation-tasks)
- [Demo Of A Non-Responsive Application](#demo-of-a-non-responsive-application)
- [Adding Tasks For Responsiveness](#adding-tasks-for-responsiveness)
- [Further Reading](#further-reading)
- [C# Task FAQ](#c-task-faq)
    - [C# Task.run Return Value](#c-taskrun-return-value)
    - [C# Run Task In Background Without Await](#c-run-task-in-background-without-await)
    - [Task.run Async Lambda](#taskrun-async-lambda)
    - [Run Async Method Synchronously C\#](#run-async-method-synchronously-c)
    - [Task Does Not Contain A Definition For Run](#task-does-not-contain-a-definition-for-run)
    - [Does Task.run Create A New Thread](#does-taskrun-create-a-new-thread)

## Using C\# Tasks

To get started with Tasks in C# you have to create an object of Task Class, which is available in namespace `System.Threading.Tasks` and provide the code to be executed within the task as the task action parameter.

### C\# Task Example {#csharp-task-example}
Let's see an example,

{% highlight csharp linenos %}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace _01_Getting_Started_With_Task
{
    class Program
    {
        static void Main(string[] args)
        {
            //create task object and pass anonymous method 
            //to task constructor parameter as work to do 
            //within the task
            Task t = new Task(() =>
              {
                  for (int i = 0; i < 100; i++)
                  {
                      //print task t thread id
                      var threadId = Thread.CurrentThread.ManagedThreadId;
                      Console.WriteLine("Task Loop Current Thread Id:" + threadId);
                  }
              });

            //start task t execution
            t.Start();

            for (int i = 0; i < 100; i++)
            {
                //print main thread id
                var threadId = Thread.CurrentThread.ManagedThreadId;
                Console.WriteLine("Main Loop Current Thread Id " + threadId);
            }

            //wait for task t to complete its execution
            t.Wait();

            Console.WriteLine("Press enter terminate the process!");
            Console.ReadLine();
        }
    }
}
{% endhighlight %}

Let's see what's happening in the above program line by line.

Here, we are creating the Task `t` along with the code to execute within the task. However, Task `t` starts its execution after calling `t.Start()` method.

So,

After calling `t.Start()`, our program is split into two programs that are executing in the parallel codestream also known as a fork or split in the program.

So basically code in task and code below the task's start method, both are executing together. You can't see this but this is happening and you have to imagine this, that now your program is executing two parallel codestreams.

Also, you must have noticed that we passed an anonymous method to the Task constructor parameter, as a code to be executed within the task. This we can do because Task Class constructor takes `Action` as a parameter which is nothing but a [delegate](/delegates-and-events-in-csharp/) with the void return type.

### Execution Model Of A Task {#execution-model-of-a-task}

Let's discuss the basic execution model of a task,

In the example above, we created a task and provide a basic operation to be performed by the task.

A task scheduler is responsible for starting the Task and managing it. By default, the Task scheduler uses threads from the thread pool to execute the Task.

Tasks can be used to make your application more responsive. If the thread that manages the user interface offloads work to another thread from the thread pool, it can keep processing user events and ensure that the application can still be used. 

But it doesn’t help with scalability. If a thread receives a web request and it would start a new Task, it would just consume another thread from the thread pool while the original thread waits for results.

Executing a Task on another thread makes sense only if you want to keep the user interface thread free for other work or if you want to parallelize your work on to multiple processors.

Also, In the above example, you may have seen the below code,

{% highlight csharp linenos %}

//wait for task t to complete its execution
t.Wait();
{% endhighlight %}

Calling `Wait` method of the task is equivalent to calling the `Join` method on a [thread](/multithreading-in-csharp/getting-started-with-thread-class-in-csharp/#csharp-start-new-thread). When the `Wait` method is called within the `Main` method the main thread pauses its execution until the task `t` completes its execution.

## C# Task That Returns A Value {#c-task-that-returns-a-value}

The .NET Framework also has the generic version of task class `Task<T>` that you can use if a Task should return a value. Here `T` is the data type you want to return as a result. The below code shows how this works.

{% highlight csharp linenos %}

using System;
using System.Threading.Tasks;

namespace Example2
{
    class Program
    {
        static void Main(string[] args)
        {
            Task<int> t = Task.Run(() =>
            {
                return 32;
            });
            Console.WriteLine(t.Result); // Displays 32

            Console.WriteLine();
            Console.WriteLine("Press Enter to terminate!");
            Console.ReadLine();
        }
    }
}
{% endhighlight %}

Attempting to read the `Result` property on a Task will force the thread that's trying to read the result to wait until the task is finished, which is equivalent to calling `Join` method on a thread and calling `Wait` method in the task as mentioned before.

As long as the Task has not finished, it is impossible to give the result. If the task is not finished, this call will block the current thread.

## How To Avoid Blocking Of Current Thread? How To Be Responsive?

As I mentioned at the start of this chapter,

> Tasks can be used to make your application more responsive.

But, until now the only thing I told you is this,

> Calling `Wait` method of the task is equivalent to calling the `Join` method on a thread. When the `Wait` method is called within the `Main` method the main thread pauses its execution until the task `t` completes its execution.

and this,

> Attempting to read the `Result` property on a Task will force the thread that's trying to read the result to wait until the task is finished.

Then how in the world task can help be responsive? Your question is right and below is the answer that you are looking for.

## Adding A Continuation {#adding-a-continuation}

Another great feature that task supports is the continuation. This means that you can execute another task as soon as the first task finishes. Thus, you can avoid the block that we discussed before. This method is similar to calling the callback method when a certain operation is finished.

Below is an example of creating such a continuation.

{% highlight csharp linenos %}

using System;
using System.Threading.Tasks;

namespace Example3
{
    class Program
    {
        static void Main(string[] args)
        {
            Task<int> t = Task.Run(() =>
            {
                return 32;
            }).ContinueWith((i) =>
            {
                return i.Result * 2;
            });

            t.ContinueWith((i) =>
            {
                 Console.WriteLine(i.Result);
            });

            Console.WriteLine("Press Enter to terminate!");
            Console.ReadLine();
        }
    }
}
{% endhighlight %}

## Scheduling Different Continuation Tasks {#scheduling-different-continuation-tasks}

The ContinueWith method has a couple of overloads that you can use to configure when the continuation will run. This way you can add different continuation methods that will run when an exception happens, the Task is canceled, or the Task completes successfully. The below code shows how to do this.

{% highlight csharp linenos %}

using System;
using System.Threading.Tasks;

namespace Example_4
{
    class Program
    {
        static void Main(string[] args)
        {
            Task<int> t = Task.Run(() =>
            {
                return 32;
            });
            t.ContinueWith((i) =>
            {
                Console.WriteLine("Canceled");
            }, TaskContinuationOptions.OnlyOnCanceled);
            t.ContinueWith((i) =>
            {
                Console.WriteLine("Faulted");
            }, TaskContinuationOptions.OnlyOnFaulted);
            var completedTask = t.ContinueWith((i) =>
            {
                Console.WriteLine(i.Result);
                Console.WriteLine("Completed");
            }, TaskContinuationOptions.OnlyOnRanToCompletion);
            
            Console.WriteLine("Press Enter to terminate!");
            Console.ReadLine();
        }
    }
}
{% endhighlight %}

Using task with continuation is a great way to create a responsive application that doesn't block the main thread. In desktop applications like Windows Forms and WPF, we can use this feature of the task to create a very responsive application that doesn't block the UI thread.

## Demo Of A Non-Responsive Application {#demo-of-a-non-responsive-application}

To give a demo of a non-responsive application I created a simple Windows Forms application which you can download from [here][project-files]. In this application we simply calculate the nth term of the Fibonacci series. In the application when we put some higher value (ex: "900000000") for calculating nth term we see that application UI get lock up until the calculation is going on and after a while when execution is complete we see the result along with the time required by the program to get the result.

Here is the code of the application,

{% highlight csharp linenos %}

using System;
using System.Diagnostics;
using System.Windows.Forms;

namespace _02_Program_For_Responsiveness
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Calculate_Click(object sender, EventArgs e)
        {           
            var stopWatch = new Stopwatch();
            stopWatch.Start();
            textBox2.Text = Fibo(textBox1.Text).ToString();
            stopWatch.Stop();
            label2.Text = (stopWatch.ElapsedMilliseconds / 1000).ToString();
        }

        private ulong Fibo(string nthValue)
        {        
            try
            {
                ulong x = 0, y = 1, z = 0, nth, i;
                nth = Convert.ToUInt64(nthValue);
                for (i = 1; i <= nth; i++)
                {
                    z = x + y;
                    x = y;
                    y = z;
                }

                return z;
            }
            catch { }

            return 0;
        }
    }
}
{% endhighlight %}

## Adding Tasks For Responsiveness {#adding-tasks-for-responsiveness}

Let's add a task in our `Calculate_Click` method to make it responsive,

{% highlight csharp linenos %}

 private void Calculate_Click(object sender, EventArgs e)
        {
            var task=new Task(() =>
            {
                var stopWatch = new Stopwatch();
                stopWatch.Start();
                textBox2.Text = Fibo(textBox1.Text).ToString();
                stopWatch.Stop();
                label2.Text = (stopWatch.ElapsedMilliseconds / 1000).ToString();
            });

            task.Start();
        }
{% endhighlight %}

When you run this version of the application you will find that it's not updating values; Also if you look into the debug window of visual studio you will notice that there is InvalidOperationExecption raised each time you hit the calculate button.

Why?

WPF and most Windows UI frameworks have something called "[Thread affinity][thread-affinity]". This means you can't change UI stuff on any thread that isn't the main UI thread.

Let's try to solve this problem,

To solve this problem one thing we can do is we can specify the .NET to run this particular task in UI thread which is our current thread instead of running into a separate thread by using the task scheduler parameter in `task.Start()` method like this,

{% highlight csharp linenos %}

task.Start(TaskScheduler.FromCurrentSynchronizationContext());
{% endhighlight %}

Here is the complete `Calculate_Click` method example,

{% highlight csharp linenos %}

 private void Calculate_Click(object sender, EventArgs e)
        {
            var task=new Task(() =>
            {
                var stopWatch = new Stopwatch();
                stopWatch.Start();
                textBox2.Text = Fibo(textBox1.Text).ToString();
                stopWatch.Stop();
                label2.Text = (stopWatch.ElapsedMilliseconds / 1000).ToString();
            });

            task.Start(TaskScheduler.FromCurrentSynchronizationContext());
        }
{% endhighlight %}

However, when you run this version of the application you will find that the user interface is once again lock up. 

Again Why?

Because, we're running the task on the same UI thread, consuming the same UI thread's execution cycle until the task execution is done, which is essentially the entire time which locks up the user interface and thus we're back to where we started.

Correct solution:

The key solution to above problem is that we want to do the CPU intense work in one task which will run on worker thread by default and run the UI related work on another task, and the key is here that we want to run the second task only after when the first task is done with its execution. To achieve this functionality task provides the `ContinueWith` method which does the same thing here is the solution.

Also,

You have to use a `TaskScheduler` associated with the current UI SynchronizationContex as the second parameter in `task.ContinueWith` to run a new continuation task on the UI thread.

Let's see how the final code will look like,

{% highlight csharp linenos %}

private void Calculate_Click(object sender, EventArgs e)
        {
            Stopwatch stopWatch = new Stopwatch();
            string result="";

            var task=new Task(() =>
            {
                stopWatch.Start();
                result = Fibo(textBox1.Text).ToString();                
            });

            task.ContinueWith((previousTask) =>
            {
                textBox2.Text = result;
                stopWatch.Stop();
                label2.Text = (stopWatch.ElapsedMilliseconds / 1000).ToString();
                stopWatch.Reset();
            },
            TaskScheduler.FromCurrentSynchronizationContext()
            );

            task.Start();
        }
{% endhighlight %}
And that's how it's done!

However, there are still some other improvements that can be done in the above code which we will discuss in the next post.

In the next post [Async And Await In C#](/tasks-in-csharp/async-await-c/), you'll learn what are async and await keywords in C#, and how to use async-await feature along with Task for asynchronous programming.

## Further Reading

- [Async And Await In C#](/async-await-c/) - In this article, you’ll learn what are async and await keywords in C#, and how to use async-await feature along with Task for asynchronous programming. You will also learn about the application of this asynchronous principle across .Net Applications.

- [Task Parallelism C#](/task-parallelism-c/) - Task parallelism is the process of running tasks in parallel. Task parallelism divides tasks and allocates those tasks to separate threads for processing. In this article, we will be discussing different methods to achieve parallelism using Tasks in C#.

## C# Task FAQ

Following are some frequently asked questions within community related to C# tasks.

### C# Task.run Return Value

#### Question

I have the following code:

{% highlight csharp %}
public static async Task<string> Start(IProgress<ProcessTaskAsyncExProgress> progress)
{
    const int total = 10;
    for (var i = 0; i <= total; i++)
    {
        await Task.Run(() => RunLongTask(i.ToString(CultureInfo.InvariantCulture)));
        if (progress != null)
        {
            var args = new ProcessTaskAsyncExProgress
            {
                ProgressPercentage = (int)(i / (double)total * 100.0),
                Text = "processing " + i
            };
            progress.Report(args);
        }
    }
    return "Done";
}

private static string RunLongTask(string taskName)
{
    Task.Delay(300);
    return taskName + "Completed!";
}

{% endhighlight %}

How do I get back the string value of RunLongTask from this line: await Task.Run(() => RunLongTask(i.ToString(CultureInfo.InvariantCulture)));?

I've tried:

{% highlight csharp %}
var val = await Task.Run(() => RunLongTask(i.ToString(CultureInfo.InvariantCulture))).Result;
But I get an error saying "string is not awaitable".
{% endhighlight %}

#### Answer 1

Remove the Result from the end. When you await you will get the Result back from the await-able method.

```cs
var val = await Task.Run(() => RunLongTask(i.ToString(CultureInfo.InvariantCulture)));
```

#### Answer 2

This is not a direct answer to old question, but for others searching:

"Normally" you shouldn't do this, but sometimes you need to match a library API so you can use a wrapper function like below:

{% highlight csharp %}
private async Task<string> WrapSomeMethod(string someParam)
{
    //adding .ConfigureAwait(false) may NOT be what you want but google it.
    return await Task.Run(() => SomeObj.SomeMethodAsync(someParam)).ConfigureAwait(false);
}
{% endhighlight %}

And then call that instead with .Result like below:

`string blah = WrapSomeMethod(someParam).Result;`

### C# Run Task In Background Without Await

#### Question

I have an async method which returns no data:

{% highlight csharp %}
public async Task MyAsyncMethod()
{
    // do some stuff async, don't return any data
}
{% endhighlight %}

I'm calling this from another method which returns some data:

{% highlight csharp %}
public string GetStringData()
{
    MyAsyncMethod(); // this generates a warning and swallows exceptions
    return "hello world";
}
{% endhighlight %}

Calling MyAsyncMethod() without awaiting it causes a "Because this call is not awaited, the current method continues to run before the call is completed" warning in visual studio. On the page for that warning it states:

You should consider suppressing the warning only if you're sure that you don't want to wait for the asynchronous call to complete and that the called method won't raise any exceptions.

I'm sure I don't want to wait for the call to complete; I don't need to or have the time to. But the call might raise exceptions.

I've stumbled into this problem a few times and I'm sure it's a common problem which must have a common solution.

How do I safely call an async method without awaiting the result?

##### Update:
For people suggesting that I just await the result, this is code that is responding to a web request on our web service (ASP.NET Web API). Awaiting in a UI context keeps the UI thread free, but awaiting in a web request call will wait for the Task to finish before responding to the request, thereby increasing response times with no reason.

#### Answer 1

If you want to get the exception "asynchronously", you could do:

{% highlight csharp %}
  MyAsyncMethod().
    ContinueWith(t => Console.WriteLine(t.Exception),
        TaskContinuationOptions.OnlyOnFaulted);
{% endhighlight %}

This will allow you to deal with an exception on a thread other than the "main" thread. This means you don't have to "wait" for the call toMyAsyncMethod() from the thread that calls MyAsyncMethod; but, still allows you to do something with an exception--but only if an exception occurs.

Update:
technically, you could do something similar with await:

{% highlight csharp %}
try
{
    await MyAsyncMethod().ConfigureAwait(false);
}
catch (Exception ex)
{
    Trace.WriteLine(ex);
}
{% endhighlight %}

...which would be useful if you needed to specifically use try/catch (or using) but I find the ContinueWith to be a little more explicit because you have to know what ConfigureAwait(false) means.

#### Answer 2

You should first consider making GetStringData an async method and have it await the task returned from MyAsyncMethod.

If you're absolutely sure that you don't need to handle exceptions from MyAsyncMethod or know when it completes, then you can do this:

{% highlight csharp %}
public string GetStringData()
{
  var _ = MyAsyncMethod();
  return "hello world";
}
{% endhighlight %}

BTW, this is not a "common problem". It's very rare to want to execute some code and not care whether it completes and not care whether it completes successfully.

##### Update:

Since you're on ASP.NET and wanting to return early, you may find my blog post on the subject useful. However, ASP.NET was not designed for this, and there's no guarantee that your code will run after the response is returned. ASP.NET will do its best to let it run, but it can't guarantee it.

So, this is a fine solution for something simple like tossing an event into a log where it doesn't really matter if you lose a few here and there. It's not a good solution for any kind of business-critical operations. In those situations, you must adopt a more complex architecture, with a persistent way to save the operations (e.g., Azure Queues, MSMQ) and a separate background process (e.g., Azure Worker Role, Win32 Service) to process them.

### Task.run Async Lambda

#### Question 

I just came across some code like:

{% highlight csharp %}
var task = Task.Run(async () => { await Foo.StartAsync(); });
task.Wait();
{% endhighlight %}

(No, I don't know the inner-workings of Foo.StartAsync()). My initial reaction would be get rid of async/await and rewrite as:

{% highlight csharp %}
var task = Foo.StartAsync();
task.Wait();
{% endhighlight %}

Would that be correct, or not (again, knowing nothing at all about Foo.StartAsync()). This answer to What difference does it make - running an 'async' action delegate with a Task.Run ... seems to indicate there may be cases when it might make sense, but it also says "To tell the truth, I haven't seen that many scenarios ..."

#### Answer 1

Normally, the intended usage for Task.Run is to execute CPU-bound code on a non-UI thread. As such, it would be quite rare for it to be used with an async delegate, but it is possible (e.g., for code that has both asynchronous and CPU-bound portions).

However, that's the intended usage. I think in your example:

{% highlight csharp %}
var task = Task.Run(async () => { await Foo.StartAsync(); });
task.Wait();
{% endhighlight %}

It's far more likely that the original author is attempting to synchronously block on asynchronous code, and is (ab)using Task.Run to avoid deadlocks common in that situation (as I describe on my blog).

In essence, it looks like the "thread pool hack" that I describe in my article on brownfield asynchronous code.

The best solution is to not use Task.Run or Wait:

{% highlight csharp %}
await Foo.StartAsync();
{% endhighlight %}

This will cause async to grow through your code base, which is the best approach, but may cause an unacceptable amount of work for your developers right now. This is presumably why your predecessor used `Task.Run(..).Wait()`.

#### Answer 2

Mostly yes.

Using Task.Run like this is mostly used by people who don't understand how to execute an async method.

However, there is a difference. Using Task.Run means starting the async method on a ThreadPool thread.

This can be useful when the async method's synchronous part (the part before the first await) is substantial and the caller wants to make sure that method isn't blocking.

This can also be used to "get out of" the current context, for example where there isn't a SynchronizationContext.

### Run Async Method Synchronously C\#

#### Question

I have a public async void `Foo()` method that I want to call from synchronous method. So far all I have seen from MSDN documentation is calling async methods via async methods, but my whole program is not built with async methods.

Is this even possible?

Here's one example of calling these methods from an asynchronous method: [http://msdn.microsoft.com/en-us/library/hh300224(v=vs.110).aspx](#http://msdn.microsoft.com/en-us/library/hh300224(v=vs.110).aspx)

Now I'm looking into calling these async methods from sync methods.

#### Answer

Asynchronous programming does "grow" through the code base. It has been [compared to a zombie virus](https://blogs.msdn.microsoft.com/lucian/2011/04/15/async-ctp-refresh-design-changes/). The best solution is to allow it to grow, but sometimes that's not possible.

Stephen Cleary have written a few types in [Nito.AsyncEx library](#https://github.com/StephenCleary/AsyncEx) for dealing with a partially-asynchronous code base. There's no solution that works in every situation, though.

##### Solution A

If you have a simple asynchronous method that doesn't need to synchronize back to its context, then you can use Task.WaitAndUnwrapException:

{% highlight csharp %}
var task = MyAsyncMethod();
var result = task.WaitAndUnwrapException();
{% endhighlight %}

You do not want to use Task.Wait or Task.Result because they wrap exceptions in AggregateException.

This solution is only appropriate if MyAsyncMethod does not synchronize back to its context. In other words, every await in MyAsyncMethod should end with ConfigureAwait(false). This means it can't update any UI elements or access the ASP.NET request context.

##### Solution B

If MyAsyncMethod does need to synchronize back to its context, then you may be able to use AsyncContext.RunTask to provide a nested context:

{% highlight csharp %}
var result = AsyncContext.RunTask(MyAsyncMethod).Result;
{% endhighlight %}

In more recent versions of the library the API is as follows:

{% highlight csharp %}
var result = AsyncContext.Run(MyAsyncMethod);
{% endhighlight %}

(It's OK to use Task.Result in this example because RunTask will propagate Task exceptions).

The reason you may need AsyncContext.RunTask instead of Task.WaitAndUnwrapException is because of a rather subtle deadlock possibility that happens on WinForms/WPF/SL/ASP.NET:

1. A synchronous method calls an async method, obtaining a Task.
2. The synchronous method does a blocking wait on the Task.
3. The async method uses await without ConfigureAwait.
4. The Task cannot complete in this situation because it only completes when the async method is finished; the async method cannot complete because it is attempting to schedule its continuation to the SynchronizationContext, and WinForms/WPF/SL/ASP.NET will not allow the continuation to run because the synchronous method is already running in that context.
This is one reason why it's a good idea to use ConfigureAwait(false) within every async method as much as possible.

##### Solution C

AsyncContext.RunTask won't work in every scenario. For example, if the async method awaits something that requires a UI event to complete, then you'll deadlock even with the nested context. In that case, you could start the async method on the thread pool:

{% highlight csharp %}
var task = Task.Run(async () => await MyAsyncMethod());
var result = task.WaitAndUnwrapException();
{% endhighlight %}

However, this solution requires a MyAsyncMethod that will work in the thread pool context. So it can't update UI elements or access the ASP.NET request context. And in that case, you may as well add ConfigureAwait(false) to its await statements, and use solution A.

The current "least-worst practices" are in an MSDN article [here](https://msdn.microsoft.com/en-us/magazine/mt238404.aspx).

### Task Does Not Contain A Definition For Run

#### Question 

I tried to implement multithreading in my code, 1st time. When i tried to use

{% highlight csharp %}
Task T = Task.Run(() => { });
{% endhighlight %}

Visual Studio is still underlines Run() with statement "Task does not contain a definition 'Run' "

I'm using `System.Threading.Tasks;` Internet knows nothing about this problem

#### Answer 

.NET 4.0 does not have a Task.Run method. Instead you can use:

{% highlight csharp %}
Task T = Task.Factory.StartNew(() => { });
{% endhighlight %}

Which you can learn more about [here](https://msdn.microsoft.com/en-us/library/dd321455(v=vs.100).aspx)

### Does Task.run Create A New Thread

#### Question

I have read a lot of articles and still cant get understand this part.

Consider this code :

{% highlight csharp %}
private async void button1_Click(object sender, EventArgs e)
{
    await Dosomething();
}

private async Task<string> Dosomething()
{
    await Task.Run((() => "Do Work"));
    return "I am done";
}
{% endhighlight %}

##### First question:

When I click the button, it will Call DoSomething and await a Task that creates a Thread from the threadpool by calling Task.Run ( if I am not mistaken ) and all of this runs asynchronously. So I achieved creating a thread that does my work but doing it asynchronously? But consider that I don't need any result back, i just want the work to be done without getting any result back, is there really a need to use async/await , and if so, how?

##### Second question:

When running a thread asynchronously, how does that work? Is it running on the main UI but on a separate thread or is it running on a separate thread and separate is asynchronously inside that method?

#### Answer

1. The purpose of creating Async methods is so you can Await them later. Kind of like "I'm going to put this water on to boil, finish prepping the rest of my soup ingredients, and then come back to the pot and wait for the water to finish boiling so I can make dinner." You start the water boiling, which it does asynchronously while you do other things, but eventually you have to stop and wait for it. If what you want is to "fire-and-forget" then Async and Await are not necessary. [Simplest way to do a fire and forget method in C#?](https://stackoverflow.com/questions/1018610/simplest-way-to-do-a-fire-and-forget-method-in-c)

2. Starting a new task queues that task for execution on a threadpool thread. Threads execute in the context of the process (eg. the executable that runs your application). If this is a web application running under IIS, then that thread is created in the context of the IIS worker process. That thread executes separately from the main execution thread, so it goes off and does its thing regardless of what your main execution thread is doing, and at the same time, your main execution thread moves on with its own work.


[thread-affinity]: https://stackoverflow.com/questions/8733303/why-do-ui-controls-in-wpf-have-thread-affinity
[project-files]: https://github.com/kudchikarsk/tasks-in-csharp