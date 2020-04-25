---
layout: post
current: post
navigation: True
tags: [Csharp Beginner]
class: post-template
subclass: 'post csharp-beginner'
title: Introducing To .NET Framework
description: This article introduces the .NET Framework and links to additional resources. .NET (dot-net) is the name Microsoft gives to its general vision of the future of computing, the view being of a world in which many applications run in a distributed manner across the Internet.
comments: true
permalink: /introduction-to-dotnet-framework/
aside: csharp_tutorial_aside.html
cover: "assets/images/programming2.jpg"
author: shadman_kudchikar
---

.NET (dot-net) is the name Microsoft gives to its general vision of the future of computing, the view being of a world in which many applications run in a distributed manner across the Internet. We can identify a number of different motivations driving this vision.

Firstly, distributed computing is rather like object oriented programming, in that it encourages specialised code to be collected in one place, rather than copied redundantly in lots of places. There are thus potential efficiency gains to be made in moving to the distributed model.

Secondly, by collecting specialised code in one place and opening up a generally accessible interface to it, different types of machines (phones, handhelds, desktops, etc.) can all be supported with the same code. Hence Microsoft's 'run-anywhere' aspiration.

Thirdly, by controlling real-time access to some of the distributed nodes (especially those concerning authentication), companies like Microsoft can control more easily the running of its applications. It moves applications further into the area of 'services provided' rather than 'objects owned'.

Interestingly, in taking on the .NET vision, Microsoft seems to have given up some of its proprietary tendencies (whereby all the technology it touched was warped towards its Windows operating system). Because it sees its future as providing software services in distributed applications, the .NET framework has been written so that applications on other platforms will be able to access these services. For example, .NET has been built upon open standard technologies like XML and SOAP.

At the development end of the .NET vision is the .NET Framework. This contains the Common Language Runtime, the .NET Framework Classes, and higher-level features like ASP.NET (the next generation of Active Server Pages technologies) and WinForms (for developing desktop applications).

The Common Language Runtime (CLR) manages the execution of code compiled for the .NET platform. The CLR has two interesting features. Firstly, its specification has been opened up so that it can be ported to non-Windows platforms. Secondly, any number of different languages can be used to manipulate the .NET framework classes, and the CLR will support them. This has led one commentator to claim that under .NET the language one uses is a 'lifestyle choice'.

Not all of the supported languages fit entirely neatly into the .NET framework, however (in some cases the fit has been somewhat Procrustean). But the one language that is guaranteed to fit in perfectly is C#. This new language, a successor to C++, has been released in conjunction with the .NET framework, and is likely to be the language of choice for many developers working on .NET applications.

## What is Microsoft .Net Framework?
The .Net framework is a software development platform developed by Microsoft. The framework was meant to create applications, which would run on the Windows Platform. The first version of the .Net framework was released in the year 2002.

The version was called .Net framework 1.0. The .Net framework has come a long way since then, and the current version is 4.7.1.

The .Net framework can be used to create both - Form-based and Web-based applications. Web services can also be developed using the .Net framework.

The framework also supports various programming languages such as Visual Basic and C#.

## .NET Framework Objectives

The .NET Framework is designed to fulfill the following objectives:

- To provide a consistent object-oriented programming environment whether object code is stored and executed locally, executed locally but Internet-distributed, or executed remotely.

- To provide a code-execution environment that minimizes software deployment and versioning conflicts.

- To provide a code-execution environment that promotes safe execution of code, including code created by an unknown or semi-trusted third party.

- To provide a code-execution environment that eliminates the performance problems of scripted or interpreted environments.

- To make the developer experience consistent across widely varying types of apps, such as Windows-based apps and Web-based apps.

- To build all communication on industry standards to ensure that code based on the .NET Framework integrates with any other code.

## The Common Language Infrastructure

The Common Language Infrastructure (CLI) is a specification that allows several different programming languages to be used together on a given platform. The CLI has a lot of components, typically referred to by three-letter abbreviations (acronyms). Here are the most important parts of the Common Language Infrastructure.

### Parts Of The Common Language Infrastructure

#### Common Intermediate language (CIL) including a common type system (CTS)

Common Intermediate Language (CIL), formerly called Microsoft Intermediate Language (MSIL) or Intermediate Language (IL)., is the intermediate language binary instruction set defined within the Common Language Infrastructure (CLI) specification. CIL instructions are executed by a CLI-compatible runtime environment such as the Common Language Runtime. Languages which target the CLI compile to CIL. CIL is object-oriented, stack-based bytecode. Runtimes typically just-in-time compile CIL instructions into native code.

#### Common Language Specification (CLS)

Common Language Specification (CLS) is a set of basic language features that .Net Languages needed to develop Applications and Services , which are compatible with the .Net Framework. When there is a situation to communicate Objects written in different .Net Complaint languages , those objects must expose the features that are common to all the languages . Common Language Specification (CLS) ensures complete interoperability among applications, regardless of the language used to create the application.

#### Virtual Execution System (VES)

The Virtual Execution System (VES) is a run-time system of the Common Language Infrastructure CLI which provides an environment for executing managed code. It provides direct support for a set of built-in data types, defines a hypothetical machine with an associated machine model and state, a set of control flow constructs, and an exception handling model. To a large extent, the purpose of the VES is to provide the support required to execute the Common Intermediate Language CIL instruction set.


The following illustration, taken from Wikipedia, illustrates the CLI and its context.

![](/assets/images/Overview_of_the_Common_Language_Infrastructure.jpg)

.Net is one particular implementation of the Common Language Infrastructure, and it is undoubtedly the most complete one. .Net is closely associated with Windows. .Net is, however, not the only implementation of the CLI. Mono is another one, which is intended to work on several platforms. Mono is the primary implementation of the CLI on Linux. Mono is also available on Windows. MONO and .NET are both implementations of the Common Language Infrastructure. The C# language and the Common Language Infrastructure are standardized by ECMA and ISO

## C# Compilation and Execution

The Common Language Infrastructure supports a two-step compilation process

### Compiler time process

The .Net framework has one or more language compliers, such as Visual Basic, C#, Visual C++, JScript, or one of many third-party compilers such as an Eiffel, Perl, or COBOL compiler.
Any one of the compilers translate your source code into Microsoft Intermediate Language (MSIL) code.
For example, if you are using the C# programming language to develop an application, when you compile the application, the C# language compiler will convert your source code into Microsoft Intermediate Language (MSIL) code.
In short, VB.NET, C# and other language compilers generate MSIL code. (In other words, compiling translates your source code into MSIL and generates the required metadata.)
Currently "Microsoft Intermediate Language" (MSIL) code is also known as "Intermediate Language" (IL) Code or "Common Intermediate Language" (CIL) Code.

### Runtime process.

The Common Language Runtime (CLR) includes a JIT compiler for converting MSIL to native code.
The JIT Compiler in CLR converts the MSIL code into native machine code that is then executed by the OS.
During the runtime of a program the "Just in Time" (JIT) compiler of the Common Language Runtime (CLR) uses the Metadata and converts Microsoft Intermediate Language (MSIL) into native code.

In order to use C# and the .NET framework classes, you first need to install either the .NET framework SDK, or else Visual Studio .NET. Below are the links for installation process:

- [Install Visual Studio](http://www.mastercsharp.com/article.aspx?ArticleID=17&TopicID=10)
- [Install the .NET Framework for developers](https://docs.microsoft.com/en-us/dotnet/framework/install/guide-for-developers)

In the next article we run through a standard 'hello world' example, with links to lessons covering the different parts of the program.