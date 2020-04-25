---
layout: post
current: post
navigation: True
tags: [Entity Framework]
class: post-template
subclass: 'post entity-framework'
title:  "Entity Framework Migrations For Teams"
description: "Entity Framework is an Object Relational Mapper (ORM) which is a type of tool that simplifies mapping between objects in your software to the tables and columns of a relational database. In this article you will learn how to use EF Migrations with Git and TFS source control in teams."
cover: "assets/images/entity-framework-migrations-for-teams.jpg"
date: 2019-03-28 12:00:00
last_modified_at: Sat Jun 22 12:34:37 2019
author: shadman_kudchikar
comments: true
---


## Contents

* [Why Use Database Migrations?](#why-use-database-migrations)
* [Crafting Migrations in EF](#crafting-migrations-in-ef)
	- [Enable migration](#enable-migration)
	- [Update Entities and Add Migration](#update-entities-and-add-migration)
	- [Spot Checking](#spot-checking)
	- [Update-Database](#update-database)
* [Merge Workflow With Migrations](#merge-workflow-with-migrations)
* [Handling Special Cases With Migrations](#handling-special-cases-with-migrations)
* [Best Practices](#best-practices)
* [References](#references)

## Why Use Database Migrations? {#why-use-database-migrations}

Teams usually use version control systems to manage and collaborate on changes made to versions of source code. Different developers can develop on divergent, relatively older or newer branches of the same source code to make changes and additions during development.

<!--more-->

Supposing that the software under development interacts with a database, every version of the source code can be associated with at least one database schema with which it is compatible.

Schema migration tools can be said to solve versioning problems for database schemas just as version control systems solve versioning problems for source code. 

In practice, many schema migration tools actually rely on a textual representation of schema changes (such as files containing SQL statements) such that the version history of schema changes can effectively be stored alongside program source code within VCS. Its Entity Framework Migrations in our case which gets stored in migration folder in our project.

This approach ensures that the information necessary to recover a compatible database schema for a particular code branch is recoverable from the source tree itself. Another benefit of this approach is the handling of concurrent conflicting schema changes; developers may simply use their usual text-based conflict resolution tools to reconcile differences.

## Crafting Migrations in EF {#crafting-migrations-in-ef}

### 1. Enable migration {#enable-migration}

Enable migration with `Enable-Migrations` command. This will be one time process and done only once in your project lifetime.

### 2. Update Entities and Add Migration {#update-entities-and-add-migration}

After creating or making changes in Entites and Mapping Configuration you will add migration to migration folder using `Add-Migration` command followed by mirgration name.

### 3. Spot Checking {#spot-checking}

Spot checking migration is the important step before updating database which people usually forget or ignore. While spot checking, you should look code generated for default parameters of datatype and relationships between entities in mirgration file. If you are happy with generated migrations you can move to updating database step or delete the migration file and update the enitiy and mapping configuration as per your need.

Also note dont update the code in mirgration file directly as that will be a bad idea because its nothing but just reflection of the entity models and mapping configuration and that will not change your models.

### 4. Update-Database {#update-database}

If everthing is as per requirement in your mirgration run the `Update-Database` command.

Also note that steps 2 to 4 are repetative steps for any change you do in model but enable migration is just one time process.

## Merge Workflow With Migrations {#merge-workflow-with-migrations}

Issues start to arise when you have multiple developers making changes to the EF model and submitting to source control at the same time. What EF lacks is a first class way to merge your local migrations with migrations that another developer has submitted to source control since you last synced.

So in such cases while running Update-Database command can raise a warning:

*Unable to update database to match the current model because there are pending changes and automatic migration is disabled. Either write the pending model changes to a code-based migration or enable automatic migration*

This issue arise when two or more migrations has same base migration, or you can say that, this happens when two or more migrations are created from same source control base branch and then merged together.

You can create custom merge migration, which has updated resx and model but not any up and down steps, to solve this issue. 

The command to create this custom merge migration is `Add-Migration -IgnoreChanges` followed by migration name.

Here rexs files are nothing but binary snapshot of current model attached to migration, which is used to find the required database changes in subsequent migrations, thus by updating it in custom merge branch you solve the model difference issue.

For addition information refer [this article](https://docs.microsoft.com/en-us/ef/ef6/modeling/code-first/migrations/teams)

## Handling Special Cases With Migrations {#handling-special-cases-with-migrations}

- Seeding table with enum for lookup data is done using seed method.
- Lookup data not related to source code can be seeded using custom migrations with sql commands.
- Complex structres can be seeded using custom migrations with sql commands.
- For Views, create entity models, and views can be made by replacing table creation migration code with sql commands.
- Fix invalid data in database using custom migration.
- You can even write stored procedures using custom migrations.

## Best Practices {#best-practices}
- Turn off Automatic Migrations – Automatic migrations takes all control away from the developer on how the database is migrated. You should be in control of the migration files to avoid, ‘It just deleted all my data scenarios’. By turning off automatic migrations you get a chance to decide whether the migration that EF guessed was the right one is actually what you want to happen in the database. It also means simpler and more maintainable code in the EF codebase because we don't need to deal with corner cases in which there is a mix of explicit and automatic migrations.
- Take lastest branch – Always having the latest branch helps to reduce the number of times merge error scenario occurs.
- Push commits and merge branch often – Large pull requests cause a big overhead during the code review and can facilitate bugs in the codebase. That's why you need to care about the pull request itself. It should be short, have a clear title and description, and do only one thing, just a migration in our case.

## References {#references}
- [https://docs.microsoft.com/en-us/ef/ef6/modeling/code-first/migrations/teams](https://docs.microsoft.com/en-us/ef/ef6/modeling/code-first/migrations/teams)
- [https://stackoverflow.com/questions/716637/why-use-database-migrations-instead-of-a-version-controlled-schema](https://stackoverflow.com/questions/716637/why-use-database-migrations-instead-of-a-version-controlled-schema)

[post-image]: /assets/images/entity-framework-migrations-for-teams.jpg "Entity Framework Migrations For Teams"
