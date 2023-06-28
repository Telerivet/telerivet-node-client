/**
    Group
    
    Represents a group used to organize contacts within Telerivet.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the group
          * Read-only
      
      - name
          * Name of the group
          * Updatable via API
      
      - dynamic (bool)
          * Whether this is a dynamic or normal group
          * Read-only
      
      - num_members (int)
          * Number of contacts in the group (null if the group is dynamic)
          * Read-only
      
      - time_created (UNIX timestamp)
          * Time the group was created in Telerivet
          * Read-only
      
      - vars (object)
          * Custom variables stored for this group
          * Updatable via API
      
      - project_id
          * ID of the project this group belongs to
          * Read-only
 */

var util = require('./util'),
    Entity = require('./entity');

var Group = util.makeClass('Group', Entity);

/**
    group.queryContacts(options)
    
    Queries contacts that are members of the given group.
    
    Arguments:
      - options (object)
        
        - name
            * Filter contacts by name
            * Allowed modifiers: name[ne], name[prefix], name[not_prefix], name[gte], name[gt],
                name[lt], name[lte]
        
        - phone_number
            * Filter contacts by phone number
            * Allowed modifiers: phone_number[ne], phone_number[prefix],
                phone_number[not_prefix], phone_number[gte], phone_number[gt], phone_number[lt],
                phone_number[lte], phone_number[exists]
        
        - time_created (UNIX timestamp)
            * Filter contacts by time created
            * Allowed modifiers: time_created[min], time_created[max]
        
        - last_message_time (UNIX timestamp)
            * Filter contacts by last time a message was sent or received
            * Allowed modifiers: last_message_time[min], last_message_time[max],
                last_message_time[exists]
        
        - last_incoming_message_time (UNIX timestamp)
            * Filter contacts by last time a message was received
            * Allowed modifiers: last_incoming_message_time[min],
                last_incoming_message_time[max], last_incoming_message_time[exists]
        
        - last_outgoing_message_time (UNIX timestamp)
            * Filter contacts by last time a message was sent
            * Allowed modifiers: last_outgoing_message_time[min],
                last_outgoing_message_time[max], last_outgoing_message_time[exists]
        
        - incoming_message_count (int)
            * Filter contacts by number of messages received from the contact
            * Allowed modifiers: incoming_message_count[ne], incoming_message_count[min],
                incoming_message_count[max]
        
        - outgoing_message_count (int)
            * Filter contacts by number of messages sent to the contact
            * Allowed modifiers: outgoing_message_count[ne], outgoing_message_count[min],
                outgoing_message_count[max]
        
        - send_blocked (bool)
            * Filter contacts by blocked status
        
        - vars (object)
            * Filter contacts by value of a custom variable (e.g. vars[email], vars[foo], etc.)
            * Allowed modifiers: vars[foo][ne], vars[foo][prefix], vars[foo][not_prefix],
                vars[foo][gte], vars[foo][gt], vars[foo][lt], vars[foo][lte], vars[foo][min],
                vars[foo][max], vars[foo][exists]
        
        - sort
            * Sort the results based on a field
            * Allowed values: default, name, phone_number, last_message_time
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
        APICursor (of Contact)
    */
Group.prototype.queryContacts = function(options)
{
    return this.api.cursor(require('./contact'), this.getBaseApiPath() + "/contacts", options);
};

/**
    group.queryScheduledMessages(options)
    
    Queries scheduled messages to the given group.
    
    Arguments:
      - options (object)
        
        - message_type
            * Filter scheduled messages by message_type
            * Allowed values: sms, mms, ussd, ussd_session, call, chat, service
        
        - time_created (UNIX timestamp)
            * Filter scheduled messages by time_created
            * Allowed modifiers: time_created[min], time_created[max]
        
        - next_time (UNIX timestamp)
            * Filter scheduled messages by next_time
            * Allowed modifiers: next_time[min], next_time[max], next_time[exists]
        
        - relative_scheduled_id
            * Filter scheduled messages created for a relative scheduled message
        
        - sort
            * Sort the results based on a field
            * Allowed values: default, next_time
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
        APICursor (of ScheduledMessage)
    */
Group.prototype.queryScheduledMessages = function(options)
{
    return this.api.cursor(require('./scheduledmessage'), this.getBaseApiPath() + "/scheduled", options);
};

/**
    group.save(callback)
    
    Saves any fields that have changed for this group.
    
      - callback : function(err)
          * Required
    */
Group.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    group.delete(callback)
    
    Deletes this group (Note: no contacts are deleted.)
    
      - callback : function(err)
          * Required
    */
Group.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(Group.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(Group.prototype, 'name', {
    enumerable: true,
    get: function() { return this.get('name'); },
    set: function(value) { this.set('name', value); }
});

Object.defineProperty(Group.prototype, 'dynamic', {
    enumerable: true,
    get: function() { return this.get('dynamic'); },
    set: function(value) { throw new Error('dynamic is not writable'); }
});

Object.defineProperty(Group.prototype, 'num_members', {
    enumerable: true,
    get: function() { return this.get('num_members'); },
    set: function(value) { throw new Error('num_members is not writable'); }
});

Object.defineProperty(Group.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});

Object.defineProperty(Group.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

Group.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/groups/" + this.get("id");
};

module.exports = Group;

