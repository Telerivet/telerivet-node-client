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
            * Unique string used as a component of the project's URL in the Telerivet web app
                (required length: 3-18 characters). If not provided, a URL slug will be generated
                automatically.
        
        - auto_create_contacts (bool)
            * If true, a contact will be automatically created for each unique phone number that
                a message is sent to or received from. If false, contacts will not automatically be
                created (unless contact information is modified by an automated service). The
                Conversations tab in the web app will only show messages that are associated with a
                contact.
            * Default: 1
        
        - message_retention_days (int)
            * Number of days to retain messages in this project. Messages older than this will
                be automatically deleted. If null or not provided, messages will be retained
                forever.
        
        - short_link_scheme (bool)
            * If true (the default), short links in messages will include the scheme (e.g.,
                'https://rvt.me/xxxxxxxxx'). If false, short links will not include the scheme
                (e.g., 'rvt.me/xxxxxxxxx').
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
    organization.getBillingDetails(options, callback)
    
    Retrieves information about the organization's service plan, including pricing, billing
    period, current limits, enabled features, overage rates, and any minimum usage fees, as well
    as the current account balance and payment status.
    
    The `plan_limits` object specifies the maximum allowed usage per
    metric (e.g. messages per day, contacts, API requests per day) that is included as part of
    the `plan_price`. Unless otherwise specified, each limit is the total across all projects in
    the organization (except for `custom_actions`).
    
    When usage reaches a limit, what happens depends on the metric
    and whether the `soft_limits` feature is enabled in `plan_features`. For some limits,
    additional usage is allowed and is billed based on `overage_rates` when the `soft_limits`
    feature is enabled. For other limits, additional usage is blocked until the plan is upgraded
    to increase the limits.
    
    Additional details about how service plan limits are defined,
    including what happens when the limits are reached, can be found in the [User
    Guide](https://guide.telerivet.com/hc/en-us/articles/360038959631-Service-Plan-Limits).
    
    Arguments:
      - options (object)
        
        - usage (bool)
            * If true, the response also includes a `usage` object with the current usage count
                for every key in `plan_limits` — equivalent to calling `getUsage` once per key but
                in the same round-trip. Omit (or pass false) to skip the usage counters.
            * Default:
      
      - callback : function(err, res)
          * Required
    */
Organization.prototype.getBillingDetails = function(options, callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/billing", options, callback);
};

/**
    organization.getUsage(usage_type, callback)
    
    Retrieves the current usage count associated with a particular service plan limit.
    
    The available `usage_type` values are the same as the keys returned
    in `plan_limits` from the [getBillingDetails](#Organization.getBillingDetails) method, so
    each call returns the current value of the corresponding limit's counter.
    
    Notes:
    
    - `external_messages_day` and `external_messages_period` reset on
    different schedules: daily counters reset at midnight in the organization's timezone; period
    counters reset at the start of the next plan period (`plan_start_time` to `plan_end_time`
    from `getBillingDetails`).
    - `custom_actions` is the highest custom-action count across any
    single active service in the organization (since the corresponding limit is enforced per
    service, not per organization).
    - `messages_day` is retained as a deprecated alias for
    `external_messages_day`
    
    Arguments:
      - usage_type
          * Usage type. Same as the keys returned in `plan_limits` from
              `Organization.getBillingDetails`.
          * Allowed values: contacts, phones, active_services, users, stored_messages,
              service_invocations_day, api_requests_day, projects, data_rows, script_module_mb,
              stored_file_mb, custom_actions, groups, custom_contact_fields, external_messages_day,
              external_messages_period, ai_chat_credits_day
          * Required
      
      - callback : function(err, res)
          * Required
    */
Organization.prototype.getUsage = function(usage_type, callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/usage/" + usage_type, null, callback);
};

/**
    organization.getUsageHistory(options, callback)
    
    Retrieves the daily history of the usage count associated with a particular service plan
    limit.
    
    Telerivet stores a snapshot of each organization's usage once per
    day, shortly after midnight in the organization's time zone. For usage types that are
    counted per day (`external_messages_day`, `api_requests_day`, `service_invocations_day`, and
    `ai_chat_credits_day`), each entry contains the usage counted during that entire day. For
    all other usage types, each entry contains the usage count at the time the snapshot was
    recorded.
    
    The maximum supported date range is 500 days between start_date and
    end_date. If the requested date range includes the current time, the response will also
    include a final entry with `current: true` containing the live usage count computed at the
    time of the API request.
    
    Usage snapshots are only recorded while an organization is active,
    so an entry may not be available for every date in the requested range.
    
    Arguments:
      - options (object)
          * Required
        
        - usage_type (string)
            * Usage type, corresponding to the keys in the `plan_limits` property returned by
                [getBillingDetails](#Organization.getBillingDetails).
            * Allowed values: contacts, phones, active_services, users, stored_messages,
                service_invocations_day, api_requests_day, projects, data_rows, script_module_mb,
                stored_file_mb, custom_actions, groups, custom_contact_fields,
                external_messages_day, external_messages_period, ai_chat_credits_day
            * Required
        
        - start_date (string)
            * Start date of usage history, in YYYY-MM-DD format (in the organization's time
                zone)
            * Required
        
        - end_date (string)
            * End date of usage history (inclusive), in YYYY-MM-DD format (in the organization's
                time zone)
            * Required
      
      - callback : function(err, res)
          * Required
    */
Organization.prototype.getUsageHistory = function(options, callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/usage_history", options, callback);
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
                requested properties). Supported metrics are `count` (the number of messages),
                `num_parts` (the number of SMS parts), `duration` (the total duration of calls, in
                seconds), and `price.<currency>` (the total price of messages priced in the
                specified ISO 4217 currency, e.g. `price.USD`). Amounts are not converted between
                currencies: each `price.<currency>` metric only includes messages priced in the
                specified currency.
            * Required
        
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

