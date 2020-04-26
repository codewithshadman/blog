---
layout: post
current: post
navigation: True
tags: [ASP.NET]
class: post-template
subclass: 'post asp-dotnet'
title: Send and Receive Emails in ASP.NET with C#
description: In this post, you will learn how to send and receive Emails in ASP.NET with C#.
cover: "assets/images/send-and-receive-emails-in-aspnet-with-csharp.jpg"
date: Tue Nov 19 23:15:32 2019
last_modified_at: Tue Nov 19 23:15:34 2019
author: andriy_zapisotskyi
comments: true
---


You've got along ASP.NET project ahead. You're trying to wrap your head around all tasks at hand - infrastructure, business logic, admin panel, integrations. On top of that, there's a long list of ['could have' type](https://railsware.com/blog/moscow-prioritization/) of features that the team would like to implement if time and resources allow.

One of them is adding the ability to send email in ASP.NET C# that you've been postponing for a while. After all, it's such an obvious feature that might as well be left for the very end, when almost everything is up and running. Before your project goes live, you will need to validate your email workflows anyway and probably you don't want to stay extra hours just before the launch to do so.

While sending emails with C# is not rocket science, we strongly recommend thinking about it sooner rather than later. To make it easier to start, we've covered the first steps with the various code samples. Let's start!

## Contents

- [MailMessage](#mailmessage)
- [Sending emails in C# with SMTP](#sending-emails-in-c-with-smtp)
- [Sending emails with attachments](#sending-emails-with-attachments)
- [Adding images inline](#adding-images-inline)
- [Sending to multiple recipients](#sending-to-multiple-recipients)
- [Do I need to have an SMTP server?](#do-i-need-to-have-an-smtp-server)
- [Using API to send emails](#using-api-to-send-emails)
- [Receiving emails in C#](#receiving-emails-in-c)
- [Summary](#summary)

<!--more-->

## MailMessage

Throughout the course of this article, we'll often be using MailMessage class. It's a part of System.Net.Mail namespace and is used to create email messages that are then sent to an SMTP server. The delivery is then taken care of by the SmtpClient class.

For the complete set of parameters of this class, please refer to [Microsoft's documentation](https://docs.microsoft.com/en-us/dotnet/api/system.net.mail.mailmessage?view=netframework-4.8).

## Sending emails in C\# with SMTP

This one is fairly easy and quick to set up as SMTP (Simple Mail Transfer Protocol) is the most common communication standard used in email transmission. In the example below, we'll show how to send a very simple email with the following details:

{% highlight text linenos %}

To: elizabeth@westminster.co.uk	
From: piotr@mailtrap.io
Title: Hey what's up?
Body: Hey Elizabeth, let's meet for lunch on Monday, WDYT?
{% endhighlight %}

In order to send such an email, we'll use the aforementioned MailMessage class from .NET API.

{% highlight csharp linenos %}

// in the beginning of the file
using System.Net;
using System.Net.Mail;



MailAddress to = new MailAddress("elizabeth@westminster.co.uk");
MailAddress from = new MailAddress("piotr@mailtrap.com");

MailMessage message = new MailMessage(from, to);
message.Subject = "Hey what's up?";
message.Body = "Hey Elizabeth, let's meet for lunch on Monday, WDYT?;";

SmtpClient client = new SmtpClient("smtp.server.address", 2525)
{
    Credentials = new NetworkCredential("smtp_username", "smtp_password"),
    EnableSsl = true
};
// code in brackets above needed if authentication required 

try
{  
  client.Send(message);
}
catch (SmtpException ex)
{
  Console.WriteLine(ex.ToString());
}
{% endhighlight %}

Once the message was configured, we connected to the SMTP server and sent it this way!

## Sending emails with attachments

Now that we know how to send basic emails, let's consider a very common scenario and add an attachment to our message to the Queen of England. This could be an invoice for the last royal wedding or a set of pictures we took on that fabulous weekend.

On top of MailMessage class, we'll use [Attachment class](https://docs.microsoft.com/en-us/dotnet/api/system.net.mail.attachment?view=netframework-4.8) from .NET API. Make sure you add the attachment to the current working directory first.

{% highlight csharp linenos %}

// in the beginning of the file
using System.Net;
using System.Net.Mail;
using System.Net.Mime;



String filePath = "wedding_invoice.pdf";
Attachment data = new Attachment(filePath, MediaTypeNames.Application.Octet);

MailAddress to = new MailAddress("elizabeth@westminster.co.uk");
MailAddress from = new MailAddress("piotr@mailtrap.com");

MailMessage message = new MailMessage(from, to);
message.Subject = "Hey what's up?";
message.Body = "Hey Elizabeth, let's meet for lunch on Monday, WDYT?;";
message.Attachments.Add(data);

SmtpClient client = new SmtpClient("smtp.server.address", 2525)
{
    Credentials = new NetworkCredential("smtp_username", "smtp_password"),
    EnableSsl = true
};
// code in brackets above needed if authentication required 

try
{  
  client.Send(message);
}
catch (SmtpException ex)
{
  Console.WriteLine(ex.ToString());
}
{% endhighlight %}

If you need to send multiple invoices (lucky you!) or other files, simply use a loop and add the other files to the email.

## Adding images inline

We've just covered sending emails with attachments. But what if you're sending images but want them displayed inline rather than being attached to an email. Certainly, it will be easier to attract the Queen's attention this way. With a bit of modification of our previous code, this can be easily achieved.

When trying to send an email with images in C#, you're not going to use a typical `<img src="" alt="" />` construction. It would add an image attachment to the email and that's the last thing we need right now. Instead, we'll use LinkedResource object to directly embed an image in the HTML version of our message to the Queen. We will then follow our regular approach with MailMessage class. As always, remember to upload the file first to your current working directory. If it's missing, an email will be sent without any attachment and, really, aren't we receiving these “oops, forgot about the attachment!” emails too often already?

{% highlight csharp linenos %}

// in the beginning of the file
using System.Net;
using System.Net.Mail;
using System.Net.Mime;

String messageBody = "Elizabeth, sending you a quick sneak peak of the pictures" +
  "we took at the last royal wedding. " +
  "Let me know your thoughts.";
MailAddress to = new MailAddress("elizabeth@westminster.co.uk");
MailAddress from = new MailAddress("piotr@mailtrap.com");
MailMessage message = new MailMessage(from, to);
message.Subject = "Pics from the royal wedding";
message.Body = messageBody;

String imagePath = "familyguy.png";
LinkedResource LinkedImage = new LinkedResource(@imagePath);
LinkedImage.ContentId = "Wedding";

AlternateView htmlView = AlternateView.CreateAlternateViewFromString(
  $"{messageBody} <br> <img src=cid:Wedding>", null, "text/html"
);
htmlView.LinkedResources.Add(LinkedImage);
message.AlternateViews.Add(htmlView);
                
try
{  
  client.Send(message);
}
catch (SmtpException ex)
{
  Console.WriteLine(ex.ToString());
}                
{% endhighlight %}

## Sending to multiple recipients

No rocket science here either. Let's go back to the original email we've sent to our noble recipient.

{% highlight text linenos %}

To: elizabeth@westminster.co.uk	
From: piotr@mailtrap.io
Title: Hey what's up?
Body: Hey Elizabeth, let's meet for lunch on Monday, WDYT?
{% endhighlight %}

Let's say we want to have a bit bigger lunch party than originally planned, we're going to talk about the Royal Wedding after all. Let's keep Prince Harry and his wife Meghan in the loop. New recipients are simply added to the code, separated by a comma. As in the example below.

{% highlight csharp linenos %}

// in the beginning of the file
using System.Net;
using System.Net.Mail;


MailAddress to = new MailAddress("elizabeth@westminster.co.uk, harry@westminster.co.uk");
MailAddress from = new MailAddress("piotr@mailtrap.com");

MailMessage message = new MailMessage(from, to);
message.Subject = "Hey what's up?";
message.Body = "Hey Elizabeth, let's meet for lunch on Monday, WDYT?;";

SmtpClient client = new SmtpClient("smtp.server.address", 2525)
{
    Credentials = new NetworkCredential("smtp_username", "smtp_password"),
    EnableSsl = true
};
// code in brackets above needed if authentication required 

try
{  
  client.Send(message);
}
catch (SmtpException ex)
{
  Console.WriteLine(ex.ToString());
}
{% endhighlight %}


Things get a tiny bit more tricky when you want to add people in bcc and cc, we'll need a few additional lines:

{% highlight csharp linenos %}

// in the beginning of the file
using System.Net;
using System.Net.Mail;



MailAddress to = new MailAddress("elizabeth@westminster.co.uk, harry@westminster.co.uk");
MailAddress from = new MailAddress("piotr@mailtrap.com");

MailMessage message = new MailMessage(from, to);
message.Subject = "Hey what's up?";
message.Body = "Hey Elizabeth, let's meet for lunch on Monday, WDYT?;";
message.CC.Add(new MailAddress("bob@westminster.co.uk")); 
message.Bcc.Add(new MailAddress("charles@westminster.co.uk"));

SmtpClient client = new SmtpClient("smtp.server.address", 2525)
{
    Credentials = new NetworkCredential("smtp_username", "smtp_password"),
    EnableSsl = true
};
// code in brackets above needed if authentication required 

try
{  
  client.Send(message);
}
catch (SmtpException ex)
{
  Console.WriteLine(ex.ToString());
}
{% endhighlight %}

Voila!


## Do I need to have an SMTP server?

Let's consider a situation when you don't have (or don't want to have) an SMTP server configured but still want to send an email in C#.

The first option is to do a DNS MX lookup of the email address that you're trying to send an email to. This allows you to figure out what the SMTP server is and connect to it. So, you're still going to use an SMTP server, just not yours!

We don't, however, recommend such an approach for several reasons:
Your emails might be treated as spam, especially if you send them from a Dynamic IP
Each recipient's mail server will need to be resolved manually.
Compared to other methods, querying DNS manually consumes more CPU and networking, making the performance worse

In order to implement it, you'll need to install a 3rd party plugin. [DnsPlugin.NET](https://www.nuget.org/packages/DnsClient) is our choice here. See the sample code:

{% highlight csharp linenos %}

// in the top of the file
// requires installation of https://www.nuget.org/packages/DnsClient
using System.Net;
using System.Net.Mail;
using DnsClient;



MailAddress to = new MailAddress("elizabeth@westminster.co.uk");
MailAddress from = new MailAddress("piotr@mailtrap.com");

MailMessage message = new MailMessage(from, to);
message.Subject = "See you monday?";
message.Body = "Please lmk if we're still scheduled for lunch this Monday. I'm free from 1pm.";

LookupClient lookup = new LookupClient();
IDnsQueryResponse response = lookup.Query("westminster.co.uk", QueryType.MX);

foreach(DnsClient.Protocol.MxRecord record in response.Answers) {
	Console.WriteLine(ObjectDumper.Dump(record.Exchange));

	SmtpClient client = new SmtpClient(record.Exchange, 25);

	try
	{
		client.Send(message);
		// if we reached this point, our email was sent and we can break the loop
		break;
	}
	catch(SmtpException ex)
	{
		Console.WriteLine(ex.ToString());
	}
}
{% endhighlight %}


## Using API to send emails

A much better approach to sending emails without SMTP is with API. It's definitely the fastest one. It also provides an additional layer of security by utilizing API keys and allows you to use many 3rd party providers that give you tons of additional features such as analytics, email authentication, and others. Each provider will likely offer their own documentation, below we present a sample code from SendGrid that's very clear to understand and implement if you're using their platform.

{% highlight csharp linenos %}

// using SendGrid's C# Library
// https://github.com/sendgrid/sendgrid-csharp
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace Example
{
    internal class Example
    {
        private static void Main()
        {
            Execute().Wait();
        }

        static async Task Execute()
        {
            var apiKey = Environment.GetEnvironmentVariable("NAME_OF_THE_ENVIRONMENT_VARIABLE_FOR_YOUR_SENDGRID_KEY");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("test@example.com", "Example User");
            var subject = "Sending with SendGrid is Fun";
            var to = new EmailAddress("test@example.com", "Example User");
            var plainTextContent = "and easy to do anywhere, even with C#";
            var htmlContent = "<strong>and easy to do anywhere, even with C#</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }
    }
}
{% endhighlight %}


## Receiving emails in C\#

Finally, you might be wondering if there's a way to receive the emails directly with the C# code. After all, the Queen might get back to us any minute now. Of course, you could easily track new emails with simple email clients, such as Gmail or Thunderbird, without a single line of code and with minimal effort. But let's assume you need to see at least the topics of incoming emails with your code, for example, to build some integrations around that.

Receiving emails is not a part of core C# stack so you will need to utilize some 3rd party libraries for that purpose. [OpenPop.NET open-source library](https://sourceforge.net/projects/hpop/) seems to be getting the job done in this case. You can use the following code to fetch the topics of incoming mail:

{% highlight csharp linenos %}

var client = new POPClient();
client.Connect("pop.gmail.com", 995, true);
client.Authenticate("piotr@mailtrap.io", "My_password_here");

var count = client.GetMessageCount();
Message message = client.GetMessage(count);
Console.WriteLine(message.Headers.Subject);
{% endhighlight %}

For the details on using OpenPop library for this or any other purposes, please refer to [their documentation](http://hpop.sourceforge.net/documentation/).

## Summary

As you can see, sending emails in C# is fairly easy, it's mostly about playing with basic HTML and just a few classes. Try it out when you launch your first project but consider some more robust solutions if you plan to scale. If you need to do some email testing, the last thing you want is users receiving the test emails they were not supposed to get.

The article on [Sending emails from ASP.NET with C#](https://blog.mailtrap.io/send-emails-in-net/) was originally posted at Mailtrap's blog. 
