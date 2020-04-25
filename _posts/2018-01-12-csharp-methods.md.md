---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: C# Methods
description: C# Methods are operations associated with types. To provide a type with methods is to give it some useful functionality. In this article, you will learn different types of methods in C# language.
comments: true
permalink: /csharp-methods/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---


Methods in C# are operations associated with types. To provide a type with methods is to give it some useful functionality. Often this functionality is made generally available so that it can be utilized by other types

To take a simple example, suppose that we have an `Arithmetic` class, whose purpose is to provide arithmetic operations. One simple method this class could have is the `addTwoIntegers` method, whose job is to support the operation of adding two integers. To make use of this functionality, a piece of code would call the method by passing it two integers. The method would then return their sum. Such a piece of code might look like this:

```cs
int sum = Arithmetic.addTwoIntegers(4,7);
```

A method declaration, specified within a class declaration, comprises a method-head and a method-body. The method-head is made up of the following elements (square brackets enclose those which are optional).

```txt
[attributes] [method-modifiers] return-type method-name ([ formal-parameter-list] )
```

In the case of the example method, its method head could look something like this:

```cs
[Description("a pointless method")] public static int addTwoIntegers(int a, int b)
```

Let's discuss all the elements of a C# method one by one:

## Contents

- [C\# Method Attributes](#c-method-attributes)
- [C\# Method Modifiers](#c-method-modifiers)
    - [abstract](#abstract)
    - [static](#static)
    - [new, virtual, override](#new-virtual-override)
    - [extern](#extern)
- [C\# Method Parameters](#c-method-parameters)
    - [Parameter Passing](#parameter-passing)
        - [Passing By Value](#passing-by-value)
        - [Passing By Reference](#passing-by-reference)
        - [Output Parameters](#output-parameters)
        - [The Params Modifier](#the-params-modifier)
- [C\# Method Return Type](#c-method-return-type)
- [C\# Method Overloading](#c-method-overloading)



## C\# Method Attributes
Method attributes work in a similar way to that briefly described for [classes](/csharp-class/#c-class-attributes). They can be used to associate declarative information - you can retrieve such information at runtime at a later point of time if need be using reflection. 

In other words, you can use attributes to inject additional information to the assemblies that can be queried at runtime if needed using reflection. An attribute comprises of its name and optionally, a list of parameters. The attribute name corresponds to the attribute class.

The Obsolete attribute can be used to denote a method as obsolete - one that shouldn't be used anymore as it is no longer needed or may have some other alternative. The following code snippet illustrates how you can use the Obsolete attribute on top of a method declaration.

```cs
[Obsolete("This method is obsolete...")]
public static void DoSomeWork()

{

}
```

If you use this method in your code and compile your program, you would see a warning displayed in the output window of the Visual Studio IDE. You can ignore this warning if you want to. You can learn more about c# attributes [here](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/attributes/).

## C\# Method Modifiers
There are ten method modifiers that can be used. Four of these - public, internal, protected and private - are the access modifiers that can be used in class declarations (see [C# Class Modifiers](/csharp-class/#c-class-modifiers)). These four work similar to the way they work in class declarations. The others are the following:

### abstract

In an abstract class, it is possible to specify a class method without specifying its body. Such methods are themselves termed `abstract`. Abstract methods are discussed in [previous article](/csharp-object-oriented-programming/#c-abstract-classes).

### static

The `static` modifier declares a method to be a class method.

The methods (as well as the enumerations, properties, and variables) specified in a class can be associated either with the class's instances (ie. the reference types it specifies) or with the class itself. These methods are called, respectively, 'instance methods' and 'class methods'. Class methods, declared with the `static` modifier, can be called even when there exist no current instances of the class.

There is no equivalent modifier for instance methods since methods are instance methods just in case their declaration does not include the word `static`.

### new, virtual, override

These modifiers concern the inheritance of methods from super - to sub-classes. They are covered in the [next article](/csharp-polymorphism/).

### extern

When a method declaration includes an extern modifier, that method is said to be an external method. External methods are implemented externally, typically using a language other than C#. Because an external method declaration provides no actual implementation, the method-body of an external method simply consists of a semicolon. You can learn more about c# extern modifier [here](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/extern).

## C\# Method Parameters

A method's parameters are the types that get passed to it when the method is called. The list of parameters begins by specifying zero or more 'fixed parameters', or it may finish by specifying a single parameter-array. This latter element - is declared using the `params` keyword - means that it is possible to pass an arbitrary number of types to a single method.

```cs
public void change() //zero parameters
{

}

public void change(int a, int b) //fixed parameters
{

}

public void change(params int[] s) //arbitrary number of parameters
{

}
```

Fixed parameter specifications can have either two or three parts (ignoring attributes). The first, optional modifier can be either `ref` or `out`. The second part of the specification specifies the parameter's type, and the third part its name. Examples of these different elements can be seen in the illustrative code in the sections below.

```txt
[Modifier] parameter-type parameter-identifier
```

```cs
//here 'ref' is a modifier and 'a' is the parameter name with datatype 'int'
public void change(ref int a) 
{
    //do something
}
```

### Parameter Passing

#### Passing By Value

The parameter modifiers `ref` and `out` relate to how the parameter is passed into the method. Where neither of these modifiers is used, the parameter is passed in 'by value'. In this case, when the method is called the value given is copied to the variable specified in the method declaration. The following example illustrates this point; note that the change made to variable b in the body of the `change` method doesn't result in a change to the variable used to invoke the method.

```cs
public static void Main()
{
    int a = 0;
    change(a); // following this method invocation, a equals 0
}

public static void change(int b)
{
    b = 5;
}
```


In this example, it was a value type that was passed 'by value'. But reference types can also be passed 'by value'. As we saw previously, the immediate value held by a reference type variable is actually a memory address. So when this variable is passed 'by value', the memory address is copied to the variable specified in the method head. But of course, because the two variables will hold the same memory address, any changes made within the method body to the object located at that memory address will be reflected outside the method (although this doesn't apply for immutable reference types like strings, which act more like value types - see lesson 4).

#### Passing By Reference

In C# we can pass variables into methods 'by reference'. Where a variable is passed by reference, the `ref` modifier must be used both in the method head and the method invocation (illustrated by the next code block).

Passing by reference is most obviously useful in cases where we want to treat a value type like a reference type. For instance, the method call in the following code does change the value of the variable a passed into the `change` method.

```cs
public static void Main()
{
    int a = 0;
    change(ref a); // following this method invocation, a==5
}

public static void change (ref int b)
{
    b = 5;
}
```


#### Output Parameters

Where a method parameter is defined (and invoked) using the `out` modifier, it is passed by reference. The difference between the `out` and the `ref` modifier is this: a parameter modified by the `out` keyword need not be assigned a value before being passed into the method, but must be assigned a value in the method.

The reason that one might use output parameters is to return multiple values from a method. For instance, in the following code, an integer and a boolean is passed to the `change` method. This method sets the boolean to indicate whether or not the integer is greater than 0, and returns the value of the integer doubled.

```cs
public static void Main()
{
    bool b;
    int c = change(5, out b);
}

public static int change (int a, out bool b)
{
    b=false;
    if (a>0)
        b=true;
    return (2*a);
}
```


#### The Params Modifier
One can pass an arbitrary number of types to a method by declaring a parameter array with the `params` modifier. Note, though, that it is not necessary to place these additional types into an array before calling the method - they can simply be listed in the method invocation (see the next code block for an example).

Types passed as `params` are all passed by value. The following code gives an example of the use of the `params` modifier; the method called ignores the first type passed to it (a double) and returns the sum of all (an arbitrary number of) the integer values passed to it.

```cs
public static void Main()
{
    double a = 1;
    int b = 2;
    int c = 3;
    int d = totalIgnoreFirst(a, b, c);
}

public static int totalIgnoreFirst(double a, params int[] intArr)
{
    int sum = 0;
    for (int i=0; i < intArr.Length; i++)
        sum += intArr[i];
    return sum;
}
```


## C\# Method Return Type
Methods can either return a type or not. A method that doesn't return a type must give its return type as `void`. A method that does return a type must name the type returned.

A method will stop and return a value if it reaches a `return` statement at any point in its execution. The type returned is given at the end of such a return statement; its type must correspond with that specified in the method declaration. The following piece of code illustrates this point.

```cs
public static int exampleMethod()
{
    int i =0;
    // process i
    
    return i;
}
```


## C\# Method Overloading

Each method has a signature. This comprises the method's name and its parameters (excepting their names), but not the method's return type. In the following method header, the elements making up the method's signature are emphasized - note also that the `params` keyword is not included in the signature.

```cs
public static int myMethod(int a, ref double b, out bool c, params int[] d)
```

The importance of the signature is that no class is allowed to contain two methods with the same signature. Since the signature takes in more than the method name, however, one class can have methods sharing a name. For example, a class with the method whose header is given above might also contain a method with the header:

```cs
public static int myMethod(int a, ref double b)
```

Note, however, that since neither its return type nor the params keyword is part of a method's signature this class could not also contain a method with the header:

```cs
public static void myMethod(int e, ref double f, out bool g, int[] h)
```
