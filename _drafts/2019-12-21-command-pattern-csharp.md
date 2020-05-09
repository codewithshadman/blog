---
layout: post
current: post
navigation: True
tags: [Csharp Design Patterns]
class: post-template
subclass: 'post design-patterns'
title: Command Pattern C#
description: The Command pattern creates distance between the client that requests an operation and the object that can perform it.
cover: "assets/images/command-pattern-csharp.jpg"
date: Sat Dec 21 21:23:30 2019
last_modified_at: Sat Dec 21 21:23:33 2019
author: shadman_kudchikar
comments: false
---

## Contents

- [What Is Command Pattern?](#what-is-command-pattern)
- [Command Pattern C# Example](#command-pattern-c-example)
- [Where To Apply Command Pattern?](#where-to-apply-command-pattern)
- [Further Reading](#further-reading)

## What Is Command Pattern?

The Command pattern creates distance between the client that requests an operation and the object that can perform it. This pattern is particularly versatile. It can support:

- Sending requests to different receivers
- Queuing, logging, and rejecting requests
- Composing higher-level transactions from primitive operations
- Redo and Undo functionality

Below is the UML and sequence diagram of Command pattern from Wikipedia.

![UML and sequence diagram of Command pattern](/assets/images/Command_Design_Pattern_UML.jpg)

## Command Pattern C# Example



## Where To Apply Command Pattern?

- When you want to parameterize objects by an action to perform. You can express such parameterization in a procedural language with a callback function. Commands are an object-oriented replacement for callbacks.

- When you want to specify, queue, and execute requests at different times. A Command object can have a lifetime independent of the original request. If the receiver of a request can be represented in an address space-independent way, then you can transfer a command object for the request to a different process and fulfill the request there.

- When you want to support undo. The Command's Execute operation can store state for reversing its effects in the command itself. The Command interface must have an added Unexecute operation that reverses the effects of a previous call to Execute. Executed commands are stored in a history list. Unlimited-level undo and redo is achieved by traversing this list backwards and forwards calling Unexecute and Execute, respectively.

- When you want to support logging changes so that they can be reapplied in case of a system crash. By augmenting the Command interface with load and store operations, you can keep a persistent log of changes. Recovering from a crash involves reloading logged commands from disk and reexecuting them with the Execute operation.

- When you want to structure a system around high-level operations built on primitives operations. Such a structure is common in information systems that support transactions. A transaction encapsulates a set of changes to data. The Command pattern offers a way to model transactions. Commands have a common interface, letting you invoke all transactions the same way. The pattern also makes it easy to extend the system with new transactions.

## Further Reading