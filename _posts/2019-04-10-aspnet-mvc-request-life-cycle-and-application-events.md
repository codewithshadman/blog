---
layout: post
current: post
navigation: True
tags: [ASP.NET]
class: post-template
subclass: 'post csharp'
title:  "ASP.NET MVC Life Cycle"
description: "This article introduces Request Life Cycle and Application Events that takes place as the request travel through MVC framework and Asp.NET platform. It also explains different methods to interact with this events."
cover: "assets/images/aspnet-mvc-request-life-cycle-and-application-events.jpg"
date: 2019-04-10 00:00:00
last_modified_at: Wed Sep  4 20:37:47 2019
author: shadman_kudchikar
comments: true
---


From getting client request to sending a response, the Asp.NET MVC lifecycle is bit complex. This lifecycle is totally different from old Asp.NET Webforms. As the page in Webforms has page lifecycle many people compare this with Asp.NET MVC lifecycle which is totally a different thing.

<!--more-->

The thing is Asp.NET MVC and Webforms are both implemented using HttpHandlers over Asp.NET and the way they respond to request is different based on their implementation. Usually in Webforms the url points to aspx page which get processed and generate response. However, MVC is bit indirect in this process. In MVC, url gets routed to specific controller and action methods to generate a response.

This article introduces Request Life Cycle and Application Events that takes place as the request travel through MVC framework and Asp.NET platform. It also explains different methods to interact with this events. Let's get started.

## Contents

* [MVC Request Life Cycle](#mvc-request-life-cycle)
* [Http Application Class](#http-application-class)
* [Global.asax Events](#global-asax-events)
* [PreApplicationStart method](#preapplicationstart-method)
* [Working with Events Across Frameworks Using HttpModules](#working-with-events-across-frameworks-using-httpmodules)
* [Further Reading](#further-reading)
* [References](#references)

## MVC Request Life Cycle {#mvc-request-life-cycle}

Before we start discussing the life cycle, let's briefly understand the concept of HttpHandlers and HttpModules. 

Handlers are responsible for generating the actual response in MVC. They implement the IHttpHandler class and only one handler will execute per request. On the other hand, HttpModules are created in response to life cycle events. Modules can, for example, be used for populating HttpContext objects. A request can use many modules. These classes derive from IHttpModule.

Now,

The thing is these HttpModules and HttpHandlers are the entry points to the ASP.NET MVC framework. Requests to an ASP.NET MVC-based Web application first pass through the *UrlRoutingModule* object, which is an HttpModule. This module parses the request and performs route selection. 

From the selected Route object, the UrlRoutingModule object obtains the IRouteHandler object that is associated with the Route object. Typically, in an MVC application, this will be an instance of *MvcRouteHandler*. 

The IRouteHandler instance creates an IHttpHandler object and passes it the IHttpContext object. By default, the IHttpHandler instance for MVC is the *MvcHandler* object. The MvcHandler object then selects the controller that will ultimately handle the request.

You can download a PDF document from [here][mvc-life-cycle-ms] that charts the lifecycle of every ASP.NET MVC 5 application, from receiving the HTTP request to sending the HTTP response back to the client.

## Http Application Class {#http-application-class}

The `MVCApplication` class in *Global.asax* file inherits `HttpApplication` class.
{% highlight csharp linenos %}

public class MvcApplication : System.Web.HttpApplication
{% endhighlight %}

HttpApplication Class defines the methods, properties, and events that are common to all application objects in an ASP.NET application. This class is the base class for applications defined by the user in the *Global.asax* file.

HttpApplication class has number of application and request level events which you can override. 

{% highlight csharp linenos %}

public class MvcApplication : System.Web.HttpApplication
{

    protected void Application_Start(object sender, EventArgs e)
    {
    }

    protected void Application_BeginRequest(object sender, EventArgs e)
    {        
    }

    protected void Application_EndRequest(Object sender, EventArgs e)
    {
    }

    protected void Application_Error(object sender, EventArgs e)
    {
    }

    protected void Application_End(object sender, EventArgs e)
    {
    }

}
{% endhighlight %}

Below is a complete list of events you can override in HttpApplication class.

## Global.asax Events {#global-asax-events}

- Application_Init: Fired when an application initializes or is first called. It is invoked for all HttpApplication object instances.

- Application_Disposed: Fired just before an application is destroyed. This is the ideal location for cleaning up previously used resources.

- Application_Error: Fired when an unhandled exception is encountered within the application.

- Application_Start: Fired when the first instance of the HttpApplication class is created. It allows you to create objects that are accessible by all HttpApplication instances.

- Application_End: Fired when the last instance of an HttpApplication class is destroyed. It is fired only once during an application's lifetime.

- Application_BeginRequest: Fired when an application request is received. It is the first event fired for a request, which is often a page request (URL) that a user enters.

- Application_EndRequest: The last event fired for an application request.

- Application_PreRequestHandlerExecute: Fired before the ASP.NET page framework begins executing an event handler like a page or Web service.

- Application_PostRequestHandlerExecute: Fired when the ASP.NET page framework has finished executing an event handler.

- Applcation_PreSendRequestHeaders: Fired before the ASP.NET page framework sends HTTP headers to a requesting client (browser).

- Application_PreSendContent: Fired before the ASP.NET page framework send content to a requesting client (browser).

- Application_AcquireRequestState: Fired when the ASP.NET page framework gets the current state (Session state) related to the current request.

- Application_ReleaseRequestState: Fired when the ASP.NET page framework completes execution of all event handlers. This results in all state modules to save their current state data.

- Application_ResolveRequestCache: Fired when the ASP.NET page framework completes an authorization request. It allows caching modules to serve the request from the cache, thus bypassing handler execution.

- Application_UpdateRequestCache: Fired when the ASP.NET page framework completes handler execution to allow caching modules to store responses to be used to handle subsequent requests.

- Application_AuthenticateRequest: Fired when the security module has established the current user's identity as valid. At this point, the user's credentials have been validated.

- Application_AuthorizeRequest: Fired when the security module has verified that a user can access resources.

- Session_Start: Fired when a new user visits the application Web site.

- Session_End: Fired when a user's session times out, ends, or they leave the application Web site.

## PreApplicationStart Method {#preapplicationstart-method}

MVC Request lifecycle contains events like Appliication Start and Application End which we can configure in Global.asax file. 

However, 

We sometimes need to execute some custom code before all this events take place in the first place, like registering a HttpModule. In that case we can use PreApplicationStart method to register this HttpModules.

The PreApplicationStart method is defined at the assembly level using an attribute. We can define the name of a type as well as a method on that type that we want to run before our application starts. Below is the example,
{% highlight csharp linenos %}

[assembly: PreApplicationStartMethod(typeof(PreApplicationStart), "Start")]
{% endhighlight %}

## Working with Events Across Frameworks Using HttpModules {#working-with-events-across-frameworks-using-httpmodules}

As I mentioned earlier both Webforms and MVC frameworks uses HttpModule and HttpHandler for their request and response pipeline. We are interested in HttpModule here. We can set any number of HttpModules in an ASP.NET Http request and response pipeline. 

One of the greatest feature of ASP.Net Application Life Cycle that its events can be accessed across frameworks. ASP.NET application whether it's built on MVC or not. In fact, we can have two applications running side by side using different frameworks and still leverage the same life cycle events. 

For example, you could have a webforms application and an MVC application running side by side. You could then build an HttpModule to hook into the same life cycle events for both and perform some common tasks.

Below is a sample code for a HttpModule that registers for HttpApplication events using event handlers.

{% highlight csharp linenos %}

public class HelloWorldModule : IHttpModule
{
    public HelloWorldModule()
    {
    }

    // In the Init function, register for HttpApplication 
    // events by adding your handlers.
    public void Init(HttpApplication application)
    {
        application.BeginRequest += 
            (new EventHandler(this.Application_BeginRequest));
        application.EndRequest += 
            (new EventHandler(this.Application_EndRequest));
    }

    private void Application_BeginRequest(Object source, EventArgs e)
    {
   
    }

    private void Application_EndRequest(Object source, EventArgs e)
    {
        
    }
}
{% endhighlight %}

## Further Reading

- [ASP.NET MVC Life Cycle
][mvc-life-cycle] by [Rasmita Dash](https://www.c-sharpcorner.com/members/rasmita-dash) - Learn more about Asp.NET MVC Request Life Cycle conceptually from this well-documented article.
- [Global.asax and the HttpApplication class][global-asax-and-the-httpapplication-class] by [Scott Allen](https://odetocode.com/about/scott-allen) - This article discusses the HttpApplication class and event handlers such as `Application_Start` and `Session_Start`. By reading this article you will get more comfortable in utilizing these events.
- [How do ASP.NET Application_ Events Work](https://weblog.west-wind.com/posts/2009/jun/18/how-do-aspnet-application-events-work) by [Rick Strahl](https://weblog.west-wind.com/)- We learned about ASP.NET *Global.asax* Application_ Event name handlers, but do you know how it is that these events are actually fired automatically by ASP.NET even when you add additional events by name? In this post, Rick explains how ASP.NET hooks up these methods to HttpModule events.
- [HttpModule in Real Scenario: Events in HttpModules][module-events] by [Sourav Kayal](https://www.c-sharpcorner.com/members/sourav-kayal) - In this article, you will learn more about the execution sequence of various events, discussed before, in a HttpModule.

## References {#references}
- [https://docs.microsoft.com/en-us/aspnet/mvc/overview/older-versions-1/overview/understanding-the-asp-net-mvc-execution-process](https://docs.microsoft.com/en-us/aspnet/mvc/overview/older-versions-1/overview/understanding-the-asp-net-mvc-execution-process)
- [https://www.c-sharpcorner.com/UploadFile/00a8b7/Asp-Net-mvc-life-cycle/](https://www.c-sharpcorner.com/UploadFile/00a8b7/Asp-Net-mvc-life-cycle/)
- [https://docs.microsoft.com/en-us/aspnet/mvc/overview/getting-started/lifecycle-of-an-aspnet-mvc-5-application](https://docs.microsoft.com/en-us/aspnet/mvc/overview/getting-started/lifecycle-of-an-aspnet-mvc-5-application)
- [https://odetocode.com/articles/89.aspx](https://odetocode.com/articles/89.aspx)
- [https://docs.microsoft.com/en-in/dotnet/api/system.web.httpapplication?view=netframework-4.7.2](https://docs.microsoft.com/en-in/dotnet/api/system.web.httpapplication?view=netframework-4.7.2)


[mvc-life-cycle]: https://www.c-sharpcorner.com/UploadFile/00a8b7/Asp-Net-mvc-life-cycle/
[mvc-life-cycle-ms]: https://docs.microsoft.com/en-us/aspnet/mvc/overview/getting-started/lifecycle-of-an-aspnet-mvc-5-application
[global-asax-and-the-httpapplication-class]: https://odetocode.com/articles/89.aspx
[http-application]: https://docs.microsoft.com/en-in/dotnet/api/system.web.httpapplication?view=netframework-4.7.2
[app-events]: https://weblog.west-wind.com/posts/2009/jun/18/how-do-aspnet-application-events-work
[module-events]: https://www.c-sharpcorner.com/UploadFile/dacca2/httpmodule-in-real-scenario-events-in-httpmodules/
[post-image]: /assets/images/aspnet-mvc-request-life-cycle-and-application-events.jpg "Asp.NET MVC Request Life Cycle and Application Events"