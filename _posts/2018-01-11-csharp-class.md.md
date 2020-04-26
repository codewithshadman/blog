---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: C# Class
description:  In this article, we will learn the very basic fundamental of OOPS programming that is classes and objects. Classes are a blueprint for creating individual objects that contain the general characteristics of a defined object type.
comments: true
permalink: /csharp-class/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---

Classes are a blueprint for creating individual objects that contain the general characteristics of a defined object type.

Class declarations can have up to four different parts, surrounding the `class` keyword:

- attributes 
- class-modifiers 
- class 
- class-base 
- class-body

The class-body element specifies type members. The following is an example of a very simple class declaration, the class body being the lines following line 1:

{% highlight csharp linenos %}

public class Shape
{
    // class-body:
    // field, constructor, and 
    // method declarations 
}
{% endhighlight %}


We will now consider the other parts of a class declaration.

## Contents
- [C\# Class Attributes](#c-class-attributes)
- [C\# Class Modifiers](#c-class-modifiers)
    - [public](#public)
    - [internal](#internal)
    - [protected](#protected)
    - [protected internal](#protected-internal)
    - [private](#private)
    - [new](#new)
    - [abstract](#abstract)
    - [sealed](#sealed)
- [C\# Base Class](#c-base-class)
- [C\# Constructors](#c-constructors)
    - [Adding A Constructor To Your Type](#adding-a-constructor-to-your-type)
    - [Chaining Constructors](#chaining-constructors)



## C\# Class Attributes

Attributes can add metadata information to your assemblies. An attribute is actually an object that is associated with any of these elements: Assembly, Class, Method, Delegate, Enum, Event, Field, Interface, Property and Struct. 

They can be used to associate declarative information - you can retrieve such information at runtime at a later point of time if need be using reflection. 

Attributes can be posted at the front of a class declaration. These comprise user-defined meta-data about the class; information which can be brought out at runtime. For example, one might define a `Serializable` attribute to indicate that instances of this type can be serialized. You can learn more about c# attributes [here](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/attributes/).

{% highlight csharp linenos %}

[Serializable] // this is a class attribute
public class Shape
{
    // class-body
}
{% endhighlight %}

## C\# Class Modifiers
There are seven different class modifiers. Four of these - `public`, `internal`, `protected` and `private` - are used to specify the access levels of the types defined by the classes. 

The following five different access levels can be specified with these four modifiers:

### public


The `public` keyword identifies a type as fully accessible to all other types. This is the implicit accessibility of [enumeration](/csharp-enumerator/) members and interface members.

### internal

If a class is declared as `internal`, the type it defines is accessible only to types within the same assembly (a self-contained 'unit of packaging' containing code, metadata, etc.). This is the default access level of non-nested classes.

### protected

If a class is declared as `protected`, its type is accessible by a containing type and any type that inherits from this containing type. This modifier should only be used for internal classes (ie. classes declared within other classes).

### protected internal

The permissions allowed by this access level are those allowed by the `protected` level plus those allowed by the `internal` level. The access level is thus more liberal than its parts taken individually. This modifier should only be used for internal classes (ie. classes declared within other classes).

### private

Where a class is declared as `private`, access to the type it defines is limited to a containing type only. This modifier should only be used for internal classes (ie. classes declared within other classes).

We now turn to the final three class modifiers:

### new

The `new` keyword can be used for `nested` classes. A nested class is one that is defined in the body of another class; it is in most ways identical to a class defined in the normal way, but its access level cannot be more liberal than that of the class in which it is defined. A nested class should be declared using the `new` keyword just in case it has the same name as (and thus overrides) an inherited type.

### abstract

A class declared as `abstract` cannot itself be instanced - it is designed only to be a base class for inheritance.

### sealed

A class declared as `sealed` cannot be inherited from.

## C\# Base Class

The `class-base` part of the class declaration specifies the name of the class and any classes that it inherits from.

As we noted [previously](/csharp-object-oriented-programming/#c-classes-and-types), classes can inherit from just one base class and any number of interfaces. The classes to be inherited from are named following a colon after the class's name (with any base class preceding any interfaces). The following line declares a public class called `DrawingRectangle` which inherits from the base class `Rectangle` and the interface `Drawing`:

{% highlight csharp linenos %}

//Here DrawingRectangle is our derived class
public class DrawingRectangle : Rectangle, Drawing //this is class-base
{

}

public class Rectangle //this is our base class
{

}

public interface Drawing //this is just an interface
{
    
}
{% endhighlight %}

## C\# Constructors

Creating an instance of a class is done with the new operator. Calling new on an object executes that object’s constructor. By default, each class has an empty constructor that can be called. You can also define your own constructors. You do this for two reasons:

- To initialize the type with data
- To run some initialization code

### Adding A Constructor To Your Type

{% highlight csharp linenos %}

class Shape
{
    private int _maximumNumberOfSides;
    public Deck(int maximumNumberOfSides)
    {
        _maximumNumberOfSides = maximumNumberOfSides;
    }
    // Rest of the class
}
{% endhighlight %}

As you can see in above example, the constructor takes an argument of int. When you want to
instantiate a new instance of this class, you need to pass a value to the constructor:

{% highlight csharp linenos %}

Shape shape = new Shape(5);
{% endhighlight %}

The constructor also runs some code to make sure that the object is in a usable state.
Some good practices when designing your constructors are these:
- Explicitly declare the public default construct in classes if such a constructor is required.
- Ensure that your constructor takes as few parameters as possible.
- Map constructor parameters to properties in your class.
- Throw exceptions from instance constructors if appropriate.
- Do not call virtual members from an object inside its constructor.

### Chaining Constructors

A class can also have multiple constructors, which can be chained to each other so you can
avoid duplicate code. Below code shows how you can chain multiple constructors.



{% highlight csharp linenos %}

class ConstructorChaining
{
    private int _p;
    public ConstructorChaining() : this(3) { }
    public ConstructorChaining(int p)
    {
        this._p = p;
    }
}
{% endhighlight %}

In production code it’s important that you make clear which constructor users of your class
should use. You can do this by picking meaningful parameter names and by adding comments
that explain the use of each constructor



