---
layout: post
current: post
navigation: True
tags: [Csharp]
class: post-template
subclass: 'post csharp'
title: C# Pattern Programs
description: A complete collection of c# pattern programs. This article explains the list of star pattern programs in c# programming language.
cover: "assets/images/star-pattern/cover.jpg"
date: Sun Sep 22 12:43:09 2019
last_modified_at: Sun Sep 22 12:43:11 2019
author: shadman_kudchikar
comments: true
---



This article explains various star (\*) pattern programs in c# programming language. You can download the complete project from [here](https://github.com/kudchikarsk/csharp-star-pattern-programs) containing source code for all the star pattern programs discussed in this article.

## Content 

- [Inverted Right Angle Triangle Pattern](#inverted-right-angle-triangle-pattern)
- [Right Angle Triangle Pattern](#right-angle-triangle-pattern)
- [Diamond Pattern](#diamond-pattern)
- [Right Angle Triangle Reflection Pattern](#right-angle-triangle-reflection-pattern)
- [Parallelogram Pattern](#parallelogram-pattern)
- [Hollow Rectangle Pattern](#hollow-rectangle-pattern)
- [Castle Pattern](#castle-pattern)
- [Pyramid Pattern](#pyramid-pattern)
- [Fair Flag Pattern](#fair-flag-pattern)
- [Hollow Right Angle Triangle Pattern ](#hollow-right-angle-triangle-pattern)
- [Hollow Pyramid Pattern ](#hollow-pyramid-pattern)
- [Left Arrow Pattern](#left-arrow-pattern)
- [Hollow Diamond Pattern](#hollow-diamond-pattern)
- [Heart Pattern](#heart-pattern)

<!--more-->

## Inverted Right Angle Triangle Pattern 

![](/assets/images/star-pattern/1.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	for (int row = 8; row >= 1; --row)
        {
            for (int col = 1; col <= row; ++col)
            {
                Console.Write("*");
            }

            Console.WriteLine();
        }
        Console.ReadLine();
    }
}        
{% endhighlight %}

## Right Angle Triangle Pattern

![](/assets/images/star-pattern/2.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	for (int row = 1; row <= 8; ++row)
        {
            for (int col = 1; col <= row; ++col)
            {
                Console.Write("*");
            }

            Console.WriteLine();
        }
        Console.ReadLine();
    }
}      
{% endhighlight %}

## Diamond Pattern

![](/assets/images/star-pattern/3.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	int number = 8, count = 1;
        count = number - 1;
        for (var k = 1; k <= number; k++)
        {
            for (var i = 1; i <= count; i++)
                Console.Write(" ");
            count--;
            for (var i = 1; i <= 2 * k - 1; i++)
                Console.Write("*");
            Console.WriteLine();
        }
        count = 1;
        for (var k = 1; k <= number - 1; k++)
        {
            for (var i = 1; i <= count; i++)
                Console.Write(" ");
            count++;
            for (var i = 1; i <= 2 * (number - k) - 1; i++)
                Console.Write("*");
            Console.WriteLine();
        }
        Console.ReadLine();
    }
}      
{% endhighlight %}

## Right Angle Triangle Reflection Pattern

![](/assets/images/star-pattern/4.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	int val = 8;
        int i, j, k;
        for (i = 1; i <= val; i++)
        {
            for (j = 1; j <= val - i; j++)
            {
                Console.Write(" ");
            }
            for (k = 1; k <= i; k++)
            {
                Console.Write("*");
            }
            Console.WriteLine("");
        }
        Console.ReadLine();
    }
}     
{% endhighlight %}

## Parallelogram Pattern

![](/assets/images/star-pattern/5.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	int size = 8;
        for (int row = 1; row <= size; ++row)
        {
            for (int col = 1; col <= row; ++col)
            {
                Console.Write(" ");
            }

            for (int col = 1; col <= size; ++col)
            {
                Console.Write("*");
            }

            Console.WriteLine();
        }
        Console.ReadLine();
    }
}         
{% endhighlight %}

## Hollow Rectangle Pattern

![](/assets/images/star-pattern/6.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	int number = 7;
        for (int i = 0; i < number; i++)
        {
            if (i == 0 || i == 6)
            {
                for (int j = 0; j < number; j++)
                {
                    Console.Write("*");
                }
                Console.WriteLine();
            }
            if (i >= 1 && i <= 5)
            {
                for (int j = 0; j < number; j++)
                {
                    if (j == 0 || j == 6)
                    {
                        Console.Write("*");
                    }
                    else if (j >= 1 && j <= 5)
                    {
                        Console.Write(" ");
                    }
                }
                Console.WriteLine();
            }
        }
        Console.ReadLine();
    }
}         
{% endhighlight %}

## Castle Pattern

![](/assets/images/star-pattern/7.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	int n = 8;
        for (int i = 0; i < n; ++i)
        {
            Stars(i + 1);
            Spaces(n - i - 1);
            Stars(n - i + 1);
            Spaces(2 * i);
            Stars(n - i);
            Spaces(n - i - 1);
            Stars(i + 1);

            Console.WriteLine();
        }
        Console.ReadLine();
    }

    private static void Stars(int count)
	{
	    for (int i = 0; i < count; ++i)
	        Console.Write("*");
	}

	private static void Spaces(int count)
	{
	    for (int i = 0; i < count; ++i)
	        Console.Write(" ");
	}
}         
{% endhighlight %}

## Pyramid Pattern

![](/assets/images/star-pattern/8.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	int x = 8;
        for (int i = 1; i <= x; i++)
        {
            for (int j = 1; j <= (x - i); j++)
                Console.Write(" ");

            for (int t = 1; t < i * 2; t++)
                Console.Write("*");
            Console.WriteLine();
        }
        Console.ReadLine();
    }
}         
{% endhighlight %}

## Fair Flag Pattern

![](/assets/images/star-pattern/9.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	int space = 0;
        int max = 10;

        for (var i = max; i > 0; i--)
        {
            for (var j = 0; j < i; j++)
            {
                Console.Write("*");
            }
            for (var j = 0; j < space; j++)
            {
                Console.Write(" ");
            }

            for (var j = 0; j < i; j++)
            {
                Console.Write("*");
            }

            Console.WriteLine();
            space += 2;
        }
        Console.ReadLine();
    }
}         
{% endhighlight %}

## Hollow Right Angle Triangle Pattern 

![](/assets/images/star-pattern/10.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	int max = 10;
        for (var i = 1; i <= max; i++)
        {
            for (var j = 1; j <= i; j++)
            {
                if (j == 1 || j == i || i == max)
                {
                    Console.Write("*");
                }
                else
                {
                    Console.Write(" ");
                }
            }
            Console.WriteLine();
        }
        Console.ReadLine();
    }
}         
{% endhighlight %}

## Hollow Pyramid Pattern 

![](/assets/images/star-pattern/11.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {
        
    	int max = 8;
        for (var i = 1; i <= max; i++)
        {
            for (var j = i; j < max; j++)
            {
                Console.Write(" ");
            }
            for (var j = 1; j <= (2 * i - 1); j++)
            {
                if (i == max || j == 1 || j == (2 * i - 1))
                {
                    Console.Write("*");
                }
                else
                {
                    Console.Write(" ");
                }
            }
            Console.WriteLine();
        }
        Console.ReadLine();
    }
}         
{% endhighlight %}

## Left Arrow Pattern

![](/assets/images/star-pattern/12.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	var num = 8;
        for (var i = -num; i <= num; i++)
        {
            var k = i;
            if (k < 0)
            {
                k = k * -1;
            }
            for (var j = 0; j <= num; ++j)
            {
                if (j < k)
                {
                    Console.Write("  ");
                }
                else
                {
                    Console.Write("* ");
                }
            }
            Console.WriteLine();
        }
        Console.ReadLine();
    }
}         
{% endhighlight %}

## Hollow Diamond Pattern

![](/assets/images/star-pattern/13.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	int size = 5;
        int z = 1;
        for (int i = 0; i <= size; i++)
        {
            for (int j = size; j > i; j--)
            {
                Console.Write(" ");
            }

            Console.Write("*");

            if (i > 0)
            {
                for (int k = 1; k <= z; k++)
                {
                    Console.Write(" ");
                }
                z += 2;
                Console.Write("*");
            }
            Console.WriteLine();
        }

        z -= 4;

        for (int i = 0; i <= size - 1; i++)
        {
            for (int j = 0; j <= i; j++)
            {
                Console.Write(" ");
            }

            Console.Write("*");

            for (int k = 1; k <= z; k++)
            {
                Console.Write(" ");
            }
            z -= 2;

            if (i != size - 1)
            {
                Console.Write("*");
            }
            Console.WriteLine();
        }
        Console.ReadLine();
    }
}         
{% endhighlight %}

## Heart Pattern

![](/assets/images/star-pattern/14.jpg)

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {        
    	int size = 5;
        for (int x = 0; x < size; x++)
        {
            for (int y = 0; y <= 4 * size; y++)
            {
                double dist1 = Math.Sqrt(Math.Pow(x - size, 2) + Math.Pow(y - size, 2));
                double dist2 = Math.Sqrt(Math.Pow(x - size, 2) + Math.Pow(y - 3 * size, 2));

                if (dist1 < size + 0.5 || dist2 < size + 0.5)
                    Console.Write("*");
                else
                    Console.Write(" ");
            }
            Console.WriteLine();
        }

        for (int x = 1; x < 2 * size; x++)
        {
            for (int y = 0; y < x; y++)
                Console.Write(" ");

            for (int y = 0; y < 4 * size + 1 - 2 * x; y++)
            {
                Console.Write("*");

            }
            Console.WriteLine();
        }
        Console.ReadLine();
    }
}         
{% endhighlight %}
