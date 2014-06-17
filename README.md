Node.js client library for Telerivet REST API

http://telerivet.com

Overview
--------
This library makes it easy to integrate your Node.js application with Telerivet.
You can use it to:

- send SMS messages via an Android phone or SMS gateway service
- update contact information in Telerivet (e.g. from a signup form on your own website)
- add or remove contacts from groups
- export your message/contact data from Telerivet into your own systems
- schedule messages to be sent at a later time
- control automated services
- much more

All API methods are fully documented in the comments of the JS source files;
to learn what functionality is available, start with lib/telerivet.js,
lib/telerivet/project.js, and lib/telerivet/apicursor.js .

System Requirements
-------------------
Node.js 0.8 or higher

Installation:
-------------
npm install telerivet

API Overview
------------

First create a telerivet.API instance with your API key as a parameter:

```
var tr = new telerivet.API(API_KEY);
```

In order to access most API methods, you first need to get a `Project` object:

```
var project = tr.getProjectById(PROJECT_ID);
```

When calling `getProjectById` (and other `get____ById methods) with only 1 argument, 
a "lazy" object is returned immediately, without making an API call to retrieve the 
data for that object (e.g. project.name). 

To retrieve the data you can add a callback parameter, e.g.:

```
tr.getProjectById(PROJECT_ID, function(err, project) {
    if (err) throw err;
    console.log(project.name);
});
```

All other methods that make an API request require a final callback parameter:

```
project.sendMessage({
    to_number: '555-0001', 
    content: 'Hello world!'
}, function(err, message) {
    if (err) throw err;
    console.log(message);
});
```

The `APICursor` class makes it easy to interact with API resources that 
return a pageable list of entities (messages, contacts, etc.).

```
var cursor = project.queryMessages().limit(20);
cursor.each(function(err, message) {
    if (err) throw err;
    if (message)
    {
        console.log(message.content);
    }
});
```

Example Usage:
--------------

```
var telerivet = require('telerivet');

var API_KEY = 'YOUR_API_KEY';  // from https://telerivet.com/api/keys
var PROJECT_ID = 'YOUR_PROJECT_ID'; 

var tr = new telerivet.API(API_KEY);

var project = tr.getProjectById(PROJECT_ID); 

// send message

project.sendMessage({
    to_number: '555-0001', 
    content: 'Hello world!'
}, function(err, message) {
    if (err) throw err;
    console.log(message);
});

// import contact and add to group

project.getOrCreateContact({
    name: 'John Smith',
    phone_number: '555-0001',
    vars: {
        birthdate: '1981-03-04',
        network: 'Vodacom'
    }
}, function(err, contact) {
    if (err) throw err;
    
    project.getOrCreateGroup('Subscribers', function(err, group) {
        if (err) throw err;
        
        contact.addToGroup(group, function(err) {
            if (err) throw err;
        });
    });
});

// query contact information

var namePrefix = 'John';
var cursor = project.queryContacts({
    name: {prefix: namePrefix},
    sort: 'name'    
}).limit(20);

cursor.count(function(err, count) {
    if (err) throw err;
    
    console.log(count + " contacts matching " + namePrefix + ":");        
    
    cursor.each(function(err, contact) {
        if (err) throw err;
        
        if (contact != null)
        {
            console.log(contact.name + " " + contact.phone_number + " " + contact.vars.birthdate);
        }
    });        
});
```