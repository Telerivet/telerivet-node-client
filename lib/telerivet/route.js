/**
    Route
    
    Represents a custom route that can be used to send messages via one or more basic routes
    (phones).
    
    Custom Routes were formerly referred to simply as "Routes" within Telerivet. API methods,
    parameters, and properties related to Custom Routes continue to use the term "Route" to
    maintain backwards compatibility.
    
    Fields:
    
      - id (string, max 34 characters)
          * Telerivet's internal ID for the route
          * Read-only
      
      - name
          * The name of the route
          * Updatable via API
      
      - vars (object)
          * Custom variables stored for this route. Variable names may be up to 32 characters in
              length and can contain the characters a-z, A-Z, 0-9, and _.
              Values may be strings, numbers, or boolean (true/false).
              String values may be up to 4096 bytes in length when encoded as UTF-8.
              Up to 100 variables are supported per object.
              Setting a variable to null will delete the variable.
          * Updatable via API
      
      - url
          * URL to this route in the Telerivet web app
          * Read-only
      
      - project_id
          * ID of the project this route belongs to
          * Read-only
      
      - actions (array of RoutingAction)
          * Array of routing action objects. Allowed action types: `use_phone`, `condition`.
          * Updatable via API
 */

var util = require('./util'),
    Entity = require('./entity');

var Route = util.makeClass('Route', Entity);

/**
    route.save(callback)
    
    Saves any fields, custom variables, or routing actions that have changed for this custom
    route.
    
      - callback : function(err)
          * Required
    */
Route.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

Object.defineProperty(Route.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(Route.prototype, 'name', {
    enumerable: true,
    get: function() { return this.get('name'); },
    set: function(value) { this.set('name', value); }
});

Object.defineProperty(Route.prototype, 'url', {
    enumerable: true,
    get: function() { return this.get('url'); },
    set: function(value) { throw new Error('url is not writable'); }
});

Object.defineProperty(Route.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

Object.defineProperty(Route.prototype, 'actions', {
    enumerable: true,
    get: function() { return this.get('actions'); },
    set: function(value) { this.set('actions', value); }
});

Route.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/routes/" + this.get("id");
};

module.exports = Route;

