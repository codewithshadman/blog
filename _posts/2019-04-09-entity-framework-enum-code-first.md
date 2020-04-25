---
layout: post
current: post
navigation: True
tags: [Entity Framework]
class: post-template
subclass: 'post entity-framework'
title:  "Entity Framework Enum Code First Lookup Table"
description: "Learn how to create lookup tables using enums in entity framework with Code-first approach."
cover: "assets/images/entity-framework-enum-lookup-table.jpg"
date: 2019-04-09 00:00:00
last_modified_at: Sat Jun 22 12:34:24 2019
categories: [Entity Framework, ASP.NET MVC]
author: shadman_kudchikar
comments: true
---


In this tutorial you will learn how to create lookup tables using enums in entity framework (EF) with Code-first approach.

With EF support for enums, you can include lookup tables in the code in form of enums and also have them in the database for integrity.

## Contents

This tutorial provides the information you need about:

* [What Is Enum In C# ?](#what-is-enum-in-c)
* [Creating Enum](#creating-enum)
* [Creating Lookup Table Class Using Code-First Approch](#creating-lookup-table-class-using-code-first-approch)
* [Define Foreign Key Constraint Using Code-First Conventions](#define-foreign-key-constraint-using-code-first-conventions)
* [Disable Identity for Lookup Table IDs](#disable-identity-for-lookup-table-ids)
* [Seeding Enum into Lookup Table](#seeding-enum-into-lookup-table)
* [References](#references)

## What Is Enum In C\# ? {#what-is-enum-in-c}

Enum or Enumerations is used to declare a list of named integer constants.  The enum is used to give a name to each constant so that the constant integer can be referred using its name.

Enumerations appear in your source code. These are things that affect program logic because you're going to have conditional statements based on the state of some entity comparing it with some enum value. This enums represents numerical values which can get used in place of IDs in database tables.

<!--more-->

## Creating Enum {#creating-enum}

C# usually manages the IDs of enumeration for you.

As you version your code from one version to the next you want to make sure that those IDs remain consistent. To keep it consistent we assing values to each enum. Below is the code for StatusEnum we will be working on.

```csharp
public enum StatusEnum
{
    FullTime = 0,
    PartTime = 1,
    Casual = 2,
    Contract = 3
}
```

## Creating Lookup Table Class Using Code-First Approch {#creating-lookup-table-class-using-code-first-approch}

We will create another class named Status to represent our above enum as lookup table. Status class will act as a lookup table for our above StatusEnum. Here we use StatusEnum as datatype for our IDs to constrain the Status ID to just those values in the StatusEnum.

```csharp
public class Status
{
    public StatusEnum Id { get; set; }
    public string Name { get; set; }
}
```

## Define Foreign Key Constraint Using Code-First Conventions {#define-foreign-key-constraint-using-code-first-conventions}

Below is the Employee class that represent our Employee Table. Below code will create the Foreign Key relationship inside a Employee, and constrain the Status ID to just those values in the StatusEnum.

```csharp
public class Employee
{
    public long Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }

    //Below code will create the Foreign Key relationship inside a Employee, and 
    //constrain the Status ID to just those values in the StatusEnum
    //Here StatusEnum will act as ID/Primary key for Status table 
    //and will be seeded manually 
    //Look context class for additional model builder configuration which disables 
    //the identity for Status table and
    //Also look seed method in configuration.cs file
    public StatusEnum StatusId { get; set; }
    public virtual Status Status { get; set; }
    

}
```

## Disable Identity for Lookup Table IDs {#disable-identity-for-lookup-table-ids}

When you're backing enum with the database you want to control those IDs. We can disable the identity on our lookup Status table by confuguring the modelBuilder. By disabling the identity we will have control over the IDs we want to poplulate, which will be the enum values in our case.

```csharp
public class ApplicationContext:DbContext
{
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Status> Statuses { get; set; }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Status>()
            .Property(s => s.Id)
            .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);
    }
}
```

## Seeding Enum into Lookup Table {#seeding-enum-into-lookup-table}

In order to insert the enumeration values into the database we're going to take advantage of the seed method. This is a method on the configuration class that was created whenever we enabled migrations for the first time. Let's jump to the code, and see how we can create seed data for an enumeration.

```csharp
internal sealed class Configuration : DbMigrationsConfiguration<ApplicationContext>
{
    public Configuration()
    {
        AutomaticMigrationsEnabled = false;
    }

    protected override void Seed(MigrationTutorial.Models.ApplicationContext context)
    {
        //  This method will be called after migrating to the latest version.

        //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
        //  to avoid creating duplicate seed data.

        context.Statuses.AddOrUpdate( 
            x=> x.Id,
            Enum.GetValues(typeof(StatusEnum))
                .OfType<StatusEnum>()
                .Select(x => new Status() { Id = x, Name=x.ToString() })
                .ToArray());
    }
}
```

By using the above method for seeding we can eliminate mistakes and error occur in populating enums in our lookup table.

## References {#references}

- [https://www.tutorialsteacher.com/csharp/csharp-enum](https://www.tutorialsteacher.com/csharp/csharp-enum)
- [https://docs.microsoft.com/en-us/ef/ef6/modeling/code-first/data-types/enums](https://docs.microsoft.com/en-us/ef/ef6/modeling/code-first/data-types/enums)
- [https://www.entityframeworktutorial.net/code-first/code-first-conventions.aspx](https://www.entityframeworktutorial.net/code-first/code-first-conventions.aspx)

[post-image]: /assets/images/entity-framework-enum-lookup-table.jpg "Entity Framework Enum Lookup Table"
