---
layout: post
current: post
navigation: True
tags: [Csharp Tips]
class: post-template
subclass: 'post csharp-tips'
title: C# Data Types and Object Tips
description: In this article, we're going to be learning about a whole host of different tips and tricks related to data types and objects in C# and .NET.
cover: "assets/images/csharp-data-types-and-object-tips.jpg"
date: Sat Apr 11 00:00:00 2020
last_modified_at: Sat Apr 11 14:18:04 2020
author: shadman_kudchikar
comments: true
---

Whether you're still learning C# or you already have some experience, there will always be gaps in your knowledge, places where you are clueless as to your ignorance.

In the series of articles in [C# Tips](/tag/csharp-tips/) I will provide a whole host of useful information about the sometimes underused or unknown features of both C# and .NET. 

In the [previous](/csharp-number-and-datetime-tips/) article, we learned some tips for working with numbers and dates. In this article, we're going to be learning about a whole host of different tips and tricks related to data types and objects in C# and .NET.

## C# Data Types and Object Tips

1. [Using Tuples to Reduce the Amount of Code](#using-tuples-to-reduce-the-amount-of-code)
2. [Creating and Using Combinable Enums](#creating-and-using-combinable-enums)
3. [Improving Struct Equality Performance](#improving-struct-equality-performance)
4. [Forcing Reference Equality Comparisons](#forcing-reference-equality-comparisons)

## Using Tuples to Reduce the Amount of Code

The Tuple class was introduced in .NET Framework 4.0. A tuple is a data structure that contains a sequence of elements of different data types. It can be used where you want to have a data structure to hold an object with properties, but you don't want to create a separate type for it.

Let's see some sample code

```cs
using System;
using static System.Console;

namespace csharp_data_types_and_object_tips
{
    class Program1
    {
        public static void Run(string[] args)
        {
            Tuple<int, string, string> person1 =
                new Tuple<int, string, string>(1, "Steve", "Jobs");
            WriteLine(person1.Item1); // returns 1
            WriteLine(person1.Item2); // returns "Steve"
            WriteLine(person1.Item3); // returns "Jobs"

            var person2 = Tuple.Create(1, "Steve", "Jobs");
            WriteLine(person2.Item1); // returns 1
            WriteLine(person2.Item2); // returns "Steve"
            WriteLine(person2.Item3); // returns "Jobs"



            var numbers = Tuple.Create("One", 2, 3, "Four", 5, "Six", 7, 8);
            WriteLine(numbers.Item1); // returns "One"
            WriteLine(numbers.Item2); // returns 2
            WriteLine(numbers.Item3); // returns 3
            WriteLine(numbers.Item4); // returns "Four"
            WriteLine(numbers.Item5); // returns 5
            WriteLine(numbers.Item6); // returns "Six"
            WriteLine(numbers.Item7); // returns 7
            WriteLine(numbers.Rest ); // returns (8)
            WriteLine(numbers.Rest.Item1); // returns 8
        }
    }
}
```

When you find yourself adding "out" parameters to your methods or creating a simple POCO or model to return multiple fields, you should consider using a Tuple.

However, traditional tuples have some limitations,

### Tuple Limitations:

- A tuple is a [reference type](/csharp-variable-types/#c-reference-types) and not a [value type](/csharp-variable-types/#c-value-types). It allocates on the heap and could result in CPU intensive operations.
- The tuple is limited to include 8 elements. You need to use nested tuples if you need to store more elements. However, this may result in ambiguity.
- Tuple elements can be accessed using properties with a name pattern Item which does not make sense.

But,

C# 7 includes ValueTuple to overcome the limitations of Tuple and also makes it even easier to work with Tuple. Let's learn more about it,

C# 7.0 (.NET Framework 4.7) introduced ValueTuple, a structure which is a value type representation of the Tuple. Named parameters and better performance have made ValueTuple worth using.

The ValueTuple is only available in .NET Framework 4.7. If you don’t see ValueTuple in your project then you need to install the ValueTuple. (.NET Framework 4.7 or higher, or .NET Standard Library 2.0 or higher already includes ValueTuple.)

The following are examples of how to use ValueTuple.

```cs
using System;
using static System.Console;

namespace csharp_data_types_and_object_tips
{
    class Program2
    {
        public static void Run(string[] args)
        {
            var person = (1, "Bill", "Gates");
            WriteLine(person.Item1);  // returns 1
            WriteLine(person.Item2);   // returns "Bill"
            WriteLine(person.Item3);   // returns "Gates"

            //equivalent Tuple
            //var person = Tuple.Create(1, "Bill", "Gates");

            ValueTuple<int, string, string> person1 = (1, "Bill", "Gates");
            WriteLine(person1.Item1);  // returns 1
            WriteLine(person1.Item2);   // returns "Bill"
            WriteLine(person1.Item3);   // returns "Gates"


            (int, string, string) person2 = (1, "Bill", "Gates");
            WriteLine(person2.Item1);  // returns 1
            WriteLine(person2.Item2);   // returns "Bill"
            WriteLine(person2.Item3);   // returns "Gates"

            (int Id, string FirstName, string LastName) person3 = (1, "Bill", "Gates");
            WriteLine(person3.Id);   // returns 1
            WriteLine(person3.FirstName);  // returns "Bill"
            WriteLine(person3.LastName); // returns "Gates"

            //We can also assign member names at the right side with values, as below.
            var person4 = (Id: 1, FirstName: "Bill", LastName: "Gates");
            WriteLine(person4.Id);   // returns 1
            WriteLine(person4.FirstName);  // returns "Bill"
            WriteLine(person4.LastName); // returns "Gates"


            // PersonId, FName, LName will be ignored.
            (int Id, string FirstName, string LastName) person5 =
                            (PersonId: 1, FName: "Bill", LName: "Gates");
            WriteLine(person5.Id);   // returns 1
            WriteLine(person5.FirstName);  // returns "Bill"
            WriteLine(person5.LastName); // returns "Gates"
        }
    }
}
```

We can now specify different member names for a ValueTuple returned from a method.

```cs
using System;
using static System.Console;

namespace csharp_data_types_and_object_tips
{
    class Program3
    {
        public static void Run(string[] args)
        {
            var person1 = GetPerson();
            WriteLine(person1.Id);   // returns 1
            WriteLine(person1.FirstName);  // returns "Bill"
            WriteLine(person1.LastName); // returns "Gates"

            (var id, var fname, var lname) = GetPerson();
            WriteLine(id);   // returns 1
            WriteLine(fname);  // returns "Bill"
            WriteLine(lname); // returns "Gates"
        }

        static (int Id, string FirstName, string LastName) GetPerson()
        {
            return (1, "Bill", "Gates");
        }
    }
}
```

Also, ValueTuple now allows "discards" in deconstruction for the members you are not going to use.

```cs
(var id, var fname, _) = GetPerson(); // use discard _ for the unused member LastName
```

In summary, if you have been holding out on using Tuples like me due to the lack of naming fields or performance issues before C# 7, it's time to give them another chance.

## Creating and Using Combinable Enums

Let's take a look next to how we can create enums that we can combine to represent multiple options in a single enum value. 

```cs
using System;
using static System.Console;

namespace csharp_data_types_and_object_tips
{
    public enum TextStyles
    { 
        Normal,
        Bold,
        Italics,
        Underlined,
    }

    class Program4
    {
        
        public static void Run(string[] args)
        {
            var style = TextStyles.Bold;
            var text = "Hello world!";
            switch (style)
            {
                case TextStyles.Normal:
                    WriteLine($"<span>{text}<span>");
                    break;

                case TextStyles.Bold:
                    WriteLine($"<b>{text}<b>");
                    break;

                case TextStyles.Italics:
                    WriteLine($"<i>{text}<i>");
                    break;
                case TextStyles.Underlined:
                    WriteLine($"<strike>{text}<strike>");
                    break;
            }
        }
    }
}

//Output:
//<b>Hello world!<b>
```

In the above program, we're using a switch statement and depending on the enum value, we're just adding the HTML tag element to the text.

Let's take a look next to how we can create a version of this TextStyles that uses an enum that's configured to allow the combination of its values. 

```cs
[Flags]
public enum TextStyles
{ 
    Normal = 0,
    Bold = 1,
    Italics = 2,
    Underlined = 4,
}
```

In the above version, we added a class attribute Flags. Notice here, however, that I'm setting explicit values for each of these style options. We're starting at 0 to represent normal, and then we're defining the enum constants in powers of 2, So we start at 1, then we go to 2, if we added another option, that would be 4, and so on. 

The reason we do this is so we can combine these enum constants to represent multiple options without the values overlapping. Like this,

```cs
var style = TextStyles.Bold | TextStyles.Underlined;
```


Now, let's update the switch program we had before and instead use if statements.

Let's start by determining whether no processing is required. To do this, we can compare the options that were passed in,

```cs
if (style == TextStyles.Normal)
{
    text = $"<span>{text}<span>";
}
``` 

Now, this Boolean will be set to true if the only style option is Normal. 

But we don't want to just say `style == TextStyles.Normal` because the options that are going to be passed in may contain multiple enum values. Like this,

```cs
var style = TextStyles.Bold | TextStyles.Underlined;
```


So, for example, the options passed in could represent both Bold and Underlined, so we can't perform a straight equality comparison here. One way to check that the Bold option has been specified is to use a bitwise end and check the result is not equal to 0. Like this,

```cs
if ((style & TextStyles.Bold) != 0)
{
    text = $"<b>{text}<b>";
}
```

A more readable version, however, is to use the HasFlag method. Like this,

```cs
if (style.HasFlag(TextStyles.Bold))
{
    text = $"<b>{text}<b>";
}
```

So our final program will now look like this,

```cs
using System;
using static System.Console;

namespace csharp_data_types_and_object_tips
{
    class Program5
    {

        public static void Run(string[] args)
        {
            var style = TextStyles.Bold | TextStyles.Underlined;
            var text = "Hello world!";
            if (style.HasFlag(TextStyles.Normal))
            {
                text = $"<span>{text}<span>";
            }

            if ((style & TextStyles.Bold) != 0)
            {
                text = $"<b>{text}<b>";
            }

            if (style.HasFlag(TextStyles.Italics))
            {
                text = $"<i>{text}<i>";
            }

            if (style.HasFlag(TextStyles.Underlined))
            {
                text = $"<strike>{text}<strike>";
            }

            WriteLine(text);
        }
    }
}
```


Notice here to create a combination of enum values, we're using the bitwise or operator. You can also do the same in Enums like this,

```cs
[Flags]
public enum TextStyles
{ 
    Normal = 0,
    Bold = 1,
    Italics = 2,
    Underlined = 4,
    BoldItalics = Bold | Italics //Combine option
}
```

> Note: Add the flags attribute if you're creating an enum that represents a set of combinable flags as we've done here, you should add the flags attribute to indicate your intent as the developer and also provide better ToString functionality for enum values.

## Improving Struct Equality Performance

The next tip we're going to look at is the performance of structs, specifically their performance of equality comparisons. 

```cs
public static void Run(string[] args)
{
    var stopwatch = new Stopwatch();
    var data1 = new StructNoRef();
    var data2 = new StructNoRef();
    stopwatch.Start();
    for (int i = 0; i < 1000000; i++)
    {
        data1.Equals(data2); //compare two objects
    }
    stopwatch.Stop();
    WriteLine("StructNoRef Comparison: "+stopwatch.ElapsedMilliseconds + " Milliseconds");

    stopwatch.Reset();
    var data3 = new StructWithRef();
    var data4 = new StructWithRef();
    stopwatch.Start();
    for (int i = 0; i < 1000000; i++)
    {
        data3.Equals(data4); //compare two objects
    }
    stopwatch.Stop();
    WriteLine("StructWithRef Comparison: " + stopwatch.ElapsedMilliseconds + " Milliseconds");
}
```

In the above program, all we're doing is calling the Equals method to compare two objects, and we're performing this equality check inside a for loop just so we get more accurate numbers. 

Now, these objects are of type structs. Here struct StructNoRef has only two property `X` and `Y`, which are [value types](/csharp-variable-types/#c-value-types). And, StructWithRef is also a struct but it also has a additional property `Description` which is a [reference type](/csharp-variable-types/#c-reference-types). Like this,

```cs
struct StructNoRef
{
    public int X { get; set; }
    public int Y { get; set; }
}

struct StructWithRef
{
    public int X { get; set; }
    public int Y { get; set; }
    public string Description { get; set; }
}
```

Now if we run the program and test the time required to check the equality we will get result somewhat like this,

```txt
StructNoRef Comparison: 45 Milliseconds
StructWithRef Comparison: 818 Milliseconds
```
As you can see from the output struct with reference type members require 20 times more execution time than a struct with value type members

So why is this? Essentially, when checking for equality of two structs, if none of the fields in the struct are reference types, the Equals method performs a byte-by-byte comparison of the two objects in memory. 

However, if there are reference types, reflection is used, and reflection is comparatively slow. So if you've got structs that contain reference types, you may want to look at the performance of equality checking. 

But we can overcome this issue by overriding the Equals method. When we override the Equals method, we can provide our own code to determine whether two instances are equal. In this case, we're comparing the X and Y values and also the string description. Like this, 

```cs
struct StructWithRef
{
    public int X { get; set; }
    public int Y { get; set; }
    public string Description { get; set; }

    public override bool Equals(object obj)
    {
        if (!(obj is StructWithRef))
            return false;

        var other = (StructWithRef)obj;

        return X == other.X &&
               Y == other.Y &&
               Description == other.Description;
    }
}
```

Because we've overridden the Equals method, the default reflection‑based equality method won't be used. So let's come back to the test.

```txt
StructNoRef Comparison: 48 Milliseconds
StructWithRef Comparison: 47 Milliseconds
```

We can see when we override the Equals method, we reduce time to about 47 ms, which is a significant performance improvement if you're doing a lot of equality checks. 

So that's how we can improve the performance of struct equality checks, by overriding the Equals method and preventing the default reflection-based approach from taking place.

## Forcing Reference Equality Comparisons

For the final tip in this article, we're going to see how we can check the two references point to the same object in memory. 

```cs
Uri a = new Uri("https://codewithshadman.com");
Uri b = new Uri("https://codewithshadman.com");

var areEqual = a == b;
WriteLine(areEqual); //True
```

In the above program, we're creating two new instances of the Uri class. And if I just click on this and hit F12, we can see here that this Uri is a reference type, a class. 

![](/assets/images/csharp-tips/uri_class.JPG)

So even though a and b here are two separate instances and a and b point to two different places in memory, this areEqual Boolean is still being set to true. The reason for that is that the Uri class overrides the concept of equality. 

Even though Uri is a reference type, a class, it overrides the reference equality semantics and instead provides value equality semantics. So as long as these two Uris point to the same website, for example, in this case, [codewithshadman.com](https://codewithshadman.com), they're considered equal even though they point to different places in memory. So if a reference type is providing value equality semantics, such as the Uri class here, we're still able to check if two references point to the same object. 

So, We want to check whether or not a and b point to the same object, we're going to call the ReferenceEquals method on the object class. To use this, we pass in the two references we want to check, in this case, a and b. And for good measure after this, let's go and assign b to a and recheck if a and b point to the same reference. 

```cs
Uri a = new Uri("https://codewithshadman.com");
Uri b = new Uri("https://codewithshadman.com");

var areEqual1 = Object.ReferenceEquals(a,b);
WriteLine(areEqual1); //False

a = b;
var areEqual2 = Object.ReferenceEquals(a, b);
WriteLine(areEqual2); //True
```


Here, the object.ReferenceEquals method is telling us whether or not two references point to the same object in memory. And because a and b are different objects in memory, areEqual1 is returning false here. 

And in the next step, we assigned b to a, both of these variables then point to the same object in memory, and so ReferenceEquals returns true. 

So that's how you can use object.ReferenceEquals to check that two reference types point to the same object in memory if the type is providing value equality semantics.

## Summary

So that brings us to the end of this article. We started this article by looking at how tuples can help reduce the amount of code we need to write and maintain. 

We then learned how to create combinable enums. To do this, we give the elements of the enum specific values, and once we've done this we can also create composites for commonly used combinations. In our code, we can use the HasFlag method to see if an enum contains a specific value, and when we're creating combinable enums, we should apply the Flags attribute. 

Next, we learned how to improve the performance of struct equality comparisons if those structs contain reference types. To do this, we override the Equals method. This prevents the reflection from being used and speeds up the equality check. 

Finally, we learned how to use the object.ReferenceEquals method to determine whether two references point to the same item in memory. That's it for now, join me in the next article by subscribing to my newsletter using the form below.

## Further Reading

- [C# 7.0: Tuples Explained](https://intellitect.com/csharp7-tuples-explained/) by [Mark Michaelis](https://intellitect.com/team/mark-michaelis/) -  In this article, Mark delve into tuples again, covering the full breadth of the syntax options.

- [Type Comparison In C#](/type-comparison-in-csharp/) - This post discusses different types of comparison methods, such as equality operators, object.equals method and IEquatable interface, used for comparing values in C#.

