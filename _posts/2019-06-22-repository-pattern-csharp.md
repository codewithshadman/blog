---
layout: post
current: post
navigation: True
tags: [Csharp Design Patterns]
class: post-template
subclass: 'post design-patterns'
title:  "Repository Pattern C#"
description: "A Repository mediates between the domain and data mapping layers. Repository Pattern in C# supports the objective of achieving a clean separation and one-way dependency between the domain and data mapping layers."
cover: "assets/images/repository-pattern-csharp.jpg"
date: Sun Jun 30 14:00:06 2019
last_modified_at: Sun Nov 24 17:06:50 2019
author: shadman_kudchikar
comments: true
---

## Contents
- [What Is Repository Pattern C\# ?](#what-is-repository-pattern-csharp)
- [Why Repository Pattern C\# ?](#why-repository-pattern-csharp)
- [Entity Framework Repository Pattern C\#](#entity-framework-repository-pattern-csharp)
- [Generic Repository Pattern C\#](#generic-repository-pattern-csharp)
- [Unit Of Work Pattern C\#](#unit-of-work-pattern-csharp)
- [Repository Pattern C\# MVC](#repository-pattern-csharp-mvc)
- [Further Reading](#further-reading)
- [References](#references)

## What Is Repository Pattern C\# ? {#what-is-repository-pattern-csharp}

A Repository in C# mediates between the domain and data mapping layers (like [Entity Framework](https://docs.microsoft.com/en-us/ef/ef6/)). It allows you to pull a record or number of records out of datasets, and then have those records to work on acting like an in-memory domain object collection, and you can also update or delete records within those data set, and the mapping code encapsulated by the Repository will carry out the appropriate operations behind the scenes. 

<!--more-->

Repository pattern C# is a way to implement data access by encapsulating the set of objects persisted in a data store and the operations performed over them, providing a more object-oriented view of the persistence layer. 

Repository pattern C# also supports the objective of achieving a clean separation and one-way dependency between the domain and data mapping layers.

Repository pattern C# is mostly used where we need to modify the data before passing to the next stage. 

here’s an awesome graph that illustrates the idea:

![Repository Pattern Structure Diagram][repository-pattern-image]

## Why Repository Pattern C\# ? {#why-repository-pattern-csharp}

- **Increase testability**: Repository systems are good for testing. One reason being that you can use Dependency Injection. Basically, you create an interface for your repository, and you reference the interface for it when you are making the object. Then you can later make a fake object (using [moq](https://github.com/moq/moq4) for instance) which implements that interface. Using something like [StructureMap](https://structuremap.github.io/) you can then bind the proper type to that interface. Boom you've just taken a dependence out of the equation and replaced it with something testable.

- **Easily swapped out with various data stores without changing the API**: For example, in one instance, you may need to retrieve data from the database, in other cases you may need to retrieve something from a third-party API, or perhaps there’s some other place from which you need to retrieve data. Regardless, the idea behind the repository pattern is that whatever sits behind it doesn’t matter so long as the API it provides works for the layer of the application calling into it.

## Entity Framework Repository Pattern C\# {#entity-framework-repository-pattern-csharp}

Entity Framework (EF) itself implements Unit of work pattern and somewhat loosely implements Repository pattern. With EF you can retrieve a set of records from the database in POCO models. Also, EF keeps track of changes for you within these models and save these changes on single `SaveChanges` method call.

Let's see how to create a repository using EF, let say you have customer entity in your application, then this is how your customer repository interface will look like:

{% highlight csharp linenos %}

public interface ICustomerRepository 
{        
    IEnumerable GetCustomers();        
    Customer GetCustomerByID(int customerId);        
    void InsertCustomer(Customer customer);        
    void DeleteCustomer(int customerId);        
    void UpdateCustomer(Customer customer);        
    void Save();    
}
{% endhighlight %}

And the implementation of the above interface with EF looks like this:

{% highlight csharp linenos %}

public class CustomerRepository:ICustomerRepository    
{        
    private ApplicationContext context;        
 
    public CustomerRepository(ApplicationContext context)        
    {            
        this.context = context;        
    }        
    
    public IEnumerable<Customer> GetCustomers()        
    {            
        return context.Customers.ToList();        
    }        
    public Customer GetCustomerByID(int customerId)        
    {
        return context.Customers.Find(customerId);
    }
    
    public void InsertCustomer(Customer customer)
    {            
        context.Customers.Add(customer);      
    }        
    
    public void DeleteCustomer(int customerId)        
    {            
        Customer customer = context.Customers.Find(customerId);                    
        context.Customers.Remove(customer);        
    }        
    
    public void UpdateCustomer(Customer customer)        
    {            
        context.Entry(customer).State = EntityState.Modified;        
    }        
    
    public void Save()        
    {            
        context.SaveChanges();        
    }
    
}
{% endhighlight %}

Usually, people argue on using repository pattern over EF as it restricts EF uses by returning IEnumnerable instead of IQueryable from the repository. You can learn more about it [here](https://softwareengineering.stackexchange.com/questions/192044/should-repositories-return-iqueryable).

## Generic Repository Pattern C\# {#generic-repository-pattern-csharp}

Creating a repository class for each entity type could result in a lot of repetitive code. Generic repository pattern is a way to minimize this repetition and have single base repository work for all type of data. 

Let's see the interface for the generic repository,

{% highlight csharp linenos %}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

public interface IRepository<TEntity> where TEntity :class
{
    void Delete(TEntity entityToDelete);
    void Delete(object id);
    IEnumerable<TEntity> Get(
        Expression<Func<TEntity, bool>> filter = null, 
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, 
        string includeProperties = "");
    TEntity GetByID(object id);
    IEnumerable<TEntity> GetWithRawSql(string query, 
        params object[] parameters);
    void Insert(TEntity entity);
    void Update(TEntity entityToUpdate);
}
{% endhighlight %}

And the implementation of the above interface with EF looks like this:

{% highlight csharp linenos %}

using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

class BaseRepository<TEntity> : IRepository <TEntity> where TEntity : class
{
    internal ApplicationContext context;
    internal DbSet<TEntity> dbSet;

    public BaseRepository(ApplicationContext context)
    {
        this.context = context;
        this.dbSet = context.Set<TEntity>();
    }

    public virtual IEnumerable<TEntity> GetWithRawSql(string query, 
        params object[] parameters)
    {
        return dbSet.SqlQuery(query, parameters).ToList();
    }

    public virtual IEnumerable<TEntity> Get(
        Expression<Func<TEntity, bool>> filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        string includeProperties = "")
    {
        IQueryable<TEntity> query = dbSet;

        if (filter != null)
        {
            query = query.Where(filter);
        }

        if (includeProperties != null)
        {
            foreach (var includeProperty in includeProperties.Split
            (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }
        }
            

        if (orderBy != null)
        {
            return orderBy(query).ToList();
        }
        else
        {
            return query.ToList();
        }
    }

    public virtual TEntity GetByID(object id)
    {
        return dbSet.Find(id);
    }

    public virtual void Insert(TEntity entity)
    {
        dbSet.Add(entity);
    }

    public virtual void Delete(object id)
    {
        TEntity entityToDelete = dbSet.Find(id);
        Delete(entityToDelete);
    }

    public virtual void Delete(TEntity entityToDelete)
    {
        if (context.Entry(entityToDelete).State == EntityState.Detached)
        {
            dbSet.Attach(entityToDelete);
        }
        dbSet.Remove(entityToDelete);
    }

    public virtual void Update(TEntity entityToUpdate)
    {
        dbSet.Attach(entityToUpdate);
        context.Entry(entityToUpdate).State = EntityState.Modified;
    }
}
{% endhighlight %}

The above generic repository defines core operations. You can extend this class and interface base on business requirement and can inherit in your custom repository.

## Unit Of Work Pattern C\# {#unit-of-work-pattern-csharp}

Use of separate repository for a single transaction could result in partial updates. For example, suppose you have to update two different entity types as part of the same transaction. If each uses a separate database context instance, one might succeed and the other might fail, and one way to ensure that all repositories use the same database context (and thus coordinate all updates) is to use a unit of work class.

Unit of work pattern is easy to implement with the use of a generic repository. Let's see an example,

{% highlight csharp linenos %}

using System;
using System.Collections.Generic;

public interface IUnitOfWork
{
    IRepository<Customer> Customers { get; }
    IRepository<Order> Orders { get; }
    void Commit();
}
{% endhighlight %}

Below is the code of how the implementation of above `IUnitOfWork` will look like,

{% highlight csharp linenos %}

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class UnitOfWork : IUnitOfWork
{

    private ApplicationContext _dbContext;
    private BaseRepository<Customer> _customers;
    private BaseRepository<Order> _orders;

    public UnitOfWork(ApplicationContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IRepository<Customer> Customers
    {
        get
        {
            return _customers ?? 
                (_customers=new BaseRepository<Customer>(_dbContext));
        }
    }

    public IRepository<Order> Orders
    {
        get
        {
            return _orders ?? 
                (_orders=new BaseRepository<Order>(_dbContext));
        }
    }

    public void Commit()
    {
        _dbContext.SaveChanges();
    }
}
{% endhighlight %}

Unit of Work is the concept related to the effective implementation of the repository pattern, whether its non-generic repository pattern or generic repository pattern. 

Unit of Work is referred to as a single transaction that involves multiple operations of insert/update/delete and so on. You can learn more about Unit of Work from this awesome [post](https://www.c-sharpcorner.com/UploadFile/b1df45/unit-of-work-in-repository-pattern/).

## Repository Pattern C\# MVC {#repository-pattern-csharp-mvc}

Let's see now how our controller code will look like after using repository pattern along with unit of work:

{% highlight csharp linenos %}

public class CustomerController : Controller
{
  private UnitOfWork unitOfWork = new UnitOfWork();

  // GET: /Customer/
  public ViewResult Index()
  {
     var Customers = unitOfWork.CustomerRepository.Get();
     return View(Customers.ToList());
  }

  // GET: /Customer/Details/5
  public ViewResult Details(int id)
  {
     Customer Customer = unitOfWork.CustomerRepository.GetByID(id);
     return View(Customer);
  }

  // GET: /Customer/Create
  public ActionResult Create()
  {
     return View();
  }

  [HttpPost]
  [ValidateAntiForgeryToken]
  public ActionResult Create(Customer Customer)
  {
     try
     {
        if (ModelState.IsValid)
        {
           unitOfWork.CustomerRepository.Insert(Customer);
           unitOfWork.Save();
           return RedirectToAction("Index");
        }
     }
     catch (DataException)
     {
        ModelState.AddModelError("", "Unable to save changes.");
     }
     return View(Customer);
  }

  public ActionResult Edit(int id)
  {
     Customer Customer = unitOfWork.CustomerRepository.GetByID(id);     
     return View(Customer);
  }

  [HttpPost]
  [ValidateAntiForgeryToken]
  public ActionResult Edit(       
     Customer Customer)
  {
     try
     {
        if (ModelState.IsValid)
        {
           unitOfWork.CustomerRepository.Update(Customer);
           unitOfWork.Save();
           return RedirectToAction("Index");
        }
     }
     catch (DataException)
     {
        ModelState.AddModelError("", "Unable to save changes.");
     }
     return View(Customer);
  }

  // GET: /Customer/Delete/5
  public ActionResult Delete(int id)
  {
     Customer Customer = unitOfWork.CustomerRepository.GetByID(id);
     return View(Customer);
  }

  // POST: /Customer/Delete/5
  [HttpPost, ActionName("Delete")]
  [ValidateAntiForgeryToken]
  public ActionResult DeleteConfirmed(int id)
  {
     Customer Customer = unitOfWork.CustomerRepository.GetByID(id);
     unitOfWork.CustomerRepository.Delete(id);
     unitOfWork.Save();
     return RedirectToAction("Index");
  }

  protected override void Dispose(bool disposing)
  {
     unitOfWork.Dispose();
     base.Dispose(disposing);
  }
}
{% endhighlight %}
In the above code we directly initialized unitOfWork variable. Like this,

{% highlight csharp linenos %}

private UnitOfWork unitOfWork = new UnitOfWork();
{% endhighlight %}
However to truly use the power of repository pattern and make the above controller testable we need to use `IUnitOfWork` instead of `UnitOfWork` for our `unitOfWork` variable data type, and also we have to initialize it using Dependency Injection (DI) technique.

Assuming you’re starting with a new ASP.NET MVC 5 application, the easiest way to get StructureMap is using Nuget package StructureMap.MVC5.

After installing StructureMap, from solution explorer we can notice that Dependency Resolution folder has been added, also StructuremapMVC.cs file in App_Start folder.

The important file which is needed is the DefaultRegistry.cs. In Default Registry class, we are going configure StructureMap container. Let's see how:

{% highlight csharp linenos %}

public class DefaultRegistry : Registry 
{
    #region Constructors and Destructors

    public DefaultRegistry() 
    {
        Scan(
            scan => {
                scan.TheCallingAssembly();
                scan.WithDefaultConventions();

                //This line of code is just directions telling StructureMap 
                //where to look for DAL models.  
                //Typically, my DAL code lives in different class library
                scan.AssemblyContainingType<ApplicationDbContext>();

                //To connect implementations to our open generic type of IRepository, 
                //we use the ConnectImplementationsToTypesClosing method.  
                scan.ConnectImplementationsToTypesClosing(typeof(IRepository<>));
            });
        //For<IExample>().Use<Example>();

        //Here we resolve object instances of our DbContext and IRepository
        For<DbContext>().Use(ctx => new ApplicationDbContext());
        For(typeof(IRepository<>)).Use(typeof(BaseRepository<>));
    }

    #endregion
}
{% endhighlight %}

After configuring DefaultRegistry replace your CustomerController unitOfWork initialization code with the below code:
{% highlight csharp linenos %}

public class CustomerController : Controller
{
  private readonly IUnitOfWork unitOfWork;

  public CustomerController (IUnitOfWork unitOfWork)
  {
      this.unitOfWork = unitOfWork;
  }

}
{% endhighlight %} 

You can now start writing your unit tests for your controller classes from this base. Learn more about unit testing and how to use Moq library for mocking from this great [article](https://techbrij.com/unit-testing-asp-net-mvc-controller-service).

## Further Reading {#further-reading}
- [4 Common Mistakes with the Repository Pattern](https://programmingwithmosh.com/net/common-mistakes-with-the-repository-pattern/) by [Mosh Hamedani](https://programmingwithmosh.com/about/) - People tend to make some common mistakes while creating a repository in C#. For example, repositories that return view models/DTOs. In this article you can learn more about this kind of mistakes and why you should avoid them.

- [Creating a Repository Pattern without an ORM](https://www.danylkoweb.com/Blog/creating-a-repository-pattern-without-an-orm-A9) by [Jonathan Danylko](https://www.danylkoweb.com/About) - If you don't feel like using an ORM, like Entity Framework, you can build your own data layer. In this post, Jonathan talk about a different way to pull data from a database using a strategy pattern.

- [Introducing the CachedRepository Pattern](https://ardalis.com/introducing-the-cachedrepository-pattern) by [Steve Smith](https://ardalis.com/) - In this first part of a series on adding support for caching to the Repository Pattern, Steve show how to very simply control whether or not caching is performed on a per-repository basis through the use of an Inversion of Control Container.

## References {#references}
- [https://docs.microsoft.com/en-us/ef/ef6/](https://docs.microsoft.com/en-us/ef/ef6/)
- [https://softwareengineering.stackexchange.com/questions/192044/should-repositories-return-iqueryable](https://softwareengineering.stackexchange.com/questions/192044/should-repositories-return-iqueryable)
- [https://stackoverflow.com/questions/33755499/entity-framework-repository-pattern-why-not-return-iqueryable](https://stackoverflow.com/questions/33755499/entity-framework-repository-pattern-why-not-return-iqueryable)
- [https://programmingwithmosh.com/net/common-mistakes-with-the-repository-pattern/](https://programmingwithmosh.com/net/common-mistakes-with-the-repository-pattern/)
- [https://blogs.msdn.microsoft.com/diego/2010/10/05/self-tracking-entities-applychanges-and-duplicate-entities/](https://blogs.msdn.microsoft.com/diego/2010/10/05/self-tracking-entities-applychanges-and-duplicate-entities/)
- [https://stackoverflow.com/questions/10430880/managing-connections-with-generic-repository-pattern](https://stackoverflow.com/questions/10430880/managing-connections-with-generic-repository-pattern)
- [https://stackoverflow.com/questions/2025712/extract-sql-query-from-linq-expressions](https://stackoverflow.com/questions/2025712/extract-sql-query-from-linq-expressions)
- [https://6figuredev.com/podcast/episode-029-generic-repository-repository-pattern/](https://6figuredev.com/podcast/episode-029-generic-repository-repository-pattern/)
- [https://www.danylkoweb.com/Blog/creating-a-repository-pattern-without-an-orm-A9](https://www.danylkoweb.com/Blog/creating-a-repository-pattern-without-an-orm-A9)
- [https://www.danylkoweb.com/Blog/enhancing-the-ado-repository-with-crud-functionality-CD](https://www.danylkoweb.com/Blog/enhancing-the-ado-repository-with-crud-functionality-CD)
- [https://ardalis.com/resolving-dependencies-in-asp-net-mvc-5-with-structuremap](https://ardalis.com/resolving-dependencies-in-asp-net-mvc-5-with-structuremap)

[post-image]: /assets/images/repository-pattern-csharp.jpg "Repository Pattern C#"
[repository-pattern-image]: /assets/images/repository-pattern-csharp_structure.png "Repository Pattern Structure Diagram"
