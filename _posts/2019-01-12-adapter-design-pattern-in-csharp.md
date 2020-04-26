---
layout: post
current: post
navigation: True
tags: [Csharp Design Patterns]
class: post-template
subclass: 'post design-patterns'
title:  "Adapter Design Pattern In C#"
description: "The Adapter design pattern is one of the most common, and most useful patterns available to us. This post explains the Adapter design pattern in C# language."
cover: "assets/images/adapter-design-pattern.jpg"
date: Sat Jan  12 12:45:49 2019
last_modified_at: Sat Oct 26 18:48:54 2019
author: shadman_kudchikar
comments: true
---


## Contents

* [What is Adapter Design Pattern?](#what-is-adapter-design-pattern)
* [Adapter Pattern Structure](#adapter-pattern-structure)
* [Adpater Pattern Real World Example](#adpater-pattern-real-world-example)
* [Where To Apply Adapter Pattern?](#where-to-apply-adapter-pattern)
* [Further Reading](#further-reading)

## What is Adapter Design Pattern? {#what-is-adapter-design-pattern}
The **Adapter Pattern** is a software design pattern that attempts to reconcile the differences between two otherwise-incompatible interfaces. This pattern is especially useful when attempting to adapt to an interface that cannot be refactored.

<!--more-->

When you have a class that needs to utilize a particular interface, and you have a library that includes the functionality you need, but it doesn't use the interface that you require. You can achieve the reuse of that library's code by creating an **Adapter class**. This adapter class sits between your client code, and the code that's in this library, and adapts one interface to the other. The **Adapter design pattern** is one of the most common, and most useful patterns available to us as software developers.

## Adapter Pattern Structure {#adapter-pattern-structure}

![Adapter Design Pattern Structure][adapter-pattern-structure]

Let's look at the structure of the **Adapter Pattern** using this UML diagram. The two basic players within this example are the Client, and the Adaptee, shown above. 

Now,

The Client needs some of the logic that exists within the Adaptee. Specifically, there is this AdaptedOperation that has the code that the Client wants to be able to utilize. Unfortunately, the Client has been written in such a way that it cannot directly call this AdaptedOperation because its interface is not the one that the client expects. This is where the **Adapter Pattern** comes into play. 

First, 

The **Adapter interface** is created, exposing an operation that has the interface the client expects. 

Next,

For each different implementation required, at a minimum, one, its different ConcreteAdapter is created that takes that Operation and implements it, such that that code calls the AdaptedOperation. In this way, the Client will now be able to call the Operation on the ConcreteAdapter, which in turn will call the AdaptedOperation on the Adaptee. 

The Client really wants to use the Adaptee directly, but unfortunately, it can't due to the incompatible interface. The **Adapter Pattern** is simply allowing us to achieve this despite this incompatibility.

## Adpater Pattern Real World Example {#adpater-pattern-real-world-example}

Let's see the implementation of **Adapter pattern in C#**, with IDbDataAdapter example,

IDbDataAdapter is one of the .Net built-in interfaces under ```System.Data``` namespace.

The IDbDataAdapter interface inherits from the IDataAdapter interface and allows an object to create a DataAdapter designed for use with a relational database.

Now, In the below code, I created a `DataRenderer` class that takes `IDbDataAdapter` as a parameter and renders data that comes from data adapters in the form of data Tables.

{% highlight csharp linenos %}

public class DataRenderer
{
    private readonly IDbDataAdapter _dataAdapter;

    public DataRenderer(IDbDataAdapter dataAdapter)
    {
        _dataAdapter = dataAdapter;
    }

    public void Render(TextWriter writer)
    {
        writer.WriteLine("Rendering Data:");
        var myDataSet = new DataSet();

        _dataAdapter.Fill(myDataSet);

        foreach (DataTable table in myDataSet.Tables)
        {
            foreach (DataColumn column in table.Columns)
            {
                writer.Write(column.ColumnName.PadRight(20) + " ");
            }
            writer.WriteLine();
            foreach (DataRow row in table.Rows)
            {
                for (int i = 0; i < table.Columns.Count; i++)
                {
                    writer.Write(row[i].ToString().PadRight(20) + " ");
                }
                writer.WriteLine();
            }
        }
    }
}
{% endhighlight %}

Now consider,

If we want to render the below `persons` list using the above `DataRenderer` class, in the same format without tweaking its code. 

{% highlight csharp linenos %}

public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

static void Main(string[] args)
{
    List<Person> persons = new List<Person>() {
        new Person(){ Name ="Foo", Age = 25} ,
        new Person(){ Name ="Bar", Age = 25}
    };
   
    Console.ReadLine();
}
{% endhighlight %}

But, `DataRenderer` accepts an `IDbDataAdapter` and thus it is incompatible with `persons` datatype. However, one thing we can do is that we can create another renderer that accepts the `persons` list. 

What if,

We could convert this `List<Person> persons` into the format that is compatible with `DataRenderer` class then we don't have to write the same repeatable code for rendering data. Let's see how

{% highlight csharp linenos %}

class PersonCollectionDbAdapter : IDbDataAdapter
{
    private readonly IEnumerable<Person> _persons;

    public PersonCollectionDbAdapter(IEnumerable<Person> persons)
    {
        _persons = persons;
    }

    public int Fill(DataSet dataSet)
    {
        var myDataTable = new DataTable();
        myDataTable.Columns.Add(new DataColumn("Name", typeof(string)));
        myDataTable.Columns.Add(new DataColumn("Description", typeof(int)));

        foreach (var person in _persons)
        {
            var myRow = myDataTable.NewRow();
            myRow[0] = person.Name;
            myRow[1] = person.Age;
            myDataTable.Rows.Add(myRow);
        }
        dataSet.Tables.Add(myDataTable);
        dataSet.AcceptChanges();

        return myDataTable.Rows.Count;
    }

    //Below methods are not implemented because they are useless in our scenario

    public DataTable[] FillSchema(DataSet dataSet, SchemaType schemaType)
    {
        throw new NotImplementedException();
    }

    public IDataParameter[] GetFillParameters()
    {
        throw new NotImplementedException();
    }

    public int Update(DataSet dataSet)
    {
        throw new NotImplementedException();
    }

    public MissingMappingAction MissingMappingAction
    {
        get { throw new NotImplementedException(); }
        set { throw new NotImplementedException(); }
    }

    public MissingSchemaAction MissingSchemaAction
    {
        get { throw new NotImplementedException(); }
        set { throw new NotImplementedException(); }
    }

    public ITableMappingCollection TableMappings
    {
        get { throw new NotImplementedException(); }
    }

    public IDbCommand SelectCommand
    {
        get { throw new NotImplementedException(); }
        set { throw new NotImplementedException(); }
    }

    public IDbCommand InsertCommand
    {
        get { throw new NotImplementedException(); }
        set { throw new NotImplementedException(); }
    }

    public IDbCommand UpdateCommand
    {
        get { throw new NotImplementedException(); }
        set { throw new NotImplementedException(); }
    }

    public IDbCommand DeleteCommand
    {
        get { throw new NotImplementedException(); }
        set { throw new NotImplementedException(); }
    }
}
{% endhighlight %}

After creating DbAdapter for our `persons` list we can render our list using the existing `DataRenderer` class. Let's see how

{% highlight csharp linenos %}

static void Main(string[] args)
{
    List<Person> persons = new List<Person>() {
        new Person(){ Name ="Foo", Age = 25} ,
        new Person(){ Name ="Bar", Age = 25}
    };

    var renderer = new DataRenderer(new PersonCollectionDbAdapter(persons));
    renderer.Render(Console.Out);
    Console.ReadLine();
}
/* 
Output:
Rendering Data:
Name                 Description
Foo                  25
Bar                  25
*/
{% endhighlight %}

Now from the above code, we can conclude that the `List<Person>` is an Adaptee, `DataRenderer` is a Client that depends on `IDbDataAdapter` our Adapter and `PersonCollectionDbAdapter` is our Concrete Adapter.

Thus, by working through an adapter, our client could reuse the existing object that provides the needed functionality.

If you yourself are writing a library or a framework, and you want to ensure that it's useable by future classes that may not even have been written yet, and so you cannot be certain what their interface will be, you can add support for an **Adapter** as part of your interface for your code, and this will make it easier for other future applications to use your code.

This idea is used within the. NET Framework Library itself, you will find if you look at ADO.NET in the `System.Data` namespace using a tool such as Reflector, that IDbDataAdapter has several derived types, including a concrete class called DbDataAdapter, also you'll find the OdbcDataAdapter, OleDbDataAdapter, OracleDataAdapter, and SqlDataAdapter. Each of these implements at its core the IDbDataAdapter interface.

## Where To Apply Adapter Pattern? {#where-to-apply-adapter-pattern}

- You should consider using the **Adapter Pattern** whenever you want to use an existing class's functionality, but its interface is not the one that you require. 

- Another scenario, if you're trying to create reusable code, and you don't want to tie it too tightly to a particular implementation, you should use some kind of an **Adapter interface** as what you're code depends on, so that future clients could implement their own version of that **Adapter** and still make use of your code. 

- You should remember the Open/Closed Principle, which states that modules should be open to extension but closed to modification, and by utilizing the **Adapter Pattern** in your implementations of your code, you allow for your code to better follow the Open/Closed Principle.

> **Note:** You can download the complete solution demo from my [github repository](https://github.com/kudchikarsk/adapter-design-pattern-in-csharp).

## Further Reading
-  [A simple example of the Open/Closed Principle](http://joelabrahamsson.com/a-simple-example-of-the-openclosed-principle/) by [Joel Abrahamsson](http://joelabrahamsson.com/about-joel/) - The Open/Closed principle says that we should strive to write code that doesn’t have to be changed every time the requirements change. Here's a simple example by Joel.

- [Populating a DataSet from a DataAdapter - Microsoft Docs][data-adapter] - The ADO.NET DataSet is a memory-resident representation of data that provides a consistent relational programming model independent of the data source. The DataSet represents a complete set of data that includes tables, constraints, and relationships among the tables. Interaction with existing data sources is controlled through the DataAdapter.

[data-adapter]: https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/populating-a-dataset-from-a-dataadapter?view=netframework-4.8
[post-image]: /assets/images/adapter-design-pattern.jpg "Adapter Design Pattern In C#"
[adapter-pattern-structure]: /assets/images/adapter-pattern-structure.jpg "Adapter Design Pattern Structure"
