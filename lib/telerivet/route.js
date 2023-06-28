/**
    Route
    
    Represents a custom route that can be used to send messages via one or more basic routes
    (phones).
    
    Custom Routes were formerly referred to simply as "Routes" within Telerivet. API methods,
    parameters, and properties related to Custom Routes continue to use the term "Route" to
    maintain backwards compatibility.
    
    Custom routing rules can currently only be configured via Telerivet's web
    UI.
    
    Fields:
    
      - id (string, max 34 characters)
          * Telerivet's internal ID for the route
          * Read-only
      
      - name
          * The name of the route
          * Updatable via API
      
      - vars (object)
          * Custom variables stored for this route
          * Updatable via API
      
      - project_id
          * ID of the project this route belongs to
          * Read-only
 */

var util = require('./util'),
    Entity = require('./entity');

var Route = util.makeClass('Route', Entity);

/**
    route.save(callback)
    
    Saves any fields or custom variables that have changed for this custom route.
    
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

Object.defineProperty(Route.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

Route.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/routes/" + this.get("id");
};

module.exports = Route;

