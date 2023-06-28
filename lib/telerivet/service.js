/**
    Service
    
    Represents an automated service on Telerivet, for example a poll, auto-reply, webhook
    service, etc.
    
    A service, generally, defines some automated behavior that can be
    invoked/triggered in a particular context, and may be invoked either manually or when a
    particular event occurs.
    
    Most commonly, services work in the context of a particular message, when
    the message is originally received by Telerivet.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the service
          * Read-only
      
      - name
          * Name of the service
          * Updatable via API
      
      - service_type
          * Type of the service.
          * Read-only
      
      - active (bool)
          * Whether the service is active or inactive. Inactive services are not automatically
              triggered and cannot be invoked via the API.
          * Updatable via API
      
      - priority (int)
          * A number that determines the order that services are triggered when a particular
              event occurs (smaller numbers are triggered first). Any service can determine whether
              or not execution "falls-through" to subsequent services (with larger priority values)
              by setting the return_value variable within Telerivet's Rules Engine.
          * Updatable via API
      
      - contexts (object)
          * A key/value map where the keys are the names of contexts supported by this service
              (e.g. message, contact), and the values are themselves key/value maps where the keys
              are event names and the values are all true. (This structure makes it easy to test
              whether a service can be invoked for a particular context and event.)
          * Read-only
      
      - vars (object)
          * Custom variables stored for this service
          * Updatable via API
      
      - project_id
          * ID of the project this service belongs to
          * Read-only
      
      - response_table_id
          * ID of the data table where responses to this service will be stored
          * Updatable via API
      
      - phone_ids
          * IDs of phones (basic routes) associated with this service, or null if the service is
              associated with all routes. Only applies for service types that handle incoming
              messages, voice calls, or USSD sessions.
          * Updatable via API
      
      - apply_mode
          * If apply_mode is `unhandled`, the service will not be triggered if another service
              has already handled the incoming message. If apply_mode is `always`, the service will
              always be triggered regardless of other services. Only applies to services that handle
              incoming messages.
          * Allowed values: always, unhandled
          * Updatable via API
      
      - contact_number_filter
          * If contact_number_filter is `long_number`, this service will only be triggered if
              the contact phone number has at least 7 digits (ignoring messages from shortcodes and
              alphanumeric senders). If contact_number_filter is `all`, the service will be
              triggered for all contact phone numbers.  Only applies to services that handle
              incoming messages.
          * Allowed values: long_number, all
          * Updatable via API
      
      - show_action (bool)
          * Whether this service is shown in the 'Actions' menu within the Telerivet web app
              when the service is active. Only provided for service types that are manually
              triggered.
          * Updatable via API
      
      - direction
          * Determines whether the service handles incoming voice calls, outgoing voice calls,
              or both. Only applies to services that handle voice calls.
          * Allowed values: incoming, outgoing, both
          * Updatable via API
      
      - webhook_url
          * URL that a third-party can invoke to trigger this service. Only provided for
              services that are triggered by a webhook request.
          * Read-only
 */ 
 
var util = require('./util'),
    Entity = require('./entity');
 
var Service = util.makeClass('Service', Entity);

/**
    service.invoke(options, callback)
    
    Manually invoke this service in a particular context.
    
    For example, to send a poll to a particular contact (or resend the
    current question), you can invoke the poll service with context=contact, and `contact_id` as
    the ID of the contact to send the poll to. (To trigger a service to multiple contacts, use
    [project.sendBroadcast](#Project.sendBroadcast). To schedule a service in the future, use
    [project.scheduleMessage](#Project.scheduleMessage).)
    
    Or, to manually apply a service for an incoming message, you can
    invoke the service with `context`=`message`, `event`=`incoming_message`, and `message_id` as
    the ID of the incoming message. (This is normally not necessary, but could be used if you
    want to override Telerivet's standard priority-ordering of services.)
    
    Arguments:
      - options (object)
          * Required
        
        - context
            * The name of the context in which this service is invoked
            * Allowed values: message, call, ussd_session, row, contact, project
            * Required
        
        - event
            * The name of the event that is triggered (must be supported by this service)
            * Default: default
        
        - message_id
            * The ID of the message this service is triggered for
            * Required if context is 'message'
        
        - contact_id
            * The ID of the contact this service is triggered for (either `contact_id` or
                `phone_number` is required if `context` is 'contact')
        
        - phone_number
            * The phone number of the contact this service is triggered for (either `contact_id`
                or `phone_number` is required if `context` is 'contact'). If no  contact exists with
                this phone number, a new contact will be created.
        
        - variables (object)
            * Object containing up to 25 temporary variable names and their corresponding values
                to set when invoking the service. Values may be strings, numbers, or boolean
                (true/false). String values may be up to 4096 bytes in length. Arrays and objects
                are not supported. Within Custom Actions, each variable can be used like `[[$name]]`
                (with a leading `$` character and surrounded by double square brackets). Within a
                Cloud Script API service or JavaScript action, each variable will be available as a
                global JavaScript variable like `$name` (with a leading `$` character).
        
        - route_id
            * The ID of the phone or route that the service will use for sending messages by
                default
        
        - async (bool)
            * If set to true, the service will be invoked asynchronously. By default, queued
                services will be invoked one at a time for each project.
      
      - callback : function(err, res)
          * Required
 */
Service.prototype.invoke = function(options, callback)
{
    var self = this;
    this.api.doRequest('POST', this.getBaseApiPath() + '/invoke', options, function(err, invokeResult) 
    {
        if (err)
        {
            return callback(err);
        }
            
        var sentMessagesData = invokeResult.sent_messages;
        if (sentMessagesData)
        {
            var Message = require('./message');
        
            var sentMessages = [];            
            for (var i = 0; i < sentMessagesData.length; i++)
            {
                sentMessages.push(new Message(self.api, sentMessagesData[i]));
            }
            invokeResult.sent_messages = sentMessages;
        }        
        return callback(null, invokeResult);
    });
};
    

/**
    service.getContactState(contact, callback)
    
    Gets the current state for a particular contact for this service.
    
    If the contact doesn't already have a state, this method will return
    a valid state object with id=null. However this object would not be returned by
    queryContactStates() unless it is saved with a non-null state id.
    
    Arguments:
      - contact (Contact)
          * The contact whose state you want to retrieve.
          * Required
      
      - callback : function(err, state)
          * Required
 */
Service.prototype.getContactState = function(contact, callback)
{
    this.api.doRequest('GET', this.getBaseApiPath() + '/states/' + contact.id, null, this.api.wrapCallback(require('./contactservicestate'), callback));   
};

/**
    service.setContactState(contact, options, callback)
    
    Initializes or updates the current state for a particular contact for the given service. If
    the state id is null, the contact's state will be reset.
    
    Arguments:
      - contact (Contact)
          * The contact whose state you want to update.
          * Required
      
      - options (object)
          * Required
        
        - id (string, max 63 characters)
            * Arbitrary string representing the contact's current state for this service, e.g.
                'q1', 'q2', etc.
            * Required
        
        - vars (object)
            * Custom variables stored for this contact's state
      
      - callback : function(err, state)
          * Required
 */
Service.prototype.setContactState = function(contact, options, callback)
{
    this.api.doRequest('POST', this.getBaseApiPath() + '/states/' + contact.id, options, this.api.wrapCallback(require('./contactservicestate'), callback));   
};

/**
    service.resetContactState(contact, callback)
    
    Resets the current state for a particular contact for the given service.
    
    Arguments:
      - contact (Contact)
          * The contact whose state you want to reset.
          * Required
      
      - callback : function(err, state)
          * Required
 */
Service.prototype.resetContactState = function(contact, callback)
{
    this.api.doRequest('DELETE', this.getBaseApiPath() + '/states/' + contact.id, null, this.api.wrapCallback(require('./contactservicestate'), callback));   
};
      
/**
    service.queryContactStates(options)
    
    Query the current states of contacts for this service.
    
    Arguments:
      - options (object)
        
        - id
            * Filter states by id
            * Allowed modifiers: id[ne], id[prefix], id[not_prefix], id[gte], id[gt], id[lt],
                id[lte]
        
        - vars (object)
            * Filter states by value of a custom variable (e.g. vars[email], vars[foo], etc.)
            * Allowed modifiers: vars[foo][ne], vars[foo][prefix], vars[foo][not_prefix],
                vars[foo][gte], vars[foo][gt], vars[foo][lt], vars[foo][lte], vars[foo][min],
                vars[foo][max], vars[foo][exists]
        
        - sort
            * Sort the results based on a field
            * Allowed values: default
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
        APICursor (of ContactServiceState)
    */
Service.prototype.queryContactStates = function(options)
{
    return this.api.cursor(require('./contactservicestate'), this.getBaseApiPath() + "/states", options);
};

/**
    service.getConfig(callback)
    
    Gets configuration specific to the type of automated service.
    
    Only certain types of services provide their configuration via the
    API.
    
      - callback : function(err, res)
          * Required
    */
Service.prototype.getConfig = function(callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/config", null, callback);
};

/**
    service.setConfig(options, callback)
    
    Updates configuration specific to the type of automated service.
    
    Only certain types of services support updating their configuration
    via the API.
    
    Note: when updating a service of type custom_template_instance,
    the validation script will be invoked when calling this method.
    
    Arguments:
      - options (object)
          * Configuration for this service type. See
              [project.createService](#Project.createService) for available configuration options.
          * Required
      
      - callback : function(err, res)
          * Required
    */
Service.prototype.setConfig = function(options, callback)
{
    this.api.doRequest("POST", this.getBaseApiPath() + "/config", options, callback);
};

/**
    service.save(callback)
    
    Saves any fields or custom variables that have changed for this service.
    
      - callback : function(err)
          * Required
    */
Service.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    service.delete(callback)
    
    Deletes this service.
    
      - callback : function(err)
          * Required
    */
Service.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(Service.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(Service.prototype, 'name', {
    enumerable: true,
    get: function() { return this.get('name'); },
    set: function(value) { this.set('name', value); }
});

Object.defineProperty(Service.prototype, 'service_type', {
    enumerable: true,
    get: function() { return this.get('service_type'); },
    set: function(value) { throw new Error('service_type is not writable'); }
});

Object.defineProperty(Service.prototype, 'active', {
    enumerable: true,
    get: function() { return this.get('active'); },
    set: function(value) { this.set('active', value); }
});

Object.defineProperty(Service.prototype, 'priority', {
    enumerable: true,
    get: function() { return this.get('priority'); },
    set: function(value) { this.set('priority', value); }
});

Object.defineProperty(Service.prototype, 'contexts', {
    enumerable: true,
    get: function() { return this.get('contexts'); },
    set: function(value) { throw new Error('contexts is not writable'); }
});

Object.defineProperty(Service.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

Object.defineProperty(Service.prototype, 'response_table_id', {
    enumerable: true,
    get: function() { return this.get('response_table_id'); },
    set: function(value) { this.set('response_table_id', value); }
});

Object.defineProperty(Service.prototype, 'phone_ids', {
    enumerable: true,
    get: function() { return this.get('phone_ids'); },
    set: function(value) { this.set('phone_ids', value); }
});

Object.defineProperty(Service.prototype, 'apply_mode', {
    enumerable: true,
    get: function() { return this.get('apply_mode'); },
    set: function(value) { this.set('apply_mode', value); }
});

Object.defineProperty(Service.prototype, 'contact_number_filter', {
    enumerable: true,
    get: function() { return this.get('contact_number_filter'); },
    set: function(value) { this.set('contact_number_filter', value); }
});

Object.defineProperty(Service.prototype, 'show_action', {
    enumerable: true,
    get: function() { return this.get('show_action'); },
    set: function(value) { this.set('show_action', value); }
});

Object.defineProperty(Service.prototype, 'direction', {
    enumerable: true,
    get: function() { return this.get('direction'); },
    set: function(value) { this.set('direction', value); }
});

Object.defineProperty(Service.prototype, 'webhook_url', {
    enumerable: true,
    get: function() { return this.get('webhook_url'); },
    set: function(value) { throw new Error('webhook_url is not writable'); }
});

Service.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/services/" + this.get("id");
};

    
module.exports = Service;
