---
layout: post
current: post
navigation: True
tags: [Csharp Tips]
class: post-template
subclass: 'post csharp-tips'
title: C# String and Formatting Tips
description: In this article, we're going to be learning about a whole host of different tips and tricks related to C# String and Formatting. 
cover: "assets/images/programming2.jpg"
date: Fri Mar 27 00:00:00 2020
last_modified_at: Fri Mar 27 19:03:35 2020
author: shadman_kudchikar
comments: true
---


Whether you're still learning C# or you already have some experience, there will always be gaps in your knowledge, places where you are clueless as to your ignorance.

In the series of articles in [C# Tips](/tag/csharp-tips/) I will provide a whole host of useful information about the sometimes underused or unknown features of both C# and .NET. 

In this article, we're going to be learning about a whole host of different tips and tricks related to C# [String](/c-string/) and Formatting. 

## C# String and Formatting Tips

1. [Simplifying String Empty and Null Checking Code](#simplifying-string-empty-and-null-checking-code)
2. [String Formatting and String Interpolation](#string-formatting-and-string-interpolation)
3. [Formatting and Aligning Values into Columns](#formatting-and-aligning-values-into-columns)
4. [Conditional Formatting for Positive, Negative, and Zero Numbers](#conditional-formatting-for-positive-negative-and-zero-numbers)
5. [Building Strings with the StringBuilder Class](#building-strings-with-the-stringbuilder-class)
6. [Creating and Using Custom Numeric Format Providers](#creating-and-using-custom-numeric-format-providers)

## Simplifying String Empty and Null Checking Code {#simplifying-string-empty-and-null-checking-code}

Let's start with some code,

{% highlight csharp linenos %}

using System;
using static System.Console;

namespace string_formatting_tips
{
    class Program
    {
        static void Main(string[] args)
        {
            while (true)
            {
                WriteLine("Enter your name:");

                string name =ReadLine();

                if (name == null || name == "" || name.Trim() == "")
                {
                    WriteLine("Please enter your name");
                    continue;
                }               

                WriteLine("Hello!" + name);
                break;
            }

            ReadLine();
        }        
    }
}

{% endhighlight %}

The above code reads the user input and checks if the user has entered any value. It also makes sure that the user hasn't typed in a few spaces and hit Enter using the `Trim()` method.

{% highlight csharp linenos %}

name.Trim() == ""
{% endhighlight %}

The first tip we're going to look at is to simplify the above code, and what we're going to do is actually just delete all of the conditional code:

{% highlight csharp linenos %}

if (name == null || name == "" || name.Trim() == "")
{
    ...
}  
{% endhighlight %}

and instead, we're going to make use of the string.IsNullOrWhiteSpace method. 

{% highlight csharp linenos %}

if (String.IsNullOrWhiteSpace(name))
{
    ...
}
{% endhighlight %}

This string.IsNullOrWhiteSpace method returns true if the input string is null and an empty string or contains only whitespace characters, such as spaces and tabs. 

There's also another convenience method on the String class here, and that's the IsNullOrEmpty method. 

{% highlight csharp linenos %}

if (String.IsNullOrEmpty(name))
{
    ...
} 
{% endhighlight %}

This method returns true if the specified string is null or empty, meaning that it contains no characters. But for this version, we're going to make use of the IsNullOrWhiteSpace because we want to make sure that the user hasn't typed in a few spaces and hit Enter. 

Our final code will look like this:

{% highlight csharp linenos %}

using System;
using static System.Console;

namespace string_formatting_tips
{
    class Program
    {
        static void Main(string[] args)
        {
            while (true)
            {
                WriteLine("Enter your name:");

                string name =ReadLine();

                if (String.IsNullOrWhiteSpace(name))
                {
                    WriteLine("Please enter your name");
                    continue;
                }               

                WriteLine("Hello!" + name);
                break;
            }

            ReadLine();
        }        
    }
}
{% endhighlight %}



## String Formatting and String Interpolation {#string-formatting-and-string-interpolation}

{% highlight csharp linenos %}

using System;
using static System.Console;

namespace string_formatting_tips
{
    class Program
    {
        static void Main(string[] args)
        {
            var name = GetName();
            var age = GetAge();

            WriteLine("Name:" + name + " Age:" + age);
            ReadLine();
        }

        public static string GetName()
        {
            while (true)
            {
                WriteLine("Enter your name:");

                string name = ReadLine();


                if (String.IsNullOrWhiteSpace(name))
                {
                    WriteLine("Please enter your name");
                    continue;
                }

                return name;
            }
        }

        public static int GetAge()
        {
            while (true)
            {
                WriteLine("Enter your age:");

                string age = ReadLine();


                if (String.IsNullOrWhiteSpace(age))
                {
                    WriteLine("Please enter your age");
                    continue;
                }

                return Convert.ToInt32(age);
            }
        }
    }
}
{% endhighlight %}

In the above program, we take name and age as input and display it using the string concatenation. 

{% highlight csharp linenos %}

WriteLine("Name:" + name + " Age:" + age);
ReadLine();
{% endhighlight %}
But this is a little bit clunky. As an alternative, we can make use of the string.Format method. 

There are several different overloads to this method, one of which allows us to provide a formatting string as the first parameter and then one or more arguments to fulfill that format.

{% highlight csharp linenos %}

var line = String.Format("Name:{0} Age:{1}", name, age);
WriteLine(line);
{% endhighlight %}

Notice that we've got these braces or curly brackets, and inside these braces, we've got the values 0 and 1. We can then specify values that will be inserted into these positions, 0 and 1. So into position 0, we want to output the name, and into this second position, we want to insert the value age. 

I'm just going to tidy this up so we can see it on one line. 

{% highlight csharp linenos %}

WriteLine(String.Format("Name:{0} Age:{1}", name, age));
{% endhighlight %}

And the benefit of this method is we're not manually concatenating strings. We can see the overall message here, and then the values that get inserted into that message. 

Some methods provide a convenient way to pass a format string and a number of values, and then under the hood call string.Format. So this applies to the WriteLine method. One of the overloads of the WriteLine method allows us to specify a format string and then a number of values like this:

{% highlight csharp linenos %}

WriteLine("Name:{0} Age:{1}", name, age);
{% endhighlight %}

One disadvantage of the string.Format approach is that we're somewhat disconnected between the items in the format string, such as 0 and 1, and the actual data that's being passed into them.

An alternative method that solves this problem is to make use of C#'s string interpolation. So we can create an interpolated string by prefixing the string with a dollar sign, as we can see here. 

{% highlight csharp linenos %}

WriteLine($"Name:{name} Age:{age}");
{% endhighlight %}

As with the string.Format version, we make use of the braces, but inside the braces here, notice that rather than specifying positions such as 0 and 1, we specify directly the item that we want to output. 

So this may help prevent bugs where we've got the order of the string.Format values mixed up. For example, here if we accidentally mixed up the order of name and age, we wouldn't get a compilation error and the program would still run, but we would get the wrong data item's output. 


## Formatting and Aligning Values into Columns {#formatting-and-aligning-values-into-columns}

Sometimes you may want to format strings in such a way as things line up perfectly in columns. 


{% highlight csharp linenos %}

using System;
using System.Collections.Generic;
using static System.Console;

namespace string_formatting_tips
{
    class Program
    {
        static void Main(string[] args)
        {
            var people = new List<Person>()
            {
                new Person{ Name="Clarence Barnes",  Age= 27 },
                new Person{ Name= "Erica Wood",  Age= 33 },
                new Person{ Name= "Lois Watson",  Age= 56 },
                new Person{ Name= "Teresa Moore",  Age= 25 },
                new Person{ Name= "Addison Richardson",  Age= 45 }
            };

            foreach (var person in people)
            {
                WriteLine("Name: " + person.Name + " Age:" + person.Age);                
            }

            ReadLine();
        }              

        public class Person
        {
            public string Name { get; set; }
            public int Age { get; set; }
        }
    }
}
{% endhighlight %}

The above program generates the following result:

{% highlight text linenos %}

Name: Clarence Barnes Age:27
Name: Erica Wood Age:33
Name: Lois Watson Age:56
Name: Teresa Moore Age:25
Name: Addison Richardson Age:45
{% endhighlight %}



Let's see how we can line up the output perfectly in columns. 

We'll start with a harder way of solving this problem. Once again, we're going to use string concatenation. 

{% highlight csharp linenos %}

WriteLine("Name: "+ person.Name.PadRight(20)+" Age:"+ person.Age.ToString().PadRight(20));
{% endhighlight %}

Here we call the string's PadRight method and pass in a value of 20, which represents the total column width that we want here. So as long as none of the first names exceed 20 we should be okay. 

We continued with this string concatenation, Notice here, though, that we don't have the PadRight method available on the Integer type, so we need to convert this to a string first. 

So we called ToString.PadRight, and made the column holding the Age 20 wide as well. 

The above changes will generate the following result:

{% highlight text linenos %}

Name: Clarence Barnes      Age:27
Name: Erica Wood           Age:33
Name: Lois Watson          Age:56
Name: Teresa Moore         Age:25
Name: Addison Richardson   Age:45
{% endhighlight %}

There's an easier way to accomplish this, however, and that's to once again make use of the string.Format method. 

{% highlight csharp linenos %}

WriteLine(String.Format("Name: {0,-20} Age:{1,-20}", person.Name, person.Age));
{% endhighlight %}

or simply do this:

{% highlight csharp linenos %}

WriteLine("Name: {0,-20} Age:{1,-20}", person.Name, person.Age);
{% endhighlight %}

or this:

{% highlight csharp linenos %}

WriteLine($"Name: {person.Name,-20} Age:{person.Age,-20}");
{% endhighlight %}

So this is almost identical to what we saw before, but notice in the formatting expressions here we've got an additional parameter. The first parameter specifies the position of the argument that will be mapped to that element, so 0 represents Name and 1 represents Age, but the second parameter after the comma allows us to specify formatting information. 

Once again, we want a left‑aligned Name column 20 wide, so we need to specify ‑20 to get that left‑aligned. And for the Age, once again, left‑aligned, 20 wide. 

In addition to using the second parameter of these items to specify column widths, we can also use them to specify formatting, for example to output numbers or dates. If you want to learn more about the different options available here, be sure to check out the [documentation](https://docs.microsoft.com/en-us/dotnet/api/system.string.format?view=netframework-4.8#Starting). 



## Conditional Formatting for Positive, Negative, and Zero Numbers {#conditional-formatting-for-positive-negative-and-zero-numbers}

Let's see a completely different example, suppose we want to display a product ranting of type int. 

{% highlight csharp linenos %}

using System;
using System.Collections.Generic;
using static System.Console;

namespace string_formatting_tips
{
    class Program
    {
        static void Main(string[] args)
        {
            var products = new List<Product>()
            {
                new Product{ Name="BLACK SUN GLASS",  Rating= 5 },
                new Product{ Name= "BEAUTIFUL HEAD CAP",  Rating= 3 },
                new Product{ Name= "HEAD PROTECTED CAP",  Rating= 5 },
                new Product{ Name= "BORING HEAD CAP",  Rating= -5 },
                new Product{ Name= "NEW AGE SUN GLASS",  Rating= 0 }
            };

            foreach (var product in products)
            {
                WriteLine($"Name: {product.Name,-20} Rating:{product.Rating,-20}");
            }

            ReadLine();
        }              

        public class Product
        {
            public string Name { get; set; }
            public int Rating { get; set; }
        }
    }
}

/*
Output:
Name: BLACK SUN GLASS      Rating:5
Name: BEAUTIFUL HEAD CAP   Rating:3
Name: HEAD PROTECTED CAP   Rating:5
Name: BORING HEAD CAP      Rating:-5
Name: NEW AGE SUN GLASS    Rating:0
*/
{% endhighlight %}

Suppose that rather than outputting the integer value for the productivity rating as it is, we wanted some conditional formatting. So, for example, we wanted to output the text Good if the value is positive, we wanted to output Bad if the value is negative, and if the value is 0, we want to assume that they're a new product and don't currently have a rating. 

So we could use an if statement or ternary operator to do this depending on the value for productivity rating, 

{% highlight csharp linenos %}

var rating = product.Rating < 0 ? "Bad": product.Rating > 0 ? "Good" : "Not Rated";
WriteLine($"Name: {product.Name,-20} Rating:{rating,-20}");
{% endhighlight %}

but there's an easier way, and that's to use a three‑part conditional formatting string.

{% highlight csharp linenos %}

WriteLine($"Name: {product.Name,-20} Rating:{product.Rating.ToString("Good;Bad;Not Rated"),-20}");
{% endhighlight %}

A three‑part format string is separated by semicolons here. In the first part of this three‑part format, we can specify how we want positive numbers presented. 

We can also output the actual value. One way we can get the actual value is to specify the hash or the pound symbol, and this will map to the numeric value, in our case the rating. 

{% highlight csharp linenos %}

product.Rating.ToString("Good #;Bad -#;Not Rated")
{% endhighlight %}

So now we've defined this format, we can go and make use of it:

{% highlight csharp linenos %}

using System;
using System.Collections.Generic;
using static System.Console;

namespace string_formatting_tips
{
    class Program
    {
        static void Main(string[] args)
        {
            var products = new List<Product>()
            {
                new Product{ Name="BLACK SUN GLASS",  Rating= 5 },
                new Product{ Name= "BEAUTIFUL HEAD CAP",  Rating= 3 },
                new Product{ Name= "HEAD PROTECTED CAP",  Rating= 5 },
                new Product{ Name= "BORING HEAD CAP",  Rating= -5 },
                new Product{ Name= "NEW AGE SUN GLASS",  Rating= 0 }
            };

            foreach (var product in products)
            {
                WriteLine($"Name: {product.Name,-20} Rating:{product.Rating.ToString("Good #;Bad -#;Not Rated"),-20}");
            }

            ReadLine();
        }              

        public class Product
        {
            public string Name { get; set; }
            public int Rating { get; set; }
        }
    }
}

{% endhighlight %}

The above program will generate the following result:

{% highlight text linenos %}

Name: BLACK SUN GLASS      Rating:Good 5
Name: BEAUTIFUL HEAD CAP   Rating:Good 3
Name: HEAD PROTECTED CAP   Rating:Good 5
Name: BORING HEAD CAP      Rating:Bad -5
Name: NEW AGE SUN GLASS    Rating:Not Rated
{% endhighlight %}

## Building Strings with the StringBuilder Class {#building-strings-with-the-stringbuilder-class}

Let's say we want to display all the above products name in one line separated by a comma.

{% highlight text linenos %}

BLACK SUN GLASS, BEAUTIFUL HEAD CAP, HEAD PROTECTED CAP, BORING HEAD CAP, NEW AGE SUN GLASS,
{% endhighlight %}

Then the required program might look like this,

{% highlight csharp linenos %}

var line = "";
foreach (var product in products)
{
    line += product.Name + ", ";
}
Console.WriteLine(line);
{% endhighlight %}

So this first version uses string concatenation here where we're just adding one string to another string inside this loop. When you're concatenating strings like this, one alternative is to use the StringBuilder class. 


{% highlight csharp linenos %}

var stringBuilder = new StringBuilder();
{% endhighlight %}

The two most common methods that you'll use are the StringBuilder.Append method and the AppendLine method, which adds a carriage return line feed at the end. 

{% highlight csharp linenos %}

foreach (var product in products)
{
    stringBuilder.Append(product.Name);
    stringBuilder.Append(", ");
}
{% endhighlight %}

To get the final string, we can call the ToString method of the StringBuilder. But because we're using string interpolation here, we don't have to manually specify the ToString method, it will be called automatically for us. 

{% highlight csharp linenos %}

Console.WriteLine(stringBuilder);
{% endhighlight %}

There are two main reasons why you might want to consider using a StringBuilder over manually concatenating strings. 

The first is performance. In this example, we've only got four products in the list of products, so the foreach loop will only execute four times. In this first version using string concatenation, we probably won't experience too much of a performance problem, but if we had 1000 items in the list or 10,000, or even more, this method of string concatenation is inefficient. 

If you're performing string concatenation inside of a loop, and you might perform the concatenation many, many times, you may want to consider instead using the StringBuilder version. 

The second reason you may want to consider using a StringBuilder is if it improves readability. Even if you're not concatenating strings inside a loop, you may feel that a StringBuilder offers a more readable syntax.

## Creating and Using Custom Numeric Format Providers {#creating-and-using-custom-numeric-format-providers}

Sometimes you might have more complex formatting requirements, or you may want to create the formatting once and then reuse it in multiple places or multiple applications. One way to achieve this is to create custom format providers. Let's create one for the rating.

{% highlight csharp linenos %}

using System;
using System.Collections.Generic;
using System.Text;
using static System.Console;

namespace string_formatting_tips
{
    class Program
    {
        static void Main(string[] args)
        {
            var products = new List<Product>()
            {
                new Product{ Name="BLACK SUN GLASS",  Rating= 5 },
                new Product{ Name= "BEAUTIFUL HEAD CAP",  Rating= 3 },
                new Product{ Name= "HEAD PROTECTED CAP",  Rating= 5 },
                new Product{ Name= "BORING HEAD CAP",  Rating= -5 },
                new Product{ Name= "NEW AGE SUN GLASS",  Rating= 0 }
            };

            foreach (var product in products)
            {
                var rating = String.Format(new RatingFormatProvider(), "{0}", product.Rating);
                WriteLine($"Name: {product.Name,-20} Rating: {rating,-20}");
            }

            ReadLine();
        }              

        public class Product
        {
            public string Name { get; set; }
            public int Rating { get; set; }
        }

        public class RatingFormatProvider : IFormatProvider, ICustomFormatter
        {
            public string Format(string format, object arg, IFormatProvider formatProvider)
            {
                int rating = (int)arg;

                return rating.ToString("Good #;Bad -#;Not Rated");
            }

            public object GetFormat(Type formatType)
            {
                if (formatType == typeof(ICustomFormatter))
                {
                    return this;
                }

                return null;
            }
        }
    }
}
{% endhighlight %} 

## Summary
So that brings us to the end of this article. We started by learning how we can simplify null or whitespace checking code with one of the string static methods such as the string.IsNullOrWhiteSpace method. 

Next, we started to look at different ways to format content, such as using the string.Format method, or instead, how we can make use of string interpolation to simplify the code. 

Next, we learned some different ways to format values in two columns. And then we learned how to create a three‑part numeric conditional formatting string that allows us to specify different formatting for positive, negative, and 0 values. 

We learned as an alternative to manually concatenating strings. We can instead use an instance of the StringBuilder class, and this may give us performance benefits if we're doing string concatenation within a loop and we have a large number of loop iterations. 

Finally, we learned how we can create custom formatting and centralize it in one location by creating a custom format provider. To do this, we need to implement the IFormatProvider and ICustomFormatter interfaces.

## Further Reading

- [C# String.Format() and StringBuilder](/c-stringformat-and-stringbuilder/) - This article discusses whether String.Format is as efficient as StringBuilder in .NET.

- [Exploring memory allocation and strings](https://blog.maartenballiauw.be/post/2016/11/15/exploring-memory-allocation-and-strings.html) by [Maarten Balliauw](https://blog.maartenballiauw.be/) - Strings are objects like any other object and follow the same rules. In this post, Maarten explains how they behave in terms of memory allocation.

- [What is string interpolation?](http://irisclasson.com/2016/01/02/not-so-stupid-question-283-what-is-string-interpolation/) by [Iris Classon](http://irisclasson.com/) - In "(Not so) Stupid Question" section of her blog Iris talks about string interpolation and explains its internal working.

- [string vs. String is not a style debate](https://blog.paranoidcoding.com/2019/04/08/string-vs-String-is-not-about-style.html) by [Jared Parsons](https://blog.paranoidcoding.com/) - Jared Parson who works on the C# compiler notes that String vs string is not a style debate. He makes a compelling case for why you should always use string.