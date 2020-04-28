---
layout: post
current: post
navigation: True
tags: [Csharp Intermediate]
class: post-template
subclass: 'post csharp-intermediate'
title: C# Attributes
description: In this article, you will learn how to use C# attributes in your own code and how to use reflection along with attributes.
cover: "assets/images/programming2.jpg"
date: Sat Apr 18 00:00:00 2020
last_modified_at: Sat Apr 18 13:31:37 2020
author: shadman_kudchikar
comments: true
---

A .NET application doesn’t just contain code and data; it also contains metadata, which is information about data. In .NET, this means that an application contains the code that defines the application and data that describes the code. 

An attribute is one type of metadata that can be stored in a .NET application. Other types of metadata contain information about the types, code, assembly, and all other elements stored in your application. 

Reflection is the process of retrieving this metadata at runtime. The data can be inspected and used to make decisions. 

In this article, you will learn how to use C# attributes in your own code and how to use reflection along with attributes.

## Contents

- [Using C# Attributes ](#using-c-attributes)
    - [C# Code Time Attributes](#c#-code-time-attributes)
    - [C# Design Time Attributes](#c-design-time-attributes)
    - [C# Run Time Attributes](#C#-run-time-attributes)
- [Applying C# Attributes](#applying-c-attributes)
    - [How to apply a C# attribute](#how-to-apply-a-c-attribute)
    - [Using multiple C# attributes](#using-multiple-c-attributes)
    - [Specifying the target of a C# attribute explicitly](#specifying-the-target-of-a-c-attribute-explicitly)
- [Prebuilt C# Attributes](#prebuilt-c-attributes)
    - [DebuggerDisplay attribute](#debuggerdisplay-attribute)
    - [DebuggerBrowsable attribute](#debuggerbrowsable-attribute)
    - [Conditional attribute](#conditional-attribute)
- [Reading C# attributes](#reading-c-attributes)
- [C# Reflection](#c#-reflection)
    - [Invoke Method with parameters using C# reflection](#invoke-method-with-parameters-using-c-reflection)
    - [Things you can achieve with C# reflection](#things-you-can-achieve-with-c-reflection)
- [Applying C# Reflection with Attributes](#applying-c-reflection-with-attributes)
    - [Instantiate a type dynamically using reflection](#instantiate-a-type-dynamically-using-reflection)
    - [Creating custom C# attributes](#creating-custom-c-attributes)
    - [Using reflection to read C# attribute](#using-reflection-to-read-c-attribute)
- [Further Reading](#further-reading)

## Using C# Attributes 

Using attributes is a powerful way to add metadata to an application. Attributes can be added to all kinds of types: assemblies, types, methods, parameters, and properties. 

We can make use of attributes at code time, at design time, and at run time.

### C# Code Time Attributes

So, for example, we can use attributes during coding to further describe the code that we're writing. At code time, we can also make use of attributes to control the compilation of our code. For example, we can use attributes to configure conditional compilation. 

We can also use attributes to control the debugging experience in Visual Studio. Some of the attributes that we'll look at include this conditional compilation and debugging attributes. 

### C# Design Time Attributes

Attributes can be used at design time, for example, if we're making use of a visual GUI designer. When we drag and drop a button to a new position, this new position could be represented as attributes in some kind of code-behind.

If we're making use of an integrated development environment, such as Visual Studio, when we make changes to properties in Visual Studio, these changes may be represented as attributes in our code base. 

### C# Run Time Attributes

Attributes can also provide information at run time. So, for example, if we're making use of ASP. NET, we might use attributes to define data validation.

At run time, reflection can be used to access attributes that have been applied to code elements and use those attributes and any properties set on those attributes to control the execution of the program at run time.


## Applying C# Attributes


### How to apply a C# attribute

In C#, you apply an attribute by placing the attribute name in square brackets `[]` above the declaration that you want the attribute to apply to.

One example of an attribute in the .NET Framework is `SerializableAttribute`. This attribute indicates that a type can be serialized. The .NET Framework checks for the existence of this attribute when serializing a type, and it makes sure that all members of the type can also be serialized. 

The below example shows how to apply the Serializable attribute.


{% highlight csharp linenos %}

[Serializable]
class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
{% endhighlight %}

As you can see, the actual class in the .NET Framework is called SerializableAttribute. By convention, the name is suffixed with Attribute so you can easily distinguish between attributes and other types in the .NET Framework. When using the attribute, however, you can skip the Attribute suffix. 

### Using multiple C# attributes

A type can have as many attributes applied to it as necessary. Some attributes can even be applied multiple times. For example, you can use the ConditionalAttribute to indicate to the compiler that a method call should be ignored unless a specific compiler option is specified. The below example shows how to apply this attribute.

{% highlight csharp linenos %}

[Conditional( "CONDITION1"), Conditional( "CONDITION2")]
static void MyMethod(){ }
{% endhighlight %}

An attribute can have parameters. Just as with regular types, those parameters can be named an optional. The values set to an attribute can later be inspected at runtime.

### Specifying the target of a C# attribute explicitly

An attribute also has a specific target to which it applies. It can be an attribute applied to a whole assembly, a class, a specific method, or even a parameter of a method.

If you look at the AssemblyInfo.cs of a new class library, you can see how the target is explicitly specified.

{% highlight csharp linenos %}

[assembly: AssemblyTitle( "ClassLibrary1")]
[assembly: AssemblyDescription( "")]
[assembly: AssemblyConfiguration( "")]
[assembly: AssemblyCompany( "")]
[assembly: AssemblyProduct( "ClassLibrary1")]
[assembly: AssemblyCopyright( "Copyright © 2013")]
[assembly: AssemblyTrademark( "")]
[assembly: AssemblyCulture( "")]
{% endhighlight %}

These attributes are all applied to the current assembly and describe some metadata about the assembly.

## Prebuilt C# Attributes

### DebuggerDisplay attribute

The DebuggerDisplay attribute is available to customize the display of Class, Struct, Delegate, Enum, Field, Property, and Assembly.

Let’s consider the following Person class, which has two properties as FirstName and LastName.

{% highlight csharp linenos %}

public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
{% endhighlight %}

 

The normal way the class and its properties displayed is as follows.

![](/assets/images/csharp-attributes/Capture1.png)

To add the DebuggerDisplay attribute, you need to refer to System.Diagnostics namespace.

![](/assets/images/csharp-attributes/Capture2.png)

The attribute takes a string value as a parameter.

 

The following code shows that the Properties are used as parameters enclosed in curly braces.


{% highlight csharp linenos %}

[DebuggerDisplay("Hello {FirstName} {LastName}!")]
public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
{% endhighlight %}

The display of the class would change like the following.


![](/assets/images/csharp-attributes/Capture3.png)


### DebuggerBrowsable attribute

DebuggerBrowsable is an attribute available to C# language. This attribute is helpful for determining the display of properties and fields.

 
Let’s consider the following Person class, which has two properties as FirstName and LastName.

{% highlight csharp linenos %}

public class Person
{
    public string FirstName { get; set; }

    public string LastName { get; set; }

    public int[] WorkingDays { get; set; }
}
{% endhighlight %}

Debugging the code displays the usual way of the array name and its values on expanding.


![](/assets/images/csharp-attributes/Capture4.png)
 

Let’s add the attribute. You need to add a reference to System.Diagnostics namespace.


![](/assets/images/csharp-attributes/Capture5.png)
 

Notice that, it takes an enum as a parameter. The DebuggerBrowsableState enum has the following values.

![](/assets/images/csharp-attributes/Capture6.png)

Using this attribute other than Property, Index, and Field would give you the error. Now we would add the RootHidden enum type of DebuggerBrowsableState to AbsentDays property.

{% highlight csharp linenos %}

public class Person
{
    public string FirstName { get; set; }

    public string LastName { get; set; }
    [DebuggerBrowsable(DebuggerBrowsableState.RootHidden)]
    public int[] WorkingDays { get; set; }
}
{% endhighlight %}
 

Notice that, the property name is not displayed and the children are expanded by default.


![](/assets/images/csharp-attributes/Capture7.png)


This is again very useful if you have many properties and you need to check a few of them. It saves time to drill down.

### Conditional attribute

A conditional attribute is a tag used to mark a method or class whose execution depends on the definition of preprocessing identifier.

If specific symbols have not been defined at the instant they are called, then calls to that method or class will be ignored by the compiler.

Let’s consider the following Program class, which has a Display person method.

{% highlight csharp linenos %}

class Program
{
    public class Person
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }
        [DebuggerBrowsable(DebuggerBrowsableState.RootHidden)]
        public int[] WorkingDays { get; set; }
    }

    static void Main(string[] args)
    {
        var person = new Person
        {
            FirstName = "Shadman",
            LastName = "Kudchikar",
            WorkingDays = new int[] { 1, 2, 3, 4 }
        };
        Display(person);

        ReadLine();
    }

    public static void Display(Person person)
    {
        WriteLine(person.FirstName);
    }
}
{% endhighlight %}

The conditional attribute takes conditionString as a parameter. Wherein methods are selectively called on the basis of this definition of the symbol.

![](/assets/images/csharp-attributes/Capture8.png)

It instructs the compiler to compile (into Microsoft Intermediate Language) or not, based on a condition - whether or not a specific conditional compilation symbol is defined. 

{% highlight csharp linenos %}

[Conditional("Release")]
public static void Display(Person person)
{
    WriteLine(person.FirstName);
}
{% endhighlight %}

Now if we run the program it will not display any output. However when we can define the symbol in project properties.

![](/assets/images/csharp-attributes/Capture9.png)

Now if we run the program we can see the output

![](/assets/images/csharp-attributes/capture10.JPG)


## Reading C# attributes

Applying an attribute isn’t that useful if you can’t retrieve it. Luckily, the .NET Framework offers support for reading attributes through a process called reflection. 

The System.Attribute class, from which all other attributes inherit, defines some static methods that can be used to see whether an attribute is applied and to get the current instance of an attribute so you can further inspect it. 

Suppose that you want to check that a class has the Serializable attribute applied. You can do this by calling the static IsDefined method on Attribute. 


{% highlight csharp linenos %}

[Serializable] class Person { } 
{% endhighlight %}

{% highlight csharp linenos %}

if (Attribute.IsDefined(typeof(Person), typeof(SerializableAttribute))) 
{ 
    //do something
}
{% endhighlight %}

## C# Reflection

When reading attributes, you’ve already looked at some of the functionality that reflection offers. Reflection enables an application to collect information about itself and act on this information. Reflection is slower than normally executing static code. It can, however, give you a flexibility that static code can’t provide. 

The most basic example of reflection is getting the current type of an object you have: 

{% highlight csharp linenos %}

int i = 42; 
Type type = i.GetType(); 
{% endhighlight %}

This returns `System.Int32` as the type of int. `Type` is a class in the .NET Framework that you can use to get all kinds of metadata about any given type. 

By using Reflection in C#, one is able to find out details of an object, method, and create objects and invoke methods at runtime.

Let's create a class and invoke its method using reflection.

### Invoke Method with parameters using C# reflection

{% highlight csharp linenos %}

public class MyClass
{
   public virtual int AddNumb(int numb1,int numb2)
   {
     int result = numb1 + numb2;
     return result;
   }

}
{% endhighlight %}

The above class has the `AddNumb` method which takes two `int` parameters and returns their addition.

You can call this method using reflection like this:

{% highlight csharp linenos %}

class MyMainClass
{
    public static void Main()
    {
    // Create MyClass object
    MyClass myClassObj = new MyClass();

    // Get the Type information.
    Type myTypeObj = myClassObj.GetType();

    // Get Method Information.
    MethodInfo myMethodInfo = myTypeObj.GetMethod("AddNumb");

    object[] mParam = new object[] {5, 10};
    // Get and display the Invoke method.
    Console.Write("\nFirst method - " + myTypeObj.FullName + " returns " +  
                         myMethodInfo.Invoke(myClassObj, mParam) + "\n");
    }
}
{% endhighlight %}

So this is how it work first you get the type information:

{% highlight csharp linenos %}

Type myTypeObj = myClassObj.GetType();
{% endhighlight %}

Then will get the method's information:

{% highlight csharp linenos %}

Methodinfo myMethodInfo = myTypeObj.GetMethod("AddNumb"); 
{% endhighlight %}

Finally, we will invoke the AddNumb method:

{% highlight csharp linenos %}

myMethodInfo.Invoke(myClassObj, mParam);
{% endhighlight %}

### Things you can achieve with C# reflection

- You can use reflection to configure your application by loading an external configuration file and starting services based on it. Your application won't have to know in advance about the classes that implement those services, as long as they conform to a specific interface or API.

- Using reflection you can generate classes and code on the fly, which simplifies certain programming tasks since the programmer does not have to explicitly create all the needed code. For example, See [Applying C# Reflection with Attributes](#applying-c-reflection-with-attributes).

- Reflection is also invaluable for programs that work by examining code. An example of that would be an IDE or a UI designer.

- Reflection helps you reduce boilerplate code.

- Reflection is handy for defining mini Domain-Specific Languages (DSL) in your code.

## Applying C# Reflection with Attributes

Let's see a problem statement that a typical C# programmer will face converting a datatable into C# user-defined types

For this example, I am creating a simple Student class.

{% highlight csharp linenos %}

public class Student  
{  
    public int StudentId { get; set; }  
    public string StudentName { get; set; }  
    public string Address { get; set; }  
    public string MobileNo { get; set; }  
} 
{% endhighlight %}

And a DataTable with some data.

{% highlight csharp linenos %}

DataTable dt = new DataTable("Student");  
dt.Columns.Add("StudentId", typeof(Int32));  
dt.Columns.Add("StudentName", typeof(string));  
dt.Columns.Add("Address", typeof(string));  
dt.Columns.Add("MobileNo", typeof(string));  
    //Data  
dt.Rows.Add(1, "Manish", "Hyderabad","0000000000");  
dt.Rows.Add(2, "Venkat", "Hyderabad", "111111111");  
dt.Rows.Add(3, "Namit", "Pune", "1222222222");  
dt.Rows.Add(4, "Abhinav", "Bhagalpur", "3333333333"); 
{% endhighlight %}

Now, I will convert the preceding DataTable into a `List<Student>` using Linq.

{% highlight csharp linenos %}

List<Student> studentList = new List<Student>();  
studentList = (from DataRow dr in dt.Rows  
        select new Student()  
        {  
            StudentId = Convert .ToInt32 (dr["StudentId"]),  
            StudentName = dr["StudentName"].ToString(),  
            Address = dr["Address"].ToString(),  
            MobileNo = dr["MobileNo"].ToString()  
        }).ToList(); 
{% endhighlight %}

The above solution works well for the Student class but what if we have more datatables like this, we can have classes for Teachers, Employees, and whatnot. In that case, we have to write the mapping code just like we did for the Student class in the above example. 

However, we can use reflection to write a code that converts datatable to user-defined types based on column names and class properties. Let's see how to achieve this,


### Instantiate a type dynamically using reflection

The following are the two functions in which if we pass a DataTable and a user-defined class as a generic parameter it will then return the List of that class with the DataTable data. 

{% highlight csharp linenos %}

private static List<T> ConvertDataTable<T>(DataTable dt)  
{  
    List<T> data = new List<T>();  
    foreach (DataRow row in dt.Rows)  
    {  
        T item = GetItem<T>(row);  
        data.Add(item);  
    }  
    return data;  
}

private static T GetItem<T>(DataRow dr)  
{  
    // Get the Type information.
    Type temp = typeof(T); 
    // Create object of type T
    T obj = Activator.CreateInstance<T>();  
  
    foreach (DataColumn column in dr.Table.Columns)  
    {  
        //Get the Properties information
        foreach (PropertyInfo pro in temp.GetProperties())  
        {  
            if (pro.Name == column.ColumnName)  
                pro.SetValue(obj, dr[column.ColumnName], null); //Set the property of object
            else  
                continue;  
        }  
    }  
    return obj;  
} 
{% endhighlight %}

Now, we can convert the preceding DataTable like this, 

{% highlight csharp linenos %}

List<Student> studentDetails = ConvertDataTable<Student>(dt); 
{% endhighlight %}

Thus, reflection simplifies the instantiating and mapping task. The programmer does not have to explicitly write all the code to create an object and setting it values that we did previously using LINQ.

Notice, how we used the `typeof` operator to get the type of T from a [generic method](/generics-in-csharp/#c-generic-method).

If we call the method like this, `ConvertDataTable<Student>(...)` our type will be `Student` and If we used, `ConvertDataTable<Teacher>(...)` our type will be Teacher.

You may have noticed the following line of code as well

{% highlight csharp linenos %}

if (pro.Name == column.ColumnName)  
    pro.SetValue(obj, dr[column.ColumnName], null);  
{% endhighlight %}

The above condition checks if the property name of the user-defined class is the same as datatable on and set that property value based on the matched column name.

Thus,

The DataTable column's name and class property name should be the same otherwise this function will not work properly.

Now, what if these names somehow failed to match and you don't want to rename the class properties as well 

{% highlight csharp linenos %}

public class Student
{
    public int Id { get; set; } //Id for student
    public string StudentName { get; set; }
    public string Address { get; set; }
    public string MobileNo { get; set; }
}
{% endhighlight %}

{% highlight csharp linenos %}

DataTable dt = new DataTable("Student");
dt.Columns.Add("StudentId", typeof(Int32)); //Id for student
dt.Columns.Add("StudentName", typeof(string));
dt.Columns.Add("Address", typeof(string));
dt.Columns.Add("MobileNo", typeof(string));
{% endhighlight %}

As you can see Id property in Student class and Datatable is mismatched.

Let's tackle the above problem using attributes

### Creating custom C# attributes

First, we will define a custom attribute `NamesAttribute`.

{% highlight csharp linenos %}

public class NamesAttribute : Attribute
{
    public string[] Values { get; set; }
}
{% endhighlight %}

It only has one property Values which is a string array. Now we will use this attribute on Id property in our Student class like this:

{% highlight csharp linenos %}

public class Student
{
    [Names(Values = new string[] { "StudentId" })]
    public int Id { get; set; }
    public string StudentName { get; set; }
    public string Address { get; set; }
    public string MobileNo { get; set; }
}
{% endhighlight %}

### Using reflection to read C# attribute

Now we will write a method that checks whether Values defined on a property match with columnName passed in the parameter, using reflection.

{% highlight csharp linenos %}

private static bool NamesMatched(PropertyInfo pro, string columnName)
{
    var displayNameAttr = pro.GetCustomAttributes(false)
        .OfType<NamesAttribute>().FirstOrDefault();
    return displayNameAttr?.Values.Any(v => v == columnName) ?? false;
}
{% endhighlight %}

Now we can update our `GetItem` method to use the above method like this

{% highlight csharp linenos %}

private static T GetItem<T>(DataRow dr)
{
    Type temp = typeof(T);
    T obj = Activator.CreateInstance<T>();

    foreach (DataColumn column in dr.Table.Columns)
    {
        foreach (PropertyInfo pro in temp.GetProperties())
        {
            var isNameMatched = NamesMatched(pro, column.ColumnName);
            if (pro.Name == column.ColumnName || isNameMatched)
                pro.SetValue(obj, dr[column.ColumnName], null);
            else
                continue;
        }
    }
    return obj;
}
{% endhighlight %}

Now our program will able to map the properties values even though the name of columns and properties mismatched. This was possible as it takes into consideration the metadata that we attached with the property using attributes.

That’s all for now, join me in the next article by subscribing to my newsletter using the form below.

## Further Reading

- [Generics In C#](/generics-in-csharp/) - This article explains the Generics in C# with the help of a real-time problem and its step by step solution using c# generics. This article serves to be an in-depth post on getting started with generics in c#.

- [Metadata and Reflection in .NET](https://odetocode.com/articles/288.aspx) by [Scott Allen](https://odetocode.com/about/scott-allen) - In this article, we will discuss metadata and look at some of types and methods used to programmatically inspect and consume metadata.

- [Reserved attributes: Determine caller information](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/attributes/caller-information) - Caller Info Attributes. These attributes tell the compiler to give you information from the caller’s source code. You have to apply the attributes to optional parameters which should have default values defined. The attributes are quite useful for logging information and debugging source code.

- [Creating Copies of Attributes](https://haacked.com/archive/2010/08/05/copying-attributes.aspx/) by [Phil Haack](https://haacked.com/about/) - This article explains that you may want to avoid changing the attributes directly, because when you use reflection to retrieve attributes, those attributes may be cached by the framework. So changing an attribute is not a safe operation as you may be changing the attribute for everyone else who tries to retrieve them. Instead what you really wanted to do is create a copy of all these attributes, and pass the collection of copied attributes along.