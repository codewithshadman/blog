---
layout: post
current: post
navigation: True
tags: [A Junior Who Asked Why]
class: post-template
subclass: 'post a_junior_who_asked_why'
title: "Chapter 1: The Game We Didn’t Know We Were Playing"
description: A Junior Who Asked Why, we begin with a childhood game that unknowingly mirrors the decisions software architects make every day. This chapter draws a powerful connection between drawing lines on a grid and writing code with foresight—reminding developers that the real game is about leaving space for the future.
cover: "assets/images/the-architects-grid.jpg"
date: Fri May 2 00:00:00 2025
last_modified_at: Fri May 2 00:00:00 2025
author: shadman_kudchikar
comments: true
---

## **The Game We Used to Play**

When I was a kid, I used to play a strange little game with my cousins at home. It didn’t have a name back then—it was just something we came up with during long summer afternoons, sitting on the floor with a sheet of paper and a pen.

We’d start by drawing a grid of dots—9x9, sometimes more, sometimes less. Then the game began. One of us would play the "navigator"—giving instructions on which dot to reach next. The other had to draw a line from dot to dot, connecting them one by one, **without lifting the pen**, and most importantly, **without retracing any line already drawn**.

If I managed to complete all the paths without crossing my own tracks, I won. If I got stuck and had to retrace a step, my cousin won.

It sounds simple, almost too simple to be interesting. But the more we played, the more we realized how much thinking it required. The challenge wasn’t just about getting from one dot to another—it was about **leaving room**. You had to think three, four steps ahead.

The image below is from a recent replay of the game, I played it again with a friend to recreate the experience.

On the right the grid you see, that’s me
![The Architect's Grid](/assets/images/the-architects-grid.jpg)

---

### **The Near Dot Dilemma**

I remember moments in that childhood game where the next dot my cousin chose was just one step away. It was tempting to draw a straight line immediately. But I’d pause. Because that direct path, while easy now, could cut me off from reaching a dot on the other side of the grid later.

---

### **Drawing with Space in Mind**

Today, I wear the hat of a lead engineer. I guide projects, make architectural decisions, and think about long-term consequences in codebases. And in some way, I feel like I’m still playing that old game—just at a different scale.

In our world, the "dots" are the business requirements, features, or goals handed down by clients, stakeholders, or product managers. The "lines" we draw are the code we write, the services we architect, the APIs we expose. And the rule still stands: no retracing. No hasty decisions that trap you later. No shortcuts that feel good now but block you from completing the path later.

Let me give you an example.

Imagine you’re writing a service to send emails. You could just call a mail API directly from your controller—quick, simple, done. That’s the straight line to the next dot. But what happens tomorrow when the client wants to queue the emails instead of sending them in real-time? Or swap providers from SendGrid to SES? 

If you hard-coded everything, you’ll have to retrace your steps.

But if you used **dependency injection**, wrapped the email logic in an interface, or decoupled it behind a message queue—you’ve kept your options open. You’ve left room for future lines.

In other words, decoupling with an interface or queue is like drawing a line that doesn't immediately touch the next dot but still ensures you’ll get there—with more freedom and less risk of retracing later.

The interesting thing about this kind of decision is that it doesn’t reduce the work you do. In fact, it might increase it. But what it *does* reduce is friction—**future friction**. It gives the system space to grow, adapt, evolve.

The exact same principle that won me games against my cousin.

---

### **Thinking Like a Software Architect**

And this is what a lead engineer or software architect does 90% of the time—not just write code, but think about how the code we write today will affect our ability to draw future lines.

The role isn’t just about choosing the “best” technology. It’s about seeing the grid, predicting the paths, and designing with flexibility in mind. We think not just about now, but about tomorrow’s feature, next month’s bug, or next year’s scaling challenge.

Just like in that game, we win not by reaching one dot quickly, but by making sure we can reach all the dots without retracing.

Back then, we didn’t have a name for it. It was just something we made up.

But now, years later, with a decade of software development behind me—and after leading teams, architecting systems, and cleaning up more than a few messes—I know exactly what that game was.

It was **The Architect’s Grid**.

---

### **The Game Continues**

**The Architect’s Grid** or Software Development isn’t about being clever. It’s not about over-engineering or using big words like “modularity” and “separation of concerns” just to sound smart.

It’s about having the humility to pause before drawing the next line. It’s about holding space for what’s coming—even if you don’t know exactly what it is. And it’s about developing the instinct to ask, *“If I go this way now… what doors am I closing?”*

That childhood game was my first encounter with systems thinking. I just didn’t know it yet.

---

### **A Junior Who Asked Why**

As a junior developer, it’s easy to get caught up in the “what” and the “how.”

* **What does this framework do?**
* **How do I use this pattern?**
* **What’s the syntax for that query?**

But as you grow, you start asking a deeper question: **“Why?”**

* **Why are we injecting dependencies instead of instantiating classes directly?**
* **Why do we need this level of indirection?**
* **Why are we using eventual consistency here instead of strong consistency?**

And that’s the turning point. That’s when you stop just coding and start **architecting**.

Because asking "why" is how you learn to see the grid—the full picture, not just the next dot. You begin to see how decisions ripple across time and how simple-looking code can carry invisible weight if it's not written with intention.

In this blog series, I’ll help you see that grid for yourself. We’ll talk about patterns, principles, and philosophies—but all from the perspective of asking the right questions, not memorizing the right answers.

Because once you see the grid, you never unsee it.

---
