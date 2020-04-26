--- 
layout: post
current: post
navigation: True
tags: [Csharp Multithreading]
class: post-template
subclass: 'post csharp-multithreading'
title: Async And Await In C#
description: In this article, you’ll learn about the Task-based asynchronous programming model along with async and await keyword in C#. You will also learn about the application of this asynchronous principle across .Net Applications.
cover: "assets/images/async-await-c.jpg"
course: multithreadingcsharp
comments: true
aside: multithreading_tutorial_aside.html
author: shadman_kudchikar
redirect_from:
  - /tasks-in-csharp/async-await-c/
---

C# 5.0 introduced the async and await keywords. These keywords let you write asynchronous code that has the same structure and simplicity as synchronous code, as well as eliminating the "plumbing" of asynchronous programming.

## Contents

- [Awaiting](#awaiting)
- [Awaiting in a UI](#awaiting-in-a-ui)
- [Async Await Keyword](#async-await-keyword)
- [Application Of Asynchronous Principles Accross .Net](#application-of-asynchronous-principles-accross-net)
- [Awaiting In ASP.NET](#awaiting-in-aspnet)
    - [Avoiding Excessive Bouncing](#avoiding-excessive-bouncing)
    - [What Exactly Is That "Context"?](#what-exactly-is-that-context)
    - [Why Capturing the Current Context is Needed?](#why-capturing-the-current-context-is-needed)
    - [The Benefit Of Using Async And Await Inside ASP.NET?](#the-benefit-of-using-async-and-await-inside-aspnet)
- [Furthur Reading](#furthur-reading)

## Awaiting

The await keyword simplifies the attaching of [C# Task](/csharp-task/) continuations. 

Starting with a basic scenario, the compiler expands:

{% highlight csharp linenos %}

var result = await expression;
statement(s);
{% endhighlight %}

into something functionally similar to:

{% highlight csharp linenos %}

var awaiter = expression.GetAwaiter();
awaiter.OnCompleted (() =>
{
    var result = awaiter.GetResult();
    statement(s);
});
{% endhighlight %}

The compiler also emits code to short-circuit the continuation in case of synchronous completion.

## Awaiting in a UI

To demonstrate the above idea, I made a small WPF application that fetches data from the URL given in the textbox. You can find the complete project [here](https://github.com/kudchikarsk/async-await-demo).

{% highlight csharp linenos %}

using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows;

namespace WpfApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            var url = textBox.Text;
            var isValidUrl =  Uri.TryCreate(url, UriKind.Absolute, out _);
            if (!isValidUrl)
            {
                textBlock.Text = "Given url is not valid.";
                return;
            }

            var currentContext = TaskScheduler.FromCurrentSynchronizationContext();
            var httpClient = new HttpClient();

            var responseTask = httpClient.GetAsync(url);
            //First continuation start
            responseTask.ContinueWith(r => {
                try
                {
                    var response = r.Result;
                    response.EnsureSuccessStatusCode();

                    var dataTask = response.Content.ReadAsStringAsync();
                    //Second continuation start
                    dataTask.ContinueWith(d => {
                        textBlock.Text = d.Result;
                    }, currentContext);
                    //Second continuation end
                }
                catch (Exception ex)
                {
                    textBlock.Text = ex.Message;
                }
            });
            //First continuation ends
        }
    }
}
{% endhighlight %}

Here `responseTask.ContinueWith` what simply does is that it callback the action, defined as the lambda expression, after the `responseTask` operation is finished.

Callbacks are not all bad; they worked — they still do. But, what happens if we have a callback inside a callback, inside a callback — you get the point. It gets messy and unmaintainable really quick.

The problem described above is named "callback hell". Which you can see a bit in the above example.

To overcome the above problem which is more related to code readability, C# introduced the async await keyword. Let's try it.


## Async Await Keyword

A very common thing to first try out when you encounter the asynchronous method in .NET is to simply mark your parent method with the async keyword. Let's go ahead and try that.

Also, let's remove all the continuation from the code and directly use the .Result property to access the result from our asynchronous task operation.

Let's see how that affects our application. 

{% highlight csharp linenos %}

using System;
using System.Net.Http;
using System.Windows;

namespace WpfApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private async void Button_Click(object sender, RoutedEventArgs e)
        {
            var url = textBox.Text;
            var isValidUrl =  Uri.TryCreate(url, UriKind.Absolute, out _);
            if (!isValidUrl)
            {
                textBlock.Text = "Given url is not valid.";
                return;
            }

            var httpClient = new HttpClient();
            var response = httpClient.GetAsync(url).Result;
            try
            {

                response.EnsureSuccessStatusCode();
                var data = response.Content.ReadAsStringAsync().Result;
                textBlock.Text = data;
            }
            catch (Exception ex)
            {
                textBlock.Text = ex.Message;
            }
        }
    }
}
{% endhighlight %}

You'll notice here that I can mark my `Button_Click` handler as async. And if you run the application and see if this affected the performance of our application, you'll quickly notice that the application UI gets locks up. Let's jump into the code and discuss about why this is still not an asynchronous operation. 

![](/assets/images/async-await/demo1.JPG)

As you see here, Visual Studio will tell us that this method is marked as async, but it lacks the await keyword. So the code inside this method will still run synchronously, and that's a big problem because we want to leverage the asynchronous principles. 

Why is this a problem?

Now, in the above code you may have seen the following line:

{% highlight csharp linenos %}

var response = httpClient.GetAsync(url).Result;
{% endhighlight %}

Here GetAsync returns a task of an HttpResponseMessage, a task is a representation of our asynchronous operation. This asynchronous operation happens on a different thread. 

So if we call `.Result`, which is one of the first things that people try to get the Result out of their asynchronous operation, this is actually a really bad idea.

It will actually block the thread until this Result is available, so this is problematic because this means that code will run synchronously. 

Actually, what we need to do is to make sure that whenever we encounter the async keyword, we also have the await keyword inside that same method. Like this,

{% highlight csharp linenos %}

var response = await httpClient.GetAsync(url);
{% endhighlight %}

The await keyword is a way for us to indicate that we want to get the Result out of this asynchronous operation only once the data is available without blocking the current thread. So the above code gives us the HttpResponseMessage. 

Also,

While reading the content from the response you'll find that ReadAsString is also an asynchronous operation, and it also hints us here that we need to await this as well.

{% highlight csharp linenos %}

var data = await response.Content.ReadAsStringAsync();
{% endhighlight %}

We could, of course, say ReadAsStringAsync and then call the Result property, but this would block again and make this code run synchronously, and in a lot of cases, calling `.Result` or `.Wait` will, in fact, deadlock the application. So avoid calling `.Result` or `.Wait`.

Let's see the final result with all the changes we did,

{% highlight csharp linenos %}

using System;
using System.Net.Http;
using System.Windows;

namespace WpfApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private async void Button_Click(object sender, RoutedEventArgs e)
        {
            var url = textBox.Text;
            var isValidUrl =  Uri.TryCreate(url, UriKind.Absolute, out _);
            if (!isValidUrl)
            {
                textBlock.Text = "Given url is not valid.";
                return;
            }

            var httpClient = new HttpClient();
            var response = await httpClient.GetAsync(url);
            try
            {

                response.EnsureSuccessStatusCode();
                var data = await response.Content.ReadAsStringAsync();
                textBlock.Text = data;
            }
            catch (Exception ex)
            {
                textBlock.Text = ex.Message;
            }
        }
    }
}

{% endhighlight %}

So,

The await keyword, allows us to retrieve the result out of our asynchronous operation when that's available. It also makes sure that there are no exceptions or problems with the task that it's currently awaiting. So not only is the await keyword a great way for us to get the Result out of the asynchronous operation. It also validates the current operation.

And,

What it's also doing is introducing continuation, as we've mentioned earlier, the await keyword does the same behind the scene and puts all the code beneath it inside the continuation.

Also,

You can await the result of an async method that returns a Task because the method returns a Task, not because it’s async. That means you can also await the result of a non-async method that returns a Task:

{% highlight csharp linenos %}

public async Task NewStuffAsync()
{
  // Use await and have fun with the new stuff.
  await ...
}

public Task MyOldTaskParallelLibraryCode()
{
  // Note that this is not an async method, so we can't use await in here.
  ...
}

public async Task ComposeAsync()
{
  // We can await Tasks, regardless of where they come from.
  await NewStuffAsync();
  await MyOldTaskParallelLibraryCode();
}
{% endhighlight %}

## Application Of Asynchronous Principles Accross .Net

Asynchronous principles are suited for any type of I/O operations. As we do in this case, we interact with an API over the web, but it could also be reading and writing from disk or memory or do things like database operations. In our case here, we're fetching some data from our API using the GetAsync method on our HttpClient. 

The asynchronous principles that we talk about in our applications are not only meant for Windows applications or mobile applications. We can also apply the same principle to the server-side code in ASP.NET. 

## Awaiting In ASP.NET

Let's see an example:

{% highlight csharp linenos %}

using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace WebApplication.Controllers
{
    public class TestController : ApiController
    {
        // GET: api/Test
        public async Task<IHttpActionResult> Get(string url)
        {
            var isValidUrl = Uri.TryCreate(url, UriKind.Absolute, out _);
            if (!isValidUrl)
            {
                return BadRequest("Given url is not valid.");
            }

            var httpClient = new HttpClient();
            var response = await httpClient.GetAsync(url).ConfigureAwait(false);
            try
            {

                response.EnsureSuccessStatusCode();
                var data = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

{% endhighlight %}

Here is a test controller inside a web project that's allowing us to pretty much do the same thing that we do in our Windows application. However, we have a minor difference here:

{% highlight csharp linenos %}

.ConfigureAwait(false)
{% endhighlight %}

both of the task call this method in the end.

Why?

### Avoiding Excessive Bouncing

When you await an async method, then it will capture the current "context" and later when the task completes, it will execute the remainder of the async method on a “context” that was captured before the “await” returned.

### What Exactly Is That "Context"?

Simple answer:

If you’re on a UI thread, then it’s a UI context.
If you’re responding to an ASP.NET request, then it’s an ASP.NET request context.
Otherwise, it’s usually a thread pool context.

Complex answer:

If `SynchronizationContext.Current` is not null, then it’s the current SynchronizationContext. (UI and ASP.NET request contexts are SynchronizationContext contexts).

Otherwise, it’s the current TaskScheduler (TaskScheduler.Default is the thread pool context).
What does this mean in the real world? For one thing, capturing (and restoring) the UI/ASP.NET context is done transparently:

### Why Capturing the Current Context is Needed?

One example of when it’s necessary is in WPF apps. Imagine we delegate some kind of operation to another thread, and we want to use the result for setting a text box Text property. But the problem is, in this framework, only the thread that creates the UI element has the right to change its property. If we try to change a UI element from another thread, we get the `InvalidOperationException` error.

Most of the time, you don’t need to sync back to the "main" context. You want to use `ConfigureAwait(false)` whenever the rest of that async method does not depend on the current context.

Also,

Some frameworks depending on their internal implementation don’t need SynchronizationContext. Asp.Net Core is one such framework. Read more about it [here](https://blog.stephencleary.com/2017/03/aspnetcore-synchronization-context.html). In short in such frameworks there might be no need for ConfigureAwait(false).

### The Benefit Of Using Async And Await Inside ASP.NET?

Now what's interesting here is that this is not making the client-side app asynchronous. 

So, what's the benefit?

The benefit of using async and await inside ASP.NET is to relieve IIS or the web server that you were using so that it can go ahead and work with other requests as your data is being loaded from disk, the database, or from another API. The primary benefit of asynchronous code on the server-side is scalability.

So as you notice here, the asynchronous principles are really powerful no matter if we are working in ASP.NET, in Windows, or any type of .NET applications.

In the next post [Task Parallelism In C#](/tasks-in-csharp/task-parallelism-c/), we will look at different methods to achieve parallelism using Tasks in C#.

## Furthur Reading
- [Async/Await - Best Practices in Asynchronous Programming](https://msdn.microsoft.com/en-us/magazine/jj991977.aspx) by [Stephen Cleary](https://blog.stephencleary.com/) - This article is intended as a “second step” in learning asynchronous programming. This article highlights best practices that can get lost in the avalanche of available documentation.

- [What Is SynchronizationContext and Its Role In Asynchronous Programs](http://hamidmosalla.com/2018/06/24/what-is-synchronizationcontext/) - by [Hamid Mosalla](http://hamidmosalla.com/about/) - In this post, Hamid explained what SynchronizationContext is and what problem it tries to solve. He also digs a little deeper into why we need this construct and how .Net deals with these issues under the hood.

- [Concurrency in C# Cookbook: Asynchronous, Parallel, and Multithreaded Programming 2nd Edition](https://amzn.to/2HoBUeU) by [Stephen Cleary](https://blog.stephencleary.com/) - If you’re one of many developers still uncertain about concurrent and multithreaded development, this practical cookbook will change your mind. With more than 85 code-rich recipes in this updated second edition, author Stephen Cleary demonstrates parallel processing and asynchronous programming techniques using libraries and language features in .NET and C# 8.0. 
