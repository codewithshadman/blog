---
layout: post
current: post
navigation: True
tags: [Csharp Advanced]
class: post-template
subclass: 'post csharp-advanced'
title:  "No Virtual Keyword In Java And No Final Keyword In C# Explained"
description: "When we make something virtual in a platform, we're making an awful lot of promises about how it evolves in the future. For a non-virtual method, we promise that when you call this method, x and y will happen."
cover: "assets/images/java-csharp-difference.jpg"
date:   2018-06-04 11:25:17 +0530
last_modified_at: Sat Jun 22 12:34:55 2019
author: shadman_kudchikar
comments: true
---


## Contents

* [Java and C# Methods Behaviour Difference](#java-and-csharp-methods-behaviour-difference)
* [Why C# Implements Methods As Non-Virtual By Default?](#why-csharp-implements-methods-as-non-virtual-by-default)
* [How Java Deal With This?](#how-java-deal-with-this)
* [References](#references)

> **Note:** If you are new to object oriented programming and don't know about polymorphism much please refer [this post][understanding-polymorphism] before proceeding further.

## Java and C# Methods Behaviour Difference {#java-and-csharp-methods-behaviour-difference}

When you write any method in Java you are actually writing a virtual method because Java implements it by default, and to make it non-virtual we have to make use of final keyword in Java. However, In C# all methods you write are final (non-virtual) by default and to make it virtual you have to use virtual keyword.

<!--more-->

## Why C# Implements Methods As Non-Virtual By Default? {#why-csharp-implements-methods-as-non-virtual-by-default}

Having every method virtual by default is a performance concern because every method call must use the object's Virtual Table. Moreover, this strongly limits the Just-In-Time compiler's ability to inline methods and perform other kinds of optimization.

**Most importantly,**

If methods are not virtual by default, you can guarantee the behavior of your classes. When they are virtual by default, such as in Java, you can't even guarantee that a simple getter method will do as intended because it could be overridden to do anything in a derived class (of course you can, and should, make the method and/or the class final).

So,

When we make something virtual in a platform, we're making an awful lot of promises about how it evolves in the future. For a non-virtual method, we promise that when you call this method, x and y will happen. Thus, C# forces one to use virtual and new/override to consciously make those decisions.

## How Java Deal With This? {#how-java-deal-with-this}

Java does not have a virtual keyword because all non-static methods use dynamic binding and and therefore are be default virtual. In Java, the programmer doesn't have to decide whether to use dynamic binding. 

In Java you do not need to use any keyword like virtual or override since by default all non static functions are considered as virtual. You have to make it either private or use final keyword to remove the default virtual feature in each function in the Java classes. 


## References {#references}
- [https://www.artima.com/intv/nonvirtual.html](https://www.artima.com/intv/nonvirtual.html)
- [https://www.c-sharpcorner.com/UploadFile/ff2f08/understanding-polymorphism-in-C-Sharp/](https://www.c-sharpcorner.com/UploadFile/ff2f08/understanding-polymorphism-in-C-Sharp/)
- [https://kudchikarsk.com/csharp-polymorphism/](https://kudchikarsk.com/csharp-polymorphism/)

[post-image]: /assets/images/java-csharp-difference.jpg
[understanding-polymorphism]: /csharp-polymorphism/
[Instagram]: https://www.instagram.com/kudchikarsk
[LinkedIn]: https://linkedin.com/in/kudchikarsk