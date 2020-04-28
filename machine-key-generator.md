---
layout: page
class: page-template
title: "Machine Key Generator"
description: "Easiest way to generate Machine Key"
comments: true
---

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.6/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.6/angular-animate.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.6/angular-aria.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.6/angular-messages.min.js"></script>


<link rel="stylesheet" type="text/css" href="/assets/css/machine-key-generator.css">
<div ng-app="myApp" ng-controller="machineKeyCtrl" ng-cloak>
	<div ng-repeat='error in errors'>
		<div class="alert mt-2">
		  <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
		  <strong>Server Error:</strong> &#123;&#123; error.text &#125;&#125;
		</div>
	</div>
	<div>	
		<div class='form-group mt-2'>
			<label class="label">Validation method:</label>
			<div class="btn-group">
				<button name="validation" class='radio-btn' ng-class="{'selected': validation=='MD5'}" ng-click="validation='MD5'">MD5</button>
				<button name="validation" class='radio-btn' ng-class="{'selected': validation=='SHA1'}" ng-click="validation='SHA1'">SHA1</button>
				<button name="validation" class='radio-btn' ng-class="{'selected': validation=='3DES'}" ng-click="validation='3DES'">3DES</button>
				<button name="validation" class='radio-btn' ng-class="{'selected': validation=='AES'}" ng-click="validation='AES'">AES</button>
				<button name="validation" class='radio-btn' ng-class="{'selected': validation=='HMACSHA256'}" ng-click="validation='HMACSHA256'">HMACSHA256</button>
				<button name="validation" class='radio-btn' ng-class="{'selected': validation=='HMACSHA384'}" ng-click="validation='HMACSHA384'">HMACSHA384</button>
				<button name="validation" class='radio-btn' ng-class="{'selected': validation=='HMACSHA512'}" ng-click="validation='HMACSHA512'">HMACSHA512</button>
			</div>
		</div>
		<div class="form-group mt-1">
				<label class="label">Decryption method:</label>
				<div class="btn-group">
					<button name="decryption" class="radio-btn" ng-class="{'selected': decryption=='AES128'}" ng-click="decryption='AES128'">AES-128</button>
					<button name="decryption" class="radio-btn" ng-class="{'selected': decryption=='AES192'}" ng-click="decryption='AES192'">AES-192</button>
					<button name="decryption" class="radio-btn" ng-class="{'selected': decryption=='AES256'}" ng-click="decryption='AES256'">AES-256</button>
					<button name="decryption" class="radio-btn" ng-class="{'selected': decryption=='DES'}" ng-click="decryption='DES'">DES</button>
					<button name="decryption" class="radio-btn" ng-class="{'selected': decryption=='3DES'}" ng-click="decryption='3DES'">3DES</button>	
			</div>
		</div>		
	</div>	
	<div style="height: 40px; margin-top: 10px;" class="mt-2">
		<button class="btn float-right" ng-click="generateMachineKey()">Generate</button>
	</div>
	<!--<div class="output mt-2">
		<div class="output-header">
			<span class='heading'> Output </span>
			<button class="output-button" ng-click="copyText('result')"><i class="fa fa-copy"></i> Copy</button>
		</div>
		<div class='output-body' id='result'>
		&#123;&#123; result &#125;&#125;
		</div>
	</div>-->
</div>

<script type="text/javascript" src="/assets/js/machine-key-generator.js"></script>

## What Is Machine Key?

The *machineKey* element in the ASP.NET web.config file specifies the algorithm and keys that ASP.NET will use for encryption. 

By default the validationKey and the decryptionKey keys are set to AutoGenerate which means the runtime will generate a random key for use. This works fine for applications that are deployed on a single server.

But, When you use webfarms a client request can land on any one of the servers in the webfarm. Hence you will have to hardcode the validationKey and the decryptionKey on all your servers in the farm with a manually generated key.

The value is stored locally in the web.config of that application. Below is the sample code.

```xml
<configuration>
	<system.web>
		<machineKey 
		decryption="AES"
		validation="SHA1"
		decryptionKey="Decryption key goes here" 
		validationKey="Validation key goes here"                  
		/>
	</system.web>
</configuration>
```

## What Is The Use Of Machine Key In IIS?
Machine key is a unique key that differentiates one computer from others. And this key is used to create unique identifier when cookie is created in the client machine from a server side code.

This key is generally present in the machine.config file when you install .NET framework that is generally not visible to the user as it remains in the .NET Framework installation directory. 

When you specify the same key in your web.config, the value of machine key specified in the machine.config is overridden by the one you have specified in the web.config file.

## Further Reading

- [Replace the ASP.NET machineKey in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/compatibility/replacing-machinekey?view=aspnetcore-2.2) - The implementation of the &lt;machineKey&gt; element in ASP.NET is replaceable. This allows most calls to ASP.NET cryptographic routines to be routed through a replacement data protection mechanism, including the new data protection system. 

- [Setting the Validation and Decryption Keys](https://docs.microsoft.com/en-us/aspnet/web-forms/overview/older-versions-security/introduction/forms-authentication-configuration-and-advanced-topics-cs#setting-the-validation-and-decryption-keys) - The encryption and hashing algorithms used by the forms authentication system to encrypt and validate the authentication ticket are customizable through the &lt;machineKey&gt; element in Web.config. This microsoft doc outlines the &lt;machineKey&gt; element's attributes and their possible values.

- [Professional ASP.NET 2.0 Security, Membership, and Role Management](https://amzn.to/31b65yc) - Refer this book for an in-depth look at these issues, including guidance on what encryption and validation algorithms to use, what key lengths to use, and how best to generate these keys.

