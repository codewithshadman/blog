---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: Getting Started With C#
description: In this article we run through a standard 'hello world' example, with links to articles covering the different parts of the program.
comments: true
permalink: /getting-started-with-csharp/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---

Let's begin in the traditional way, by looking at the code of a 'Hello World' program using C# language.

{% highlight csharp linenos %}

using System;
public class HelloWorld
{
	public static void Main()
	{
		// This is a single line comment
		/* This is a
		multiple
		line comment */
		Console.WriteLine("Hello World!");
	}
}
{% endhighlight %}


The first thing to note about C# is that it is case-sensitive. You will therefore get compiler errors if, for instance, you write 'console' rather than 'Console'.

The second thing to note is that every statement finishes with a semicolon (;) or else takes a code block within curly braces.

As C# is an object-oriented language, C# programs must be placed in classes (classes are discussed in my blog post - [C# Object-Oriented Programming](/csharp-object-oriented-programming/#c-classes-and-types), but if you are new to object orientation we suggest that you first read some introductory material). Line 2 above declares the class to be named 'HelloWorld'.

Line 1 of the code declares we are using the System namespace (namespaces are also covered in my blog post - [C# Object-Oriented Programming](/csharp-object-oriented-programming/#c-namespaces)). The point of this declaration is mostly to save ourselves time typing. Because the 'Console' object used in line 10 of the code actually belongs to the 'System' namespace, its fully qualified name is 'System.Console'. However, because in line 1 we declare that the code is using the System namespace, we can then leave off the 'System.' part of its name within the code.

When compiled and run, the program above will automatically run the 'Main' method declared and begun in line 4. Note again C#'s case-sensitivity - the method is 'Main' rather than 'main'.

Lines 6-9 of the program are ignored by the compiler, being comments entered by the programmer for his own benefit. Line 6 shows a single line comment, in which everything on the line after the two forward slashes is ignored by the compiler. Lines 7-9 demonstrate a multi-line comment, in which everything between the opening /\* and closing \*/ is ignored, even when it spans multiple lines.

The statement on line 10 calls the 'WriteLine' method of the Console class in the System namespace. It should be obvious how this works in the given example - it just prints out the given string to the 'Console' (on PC machines this will be a DOS prompt). For a more complicated use of the WriteLine method, see my blog post - [C# String](/c-string/).

In order to run it, the program above must first be saved in a file. Unlike in Java, the name of the class and the name of the file in which it is saved do not need to match up, although it does make things easier if you use this convention. In addition, you are free to choose any extension for the file, but it is usual to use the extension '.cs'.

Suppose that you have saved the file as 'HelloWorld.cs'. Then to compile the program from a command line, you would use the command

csc HelloWorld.cs
(for Visual Studio .NET users: compile by pressing Ctrl-Shift-B)

This command would generate the executable HelloWorld.exe, which could be run in the usual way, by entering its name:

HelloWorld
(for Visual Studio .NET users: run by pressing Ctrl-F5)

Fairly obviously, this program would produce the output:

{% highlight text linenos %}

Hello World!
{% endhighlight %}