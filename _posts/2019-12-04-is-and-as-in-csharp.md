---
layout: post
current: post
navigation: True
tags: [Csharp Intermediate]
class: post-template
subclass: 'post csharp-intermediate'
title: Is And As Operators In C#
description:  In this article, we will discuss, the IS and AS keywords in C# and the importance of IS and AS operators in C#.
cover: "assets/images/is-and-as-in-csharp.jpg"
date: Wed Dec  4 21:17:01 2019
last_modified_at: Thu Dec  5 21:40:00 2019
author: shadman_kudchikar
comments: true
---

## Contents

- [C# Is Operator](#c-is-operator)
    - [C# Is Operator Example](#c-is-operator-example)
    - [Problem With C# Is Operator](#problem-with-c-is-operator)
- [C# As Keyword](#c-as-keyword)
    - [As In C# Example](#as-in-c-example)
- [Is Vs As Operator Keyword In C#](#is-vs-as-operator-keyword-in-c)
- [Further Reading](#further-reading)

## C# Is Operator

C# has an interesting operator know as `is`. The `is` operator is used for execution-time type checking. It is a binary operator that returns a Boolean indicating whether or not the instance in question is in fact of the type specified as the second operand.

Here is an example:

### C# Is Operator Example

```cs
using System;

class Example
{
    static void Main()
    {
        Console.WriteLine("hello, world" is string);  // True
    }
}
```

Obviously, this is a simple example but I am sure that the reader is capable of extrapolating more practical usages of is. 

### Problem With C# Is Operator

There is an inherent problem with `is` operator that many developers are not aware of:

Under the covers, the `is` operator uses a cast to make its determination.

Why is this a problem? 

Because the next step most developers take is to cast the instance to the type. The `is` operator viewed as a sort of "safe cast" since you know that the instance is of that type. Here is an example of this practice:

```cs
using System;

class Dog
{
    public void Speak() { Console.WriteLine("Bark!"); }
}

class Example
{
    static void Main()
    {
        Object obj = new Dog();

        if (obj is Dog)
            ((Dog)obj).Speak();  // Bark!
    }
}
```

In this example there are actually two separate casts, the `is` and the explicit cast below it (inside the conditional statement). You shouldn’t cast more then once if you don’t need to do so. Also, the `is` check does not consider user-defined conversions (such as implicit and explicit cast operators) so is may return false for an instance that could have successfully been casted.

So what should we do instead?

One method would be to use `is` operator with a variable name. Like this,

```cs
using System;

class Dog
{
    public void Speak() { Console.WriteLine("Bark!"); }
}

class Example
{
    static void Main()
    {
        Object obj = new Dog();

        if (obj is Dog dog)
            dog.Speak();  // Bark!
    }
}
```

Or use C#'s true safe casting operator: `as`. 

## C# As Keyword

The `as` operator allows you to do an explicit cast on a type while avoiding any InvalidCastExceptions that may occur by assigning null to the variable if the cast fails.

Here is an example of how to use `as`:

### As In C# Example

```cs
using System;

class Dog
{
    public void Speak() { Console.WriteLine("Bark!"); }
}

class Example
{
    static void Main()
    {
        Object obj = new Dog();

        Dog dog = obj as Dog;
        if (dog != null)
            dog.Speak();
    }
}
```

This example only contains one cast and also allows you to avoid any exceptions that may occur at execution time.

So, the important thing to remember is that if you feel like you need to use `is`, most likely you ought to use `as`.

However,

Be careful that you are not using casting to solve a problem that would be better solved with polymorphism. If you find that you are doing multiple checks for different types, casting, and then calling methods on those types, you should reevaluate your approach to see if a polymorphic solution would be better. Casting is a powerful tool but it can be misapplied.

## Is Vs As Operator Keyword In C\#

The `is` operator is used to check if a type of an object is compatible with the given type at the run-time, 

```cs
if(obj is SomeClass)
{
     ...
}
```

whereas, `as` operator is used to perform casting between compatible reference types or Nullable types.

```cs
SomeClass someObject = obj as SomeClass;
```

With the "classic" method of type casting, 

```cs
SomeClass someObject = (SomeClass) obj;
```

if the cast fails, an exception is thrown. However, with the `as` method, it results in null, which can be checked for, and avoid an exception being thrown.

```cs
SomeClass someObject = (obj as SomeClass) ?? new SomeClass();
```

> **Note:** you can only use `as` with reference types, so if you are typecasting to a value type, you must still use the "classic" method.


## Further Reading

- [C# Variable Types](/csharp-variable-types/) - C# is a type-safe language. Variables are declared as being of a particular type, and each variable is constrained to hold only values of its declared type. Variables can hold either value types or reference types, or they can be pointers. This lesson covers the value types and reference types.

- [Generics In C#](/generics-in-csharp/) - This article explains the Generics in C# with the help of a real-time problem and its step by step solution using c# generics. This article serves to be an in-depth post on getting started with generics in c#.

- [Writing Implicit and Explicit C# Conversion Operators](http://dontcodetired.com/blog/post/Writing-Implicit-and-Explicit-C-Conversion-Operators) by [Jason Roberts](http://dontcodetired.com/blog) - When writing custom classes we can provide behavior to allow for both explicit and implicit conversions to other types. Implicit conversion operators are those that don’t require an explicit cast. Explicit conversion operators are those that do require an explicit cast. In this article, Jason explains how to write them.

- [Nullable Types And Null Coalescing Operator C#](/null-coalescing-operator-csharp/) - A reference type can have an actual value of null, meaning it has no value. A value type can’t have a value of null. This is why Nullables were added to the .Net Framework. This C# article discusses the Nullables with Null Coalescing operator and also explains the unique ways to use the Null Coalescing operator.