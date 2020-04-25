---
layout: post
current: post
navigation: True
tags: [Csharp]
class: post-template
subclass: 'post csharp'
title: C# String.Format() and StringBuilder
description: This article discusses whether String.Format is as efficient as StringBuilder in .NET.
cover: "assets/images/c-stringformat-and-stringbuilder.jpg"
date: Sat Oct 12 17:56:37 2019
last_modified_at: Sat Oct 12 19:30:02 2019
author: shadman_kudchikar
comments: true
---


> **Note:** If you are not familiar with String.Format and StringBuilder you can learn about it in my blog post [C# String](/c-string/).

Recently, I saw some code that looked something like this:

```cs
StringBuilder builder = new StringBuilder();
builder.Append(String.Format("{0} {1}", firstName, lastName));
// Do more with builder...
```

Now, I don't wana get into arguments about how String.Concat() is more performant here. String.Format() allows code to be more easily localized and it is being used for that purpose here. The real problem is that StringBuilder.AppendFormat() should be used instead:

```cs
StringBuilder builder = new StringBuilder();
builder.AppendFormat("{0} {1}", firstName, lastName);
// Do more with builder...
```

<!--more-->

The reason that this is important is because, internally, String.Format() actually creates a StringBuilder and calls StringBuilder.AppendFormat()! String.Format() is implemented something like this:

```cs
public static string Format(IFormatProvider provider, string format, params object[] args)
{
  if (format == null || args == null)
   throw new ArgumentNullException((format == null ? "format" : "args"));

  StringBuilder builder = new StringBuilder(format.Length + (args.Length * 8));
  builder.AppendFormat(provider, format, args);
  return builder.ToString();
}
```

you can see the actual implementation in the source code for the runtime of .NET Core.
Here is the link for the same: [String.Manipulation.cs](https://github.com/dotnet/coreclr/blob/master/src/System.Private.CoreLib/shared/System/String.Manipulation.cs)

In String.Manipulation.cs file you will find the Format method:

![](/assets/images/string-format-codebase1.PNG)

From the above code, you can see that Format method calls an internal method FormatHelper.

![](/assets/images/string-format-codebase2.PNG)

Now, the FormatHelper method uses StringBuilder for formatting the text using [StringBuilderCache](https://github.com/dotnet/coreclr/blob/master/src/System.Private.CoreLib/shared/System/Text/StringBuilderCache.cs).

It turns out that the formatting logic is actually implemented in StringBuilder.AppendFormat(). So, the original code actually caused a second StringBuilder to be utilized when it wasn't needed.

This is also important to know if you are trying to avoid creating a StringBuilder by concatentating strings with String.Format(). For example:

```cs
string nameString = "<td>" + String.Format("{0} {1}", firstName, lastName) + "</td>"
  + "<td>" + String.Format("{0}, {1}", id, department) + "</td>";
```

That code will actually create two StringBuilders, if the size of formatted string is greater than MaxBuilderSize, used in StringBuilderCache, which is set to 360. So, creating one StringBuilder and using AppendFormat() will be more performent:

```cs
StringBuilder nameBuilder = new StringBuilder();
nameBuilder.Append("<td>");
nameBuilder.AppendFormat("{0} {1}", firstName, lastName);
nameBuilder.Append("</td>");
nameBuilder.Append("<td>");
nameBuilder.AppendFormat("{0}, {1}", id, department);
nameBuilder.Append("</td>");
string nameString = nameBuilder.ToString();
```

I decided to run some performance tests to verify my claims. First, I timed code that demonstrates the very reason that StringBuilder exists:

```cs
const int LOOP_SIZE = 10000;
const string firstName = "Shadman";
const string lastName = "Kudchikar";
const int id = 1;
const string department = ".NET Team";

static void PerformanceTest1()
{
  string nameString = String.Empty;

  for (int i = 0; i < LOOP_SIZE; i++)
    nameString += String.Format("{0} {1}", firstName, lastName);
}
```

The above code creates a new string and then concatenates to it inside of a for-loop. This causes two new strings to be created on each pass--one from String.Format() and one from the concatenation. This is woefully inefficient.

Next, I tested the same code modified to use a StringBuilder with String.Format():

```cs
static void PerformanceTest2()
{
  StringBuilder builder = new StringBuilder((firstName.Length + lastName.Length + 1) * LOOP_SIZE);

  for (int i = 0; i < LOOP_SIZE; i++)
    builder.Append(String.Format("{0} {1}", firstName, lastName));

  string nameString = builder.ToString();
}
```

Finally, I tested code that uses StringBuilder.AppendFormat() instead of String.Format():

```cs
static void PerformanceTest3()
{
  StringBuilder builder = new StringBuilder((firstName.Length + lastName.Length + 1) * LOOP_SIZE);

  for (int i = 0; i < LOOP_SIZE; i++)
    builder.AppendFormat("{0} {1}", firstName, lastName);

  string nameString = builder.ToString();
}
```

These three methods ran with the following timings:

For .NET Framework:

```txt
PerformanceTest1: 0.21045 seconds
PerformanceTest2: 0.001585 seconds
PerformanceTest3: 0.0010846 seconds
```

For .NET Core:

```txt
PerformanceTest1: 0.173821 seconds
PerformanceTest2: 0.0012753 seconds
PerformanceTest3: 0.0007812 seconds
```

Obviously, concatenating a string in a loop without using a StringBuilder is amazingly inefficient. And, removing the call to String.Format also yields a performance boost.

Next, I tested the following two methods:

```cs
static void PerformanceTest4()
{
  string htmlString;
  for (int i = 0; i < LOOP_SIZE; i++)
    htmlString = "<td>" + String.Format("{0} {1}", firstName, lastName) + "</td><td>"
      + String.Format("{0}, {1}", id, department) + "</td>";
}
static void PerformanceTest5()
{
  StringBuilder builder = new StringBuilder(256);

  string htmlString;
  for (int i = 0; i < LOOP_SIZE; i++)
  {
    builder.Append("<td>");
    builder.AppendFormat("{0} {1}", firstName, lastName);
    builder.Append("</td><td>");
    builder.AppendFormat("{0}, {1}", id, department);
    builder.Append("</td>");
    htmlString = builder.ToString();
    builder.Length = 0;
  }
}
```

These two methods ran with the following timings:

For .NET Framework:

```txt
PerformanceTest4: 0.0050095 seconds
PerformanceTest5: 0.0044467 seconds
```

For .NET Core:

```txt
PerformanceTest4: 0.0036363999999999997 seconds
PerformanceTest5: 0.0019971 seconds
```

As you can see, it is important to know when to use String.Format and when to use StringBuilder.AppendFormat(). While the performance boosts that can be achieved are fairly small, they are too easy to code.

You can download the performance tests here: [https://github.com/kudchikarsk/string-format-performance-test](https://github.com/kudchikarsk/string-format-performance-test).

## Further Reading

- [Exploring memory allocation and strings](https://blog.maartenballiauw.be/post/2016/11/15/exploring-memory-allocation-and-strings.html) by [Maarten Balliauw](https://blog.maartenballiauw.be/) - Strings are objects like any other object and follow the same rules. In this post, Maarten explains how they behave in terms of memory allocation.

- [What is string interpolation?](http://irisclasson.com/2016/01/02/not-so-stupid-question-283-what-is-string-interpolation/) by [Iris Classon](http://irisclasson.com/) - In "(Not so) Stupid Question" section of her blog Iris talks about string interpolation and explains its internal working.

- [string vs. String is not a style debate](https://blog.paranoidcoding.com/2019/04/08/string-vs-String-is-not-about-style.html) by [Jared Parsons](https://blog.paranoidcoding.com/) - Jared Parson who works on the C# compiler notes that String vs string is not a style debate. He makes a compelling case for why you should always use string.

- [Challenging the C# StringBuilder Performance](https://michaelscodingspot.com/challenging-the-c-stringbuilder/) by [Michael Shpilt](https://michaelscodingspot.com/) - In this post Michael performed some benchmarking on string concatenation and derived conclusion similar to above tests. 