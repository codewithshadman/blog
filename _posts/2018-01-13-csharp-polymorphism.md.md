---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: C# Polymorphism 
description: Polymorphism in C# relates to the choice of which method to call, where the declared class of a variable is different from the run-time class of the object it references. In this tutorial, you will learn about - inheritance polymorphism and runtime polymorphism in c#.
comments: true
permalink: /csharp-polymorphism/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---

The word polymorphism means having many forms. Polymorphism is often expressed as "one name many forms". In other words, one object has many forms or has one name with multiple functionalities.

There are two types of polymorphism in C#:

- Static / Compile Time Polymorphism.
- Dynamic / Runtime Polymorphism.

Method overloading is an example of Static Polymorphism. In overloading, the method/function has the same name but different signatures. We've already seen this in [previous article](/csharp-methods/#c-method-overloading).

Let's see the Dynamic / Runtime Polymorphism,

As we have seen, classes take on the methods of the classes from which they inherit. In some cases, however, a class may want to 'overwrite' such a method. C# supports two different ways of method overwriting - 'hiding' or 'overriding'. Note that the term 'overwrite' is a term we have devised to cover both hiding and overriding.

Method overwriting makes use of the following three method-head keywords:

`new`, `virtual`, `override`

The main difference between hiding and overriding relates to the choice of which method to call, where the declared class of a variable is different from the run-time class of the object it references. This point is explained further below.


## Contents
- [C\# Method Overriding](#c-method-overriding)
- [C\# Method Hiding](#c-method-hiding)

## C\# Method Overriding

Suppose that we define a Square class that inherits from a Rectangle class (a square being a special case of a rectangle). Each of these classes also specifies a `getArea` instance method, returning the area of the given instance.

For the Square class to `override` the Rectangle class' getArea method, the Rectangle class' method must have first declared that it is happy to be overridden. One way in which it can do this is with the `virtual` keyword. So, for instance, the Rectangle class' getArea method might be specified like this:

```cs
public virtual double getArea() // in Rectangle
{
	return length * width;
}
```


To override this method the Square class would then specify the overriding method with the `override` keyword. For example:

```cs
public override double getArea() // in Square
{
    return length * length;
}
```


Note that for one method to override another, the overridden method must not be static, and it must be declared as either `virtual`, `abstract` or `override`. Furthermore, the access modifiers for each method must be the same.

The major implication of the specifications above is that if we construct a new Square instance and then call its `getArea` method, the method actually called will be the Square instance's getArea method. So, for instance, if we run the following code:

```cs
Square sq = new Square(5);
double area = sq.getArea();
```

then the getArea method called on the second line will be the method defined in the Square class.

There is, however, a more subtle point. To show this, suppose that we declare two variables in the following way:

```cs
Square sq = new Square(4);
Rectangle r = sq;
```

Here variable r refers to sq as a Rectangle instance (possible because the Square class derives from the Rectangle class). We can now raise the question: if we run the following code

```cs
double area = r.getArea();
```

then which getArea method is actually called - the Square class method or the Rectangle class method?

The answer, in this case, is that the Square class method would still be called. Because the Square class' getArea method `overrides` the corresponding method in the Rectangle class, calls to this method on a Square instance always 'slide through' to the overriding method.

## C\# Method Hiding
Where one method hides another, the hidden method does not need to be declared with any special keyword. Instead, the hiding method just declares itself as `new`. So, where the Square class hides the Rectangle class's getArea method, the two methods might just be written thus:

```cs
public double getArea() // in Rectangle
{
    return length * width;
}

public new double getArea() // in Square
{
    return length * length;
}
```


Note that a method can `hide` another one without the access modifiers of these methods being the same. So, for instance, Square's getArea method could be declared as private, viz:

```cs
private new double getArea()
{
    return length * length;
}
```


This leads us to an important point. A `new` method only hides a super-class method with a scope defined by its access modifier. Specifically, where the access level of the hiding method is `private`, as in the method just described, this method only hides the super-class method for the particular class in which it is defined.

To make this point more concrete, suppose that we introduced a further class, SpecialSquare, which inherits from Square. Suppose further that SpecialSquare does not overwrite the getArea method. In this case, because Square's getArea method is defined as private, SpecialSquare inherits its getArea method directly from the Rectangle class (where the getArea method is public).

The final point to note about method hiding is that method calls do not always 'slide through' in the way that they do with virtual methods. So, if we declare two variables thus:

```cs
Square sq = new Square(4);
Rectangle r = sq;
```

then run the code

```cs
double area = r.getArea();
```

the getArea method defined in the Rectangle class will be executed and not the one in the Square class.