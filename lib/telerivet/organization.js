/**
    Organization
    
    Represents a Telerivet organization.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the organization
          * Read-only
      
      - name
          * Name of the organization
          * Updatable via API
      
      - timezone_id
          * Billing quota time zone ID; see
              <http://en.wikipedia.org/wiki/List_of_tz_database_time_zones>
          * Updatable via API
 */

var util = require('./util'),
    Entity = require('./entity');

var Organization = util.makeClass('Organization', Entity);

/**
    organization.save(callback)
    
    Saves any fields that have changed for this organization.
    
      - callback : function(err)
          * Required
    */
Organization.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    organization.getBillingDetails(callback)
    
    Retrieves information about the organization's service plan and account balance.
    
      - callback : function(err, res)
          * Required
    */
Organization.prototype.getBillingDetails = function(callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/billing", null, callback);
};

/**
    organization.getUsage(usage_type, callback)
    
    Retrieves the current usage count associated with a particular service plan limit. Available
    usage types are `phones`, `projects`, `users`, `contacts`, `messages_day`,
    `stored_messages`, `data_rows`, and `api_requests_day`.
    
    Arguments:
      - usage_type
          * Usage type.
          * Required
      
      - callback : function(err, res)
          * Required
    */
Organization.prototype.getUsage = function(usage_type, callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/usage/" + usage_type, null, callback);
};

/**
    organization.queryProjects(options)
    
    Queries projects in this organization.
    
    Arguments:
      - options (associative array)
        
        - name
            * Filter projects by name
            * Allowed modifiers: name[ne], name[prefix], name[not_prefix], name[gte], name[gt],
                name[lt], name[lte]
        
        - sort
            * Sort the results based on a field
            * Allowed values: default, name
            * Default: default
        
        - sort_dir
            * Sort the results in ascending or descending order
            * Allowed values: asc, desc
            * Default: asc
        
        - page_size (int)
            * Number of results returned per page (max 500)
            * Default: 50
        
        - offset (int)
            * Number of items to skip from beginning of result set
            * Default: 0
      
    Returns:
        APICursor (of Project)
    */
Organization.prototype.queryProjects = function(options)
{
    return this.api.cursor(require('./project'), this.getBaseApiPath() + "/projects", options);
};

Object.defineProperty(Organization.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(Organization.prototype, 'name', {
    enumerable: true,
    get: function() { return this.get('name'); },
    set: function(value) { this.set('name', value); }
});

Object.defineProperty(Organization.prototype, 'timezone_id', {
    enumerable: true,
    get: function() { return this.get('timezone_id'); },
    set: function(value) { this.set('timezone_id', value); }
});

Organization.prototype.getBaseApiPath = function()
{
    return "/organizations/" + this.get("id");
};

module.exports = Organization;

