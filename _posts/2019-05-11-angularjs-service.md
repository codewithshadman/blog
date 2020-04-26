---
layout: post
current: post
navigation: True
tags: [AngularJs]
class: post-template
subclass: 'post angularjs'
title:  "AngularJS Service"
description: "Angularjs Services are objects that contain reusable code that can get consumed across app using Dependency Injection. This article will explain all of the techniques required to create your own AngularJS service."
cover: "assets/images/angularjs-service.jpg"
date: Sat May  11 12:45:49 2019
last_modified_at: Sat Jun  8 12:44:16 2019
categories: [Angular, AngularJS]
author: shadman_kudchikar
comments: true
---


## Contents

* [What are Services in Angularjs?](#what-are-services-in-angularjs)
* [Why use Services in Angularjs?](#why-use-services-in-angularjs)
* [Angularjs Service Example](#angularjs-service-example)
* [Different Methods To Create AngularJS Services](#different-methods-to-create-angularjs-services)
    * [Angularjs Provider Example](#angularjs-provider-example)
    * [Factory Method In AngularJs](#factory-method-in-angularjs)
    * [Service Method In AngularJs](#service-method-in-angularjs)
      * [Difference Between Service And Factory In Angularjs ](#difference-between-service-and-factory-in-angularjs)
    * [Angularjs Value Service](#angularjs-value-service)
    * [Angularjs Constant Service](#angularjs-constant-service)
* [Conclusion](#conclusion)
* [References](#references)

## What are Services in Angularjs? {#what-are-services-in-angularjs}

**Angularjs Services** are functions or objects that contains reusable code that can get consumed accross app by controllers, directives, filters and other **services** using Dependency Injection Mechanism of Angularjs. 

<!--more-->

These are also called as singletons, which are the objects that are instantiated only once per application.

**Services** provide a method for us to keep data around the lifetime of the app and communicate across controllers in a consistent manner.

## Why use Services in Angularjs? {#why-use-services-in-angularjs}

Writing your own **services** is a great way to implement reusable code and they're the perfect place to capture the logic specific to your application.

Following are its uses:

- To share data between controllers, **Services** will fetch data from the database, if we store the data inside a controller, once we change to another controller the data will be discarded.This problem can be solved by using $rootscope but, that is not the best way. If we keep the data inside **service**, that will be accessible for all the controllers.
- It provides a method to keep data across the lifetime of the angular application.
- It is used to organize and share data and functions across the application.
- We can divide our application into multiple different types of components which Angularjs can inject into each other.Modularizing our application makes it easier to reuse, configure and test the components in our application.

## Angularjs Service Example {#angularjs-service-example}

The most simple example I could come up with is alert **service** or notifier **service**, consider you are using routing and ng view in your angular app and you want to send classic bootstrap alert box in your main index controller outside of your route controller, than creating a alert **service** that get consumed by both controller can solve this problem. 

Below is the sample code.

{% highlight javascript linenos %}

angular.module('app')
    .factory('alertService', function ($interval) {

        return  {
            alerts: [], 

            addAlert: function addAlert(icon,type, title, message, timeout) {
                var alert = {
                    icon: icon,
                    type: type,
                    title: title,
                    message: message
                };
                this.alerts.push(alert);

                var serv = this;

                $interval(function () {
                    var alertIndex = serv.alerts.findIndex(function (a) { return a == alert });
                    if (alertIndex > -1) {
                        serv.alerts.splice(alertIndex, 1);
                    }                    
                }, timeout, 1);
            },

            addDanger: function addDanger(title, message, timeout = 3000) {
                this.addAlert("fa-ban","alert-danger", title, message, timeout);
            },
            addWarning: function addWarning(title, message, timeout = 3000) {
                this.addAlert("fa-warning","alert-warning", title, message, timeout);
            },
            addInfo: function addInfo(title, message, timeout = 3000) {
                this.addAlert("fa-info","alert-info", title, message, timeout);
            },
            addSuccess: function addSuccess(title, message, timeout = 3000) {
                this.addAlert("fa-check", "alert-success", title, message, timeout);
            },
        }

    });
{% endhighlight %}


## Different Methods To Create AngularJS Services {#different-methods-to-create-angularjs-services}

There are five functions you can use to create an Angular **service**. All of these functions may be called on the built-in provide **service**. All of them are also exposed on the module object as a convenience. 

### Angularjs Provider Example {#angularjs-provider-example}
The most fundamental **service** creation function is the **provider function**. Creating **services** with it allows you to create a configurable **provider** object. The **provider** knows how to create the resulting **service**.

The basic process is that the `$provide` service creates a **provider** which contains a function that is used to create a **service**. 

The first function on the $provide **service** we'll look at is the `provider` function. It's the most fundamental way to create a **service**. All of the other methods of creating **services**(factory, service, and value method) which we'll learn are just wrappers around the **provider function** (except constant method).

To use the **provider function** directly, you simply call the function and pass it a name and a function that will define the underlying **provider**. 

The **provider** created for each **service**, will be given a name that is the name you specify for the **service** with the word **provider** appended to it. So in the below example, the name of the **service** we will inject into our other components, will be 'oauth', and the name of the **provider** we will inject in module config method will be oauthProvider to configure our oauth **service**. 

Provider function requires **service** name as first parameter and second parameter it require is the function which must contain a property named `$get.` 

The return value of the function assigned to `$get` property will represent our **service** that gets injected.

The benefit of using **provider** method is that it is configurable which at the end decides the resulting **service**. None of the other **service** creation functions allow you to do this. 

Let's see how to create and configure a **service** with the **provider function** in code below.

In the below example I created an oauth **service** that can be used for login and logut operation in the app. It internally depends on custom currentUser and formEncode **service** and angular built-in $http **service**. You can find currentUser and formEncode **service** code [here](https://gist.github.com/kudchikarsk/f8ae377255f04cdc00a0fbc35287dbb5) and [here](https://gist.github.com/kudchikarsk/4145277e8d81aedca5b69782f9fe1713).

{% highlight javascript linenos %}

angular.module("app")
    .config(function ($provide) {
        $provide.provider("oauth", function () {

            var url = "/token";

            this.setUrl = function (newUrl) {
                url = newUrl;
            };

            this.$get = function ($http, formEncode, currentUser) {

                var processToken = function (username) {
                    return function (response) {
                        currentUser.profile.username = username;
                        currentUser.profile.token = response.data.access_token;
                        currentUser.save();

                        $http.get(`api/IdentityEmployee/${username}`).then(function (res) {
                            currentUser.profile.userInfo = res.data;
                            currentUser.save();
                        });

                        return username;
                    }
                };

                var login = function (username, password) {

                    var configuration = {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    };

                    var data = formEncode({
                        username: username,
                        password: password,
                        grant_type: "password"
                    });

                    return $http.post(url, data, configuration).then(processToken(username));
                };

                var logout = function () {
                    currentUser.profile.username = "";
                    currentUser.profile.token = "";
                    currentUser.remove();
                };

                return {
                    login: login,
                    logout: logout
                };
            }
        });
    }); 

angular.module("app").config(["oauthProvider", function(oauthProvider) {
  oauthProvider.setUrl('/another-token-url');
}]);
{% endhighlight %}

The below three **service** creation methods all internally call the **provider function**. They're just syntactic sugar that make your code a little simpler if you don't need to provide all of the data required by the **provider function**.

### Factory Method In AngularJs {#factory-method-in-angularjs}
The **factory function** is much easier to use than the above **provider** method. If you don't need to configure the **provider**, like we did in the last example, then use the **factory function** which is much simpler and readable way to create your **services**. 

In the below example I created a simple localStorage **service** that internally use browser window local storage to store key value data.

{% highlight javascript linenos %}

angular.module("app")
    .factory("localStorage", function ($window) {

        var store = $window.localStorage;

        var add = function (key, value) {
            value = angular.toJson(value);
            store.setItem(key, value);
        };

        var get = function (key) {
            var value = store.getItem(key);
            if (value) {
                value = angular.fromJson(value);
            }
            return value;
        };

        var remove = function (key) {
            store.removeItem(key);
        };

        return {
            add: add,
            get: get,
            remove: remove
        };
    });
{% endhighlight %}

### Service Method In AngularJs {#service-method-in-angularjs}

The next **service** creation function is Service, which is simply a wrapper around the **factory function**. When you call the **service** function, it will internally call the **factory function**, which will then call the **provider function**.

#### Difference Between Service And Factory In Angularjs {#difference-between-service-and-factory-in-angularjs}
The only difference is that the function you passed to the **service method** will be treated as a constructor function and called with the JavaScript "new" operator. You would use the **service method** instead of the factory method if you specifically needed your function to be treated as a constructor and called with the "new" operator. 

There are several reasons why you may want that behavior. One is if you have defined an inheritance hierarchy in your code. Creating an instance with "new" will make sure that your instantiated object properly inherits from its prototypes. Here is an example,

{% highlight javascript linenos %}

 angular.module('app')
        .service('logger', CustomerLogger);

    function LoggerBase() { }

    LoggerBase.prototype.output = function(message) {
        console.log('LoggerBase: ' + message);
    };

    function CustomerLogger() {

        LoggerBase.call(this);

        this.logApp = function(customer) {
            console.log('Customer: ' + customer);
        }
    }

    CustomerLogger.prototype = Object.create(LoggerBase.prototype);
{% endhighlight %}

From the above code you can call logger **service** `output` method which is part of base `LoggerBase` class even though logger **service** is registering CustomerLogger class.

### Angularjs Value Service {#angularjs-value-service}
Similarly, the value function is just a thin wrapper around the **factory function**.  The value function is just shorthand for calling the **factory function** with no parameters. If you don't need to inject anything into your **factory function**, you can use the value function instead.

{% highlight javascript linenos %}

angular.module('app').value('clientId', 'a12345654321x');

angular.module('app').controller('DemoController', ['clientId', function DemoController(clientId) {
  this.clientId = clientId;
}]);
{% endhighlight %}

You use it in much the same way you use the **constant service** which is the fifth function available for **service** creation. 

### Angularjs Constant Service {#angularjs-constant-service}

The constant function is totally different from other **services**. It allows you to register an object literal function or some other constant value with the injector, but it doesn't call the **service**, **factory** or **provider methods** behind the scenes. What makes it different from **value service** is that a **value service** can't be injected into a module configuration function, but a **constant service** can.

AngularJS splits the life-cycle into configuration phase and run phase and you can provide configuration to your application via the config function. Since the config function runs in the configuration phase when no **services** are available, it doesn't have access even to simple value **service** objects created via the Value function method.

This is what the Constant **service** is for.

{% highlight javascript linenos %}

angular.module('app').constant('tokerUrl', '/another-token-url');

angular.module("app").config(["oauthProvider", "tokerUrl", function(oauthProvider, tokerUrl) {
  oauthProvider.setUrl(tokerUrl);
}]);
{% endhighlight %}

## Conclusion {#conclusion}
There are five methods to create **services**: Value, Factory, Service, Provider and Constant.

**Factory and Service** are the most commonly used method. The only difference between them is that the Service method works better for objects that need inheritance hierarchy, while the Factory can produce JavaScript primitives and functions.

The Provider function is the core method and all the other ones are just syntactic sugar on it. You need it only if you are building a reusable piece of code that needs global configuration.

<table class="table table-bordered code-table ng-scope">
<thead>
<tr>
  <th>Features / Methods</th>
  <th>Factory</th>
  <th>Service</th>
  <th>Value</th>
  <th>Constant</th>
  <th>Provider</th>
</tr>
</thead>
<tbody>
<tr>
  <td>can have dependencies</td>
  <td class="success">yes</td>
  <td class="success">yes</td>
  <td class="error">no</td>
  <td class="error">no</td>
  <td class="success">yes</td>
</tr>
<tr>
  <td>uses type friendly injection</td>
  <td class="error">no</td>
  <td class="success">yes</td>
  <td class="success">yes*</td>
  <td class="success">yes*</td>
  <td class="error">no</td>
</tr>
<tr>
  <td>object available in config phase</td>
  <td class="error">no</td>
  <td class="error">no</td>
  <td class="error">no</td>
  <td class="success">yes</td>
  <td class="success">yes**</td>
</tr>
<tr>
  <td>can create functions</td>
  <td class="success">yes</td>
  <td class="success">yes</td>
  <td class="success">yes</td>
  <td class="success">yes</td>
  <td class="success">yes</td>
</tr>
<tr>
  <td>can create primitives</td>
  <td class="success">yes</td>
  <td class="error">no</td>
  <td class="success">yes</td>
  <td class="success">yes</td>
  <td class="success">yes</td>
</tr>
</tbody>
</table>

\* at the cost of eager initialization by using new operator directly

** the **service** object is not available during the config phase, but the **provider** instance is (see the oauthProvider example above).

## References {#references}
- [https://docs.angularjs.org/guide/services](https://docs.angularjs.org/guide/services)
- [https://docs.angularjs.org/guide/providers](https://docs.angularjs.org/guide/providers)
- [https://docs.angularjs.org/guide/di](https://docs.angularjs.org/guide/di)
- [https://gist.github.com/kudchikarsk/f8ae377255f04cdc00a0fbc35287dbb5](https://gist.github.com/kudchikarsk/f8ae377255f04cdc00a0fbc35287dbb5)
- [https://gist.github.com/kudchikarsk/4145277e8d81aedca5b69782f9fe1713](https://gist.github.com/kudchikarsk/4145277e8d81aedca5b69782f9fe1713)




[post-image]: /assets/images/angularjs-service.jpg "AngularJS Service"