---
layout: post
current: post
navigation: True
tags: [A Junior Who Asked Why]
class: post-template
subclass: 'post a_junior_who_asked_why'
title: "Chapter 2: The Bike That Never Went Out of Control"
description: A story about a college friend's bike leads to a deeper lesson on software design principles and why great code, like a great machine, should never go out of control.
cover: "assets/images/bike-909690_640.jpg"
date: Fri May 29 00:00:00 2025
last_modified_at: Fri May 29 00:00:00 2025
author: shadman_kudchikar
comments: true
---

## The Bike That Never Went Out of Control

I had a friend in college who was obsessed with his bike.
Not just in the “wash it every Sunday” way — he *lived* for that machine.

One evening, he said something strange but powerful.
We were parked outside the campus tea stall, sipping cutting chai, when he pointed at his bike and said:

**“This thing never goes out of control. Not even an inch. It does *exactly* what I tell it to.”**

At first, I laughed. It sounded like a line from a Fast & Furious movie.

But years later, while leading software teams, that statement hit me differently.
Because in that one line was the philosophy behind some of the most important principles in programming — principles most college courses *never* explain well.

---

### The Secret That College Never Shared

In college, we were taught syntax.
But nobody told us *why* we need things like:

* `private` and `protected` fields in Java and C#
* `const` and `readonly` in JavaScript and TypeScript
* `final`, `sealed`, and `virtual` methods
* Encapsulation and access modifiers

We memorized keywords but missed the mindset behind them.

That mindset?
**Control.**

Just like my friend didn’t want his bike moving even an inch without his say —
As engineers, **we don’t want our code changing behavior unless we decide to.**

---

### The Open/Closed Principle: What It Really Means

You may have heard of the Open/Closed Principle — the “O” in SOLID.

It says:

> **Software entities should be open for extension, but closed for modification.**

Sounds like a paradox, right?

But let’s go back to the bike.

Imagine my friend wanted to add a Bluetooth speaker to his bike. Or change the headlights. He could *extend* his bike with accessories, but he wouldn't mess with the engine every time he added a new feature. That would risk making the bike unstable — or worse, dangerous.

The same applies to code.

When you build a class, your goal is to **shield the core behavior from accidental change**, but still allow it to be extended in a controlled way.

This is why in C#, many methods are *not virtual by default* — because Microsoft doesn’t want developers accidentally overriding behavior without intention.
In Java, `final` and `private` play the same role — they say:

> “You can use this, but please don’t tamper with the internals.”

---

### DDD and Domain-Rich Models: Guarding Behavior Like a Trusted Engine

This mindset shows up again in **Domain-Driven Design (DDD)**.

DDD tells us to avoid **anemic models** — objects that are just data bags with no logic. Instead, it encourages **rich domain models** — classes that own both *data* and *behavior*.

Why?

Because logic scattered across services and helper functions is like letting every mechanic in the city touch your engine. No coordination, no ownership.

A rich domain model is like saying:
**“This class is responsible for how this part of the system behaves — and no one else touches it.”**

It’s the same idea my friend bragged about:

> “It never goes out of control.”

And when something does go wrong? You know *exactly* where to look — inside that one class. Not across 14 files and 7 utility services.

---

### The Root of Every Solution: A Class, a Method, a Boundary

Today, as a lead engineer, I’ve come to believe something simple yet profound:

> **Almost every solution in modern software starts with a class.**

* You want to send an email? You create a service class.
* You want to track an event? You write a method inside a class.
* You want to protect business rules? You encapsulate them in a model class.

Whether you’re working with outbox patterns, domain events, or async jobs —
**you’re creating classes that must be predictable, testable, and protected.**

The moment that class starts behaving in unpredictable ways, your system becomes fragile. Bugs creep in. Features become risky. Teams lose trust in the codebase.

---

### The Junior Who Asked Why

So when a junior asks:

* “Why are some methods sealed?”
* “Why is this field private?”
* “Why should I put logic inside my domain model?”
* “Why doesn’t C# allow virtual methods by default?”

Don’t throw documentation at them.

Tell them this:

**“We write code the way we maintain trusted machines. We don’t let it go out of control. We lock down what shouldn’t change. We expose what should. And we always, always, protect the engine.”**

Because in the end, the Open/Closed Principle, encapsulation, access modifiers, and DDD all teach us the same thing:

> **“Control your code, or your code will control you.”**

Just like my friend’s bike,
**your software should never move an inch… without your permission.**

That’s all for now, join me in the next article by subscribing to my newsletter using the form below.




