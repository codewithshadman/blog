---
layout: post
current: post
navigation: True
tags: [Csharp Design Patterns]
class: post-template
subclass: 'post design-patterns'
title: Template Pattern C#
description: The Template Method pattern in C# enables algorithms to defer certain steps to subclasses. The structure of the algorithm does not change, but small well-defined parts of its operation are handled elsewhere.
cover: "assets/images/template-pattern-csharp.jpg"
date: Sun Dec  1 00:00:00 2019
last_modified_at: Sun Dec  1 13:13:24 2019
author: shadman_kudchikar
comments: true
---

## Contents

- [What Is Template Method Pattern?](#what-is-template-method-pattern)
- [Template Method Pattern C# Example](#template-method-pattern-c-example)
- [Where To Apply Template Method Pattern?](#where-to-apply-template-method-pattern)
- [Further Reading](#further-reading)

## What Is Template Method Pattern?

The Template Method pattern in C# enables algorithms to defer certain steps to subclasses.
The structure of the algorithm does not change, but small well-defined parts
of its operation are handled elsewhere.

Template Methods are very useful in conjunction with the [Strategy pattern](/strategy-pattern-csharp/). Any system that wishes to defer primitive operations to other classes will benefit from this pattern. In C#, it is used extensively through predefined interfaces.

The Template Method pattern defines the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm
without changing the algorithm's structure.



## Template Method Pattern C# Example

Let's start with the problem statement,

Let say you are creating a library of algorithms for C# developers that contain all type of sorting algorithm. One of the algorithms would be Merge Sort like this:

```cs
using System.Collections.Generic;
using System.Linq;

public class MergeSort
{
    public List<int> Sort(List<int> unsorted)
    {
        if (unsorted.Count <= 1)
            return unsorted;

        List<int> left = new List<int>();
        List<int> right = new List<int>();

        int middle = unsorted.Count / 2;
        for (int i = 0; i < middle; i++)  //Dividing the unsorted list
        {
            left.Add(unsorted[i]);
        }
        for (int i = middle; i < unsorted.Count; i++)
        {
            right.Add(unsorted[i]);
        }

        left = Sort(left);
        right = Sort(right);
        return Merge(left, right);
    }

    private List<int> Merge(List<int> left, List<int> right)
    {
        List<int> result = new List<int>();

        while (left.Count > 0 || right.Count > 0)
        {
            if (left.Count > 0 && right.Count > 0)
            {
                //Comparing First two elements to see which is smaller
                if (left.First() <= right.First())  
                {
                    result.Add(left.First());
                    //Rest of the list minus the first element
                    left.Remove(left.First());      
                }
                else
                {
                    result.Add(right.First());
                    right.Remove(right.First());
                }
            }
            else if (left.Count > 0)
            {
                result.Add(left.First());
                left.Remove(left.First());
            }
            else if (right.Count > 0)
            {
                result.Add(right.First());

                right.Remove(right.First());
            }
        }
        return result;
    }
}
```

Now you don't have to know the code for the Merge Sort, it's only going to be here to prove a point. 

Let's see how clients will use our above class,

```cs
using System;
using System.Collections.Generic;
using System.Linq;

namespace example1
{
    class Program
    {
        static void Main(string[] args)
        {
            Random _rand = new Random(1024);

            //Generate list of random int variables
            var unsorted = Enumerable.Range(0, 10)
                                    .Select(r => _rand.Next(100))
                                    .ToList();
            List<int> sorted;


            Console.WriteLine("Original array elements:");
            foreach (var item in unsorted)
            {
                Console.Write(item + " ");
            }
            Console.WriteLine();

            var algorithm = new MergeSort();
            sorted = algorithm.Sort(unsorted);

            Console.WriteLine("Sorted array elements: ");
            foreach (var item in sorted)
            {
                Console.Write(item + " ");
            }
            Console.WriteLine();
            Console.ReadLine();
        }        
    }
}
```

Everything looks cool in the above program right! If we run the above program we will get the following output.

```txt
Original array elements:
68 27 53 12 52 43 71 16 66 87
Sorted array elements:
12 16 27 43 52 53 66 68 71 87
```

Now,

Here’s my problem, it only stores int.

What if our clients want to use a different data type like float or string or any user-defined type like below one, a Person type. 

```cs
public class Person
{
    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }

    public string Name { get; set; }
    public int Age { get; set; }    

    public override string ToString()
    {
        return $"Name: {Name}\tAge: {Age}";
    }
}
```

Also, what if I have to sort the list of person based on its age or name.

One thing we can do is make our MergeSort algorithm [generic](/generics-in-csharp/) like this,

> **Note:** You can learn more about Generic Types in my blog post [Generics In C#](/generics-in-csharp/).

```cs
using System;
using System.Collections.Generic;
using System.Linq;

namespace example2
{
    public class MergeSort<T>
    {
        public List<T> Sort(List<T> unsorted)
        {
            if (unsorted.Count <= 1)
                return unsorted;

            List<T> left = new List<T>();
            List<T> right = new List<T>();

            int middle = unsorted.Count / 2;
            for (int i = 0; i < middle; i++)  //Dividing the unsorted list
            {
                left.Add(unsorted[i]);
            }
            for (int i = middle; i < unsorted.Count; i++)
            {
                right.Add(unsorted[i]);
            }

            left = Sort(left);
            right = Sort(right);
            return Merge(left, right);
        }

        private List<T> Merge(List<T> left, List<T> right)
        {
            List<T> result = new List<T>();

            while (left.Count > 0 || right.Count > 0)
            {
                if (left.Count > 0 && right.Count > 0)
                {
                    //Comparing First two elements to see which is smaller
                    if (left.First() <= right.First())
                    {
                        result.Add(left.First());
                        //Rest of the list minus the first element
                        left.Remove(left.First());      
                    }
                    else
                    {
                        result.Add(right.First());
                        right.Remove(right.First());
                    }
                }
                else if (left.Count > 0)
                {
                    result.Add(left.First());
                    left.Remove(left.First());
                }
                else if (right.Count > 0)
                {
                    result.Add(right.First());

                    right.Remove(right.First());
                }
            }
            return result;
        }
    }
}

```

After we make this adjustment you will find that there would be a compile-time error


![](/assets/images/template-pattern-examples/example1.jpeg)

So, how to solve this?

As I mentioned earlier, In C#, the template method is used extensively through predefined interfaces, one such interface is `IComparable`.

In the above sort method, the compare operations can replace `<=` operator with the primitive operation CompareTo, as in:

```cs
if (left.First().CompareTo(right.First()) <= 0)  
```

CompareTo is a method that returns 1 if `a>b`, 0 if `a==b`, and -1 if `a<b`. 

It is defined in the `IComparable` interface, which many predefined C# types already implement. For example, CompareTo is available for integers and strings. Because our sort methods are meant
to be general, we declare that the item types must implement the interface using:

```cs
public class MergeSort<T> : where T : IComparable<T>
```

The where clause puts a constraint on the type `<T>` by saying it must implement
`IComparable`. Any class can do so if it provides a CompareTo method. So,
inside a Person class, we have to implement the `IComparable` interface like this:

```cs
public class Person : IComparable<Person> 
{
    ...
    ...

    public int CompareTo(Person other)
    {
        // Comparison based on names
        return Name.CompareTo(other.Name);
    }    
}

```

But how is CompareTo defined in terms of CompareTo? Well, we are looking at names, so the name will presumably be a string. CompareTo is defined for strings so that is what will be called. The check for the type of the object is necessary because the implementation of CompareTo must match its interface, which is defined on the object.

Let's see how clients can use our new update merge sort class,

```cs
using System;
using System.Collections.Generic;
using System.Linq;

namespace example2
{
    class Program
    {
        public class Person : IComparable<Person>
        {
            public Person(string name, int age)
            {
                Name = name;
                Age = age;
            }

            public string Name { get; set; }
            public int Age { get; set; }

            public int CompareTo(Person other)
            {
                return Name.CompareTo(other.Name);
            }

            public override string ToString()
            {
                return $"Name: {Name}\tAge: {Age}";
            }
        }

        static void Main(string[] args)
        {
            var names = new List<string>()
            {
                "Tamra Grist"       ,
                "Bennie Sweatt"     ,
                "Misha Mattei"      ,
                "Mable Lampkins"    ,
                "Kaley Gervasi"     ,
                "Nettie Horace"     ,
                "Cassidy Broxton"   ,
                "January Berk"      ,
                "Michele Barga"     ,
                "Arden Emig"        ,
            };

            Random _rand = new Random(1024);

            //Generate list of random int variables
            var unsorted = Enumerable.Range(0, 10)
                                    .Select(r => new Person(names[r], _rand.Next(100)))
                                    .ToList();
            List<Person> sorted;


            Console.WriteLine("Original array elements:");
            foreach (var item in unsorted)
            {
                Console.WriteLine(item);
            }
            Console.WriteLine();

            var algorithm = new MergeSort<Person>();
            sorted = algorithm.Sort(unsorted);

            Console.WriteLine("Sorted array elements: ");
            foreach (var item in sorted)
            {
                Console.WriteLine(item);
            }
            Console.WriteLine();
            Console.ReadLine();
        }
    }
}
```

If we run the above program we will get the following output:

```txt
Original array elements:
Name: Tamra Grist       Age: 68
Name: Bennie Sweatt     Age: 27
Name: Misha Mattei      Age: 53
Name: Mable Lampkins    Age: 12
Name: Kaley Gervasi     Age: 52
Name: Nettie Horace     Age: 43
Name: Cassidy Broxton   Age: 71
Name: January Berk      Age: 16
Name: Michele Barga     Age: 66
Name: Arden Emig        Age: 87

Sorted array elements:
Name: Arden Emig        Age: 87
Name: Bennie Sweatt     Age: 27
Name: Cassidy Broxton   Age: 71
Name: January Berk      Age: 16
Name: Kaley Gervasi     Age: 52
Name: Mable Lampkins    Age: 12
Name: Michele Barga     Age: 66
Name: Misha Mattei      Age: 53
Name: Nettie Horace     Age: 43
Name: Tamra Grist       Age: 68
```

When a Template Method uses an interface for specifying the primitive operations, the classes must implement those operations. It is also possible to define IPrimitives as an abstract class and to provide default behavior for any of the operations, leaving the subclass to override as many operations as it wishes. Methods that have defaults are called hook operations, and they often do nothing by default.


## Where To Apply Template Method Pattern?

- When you need to implement the invariant parts of an algorithm once and leave it up to subclasses to implement the behavior that can vary.

- When common behavior among subclasses should be factored and localized in a common class to avoid code duplication. This is a good example of "refactoring to generalize" as described by Opdyke and Johnson in their research paper [Creating Abstract Superclasses by Refactoring](https://www.researchgate.net/publication/221476844_Creating_Abstract_Superclasses_by_Refactoring). You first identify the differences in the existing code and then separate the differences into new operations. Finally, you replace the differing code with a template method that calls one of these new operations.

- When you need to control subclasses extensions. You can define a template method that calls "hook" operations at specific points, thereby permitting extensions only at those points.


The Template Method pattern is more like the [Strategy pattern](/strategy-pattern-csharp/) in that it is algorithm-based. The steps of the algorithm are specified in the Template Method and some are
deferred to domain classes.

> **Note:** You can download the complete solution demo from my [github repository](https://github.com/kudchikarsk/template-pattern-csharp).

## Further Reading

- [Strategy Pattern C#](/strategy-pattern-csharp/) - The Strategy pattern in C# lets the algorithm vary independently from clients that use it. The Strategy pattern enables a client to choose which algorithm to use from a family of algorithms and gives it a simple way to access it.

- [Template Method Pattern. Can we do better?](https://blog.leifbattermann.de/2016/03/06/template-method-pattern-there-might-be-a-better-way/) by [Leif Battermann](https://blog.leifbattermann.de/about/) - In this post, Leif compare the application of the Template Method pattern to an alternative approach adopted from functional programming. This alternative approach made use of higher-order functions. Even though this example is kind of simple and bold it demonstrates that the functional way may lead to cleaner and more maintainable code in some situations.

- [Curiously recurring template pattern](https://blog.arkanosoft.com/index.php/crtp-c/) by [Guillermo Subirán](https://blog.arkanosoft.com/index.php/author/guillermo-subiran/) - In this post, Guillermo explains the curiously recurring template pattern (CRTP) which is an idiom in C++ in which class X derives from a class template instantiation using X itself as a template argument. More generally it is known as F-bound polymorphism, and it is a form of F-bounded quantification. The idea of CRTP is similar to the template method pattern we discussed in this post.

