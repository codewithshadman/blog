---
layout: post
current: post
navigation: True
tags: [Csharp Intermediate]
class: post-template
subclass: 'post csharp-intermediate'
title:  "Nullable Types And Null Coalescing Operator C#"
description: "This C# article discusses the Nullables with Null Coalescing operator and also explains the unique ways to use the Null Coalescing operator."
cover: "assets/images/null-coalescing-operator-csharp.jpg"
date: Sun Jun 16 13:05:38 2019
last_modified_at: Sun Nov 24 17:06:45 2019
author: shadman_kudchikar
comments: true
---


The ?? operator is also known as the null-coalescing operator. It returns the left side operand if the operand is not null else it returns the right side operand. This article explains what is nullable types, the null coalescing operator, and unique ways to use the null-coalescing operator in C#.

## Contents
- [C# Nullables Types](#csharp-nullables-types)
    - [Shorthand Syntax For Nullable Types](#shorthand-syntax-for-nullable-types)
- [What Is Null Coalescing Operator In C#?](#what-is-null-coalescing-operator-in-csharp)
- [Null Coalescing Operators In Practical Scenarios](#null-coalescing-operators-in-practical-scenarios)
- [Further Reading](#further-reading)
- [References](#references)

## C# Nullables {#csharp-nullables}

A [reference type](/csharp-variable-types/#c-reference-types) can have an actual value of null, meaning it has no value. A [value type](/csharp-variable-types/#c-value-types) can't have a value of null. 

For example, how would you express that some boolean value is true, false, or unknown? Regular Boolean can be only true or false.

<!--more-->

This is why Nullables were added to the .Net Framework. A Nullable is a wrapper around a value type with a Boolean flag that it stores if the Nullable has a value set

Below is a simplified version of the support of Nullables in the .NET Framework

{% highlight csharp linenos %}

[Serializable, StructLayout(LayoutKind.Sequential)]
public struct Nullable<T> where T : struct
{
    // These 2 fields represent the state
    private Boolean hasValue = false; // Assume null
    internal T value = default(T); // Assume all bits zero
    public Nullable(T value)
    {
        this.value = value;
        this.hasValue = true;
    }
    public Boolean HasValue { get { return hasValue; } }
    public T Value
    {
        get
        {
            if (!hasValue)
            {
                throw new InvalidOperationException(
                "Nullable object must have a value.");
            }
            return value;
        }
    }
    public T GetValueOrDefault() { return value; }
    public T GetValueOrDefault(T defaultValue)
    {
        if (!HasValue) return defaultValue;
        return value;
    }
    public override Boolean Equals(Object other)
    {
        if (!HasValue) return (other == null);
        if (other == null) return false;
        return value.Equals(other);
    }
    public override int GetHashCode()
    {
        if (!HasValue) return 0;
        return value.GetHashCode();
    }
    public override string ToString()
    {
        if (!HasValue) return "";
        return value.ToString();
    }
    public static implicit operator Nullable<T>(T value)
    {
        return new Nullable<T>(value);
    }
    public static explicit operator T(Nullable<T> value)
    {
        return value.Value;
    }
}
{% endhighlight %}

You can use the '?' operator to shorthand the syntax e.g. int?, long? instead of using Nullable<T>.

### Shorthand Syntax For Nullable Types {#shorthand-syntax-for-nullable-types}

{% highlight csharp linenos %}

int? i = null;
double? d = null;
{% endhighlight %}

From the above definition, you can easily make out that:

- Nullable<T> type is also a value type.
- Nullable Type is of struct type that holds a value type (struct) and a Boolean flag, named HasValue, to indicate whether the value is null or not.
- Since Nullable<T> itself is a value type, it is fairly lightweight. The size of Nullable<T> type instance is the same as the size of containing value type plus the size of a boolean.
- The nullable types parameter T is struct. i.e., you can use nullable type only with value types. This is quite ok because reference types can already be null. You can also use the Nullable<T> type for your user defined struct.
- Nullable type is not an extension in all the value types. It is a struct which contains a generic value type and a boolean flag.

This is all about Nullable types in C#. Now I am going to discuss the Null Coalescing operator in C#.

## What Is Null Coalescing Operator In C#? {#what-is-null-coalescing-operator-in-csharp}
The ?? operator is called the null-coalescing operator. You can use it to provide a default value
for nullable value types or for reference types.
The operator returns the left value if it’s not null; otherwise, the right operand.
Here is an example of using the operator.

{% highlight csharp linenos %}

int? x = null;
int y = x ?? -1;
{% endhighlight %}

In this case, the value of y is -1 because x is null.
You can also nest the null-coalescing operator, below is an example,

{% highlight csharp linenos %}

int? x = null;
int? z = null;
int y = x ??
        z ??
        -1;
{% endhighlight %}

Of course, you can achieve the same with an if statement but the null-coalescing operator
can shorten your code and improve its readability.

## Null Coalescing Operators In Practical Scenarios {#null-coalescing-operators-in-practical-scenarios}

Let us see how to use the Null coalescing operators in practical scenarios.

### Scenario 1 - Assign a Nullable type to Non-Nullable Type
Consider the following piece of code where we are assigning a nullable type to a non-nullable type.

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {
        int? a = null;
        int b = a.Value;
        Console.WriteLine("Value of b is {0}", b);

        Console.ReadLine();
    }
}
{% endhighlight %}

In the code above, if the nullable type (in our case ‘a’) has a null value and the null value is assigned to a non-nullable type (in our case ‘b’), an exception of type InvalidOperationException is thrown.

One way to resolve this error is to use an "IF..ELSE" condition and check the value of the nullable type before assigning it to the non-nullable type

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {
        int? a = null;
        int b;
        if (a.HasValue)
            b = a.Value;
        else
            b = 0;
        Console.WriteLine("Value of b is {0}", b);

        Console.ReadLine();
    }
}
{% endhighlight %}

The code will now compile and give you desired results. However using the null coalescing operator in such scenarios, you can create clearer code than the equivalent if-else statement, as shown below:

{% highlight csharp linenos %}

class Program
{
    static void Main(string[] args)
    {
        int? a = null;
        int b = a ?? 0;
        Console.WriteLine("Value of b is {0}", b);

        Console.ReadLine();
    }
}
{% endhighlight %}

In the code shown above, if ‘a’ has been assigned a non-null value, then this value will be assigned to the int b. However since the nullable type ‘a’ has been assigned null, the value to the right of the operator (??) i.e. zero will be assigned to b instead.

### Scenario 2 - How you can use this operator in LINQ.

{% highlight csharp linenos %}

using System;  
using System.Collections.Generic;  
using System.Linq;  
using System.Text;  
using System.Threading.Tasks;  
  
namespace NullCollation  
{  
    public class Employee  
    {  
        public int Id { get; set; }  
        public int age { get; set; }  
        public string name { get; set; }  
        public string gender { get; set; }  
    }  
    class Program  
    {  
  
        static void Main(string[] args)  
        {  
            List<Employee> li = new List<Employee>();  
            li.Add(new Employee { Id = 1, name = "Ritesh", gender = "M" });  
            li.Add(new Employee { Id = 2, name = "sujit", gender = "M" });  
            li.Add(new Employee { Id = 3, name = "Kabir", gender = "F" });  
            li.Add(new Employee { Id = 4, name = null, gender = "F" });  
            li.Add(new Employee { Id = 5, name = "Kamlesh", gender = "M" });  
            li.Add(new Employee { Id = 6, name = "Manoj", gender = "M" });  
  
            var Data = from emp in li where emp.Id == 4 
                select new { Name = emp.name ?? "No name" };  
  
            foreach (var obj in Data)  
            {  
                Console.WriteLine(obj.Name);  
            }  
            Console.ReadLine();  
  
        }  
    }  
}
{% endhighlight %}

### Scenario 3 - In expressions with the null-conditional operators ?. and ?[]
You can use the null-coalescing operator to provide an alternative expression to evaluate in case the result of the expression with null-conditional operations is null:

{% highlight csharp linenos %}

double SumNumbers(List<double[]> setsOfNumbers, int indexOfSetToSum)
{
    return setsOfNumbers?[indexOfSetToSum]?.Sum() ?? double.NaN;
}

var sum = SumNumbers(null, 0);
Console.WriteLine(sum);  // output: NaN
{% endhighlight %}
### Scenario 4 - Null-conditional delegate invocation

Use the ?. operator to check if a delegate is non-null and invoke it in a thread-safe way (for example, when you [raise an event](/delegates-and-events-in-csharp/#create-and-raise-events-in-csharp)), as the following code shows:

{% highlight csharp linenos %}

myDelegate?.Invoke(args)
{% endhighlight %}

### Scenario 5 - You can use the null coalesce operator to lazy load certain properties.

{% highlight csharp linenos %}

public class Vocabulary
{
    private IEnumerable<string> _definitions;
    public IEnumerable<string> Definitions
    {
        get
        {
            return _definitions ?? (
                _definitions = new List<string>
                {
                    "definition 1",
                    "definition 2",
                    "definition 3"
                }
            );
        }
    } 
}
{% endhighlight %}

## Further Reading {#further-reading}

- [?. in C#: When properties might be null](http://thebillwagner.com/Blog/Item/2015-03-03-inCWhenpropertiesmightbenull) by [Bill Wagner](http://thebillwagner.com/) - In this article, Bill explains concise syntax for checking against null, and taking some default action based on the ‘null-ness’ of a variable.

- [Eliminate null-checks using arrays](http://firstclassthoughts.co.uk/Articles/Readability/NullCheckEliminationUsingArrays.html) by [Kasper B. Graversen ](http://firstclassthoughts.co.uk/) - In this article, Kasper show a coding pattern which eliminate the need for null-checking. since null typically is used to indicate that "nothing is here" - this is essentially the semantics of an empty array. The result is shorter and easier to read code.

## References {#references}
- [https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/operators/member-access-operators#null-conditional-operators--and-](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/operators/member-access-operators#null-conditional-operators--and-)
- [https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/operators/null-coalescing-operator](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/operators/null-coalescing-operator)
- [https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/nullable-types/](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/nullable-types/)
- [https://stackoverflow.com/questions/278703/unique-ways-to-use-the-null-coalescing-operator](https://stackoverflow.com/questions/278703/unique-ways-to-use-the-null-coalescing-operator)

[post-image]: /assets/images/null-coalescing-operator-csharp.jpg "Null Coalescing Operator C#"
