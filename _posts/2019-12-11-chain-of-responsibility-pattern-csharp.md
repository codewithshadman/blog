---
layout: post
current: post
navigation: True
tags: [Csharp Design Patterns]
class: post-template
subclass: 'post design-patterns'
title: Chain Of Responsibility Pattern C#
description: The Chain of Responsibility is an ordered list of message handlers that know how to do two things; process a specific type of message, or pass the message along to the next message handler in the chain. The Chain of Responsibility provides a simple mechanism to decouple the sender of a message from the receiver.
cover: "assets/images/chain-of-responsibility-pattern-csharp.jpg"
date: Wed Dec 11 21:47:37 2019
last_modified_at: Wed Dec 11 21:47:40 2019
author: shadman_kudchikar
comments: true
---

## Contents

- [What Is Chain Of Responsibility Pattern?](#what-is-chain-of-responsibility-pattern)
- [Chain Of Responsibility Pattern Example](#chain-of-responsibility-pattern-example)
  - [Example 1](#example-1)
  - [Example 2](#example-2)
- [Chain Of Responsibility Pattern In .NET](#chain-of-responsibility-pattern-in-net)
- [Chain Of Responsibility Pattern In ASP.NET](#chain-of-responsibility-pattern-in-aspnet)
- [Where To Apply Chain Of Responsibility Pattern?](#where-to-apply-chain-of-responsibility-pattern)
- [Further Reading](#further-reading)

## What Is Chain Of Responsibility Pattern?

The Chain of Responsibility is an ordered list of message handlers that know how to do two things; process a specific type of message, or pass the message along to the next message handler in the chain. 

The Chain of Responsibility provides a simple mechanism to decouple the sender of a message from the receiver.

The Chain of Responsibility has several traits. The sender is only aware of one receiver. Each receiver is only aware of the next receiver. Receivers process the message or send it down the chain. The sender does not know who received the message. The first receiver to handle the message terminates the chain. 

In this respect, the order of the receiver list matters. If the first receiver and the second receiver can both handle the same type of message, some sort of message handling priority would have to be built-in to the list.

Below is the UML and sequence diagram of Chain Of Responsibility pattern from Wikipedia.

![UML and sequence diagram of Chain Of Responsibility pattern](/assets/images/Chain_of_Responsibility_Design_Pattern_UML.jpg)

## Chain Of Responsibility Pattern Example

### Example 1

One of the great examples of the Chain of Responsibility pattern is the ATM Dispense machine. The user enters the amount to be dispensed and the machine checks if the amount is dispensable in terms of defined currency bills such as 50$, 20$, 10$, etc.

We will use the Chain of Responsibility pattern to implement this solution. The chain will process the request in the same order as the below image.

![](/assets/images/Chain-of-Responsibility-Pattern.png)

We can implement this solution easily in a single program itself but then the complexity will increase and the solution will be tightly coupled. So we will create a chain of dispense systems to dispense bills of 50$, 20$ and 10$.

```cs
namespace ATMDispenserExample
{
    class Program
    {
        static void Main(string[] args)
        {

            //create handlers
            var bills50s = new CurrencyBill(50, 1);
            var bills20s = new CurrencyBill(20, 2);
            var bills10s = new CurrencyBill(10, 5);

            //set handlers pipeline
            bills50s.RegisterNext(bills20s)
                    .RegisterNext(bills10s);

            //client code that uses the handler
            while (true)
            {
                Console.WriteLine("Please enter amount to dispense:");
                var isParsed = int.TryParse(Console.ReadLine(), out var amount);

                if (isParsed)
                {

                    //sender pass the request to first handler in the pipeline
                    var isDepensible = bills50s.DispenseRequest(amount);
                    if (isDepensible)
                    {
                        Console.WriteLine($"Your amount ${amount} is dispensable!");
                    }
                    else
                    {
                        Console.WriteLine($"Failed to dispense ${amount}!");
                    }
                }
                else
                {
                    Console.WriteLine("Please enter a valid amount to dispense");
                }
            }
        }
    }


    public class CurrencyBill
    {
        private CurrencyBill next = CurrencyBill.Zero; //sets default handler instead of null object
        private static readonly CurrencyBill Zero;

        public int Denomination { get; }
        public int Quantity { get; }

        //A static constructor that initializes static Zero property
        //This property is used as default next handler instead of a null object
        static CurrencyBill()
        {
            Zero = new ZeroCurrencyBill();
        }

        //Use to set static Zero property
        //Will always return false at it cannot process any given amount.
        public class ZeroCurrencyBill : CurrencyBill
        {
            public ZeroCurrencyBill() : base(0, 0)
            {
            }

            public override bool DispenseRequest(int amount)
            {
                return false;
            }
        }

        //CurrencyBill constructor that set the denomination value and quantity
        public CurrencyBill(int denomination, int quantity)
        {
            Denomination = denomination;
            Quantity = quantity;
        }

        //Method that set next handler in the pipeline
        public CurrencyBill RegisterNext(CurrencyBill currencyBill)
        {
            next = currencyBill;
            return next;
        }

        //Method that processes the request or passes it to the next handler
        public virtual bool DispenseRequest(int amount)
        {
            if (amount >= Denomination)
            {
                var num = Quantity;
                var remainder = amount;
                while (remainder >= Denomination && num > 0)
                {
                    remainder -= Denomination;
                    num--;
                }

                if (remainder != 0)
                {
                    return next.DispenseRequest(remainder);
                }

                return true;
            }
            else
            {
                return next.DispenseRequest(amount);
            }

        }
    }
}
```

```txt
Please enter amount to dispense:
140
Your amount $140 is dispensable!
Please enter amount to dispense:
100
Your amount $100 is dispensible!
Please enter amount to dispense:
200
Failed to dispense $200!
```

### Example 2

Let's see another example. This time we will start with the problem statement, the Budget Approval problem. 

Let say a worker name William has generated an expense report. He would like to have the expenses approved so he can be repaid. He sends the expenses to his manager. The expenses are too large for his manager to directly approve, so she sends it on to the vice president. The vice president is also unable to approve such a large expense and sends it directly to the president. Now the president has the ultimate authority and will review the approval, and give William a response. Let's take a look at a solution that does not use the Chain of Responsibility Design Pattern.

There're a few basic interfaces we'll cover before we begin to get everybody up to speed. 

First, we have an ExpenseReport. An ExpenseReport simply has a total value, the dollars, and cents of the expense. 

```cs
using System;

namespace ApprovalCommon
{
    public interface IExpenseReport
    {
        Decimal Total { get; }
    }
}
```

Next, we have an ExpenseApprover. An ExpenseApprover is an employee who can approve an expense. 

```cs
public interface IExpenseApprover
{
    ApprovalResponse ApproveExpense(IExpenseReport expenseReport);
}
```

And then we have an ApprovalResponse; Denied, Approved, or Beyond the Approval Limit for that ExpenseApprover. 

```cs
public enum ApprovalResponse
{
    Denied,
    Approved,
    BeyondApprovalLimit,
}
```

The ExpenseReport concrete implementation is very straightforward. It simply exposes the Total as a property. 

```cs
using System;

namespace ApprovalCommon
{
    public class ExpenseReport : IExpenseReport
    {
        public ExpenseReport(Decimal total)
        {
            Total = total;
        }

        public decimal Total 
        { 
            get;
            private set;
        }
    }
}
```

The Employee class is the concrete implementation of the ExpenseApprover interface. Its constructor takes a string, which is the name and the decimal value for the approvalLimit. The ApproveExpense method simply looks at the ExpenseReport and determines if the value is above, or below the approvalLimit. If it's above the approvalLimit, BeyondApprovalLimit is returned. Otherwise, the Expense is Approved. 

```cs
using System;

namespace ApprovalCommon
{
    public class Employee : IExpenseApprover
    {
        public Employee(string name, Decimal approvalLimit)
        {
            Name = name;
            _approvalLimit = approvalLimit;
        }

        public string Name { get; private set; }

        public ApprovalResponse ApproveExpense(IExpenseReport expenseReport)
        {
            return expenseReport.Total > _approvalLimit 
                    ? ApprovalResponse.BeyondApprovalLimit 
                    : ApprovalResponse.Approved;
        }

        private readonly Decimal _approvalLimit;
    }
}
```

Here we have our main Expense Approval application.

```cs
using System;
using System.Collections.Generic;
using ApprovalCommon;

namespace Approval
{
    class Approval
    {
        static void Main()
        {
            List<Employee> managers = new List<Employee>
                                          {
                                              new Employee("William Worker", Decimal.Zero),
                                              new Employee("Mary Manager", new Decimal(1000)),
                                              new Employee("Victor Vicepres", new Decimal(5000)),
                                              new Employee("Paula President", new Decimal(20000)),
                                          };

            Decimal expenseReportAmount;
            while (ConsoleInput.TryReadDecimal("Expense report amount:", out expenseReportAmount))
            {
                IExpenseReport expense = new ExpenseReport(expenseReportAmount);

                bool expenseProcessed = false;

                foreach (Employee approver in managers)
                {
                    ApprovalResponse response = approver.ApproveExpense(expense);

                    if (response != ApprovalResponse.BeyondApprovalLimit)
                    {
                        Console.WriteLine("The request was {0}.", response);
                        expenseProcessed = true;
                        break;
                    }
                }

                if (!expenseProcessed)
                {
                    Console.WriteLine("No one was able to approve your expense.");
                }
            }
        }
    }
}
```

Our sample data is four workers. These workers represent a very simple management reporting structure. 

It begins with William, who reports to Mary, who reports to Victor, who reports to Paula. Each member along that chain has an expense limit. William's limit is 0. He's not able to approve any expenses. Mary's limit is $1000, Victor's is 5000, and Paula's is 20, 000. 

The algorithm begins by reading in the expenseReportAmount from the command line. That amount is fed into the constructor of an ExpenseReport, which will then be passed to every manager to see if they're able to approve it. If the first manager is able to approve the ExpenseReport, we're done. 

The request was approved or denied. But if they weren't, we'll iterate on to the next manager in the list. 

Issues in the current implementation:

One of the issues we have is that the caller is responsible for iterating over the list. This means the business logic of how expense reports are promoted through the management chain is captured at the wrong level. If I bring an expense report to my manager, and I ask for approval, if he says that's beyond my expense limit, he doesn't tell me to go on and ask his manager, he'll do that for me. I simply send an expense report, and at some point in the future, I get a response. I don't need to worry about the promotion process that happened behind the scenes. Our code should reflect that. And with the Chain of Responsibility, we'll be able to.

Now let's take a look at the Budget Approval application, using the Chain of Responsibility. 

```cs
using System;
using ApprovalCommon;

namespace Approval
{
    class Approval
    {
        static void Main()
        {
            ExpenseHandler william = new ExpenseHandler(new Employee("William Worker", Decimal.Zero));
            ExpenseHandler mary = new ExpenseHandler(new Employee("Mary Manager", new Decimal(1000)));
            ExpenseHandler victor = new ExpenseHandler(new Employee("Victor Vicepres", new Decimal(5000)));
            ExpenseHandler paula = new ExpenseHandler(new Employee("Paula President", new Decimal(20000)));

            william.RegisterNext(mary);
            mary.RegisterNext(victor);
            victor.RegisterNext(paula);

            Decimal expenseReportAmount;
            if (ConsoleInput.TryReadDecimal("Expense report amount:", out expenseReportAmount))
            {
                IExpenseReport expense = new ExpenseReport(expenseReportAmount);

                ApprovalResponse response = william.Approve(expense);

                Console.WriteLine("The request was {0}.", response);
            }
        }
    }
}
```

It should be clear just at first glance that this is a significantly smaller amount of code than what we had in the non-Chain of Responsibility solution. 

The most obvious difference, to begin with, is the addition of the ExpenseHandler class. This ExpenseHandler represents a single link in the Chain of Responsibility. Let's go ahead and take a look at that class to understand how it works. 

```cs
using ApprovalCommon;

namespace Approval
{
    interface IExpenseHandler
    {
        ApprovalResponse Approve(IExpenseReport expenseReport);
        void RegisterNext(IExpenseHandler next);
    }

    class ExpenseHandler : IExpenseHandler
    {
        public ExpenseHandler(IExpenseApprover expenseApprover)
        {
            _approver = expenseApprover;
            _next = EndOfChainExpenseHandler.Instance;
        }

        public ApprovalResponse Approve(IExpenseReport expenseReport)
        {
            ApprovalResponse response = _approver.ApproveExpense(expenseReport);

            if(response == ApprovalResponse.BeyondApprovalLimit)
            {
                return _next.Approve(expenseReport);
            }

            return response;
        }

        public void RegisterNext(IExpenseHandler next)
        {
            _next = next;
        }

        private readonly IExpenseApprover _approver;
        private IExpenseHandler _next;
    }
}
```

The ExpenseHandler implements the IExpenseHandler interface. This interface exposes two methods, the Approve method, which should look familiar, and the RegisterNext method. The RegisterNext method registers the next link in the chain. 

Basically, what its saying is if I can't approve this expense, I should ask the next link in the chain if it's able to approve the expense. In the ExpenseHandler class, the concrete implementation of the IExpenseHandler interface, we take an ExpenseApprover in the constructor. This Approver is an employee, just like in the previous example. The Approve method receives an ExpenseReport. We ask the Approver, are you able to approve this expense, just like in the previous example. In this case, if they are not able to Approve the expense, because it's beyond their approval limit, we go to the next link in the chain, and we ask it to Approve it.

Also,

In the above solution, we have used a null object pattern to handle the null reference exception because it gives us a little more freedom in how we want to handle the end of the chain. Every time we create an ExpenseHandler, until we've called RegisterNext, next will be null. So instead of letting it be null, we gave it a default value of a null object. 

What I've done is I've created an EndOfChainExpenseHandler class, and this class exposes a singleton Instance. This Instance is the EndOfChainHandler. 

```cs
using System;
using ApprovalCommon;

namespace Approval
{
    class EndOfChainExpenseHandler : IExpenseHandler
    {
        private EndOfChainExpenseHandler() { }

        public static EndOfChainExpenseHandler Instance
        {
            get { return _instance; }
        }

        public ApprovalResponse Approve(IExpenseReport expenseReport)
        {
            return ApprovalResponse.Denied;
        }

        public void RegisterNext(IExpenseHandler next)
        {
            throw new InvalidOperationException("End of chain handler must be the end of the chain!");
        }

        private static readonly EndOfChainExpenseHandler _instance = new EndOfChainExpenseHandler();
    }
}
```

The benefits you'll see when using the Chain of Responsibility include a reduced coupling between the message sender and receiver. You'll be able to dynamically manage the message handlers, and the end of chain behavior can be defined appropriately depending on your business context.

## Chain Of Responsibility Pattern In .NET

.NET exception handling mechanism is a wonderful example where the chain of responsibility pattern is leveraged. We know that we can have multiple catch blocks in a try-catch block code. Here every catch block is kind of a processor to process that particular exception.

So when an exception occurs in the try block, its send to the first catch block to process. If the catch block is not able to process it, it forwards the request to the next object in chain i.e next catch block. If even the last catch block is not able to process it, the exception is thrown outside of the chain to the calling program.

In the following example, two catch blocks are used, and the most specific exception, which comes first, is caught.

```cs
class ThrowTest3
{
    static void Main()
    {
        try
        {
            string s = null;
            ProcessString(s);
        }
        // Most specific:
        catch (ArgumentNullException e)
        {
            Console.WriteLine("{0} First exception caught.", e);
        }
        // Least specific:
        catch (Exception e)
        {
            Console.WriteLine("{0} Second exception caught.", e);
        }
    }

    static void ProcessString(string s)
    {
        if (s == null)
        {
            throw new ArgumentNullException();
        }
    }
}
/*
 Output:
 System.ArgumentNullException: Value cannot be null.
 at Test.ThrowTest3.ProcessString(String s) ... First exception caught.
*/
```

## Chain Of Responsibility Pattern In ASP.NET

 The ASP.NET pipeline is a wonderful example where the chain of responsibility pattern is leveraged to provide an extensible programming model. The ASP.NET infrastructure implements WebForms API, ASMX Web services, WCF, ASP.NET Web API, and ASP.NET MVC using HTTP modules and handlers. 

 Every request in the pipeline passes through a series of modules (a class that implements IHttpModule) before it reaches its target handler (a class that implements IHttpHandler). Once a module in the pipeline has done its duty, it passes the responsibility of the request processing to the next module in the chain. Finally, it reaches the handler.

 The following code snippet shows how one can write an object that leverages the chain of responsibility pattern to create a module that filters an incoming request. These filters are configured as chains and will pass the requested content to the next filter in the chain by the ASP.net runtime:

```cs
public class SimpleHttpModule : IHttpModule 
{ 
  public SimpleHttpModule() { } 

  public String ModuleName 
  { 
    get { return "SimpleHttpModule"; } 
  } 

  public void Init(HttpApplication application) 
  { 
    application.BeginRequest +=  
    (new EventHandler(this.Application_BeginRequest)); 
    application.EndRequest +=  
    (new EventHandler(this.Application_EndRequest)); 
  } 

  private void Application_BeginRequest(Object source,  
  EventArgs e) 
  { 
    HttpApplication application = (HttpApplication)source; 
    HttpContext context = application.Context; 
    context.Response.Write(SomeHtmlString); 
  } 

  private void Application_EndRequest(Object source, EventArgs e) 
  { 
    HttpApplication application =      (HttpApplication)source; 
    HttpContext context = application.Context; 
    context.Response.Write(SomeHtmlString); 
  } 

  public void Dispose() { } 
} 
```

```xml
<configuration> 
  <system.web> 
    <httpModules> 
      <add name=" SimpleHttpModule " type=" SimpleHttpModule "/> 
    </httpModules> 
  </system.web> 
</configuration> 
```

In the ASP.NET pipeline, a request passes through a series of HTTP modules before it hits a handler. A simple HTTP handler routine is given as follows:

```cs
public class SimpleHttpHandler: IHttpHandler 
{

  public void ProcessRequest(System.Web.HttpContext context){ 
    context.Response.Write("The page request ->" +          
    context.Request.RawUrl.ToString()); 
  }

  public bool IsReusable 
  { 
    get{ return true; } 
  } 

} 
```

We can configure the handler as given next. Whenever we create an ASP.NET resource with the .smp extension, the handler will be SimpleHttpHandler:

```xml
<system.web> 
  <httpHandlers> 
    <add verb="*" path="*.smp" type="SimpleHttpHandler"/> 
  </httpHandlers> 
</system.web> 
```

## Where To Apply Chain Of Responsibility Pattern?

- When you have more than one handler for a request
- When you have reasons why a handler should pass a request on to another one in the chain
- When you have a set of handlers that varies dynamically
- When you want to retain flexibility in assigning requests to handlers

> **Note:** You can download the complete solution demo from my [github repository](https://github.com/kudchikarsk/chain-of-responsibility-pattern).

## Further Reading

[ASP.NET Core and the Enterprise Part 3: Middleware](https://odetocode.com/blogs/scott/archive/2016/11/22/asp-net-core-and-the-enterprise-part-3-middleware.aspx) by [K. Scott Allen](https://odetocode.com/about/scott-allen) - In this post, Scott explains how ASP.NET Core is different from tradition ASP.NET. In this post, Scott talks about the replacement for modules and handlers, which is middleware. Middleware is usually chained together and it’s up to them to decide whether to invoke the next one in the chain thus creating a Chain Of Responsibility.

[Implementing a Chain-of-responsibility or "Pipeline" in C#](https://blog.maximerouiller.com/post/implementing-chain-of-responsibility-or/) by [Maxime Rouiller](https://blog.maximerouiller.com/) - In this post, Maxime explains how by chaining [Strategy Pattern](https://codewithshadman.com/strategy-pattern-csharp/), we can increase the amount of flexibility inside our model and increase the reuse of common algorithms.

[Chain of Responsibility as catamorphisms](https://blog.ploeh.dk/2019/07/22/chain-of-responsibility-as-catamorphisms/) by [Mark Seemann](https://blog.ploeh.dk/about/) - In this post, Mark discusses Chain of Responsibility from a different perspective and explains how instead of relying on keywords like if or switch, you can compose the conditional logic from polymorphic objects. This gives you several advantages. One is that you get better separations of concerns, which will tend to make it easier to refactor the code. Another is that it's possible to change the behavior at run time, by moving the objects around.
