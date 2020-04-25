---
layout: post
current: post
navigation: True
tags: [Csharp]
class: post-template
subclass: 'post csharp'
title:  "Python Style Tuple In C#"
description: "C# 7.0 (.NET Framework 4.7) introduced ValueTuple, a structure which is a value type representation of the Tuple. It can be used where you want to have a data structure to hold an object with properties, but you don't want to create a separate type for it."
cover: "assets/images/python-code.jpg"
date:   2018-06-06 07:48:17 +0530
last_modified_at: Sat Jun 22 12:34:44 2019
author: shadman_kudchikar
comments: true
---


## Contents

* [What Is Tuple In Python?](#what-is-tuple-in-python)
* [Far From Python Style Tuple](#far-from-python-style-tuple)
* [Python Style Tuple In C# 7.0](#python-style-tuple-in-csharp-7)
* [References](#references)

## What Is Tuple In Python? {#what-is-tuple-in-python}

A Tuple is a collection of Python objects separated by commas. In someways a tuple is similar to a list in terms of indexing, nested objects and repetition but a tuple is immutable unlike lists which are mutable.

<!--more-->

Lets see some code example in python,

```python
firstName, lastName = ("Bill", "Gates")
```
Similar code in C#

```csharp
(string FirstName, string LastName) person = ("Bill", "Gates");
```

Lets see how C# went from **close to actual python style tuple** in C#,

## Far From Python Style Tuple {#far-from-python-style-tuple}

The Tuple<T> class was introduced in .NET Framework 4.0. A tuple is a data structure that contains a sequence of elements of different data types. It can be used where you want to have a data structure to hold an object with properties, but you don't want to create a separate type for it.

Lets see some sample code 
```csharp
Tuple<int, string, string> person = 
			new Tuple <int, string, string>(1, "Steve", "Jobs");
person.Item1; // returns 1
person.Item2; // returns "Steve"
person.Item3; // returns "Jobs"

var person = Tuple.Create(1, "Steve", "Jobs");
person.Item1; // returns 1
person.Item2; // returns "Steve"
person.Item3; // returns "Jobs"



var numbers = Tuple.Create("One", 2, 3, "Four", 5, "Six", 7, 8);
numbers.Item1; // returns "One"
numbers.Item2; // returns 2
numbers.Item3; // returns 3
numbers.Item4; // returns "Four"
numbers.Item5; // returns 5
numbers.Item6; // returns "Six"
numbers.Item7; // returns 7
numbers.Rest; // returns (8)
numbers.Rest.Item1; // returns 8
```

Tuples can be used in the following scenarios:
- When you want to return multiple values from a method without using ref or out parameters.
- When you want to pass multiple values to a method through a single parameter.
- When you want to hold a database record or some values temporarily without creating a separate class.

Tuple Limitations:
- Tuple is a reference type and not a value type. It allocates on heap and could result in CPU intensive operations.
- Tuple is limited to include 8 elements. You need to use nested tuples if you need to store more elements. However, this may result in ambiguity.
- Tuple elements can be accessed using properties with a name pattern Item<elementNumber> which does not make sense.

C# 7 includes ValueTuple to overcome the limitations of Tuple and also makes it even easier to work with Tuple. Lets learn more about it,

## Python Style Tuple In C\# 7.0 {#python-style-tuple-in-csharp-7}

C# 7.0 (.NET Framework 4.7) introduced ValueTuple, a structure which is a value type representation of the Tuple.

The ValueTuple is only available in .NET Framework 4.7. If you don't see ValueTuple in your project then you need to install the ValueTuple. (.NET Framework 4.7 or higher, or .NET Standard Library 2.0 or higher already includes ValueTuple.)

To install the ValueTuple package, right click on the project in the solution explorer and select **Manage NuGet Packages...** This will open the NuGet Package Manager. Click the **Browse** tab, search for ValueTuple in the search box and select the **System.ValueTuple** package.

Lets see some code example,

```csharp
var person = (1, "Bill", "Gates");
    
//equivalent Tuple
//var person = Tuple.Create(1, "Bill", "Gates");

ValueTuple<int, string,string> person = (1, "Bill", "Gates");
person.Item1;  // returns 1
person.Item2;   // returns "Bill"
person.Item3;   // returns "Gates"


(int, string, string) person = (1, "Bill", "Gates");
person.Item1;  // returns 1
person.Item2;   // returns "Bill"
person.Item3;   // returns "Gates"

(int Id, string FirstName, string LastName) person = ("Bill", "Gates", 60);
person.Id;   // returns 1
person.FirstName;  // returns "Bill"
person.LastName; // returns "Gates"

//We can also assign member names at the right side with values, as below.
var person = (Id:1, FirstName:"Bill", LastName: "Gates");
person.Id;   // returns 1
person.FirstName;  // returns "Bill"
person.LastName; // returns "Gates"


// PersonId, FName, LName will be ignored.
(int Id, string FirstName, string LastName) person = 
				(PersonId:1, FName:"Bill", LName: "Gates");


```

You may have notice now from above example how this C# tuples are now much alike to python style tuples. We can also specify different member names for a ValueTuple returned from a method.

```csharp
static void Main(string[] args)
{
    var person = GetPerson();
    (var id, var fname, var lname) = GetPerson();
}

static (int Id, string FirstName, string LastName) GetPerson()
{
    return (1, "Bill", "Gates");
}
```

ValueTuple also allows "discards" in deconstruction for the members you are not going to use.

```csharp
(var id, var fname, _) = GetPerson(); // use discard _ for the unused member LastName
```

You can learn more about ValueType Tuples in C# [here][tuples-csharp-article].

## References {#references}
-  [https://intellitect.com/csharp7-tuples-explained/](https://intellitect.com/csharp7-tuples-explained/)
-  [https://www.geeksforgeeks.org/tuples-in-python/](https://www.geeksforgeeks.org/tuples-in-python/)
-  [https://stackoverflow.com/questions/14518498/how-to-achieve-multiple-return-values-in-c-sharp-like-python-style](https://stackoverflow.com/questions/14518498/how-to-achieve-multiple-return-values-in-c-sharp-like-python-style)

[post-image]: /assets/images/python-code.jpg
[tuples-csharp-article]: https://intellitect.com/csharp7-tuples-explained/
[Instagram]: https://www.instagram.com/kudchikarsk
[LinkedIn]: https://linkedin.com/in/kudchikarsk