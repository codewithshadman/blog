---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: C# Fields, Properties and Indexers
description: In this article, we will discuss about C# Fields, Properties and Indexers. A field is a variable which is declared directly in a class or struct in C#. A property is a member that provides a flexible mechanism to read, write, or compute the value of a private field.
comments: true
permalink: /csharp-fields-properties-and-indexers/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---

In C#, a field is a variable which is declared directly in a class or struct in C#. A property is a member that provides a flexible mechanism to read, write, or compute the value of a private field.

{% highlight csharp linenos %}

public class MyClass
{
    // this is a field.  It is private to your class and stores the actual data.
    private string _myField;

    // this is a property. When accessed it uses the underlying field,
    // but only exposes the contract, which will not be affected by the underlying field
    public string MyProperty
    {
        get
        {
            return _myField;
        }
        set
        {
            _myField = value;
        }
    }

    // This is an AutoProperty (C# 3.0 and higher) - which is a shorthand syntax
    // used to generate a private field for you
    public int AnotherProperty { get; set;} 
}
{% endhighlight %}

If you are a beginner, you might get confused between a C# field and a C# property. You can store value using either a field or a property and retrieve the value back. You can even protect both fields and properties using access modifiers such as private or protected. So you might wonder, why we need to have property when you can achieve the same using field or vice-versa? 

But,

Object orientated programming principles say that, the internal workings of a class should be hidden from the outside world. If you expose a field you're in essence exposing the internal implementation of the class. 

Therefore we wrap fields with Properties (or methods in Java's case) to give us the ability to change the implementation without breaking code depending on us.

So,

Properties expose fields. Fields should (almost always) be kept private to a class and accessed via get and set properties. Properties provide a level of abstraction allowing you to change the fields while not affecting the external way they are accessed by the things that use your class.

In this article, we will discuss about C# Fields, Properties and Indexers.

## Contents

- [C\# Fields](#c-fields)
    - [C\# Static](#c-static)
    - [C\# Readonly](#c-readonly)
    - [C\# Constants](#c-constants)
- [C\# Properties](#c-properties)
- [C\# Indexers](#c-indexers)

<!--more-->

## C\# Fields
Fields are variables associated with either classes or instances of classes. There are seven modifiers which can be used in their declarations. These include the four access modifiers 'public', 'protected', 'internal' and 'private' (discussed in [C# Class](/csharp-class/#c-class-modifiers)) and the 'new' keyword (discussed in [C# Polymorphism](/csharp-polymorphism/#c-method-hiding)). The three remaining modifiers are:

### C\# Static

By default, fields are associated with class instances. Use of the 'static' keyword, however, associates a field with a class itself, so there will only ever be one such field per class, regardless of the number of the class instances (and the static field will exist even if there are no class instances).

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {
        //the 'NoOfInstances' field will exist even if there are no 'MyClass' instances
        Console.WriteLine("No of MyClass instances (Before): " + MyClass.NoOfInstances);
        for (int i = 0; i < 5; i++)
        {
            var myClass = new MyClass();
        }
        Console.WriteLine("No of MyClass instances (After): " + MyClass.NoOfInstances);
        Console.ReadLine();            
        /*
        Output:
        No of MyClass instances (Before): 0
        No of MyClass instances (After): 5
        */
    }
}

public class MyClass
{
    public static int NoOfInstances = 0;

    public MyClass()
    {
        //there will only ever be one 'NoOfInstances' field, 
        //regardless of the number of the 'MyClass' instances
        MyClass.NoOfInstances = MyClass.NoOfInstances + 1;
    }
}
{% endhighlight %}

### C\# Readonly

Where a field is readonly, its value can be set only once, either in the class declaration, or in the class constructor (for static fields this will be static constructor). The following code example (which, please note, deliberately doesn't compile) shows both cases: the field StaticReadonlyInt is set in the class declaration; the field readonlyString is set in the class constructor.

{% highlight csharp linenos %}

public class MyClass
{
    public static readonly float pi = 3.14f; // a static readonly field
    public readonly float gravityOnEarth = 9.8f; // a readonly field

    static MyClass() //this is a static constructor
    {
        pi = 3.1417f;
    }

    public MyClass()
    {
        pi = 2f; //this will not compile
        gravityOnEarth = 9.80665f;
    }
   
    public void DoSomething()
    {
        gravityOnEarth = 2f; //this will not compile
    }
}
{% endhighlight %}

Also,

While we're on declarations, note also that a field declaration can involve multiple fields, as in the following line of code

{% highlight csharp linenos %}

public static int a = 1, b, c = 2;
{% endhighlight %}

which is equivalent to

{% highlight csharp linenos %}

public static int a = 1;
public static int b;
public static int c = 2;
{% endhighlight %}

### C\# Constants

Constants are unchanging types, associated with classes, that are accessible at compile time. Because of this latter fact, constants can only be value types rather than reference types. Constant declarations take the 'const' keyword (not 'static', even though they are associated with classes), and the five modifiers 'public', 'protected', 'internal', 'private' and 'new'.

{% highlight csharp linenos %}

public const int area = 4;
{% endhighlight %}

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine(MyClass.area);
        MyClass.area = 5; //this will not compile
    }

    public class MyClass
    {
        public const int area = 4;
        public MyClass()
        {
            MyClass.area = MyClass.area + 1; //this will not compile
        }
    }
}
{% endhighlight %}

If you've been reading carefully, you may be struck by the thought: what's the difference between declaring a field as 'const' and declaring a field 'static readonly'. Good question. The general point is that static readonly fields can be reference types as well as value types. However the main intention is to allows the class designer to remove write privilege of attributes that are intended to be set only during construction, even from methods of the target class (see [Private class data pattern](https://en.wikipedia.org/wiki/Private_class_data_pattern)).

## C\# Properties

Properties can be thought of as 'virtual' fields. From the outside, a class' property looks just like a field. But from the inside, the property is generated using the actual class fields.

Property declarations take just those modifiers taken by methods (see [C# Method Modifiers](/csharp-methods/#c-method-modifiers)) Unlike languages like Java, C# provides dedicated support for accession and mutation of these properties. Suppose, for instance, that a type contains an internal field called 'age'. With the following code one could specify a property Age, providing accessors and mutators to this internal field.

{% highlight csharp linenos %}

public int Age
{
    get
    {
        return this.age;
    }
    set
    {
        this.age = value;
    }
}
{% endhighlight %}


Notice that the term 'value' is used in the above piece of code. This variable always holds the value passed to the 'set' block. For instance, the execution of the following line of code (assuming the appropriate class instance) would automatically set 'value' in the 'set' block to 4.

{% highlight csharp linenos %}

person.Age = 4;
{% endhighlight %}

This property Age can be described as 'read-write' since it can be both read from and written to. To make a property 'write-only' one simply does not specify a 'get' block; to make it 'read-only' one does not specify a 'set' block. The following piece of code demonstrates the read-only property 'Adult':

{% highlight csharp linenos %}

public bool Adult
{
    get
    {
        if (this.age<18)
            return false;
        else
            return true;
    }
}
{% endhighlight %}

## C\# Indexers
If properties are 'virtual fields', indexers are more like 'virtual arrays'. They allow a class to emulate an array, where the elements of this array are actually dynamically generated by function calls.

The following piece of code defines a class to hold a list of runners in an athletics race. The runners are held in lane order, and an indexer is exposed which allows the list to be both read from and written to. The indexer deals gracefully with cases in which the lane number passed to it is either too high or too low.

{% highlight csharp linenos %}

class RaceDetails
{
    private string[] lanes;

    public RaceDetails()
    {
        this.lanes = new string[8];
    }

    public string this[int i]
    {
        get
        {
            return (i>=0 && i<8) ? this.lanes[i] : "error";
        }

        set
        {
            if (i>=0 && i<8) this.lanes[i] = value;
        }
    }
}
{% endhighlight %}


The following simple code illustrates use being made of the class just defined. The name of the person in the race's first lane is set, and then this name is sent to a console window.

{% highlight csharp linenos %}

RaceDetails rd = new RaceDetails();
rd[0] = "fred";
Console.WriteLine("Lane One : " + rd[0]);
{% endhighlight %}

As can be seen from the example, an indexer is defined in a similar way to a property. One important difference is in the indexer's signature; the word 'this' is used in place of a name, and after this word indexing elements are provided.

Indexers aren't differentiated by name, and a class cannot declare two indexers with the same signature. However, this does not entail that a class is limited to just one indexer. Different indexers can have different types and numbers of indexing elements (these being equivalent to method parameters, except that each indexer must have at least one indexing element, and the 'ref' and 'out' modifiers cannot be used).

Because indexing elements are not limited to integers, the original description of indexers as 'virtual arrays' actually rather undersells them. For example, where the indexing elements include strings, indexers present themselves more like hash tables.

The following code shows an implementation for the RaceDetails class of an indexer whose indexing element is a string. Using this indexer it is possible to refer to a lane using the name of the person currently filling that lane.

{% highlight csharp linenos %}

public string this[string s]
{
    get
    {
        int laneNum = getCorrespondingLane(s);
        return (laneNum<0) ? "error" : this.lanes[laneNum];
    }

    set
    {
        int laneNum = getCorrespondingLane(s);
        if (laneNum>=0) this.lanes[laneNum] = value;
    }
}


private int getCorrespondingLane(string myName)
{
    for (int x=0; x<lanes.Length; x++)
    {
        if (myName==lanes[x]) return x;
    }
    return -1;
}
{% endhighlight %}


The following piece of code gives an example of the kind of use one might make of this string indexer.

{% highlight csharp linenos %}

rd[5] = "fred";
rd["fred"] = "jill";
Console.WriteLine(rd[5]); //Displays jill
{% endhighlight %}

