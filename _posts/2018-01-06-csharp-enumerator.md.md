---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: C# Enumerator
description: C# Enums or Enumeration is a special kind of value type limited to a restricted and unchangeable set of numerical values. An enumerated type is declared using the enum keyword.
comments: true
permalink: /csharp-enumerator/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---

An enumeration is a special kind of value type limited to a restricted and unchangeable set of numerical values. By default, these numerical values are integers, but they can also be longs, bytes, etc. (any numerical value except char) as will be illustrated below.

When you define an enumeration you provide literals which are then used as constants for their corresponding values. The following code shows an example of such a definition:

```cs
public enum DAYS
{
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}
```


Note, however, that there are no numerical values specified in the above. Instead, the numerical values are (we think) set up according to the following two rules:

1. For the first literal: if it is unassigned, set its value to 0.

2. For any other literal: if it is unassigned, then set its value to one greater than the value of the preceding literal.

From these two rules, it can be seen that DAYS.Monday will be set to 0, and the values increased until DAYS.Sunday is set to 6. Note also how we are referring to these values - the values specified in an enumeration are static, so we have to refer to them in code using the name of the enumeration: "DAYS.Monday" rather than just "Monday". Furthermore, these values are final - you can't change their runtime value.

The following code demonstrates how you can override the default setting which makes the default values integers. In this example, the enumeration values are set to bytes.

```cs
enum byteEnum : byte
{
    A,
    B
}
```


You can also override the default numerical values of any and all of the enumeration elements. In the following example, the first literal is set to value 1. The other literals are then set up according to the second rule given above, so DAYS.Sunday will end up equal to 7.

```cs
public enum DAYS
{
    Monday=1,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}
```


In the two examples given, the values of each literal has been unique within the enumeration. This is usually how you will want things to be, but in fact the values need not be unique. In the following case, the value of DAYS.Thursday is also set to equal 1. The values assigned to the other literals will follow the rules given previously, so both DAYS.Tuesday and DAYS.Friday will equal 2, etc.

```cs
public enum DAYS
{
    Monday=1,
    Tuesday,
    Wednesday,
    Thursday=1,
    Friday,
    Saturday,
    Sunday
}
```


In C# enumerations are type-safe, by which we mean that the compiler will do its best to stop you assigning illicit values to enumeration typed variables. For instance, the following code should not compile:

```cs
int i = DAYS.Monday;
DAYS d = i;
```


In order to get this code to compile, you would have to make explicit casts both ways (even converting from DAYS to int), ie:

```cs
int i = (int)DAYS.Monday;
DAYS d = (DAYS)i;
```

At this point you may be wondering what happens if you cast an int to an enumeration value where that same value is defined for two elements within the enumeration. And the answer is this: one of the elements is given 'primary' status, so it gets picked ahead of the other.

A useful feature of enumerations is that one can retrieve the literal as a string from the numeric constant with which it is associated. In fact, this is given by the default ToString() method, so the following expression comes out as true:

```cs
DAYS.Monday.ToString()=="Monday"
```

The following code prints out both the literal and its constant value for the specified enumeration.

```cs
using System;
public class EnumTest
{
    public enum DAYS: byte
    {Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday}
    public static void Main()
    {
        Array dayArray = Enum.GetValues(typeof(EnumTest.DAYS));
        foreach (DAYS day in dayArray)
            Console.WriteLine("Number {1} of EnumTest.DAYS is {0}", 
                day, day.ToString("d"));
    }
}
```


Since it's not immediately obvious what's going on in the main method here, let's take the time to go through it.

On line 9 we use the static `GetValues` method of the Enum class. When you pass this class an enumeration type - in this case, the type corresponding to EnumTest.DAYS - it returns an array of all the values of the elements within that enumeration. Note that the Enum class also has the `GetNames` method, which returns the literal strings.

On line 10 we set up a foreach loop, pulling out, into day, each value in the dayArray in turn. Note that this value is of type DAYS.

On line 11 we use string interpolation as part of the `Console.WriteLine` method. This method makes use of the `String.Format` method, so is equivalent to:

```cs
Console.WriteLine(String.Format("Number {1} of EnumTest.DAYS is {0}", 
    day, day.ToString("d")));
```

And what the String.Format method does is to take 'textual representations' of the objects it is passed as parameters, and slots them into the appropriate places within the 'format string' it is passed. So this line of code is basically equivalent to:

```cs
Console.WriteLine("Number " + day.ToString("d").ToString() + 
    " of EnumTest.DAYS is " + day.ToString());
```

Now, we've already noted that `day.ToString()` will return a literal string, but what about the method `day.ToString("d")`? Well, we had a stab at explaining this a while ago, but did very badly. In fact, we just made an error. So hopefully the following will be better.

The ToString method can take a single IFormatProvider parameter which indicates how the string conversion should be conducted. Values for this parameter can include things like "g", "d", "x", "f", etc. The stated implication of "d", however, is to render in 'Decimal format'. And when we use this on an enumeration member, it provides a string representation of the *numerical value* of the enumeration member. So, when we run the code above, what we get is the following output:

```txt
Number 0 of EnumTest.DAYS is Monday
Number 1 of EnumTest.DAYS is Tuesday
Number 2 of EnumTest.DAYS is Wednesday
Number 3 of EnumTest.DAYS is Thursday
Number 4 of EnumTest.DAYS is Friday
Number 5 of EnumTest.DAYS is Saturday
Number 6 of EnumTest.DAYS is Sunday
```