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
          * Billing quota time zone ID; see [List of tz database time zones Wikipedia
              article](http://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
          * Updatable via API
 */

var util = require('./util'),
    Entity = require('./entity');

var Organization = util.makeClass('Organization', Entity);

/**
    organization.createProject(options, callback)
    
    Creates a new project.
    
    Some project settings are not currently possible to configure via
    the API, and can only be edited via the web app after the project is created.
    
    Arguments:
      - options (object)
          * Required
        
        - name (string)
            * Name of the project to create, which must be unique in the organization.
            * Required
        
        - timezone_id
            * Default TZ database timezone ID; see [List of tz database time zones Wikipedia
                article](http://en.wikipedia.org/wiki/List_of_tz_database_time_zones). This timezone
                is used when computing statistics by date.
        
        - url_slug
            * Unique string used as a component of the project's URL in the Telerivet web app.
                If not provided, a URL slug will be generated automatically.
        
        - auto_create_contacts (bool)
            * If true, a contact will be automatically created for each unique phone number that
                a message is sent to or received from. If false, contacts will not automatically be
                created (unless contact information is modified by an automated service). The
                Conversations tab in the web app will only show messages that are associated with a
                contact.
            * Default: 1
        
        - vars
            * Custom variables and values to set for this project
      
      - callback : function(err, project)
          * Required
    */
Organization.prototype.createProject = function(options, callback)
{
    this.api.doRequest("POST", this.getBaseApiPath() + "/projects", options, this.api.wrapCallback(require('./project'), callback));
};

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
    organization.getMessageStats(options, callback)
    
    Retrieves statistics about messages sent or received via Telerivet. This endpoint returns
    historical data that is computed shortly after midnight each day in the project's time zone,
    and does not contain message statistics for the current day.
    
    Arguments:
      - options (object)
          * Required
        
        - start_date (string)
            * Start date of message statistics, in YYYY-MM-DD format
            * Required
        
        - end_date (string)
            * End date of message statistics (inclusive), in YYYY-MM-DD format
            * Required
        
        - rollup (string)
            * Date interval to group by
            * Allowed values: day, week, month, year, all
            * Default: day
        
        - properties (string)
            * Comma separated list of properties to group by
            * Allowed values: org_id, org_name, org_industry, project_id, project_name, user_id,
                user_email, user_name, phone_id, phone_name, phone_type, direction, source, status,
                network_code, network_name, message_type, service_id, service_name, simulated, link
        
        - metrics (string)
            * Comma separated list of metrics to return (summed for each distinct value of the
                requested properties)
            * Allowed values: count, num_parts, duration, price
            * Required
        
        - currency (string)
            * Three-letter ISO 4217 currency code used when returning the 'price' field. If the
                original price was in a different currency, it will be converted to the requested
                currency using the approximate current exchange rate.
            * Default: USD
        
        - filters (object)
            * Key-value pairs of properties and corresponding values; the returned statistics
                will only include messages where the property matches the provided value. Only the
                following properties are supported for filters: `user_id`, `phone_id`, `direction`,
                `source`, `status`, `service_id`, `simulated`, `message_type`, `network_code`
      
      - callback : function(err, res)
          * Required
    */
Organization.prototype.getMessageStats = function(options, callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/message_stats", options, callback);
};

/**
    organization.queryProjects(options)
    
    Queries projects in this organization.
    
    Arguments:
      - options (object)
        
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

