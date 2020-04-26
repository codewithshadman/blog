---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: C# Object-Oriented Programming
description: Understanding and using object-oriented coding techniques is the key to building well-crafted C# applications. In this part of the C# tutorial, we will talk about object-oriented programming in C#.
comments: true
permalink: /csharp-object-oriented-programming/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---

Understanding and using object-oriented coding techniques is the key to building well-crafted C# applications. In this part of the C# tutorial, we will talk about object-oriented programming in C#.

C# is an object-oriented programming (OOP) language. OOP includes classes, objects, overloading, encapsulation, data hiding, and inheritance. All OOP languages provide mechanisms that help you implement the object-oriented model. They are encapsulation, inheritance, polymorphism, and reusability.

## Contents

- [OOPS Concepts In C#](#oops-concepts-in-c)
    - [Encapsulation](#encapsulation)
    - [Inheritance](#inheritance)
    - [Polymorphism](#polymorphism)
- [C\# Classes and Types](#c-classes-and-types)
- [C\# Inheritance](#c-inheritance)
- [C\# Abstract Classes](#c-abstract-classes)
- [C\# Interfaces](#c-interfaces)
- [Difference Between Abstract Class And Interface In C#](#difference-between-abstract-class-and-interface-in-c)
- [C\# Nested Classes](#c-nested-classes)
- [C\# Structs](#c-structs)
- [C\# Namespaces](#c-namespaces)


## OOPS Concepts In C#

C# provides full support for object-oriented programming including encapsulation, inheritance, and polymorphism.

### Encapsulation

Objects are a fundamental encapsulation mechanism of object-oriented languages (OOLs).

- objects - encapsulate data together with operations, called methods that process or act upon the data.

OOLs may provide additional encapsulation mechanisms.

- classes - create objects that all have the same members and the same implementation of methods.
- packages - group together classes that work closely with each other.
nested objects and classes - allow objects or classes to access private members of the objects or classes in which they are nested.


### Inheritance

Inheritance describes the ability to create new classes based on an existing class.

There are two types of inheritance in OOLs

- interface inheritance and
- implementation inheritance.

Interface inheritance is only necessary for typed OOLs. This is best understood when considering delegation-based design patterns.

Implementation inheritance mechanisms depend on the type of OOL.

For class-based OOLs, classes inherit from classes.

### Polymorphism

Polymorphism means that you can have multiple classes that can be used interchangeably, even though each class implements the same properties or methods in different ways.

Most non-object-oriented programming languages provide if, if..else and case or switch statement forms as alternation constructions.

In object-oriented languages there is another alternation construction: send a message to a variable. You get different code to execute by assigning a new object to the variable. The different objects that can be assigned to a variable can respond to the message in different ways. This idea is lies at the heart of many design patterns.

The rest of the sections describes how to apply these three core OOP concepts using C#.

## C\# Classes and Types

As we noted [previously](/csharp-variable-types/#c-reference-types), one can create new reference types by defining classes. Classes provide 'templates' from which these direct instances are generated. Where we appeal to the relation between a class and its corresponding reference type instances we shall say that a class specifies the type (also that the class specifies the constitutive elements of the type).

Any type is made up of elements, which we term type members. There are two main kinds of type members that a class can specify. Firstly, a class can specify other types - both value and reference (for the distinction see [C\# Variable Types](/csharp-variable-types/)). This idea, that types can contain other types, is known within the literature on object orientation as 'containment', or else 'aggregation'. Where a type contains another reference type, we shall call it the containing type of the latter.

The second, main kind of type members that a class can specify are [methods](/csharp-methods/), functions designed for reading and manipulating the value and reference types an instance contains.

{% highlight csharp linenos %}

public class Employee
{
    public int age; // a member field that holds age of an employee

    public void UpdateAge(int age) // method that update age based on some criteria
    {
        if (age < 18) 
        {
            throw new ArgumentException(
                "Age cannot be less than 18 years for an employee");
        }

        this.age = age;
    }
}
{% endhighlight %}

{% highlight csharp linenos %}

var employee = new Employee();
employee.age = 80;
employee.UpdateAge(81);
{% endhighlight %}

![A picture illustrating a reference type object](/assets/images/reference_type.png)

## C\# Inheritance

Object oriented languages like C# allow inheritance from reference types. If a type inherits from another, it takes on all of its type members. A type can, however, both add to the members it inherits in this way, as well as 'overwriting' them. To overwrite a type member - a method, say - the defining class specifies a method with the same name as one that it inherits (this is covered in future articles).

C#'s inheritance model is more similar to Java's than to C++'s. In particular, C# classes inherit always from a single base class (if one is not specified in the declaration, inheritance is from System.Object). At the same time, however, C# classes can inherit from any number of interfaces.

{% highlight csharp linenos %}

public class Employee : Person
{
    public int age;
}

public class Person 
{
    public string firstName;
    public string lastName;
}
{% endhighlight %}

{% highlight csharp linenos %}

var employee = new Employee();
employee.firstName = "John";
employee.lastName = "Doe";
employee.age = 80;
{% endhighlight %}

## C\# Abstract Classes

Some classes are not designed to have direct instances. Rather, they are designed simply to be inherited from, by ancestors which may themselves have direct instances (or not). A class is 'abstract' just in case it cannot itself have direct instances.

{% highlight csharp linenos %}

public abstract class Animal
{

}

public class Dog : Animal
{

}
{% endhighlight %}

{% highlight csharp linenos %}

var dog = new Dog(); //No Error
var animal = new Animal(); //Error
{% endhighlight %}

Classes can be abstract because in a class it is possible to specify a class method without specifying its body. Such methods are themselves termed 'abstract'. Where a class contains an abstract method it cannot be instantiated since it is not specified what should happen were the method to be called.

{% highlight csharp linenos %}

public abstract class BasePerson
{
    int age;

    public abstract string FullName(); //abstract method

    public void UpdateAge(int age) //not an abstract method
    {        
        this.age = age;
    }
}

public class Person : BasePerson
{
    public string firstName;
    public string lastName;

    //overriding the above abstract method
    public override string FullName()
    {
        return firstName + " " + lastName;
    }
}
{% endhighlight %}

## C\# Interfaces

An interface is more like a contract that has only abstract methods. An interface is declared with the `interface` keyword. Above we stated that a C# class can only inherit from one base class, but this ignores interfaces. A class can inherit from any number of interfaces.

Also, all the members of the interface must be implemented in a class or struct. C# will give a compile-time error if any one of the members is not defined.

{% highlight csharp linenos %}

public interface IPerson
{
    string FullName(); //abstract method
}

public class Person: IPerson
{
    public string firstName;
    public string lastName;

    //implementing the above abstract method
    public string FullName()
    {
        return firstName + " " + lastName;
    }
}
{% endhighlight %}

## Difference Between Abstract Class And Interface In C\#

ABSTRACT CLASS | INTERFACE
It contains both declaration and definition part. | It contains only a declaration part.
Multiple inheritances are not achieved by an abstract class. | Multiple inheritances are achieved by the interface.
It contains a constructor. | It does not contain a constructor.
It can contain static members. | It does not contain static members.
It can contain different types of access modifiers like public, private, protected, etc. | It only contains public access modifier because everything in the interface is public.
The performance of an abstract class is fast. | The performance of the interface is slow because it requires time to search the actual method in the corresponding class.
It is used to implement the core identity of the class. | It is used to implement the peripheral abilities of the class.
A class can only use one abstract class. | A class can use multiple interfaces.
If many implementations are of the same kind and use common behavior, then it is superior to use an abstract class. | If many implementations only share methods, then it is superior to use Interface.
An abstract class can contain methods, fields, constants, etc. | Interface can only contain methods.
It can be fully, partially or not implemented. | It should be fully implemented.

## C\# Nested Classes
Classes are usually specified independently of each other. But one class can be specified within another's specification. In this case, the latter class is termed a nested class.

{% highlight csharp linenos %}

public class Person
{
    public Info info;

    public class Info //this is a nested class
    {
        public string address;
        public string phoneNumber;
    }
}
{% endhighlight %}

{% highlight csharp linenos %}

var person = new Person();
person.info.address="London";
person.info.address="123456";
{% endhighlight %}

## C\# Structs
A struct is a user-defined value type. It is declared in a very similar way to a class, except that it can't inherit from any class, nor can any class inherit from it (as mentioned previously, however, all value types do inherit from System.object). The following example shows a partial declaration for a 'Coordinate' struct:


{% highlight csharp linenos %}

struct Coordinate
{
    public int x;
    public int y;

    public Coordinate(int x, int y)
    {
        this.x = x;
        this.y = y;
    }
}
{% endhighlight %}


Given the above, one could familiarly initialize a Coordinate type, using code like:

{% highlight csharp linenos %}

Coordinate c = new Coordinate(10, 2);
{% endhighlight %}

Note that if a variable of a struct type is declared without being given an explicit value, eg:

{% highlight csharp linenos %}

Coordinate c2 ;
{% endhighlight %}

it does not equate to 'null' (this being the default value for reference types, rather than value types). Instead, the variable is initialized to a state where its fields have their default values. If these fields are basic value types, they will generally be set to zero. If these fields are reference types, they will be set to 'null'.

Because of this default initialization behavior, it is an error for a struct to be given a parameterless constructor (eg. one like 'public Coordinate()'). Also, where a struct does have a constructor, you should be sure to make assignments to all of the struct's fields within this constructor.

## C\# Namespaces

Namespaces can be thought of as collections of classes; they provide unique identifiers for types by placing them in a hierarchical structure.

To illustrate the use of namespaces: suppose that two different C# developers come up with a class called 'bank', one relating to fiscal institutions and the other relating to riversides. In a programming environment containing both classes, there is a need to distinguish one from the other, and this is achieved by placing them within different namespaces. For example, the former class could be placed within the 'fiscal' namespace, say, becoming fiscal.bank, whereas the latter could be placed within the 'river' namespace becoming river.bank. (Note that C# does not include Java's direct link between the namespace hierarchy and the file structure hierarchy).

Most classes depend upon the existence of other classes - for instance, they may specify contained types. It is possible in the specification always to write each class' full namespace, but these are often too long for it to be worthwhile. To take an example at random, the following is the fully qualified name of a class in the .NET framework relating to a particular type of cryptographic algorithm:

{% highlight csharp linenos %}

System.Security.Cryptography.AsymmetricAlgorithm
{% endhighlight %}

This problem is addressed by the use of the 'using' keyword, placed at the very top of the class specification. For instance, in a class specification including the phrase

{% highlight csharp linenos %}

using System.Security.Cryptography;
{% endhighlight %}

one could write refer to the above class simply using its class name

{% highlight csharp linenos %}

AsymmetricAlgorithm
{% endhighlight %}

Alternatively, one could specify an alias for the namespace, eg

{% highlight csharp linenos %}

using myAlias = System.Security.Cryptography;
{% endhighlight %}

and then refer to the class with

{% highlight csharp linenos %}

myAlias.AsymmetricAlgorithm
{% endhighlight %}

One specifies a namespace for one's classes using the 'namespace' keyword. For instance, the following code states that the class 'Adder' is in the namespace `calc.math`.

{% highlight csharp linenos %}

namespace calc
{
    namespace math
    {
        public class Adder
        {
            // insert code here
        }
    }
}
{% endhighlight %}


Alternatively, and more simply, one write the above as:

{% highlight csharp linenos %}

namespace calc.math
{
    public class Adder
    {
        // insert code here
    }
}
{% endhighlight %}

In the following articles we will learn about C# [Classes](/csharp-class/), [Methods](/csharp-methods/) and [Polymorphism](/csharp-polymorphism/) in more detail.