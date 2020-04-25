---
layout: post
current: post
navigation: True
tags: [Csharp Intermediate]
class: post-template
subclass: 'post csharp-intermediate'
title: Type Comparison In C#
description: In this post, we will discuss different types of comparison methods, such as equality operators, object.equals method and IEquatable interface, used for comparing values in C#.
cover: "assets/images/type-comparison-in-csharp.jpg"
date: Sat Dec  7 18:47:36 2019
last_modified_at: Sat Dec  7 20:04:03 2019
author: shadman_kudchikar
comments: true
---

C# has a lot of operators and several of them are used to compare values. This is a very common task when programming - to check how two or more values relate to each other. 

In this post, we will discuss different types of comparison methods, such as equality operators, object.equals method and IEquatable interface, used for comparing values in C#. You probably already know some of these concepts, but have a look anyway and see if you learn something new!

## Contents

- [C\# Identity Equality](#c-identity-equality)
- [C\# Value Equality](#c-value-equality)
- [C\# Override Equals](#c-override-equals)
- [C\# IEquatable](#c-iequatable)
    - [IEquatable C# Example](#iequatable-c-example)
- [C\# GetHashCode](#c-gethashcode)
- [C\# Equality Operators](#c-equality-operators)

Here is a bit of a quiz: What does this program print?

```cs
using System;
using System.Collections.Generic;

class Person
{
    public string Name { get; set; }
}

class Example
{
    static void Main()
    {
        var people = new List<Person> { 
            new Person { Name = "George Washington" } };

        Console.WriteLine(
            people.Contains(
                new Person { Name = "George Washington" }));
    }
}
```

If you said `true` then, unfortunately, you would be incorrect – this program prints `false`. Before I explain why this program prints `false` I would like to make one slight change to this program to make it print `true`.

```cs
using System;
using System.Collections.Generic;

struct Person
{
    public string Name { get; set; }
}

class Example
{
    static void Main()
    {
        var people = new List<Person> { 
            new Person { Name = "George Washington" } };

        Console.WriteLine(
            people.Contains(
                new Person { Name = "George Washington" }));
    }
}
```

Did you spot it?

If you look carefully you will notice that I changed the Person type to be a struct instead of a class. Why would this make a difference? To understand let’s take a brief tour of how C# (and the CLR) handle equality.

Whenever you create a type without overriding the Equals method or implementing the `IEquatable<T>` interface you relinquish control over how two instances of your type will be compared and accept the CLR’s default comparison mechanisms. If your type is a reference type (a class) you will get identity equality and if your type is a value type (a struct) you will get value equality.

## C\# Identity Equality

Reference types are called reference types because the object itself is stored on the managed heap and you access that object via a reference to that object.

When you compare two instances of a reference type (like the Person type in my first example) the CLR will compare the references to the objects to see if the references point to the same object. Two reference types will only be equal if their reference points to the same object on the managed heap. If the references are different then objects are not equal – even if their fields are identical.

Identity equality asks this question:

Do these two references point to the same object on the managed heap?

## C\# Value Equality

Value equality is a different process but is much simpler to understand. Value equality takes all instance fields of a value type and compares them to the instance fields of a second instance in respective order. I would imagine that value equality works much the way most developers expect all equality checks ought to.

Value equality asks this question:

For each field in these two instances, are all the values equal?

So does this mean that to have value equality we must use value types? Of course not! Let's the proper way to implement value equality semantics with reference types by overriding the Object.Equals method.

## C\# Override Equals

Every time you use the binary equality operator (==) or the Equals method on a reference type you are invoking Object.Equals for the instances in question. If you wish to provide value equality the most obvious thing to do would be to override System.Object.Equals and use this method to compare the fields of your two instances. Let us begin by revisiting our Person type which I have refactored to make these examples a bit more interesting:

```cs
class Person
{
    public string Name { get; set; }
    public DateTime Birthday { get; set; }
}
```

We have a class with two properties – let’s override the Equals method:

```cs
class Person
{
    public string Name { get; set; }
    public DateTime Birthday { get; set; }

    public override bool Equals(object obj)
    {
        Person other = (Person)obj;
        return this.Name == other.Name
            && this.Birthday == other.Birthday;
    }
}
```

Now we have value equality for our reference type. While this is a simple solution, it is not ideal for the following reasons:

This approach is not type-safe. Since the Equals method accepts an argument of type Object we cannot guarantee that the instance that was passed to this method is a Person.

```cs
somePerson.equals("hello, world");  // throws an InvalidCastException
```

This approach is not "null safe". Any comparisons with null will throw a NullReferenceException.

```cs
somePerson.equals(null); // throws a NullReferenceException
```

The null safety issue is easy enough to fix:

```cs
class Person
{
    ...
    ...

    public override bool Equals(object obj)
    {
        if (obj == null)
            return false;

        Person other = (Person)obj;
        return this.Name == other.Name
            && this.Birthday == other.Birthday;
    }
}
```

But how do we preserve type safety? Meet the IEquatable<T> interface.

## C\# IEquatable<T>

This interface was designed specifically to help us tackle the type safety issue that we are facing. It declares a single member:

```cs
public interface IEquatable<T>
{
    bool Equals(T other);
}
```

As you can see, this interface gives us the ability to create a strongly-typed override of our existing Equals method. Implement the interface like this:

### IEquatable C# Example

```cs
class Person : IEquatable<Person>
{
    public string Name { get; set; }
    public DateTime Birthday { get; set; }

    public override bool Equals(object obj)
    {
        return this.Equals(obj as Person);
    }
    public bool Equals(Person other)
    {
        if (other == null)
            return false;

        return this.Name == other.Name
            && this.Birthday == other.Birthday;
    }
}
```

Now that we have a strongly-typed Equals method any equality comparisons that are done on two instances of our type will be type-safe and null-safe. Using the `as` cast in the default overridden implementation of Equals allows us to pass either an instance of Person or null and our implementation of `IEquatable<T>.Equals` returns false which ensure that our methods won’t fail for null. For more information on the `as` operator, see my blog post [Is And As Operators In C#](/is-and-as-in-csharp/).

## C\# GetHashCode

GetHashCode method is an essential part of identity equality checks. A hash code is an integral value that represents the state of the current instance. 

Basically, if two instances have the same hash code, they may be equal in terms of value. But if two objects do not have the same hash code they are most certainly not equal in terms of value. 

This method allows our calling code a performance boost by not having to call Equals if the hash codes do not match.

As for the proper or best way to generate a hash code for an object instance, that is a discussion for another day. For now, I will add a simple GetHashCode implementation to our example to complete the exercise.

```cs
class Person : IEquatable<Person>
{
    public string Name { get; set; }
    public DateTime Birthday { get; set; }

    public override bool Equals(object obj)
    {
        return this.Equals(obj as Person);
    }
    public bool Equals(Person other)
    {
        if (other == null)
            return false;

        return this.Name == other.Name
            && this.Birthday == other.Birthday;
    }
    public override int GetHashCode()
    {
        int hash = 23;
        hash = hash * 37 + this.Name.GetHashCode();
        hash = hash * 37 + this.Birthday.GetHashCode();
        return hash;
    }
}
```

All we are doing here is taking two coprime numbers (23 and 37) and using them to manipulate the hash codes of our instance’s state to arrive at a final integral value. 

Again, how the implementation works is not important at this point, what is important is that we are providing some implementation so that we can reap the performance benefits that GetHashCode can provide.

Now we have a class that properly provides value equality semantics. I hope I have shown not only how to implement this pattern in your code but also why it is important and necessary in the first place.

## C\# Equality Operators ( `==` and `!=` ) {#c-equality-operators}

The `==` (equality) and `!=` (inequality) operators check if their operands are equal or not. A user-defined type can overload the `==` and `!=` operators. If a type overloads one of the two operators, it must also overload another one.

Here is a complete example that includes those operator overloads:

```cs
class Person : IEquatable<Person>
{
    public string Name { get; set; }
    public DateTime Birthday { get; set; }

    public override bool Equals(object obj)
    {
        return this.Equals(obj as Person);
    }
    public bool Equals(Person other)
    {
        if (other == null)
            return false;

        return this.Name == other.Name
            && this.Birthday == other.Birthday;
    }
    public override int GetHashCode()
    {
        int hash = 23;
        hash = hash * 37 + this.Name.GetHashCode();
        hash = hash * 37 + this.Birthday.GetHashCode();
        return hash;
    }
    public static bool operator ==(Person left, Person right)
    {
         // If the object's have the same reference then they are most
         // certainly equal - return true here.
        if (Object.ReferenceEquals(left, right))
            return true;

        // Check for null here as well - make sure you cast the references
        // to Object so that you don't accidentally invoke this same operator
        // again.  Casting to Object allows you to invoke Object's == operator.
        if ((object)left == null || (object)right == null)
            return false;

        return left.Equals(right);
    }

    public static bool operator !=(Person left, Person right)
    {
        return !(left == right);
    }
}
```