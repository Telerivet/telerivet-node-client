/**
    Contact
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the contact
          * Read-only
      
      - name
          * Name of the contact
          * Updatable via API
      
      - phone_number (string)
          * Phone number of the contact
          * Updatable via API
      
      - time_created (UNIX timestamp)
          * Time the contact was added in Telerivet
          * Read-only
      
      - time_updated (UNIX timestamp)
          * Time the contact was last updated in Telerivet
          * Read-only
      
      - send_blocked (bool)
          * True if Telerivet is blocked from sending messages to this contact
          * Updatable via API
      
      - conversation_status
          * Current status of the conversation with this contact
          * Allowed values: closed, active, handled
          * Updatable via API
      
      - last_message_time (UNIX timestamp)
          * Last time the contact sent or received a message (null if no messages have been sent
              or received)
          * Read-only
      
      - last_incoming_message_time (UNIX timestamp)
          * Last time a message was received from this contact
          * Read-only
      
      - last_outgoing_message_time (UNIX timestamp)
          * Last time a message was sent to this contact
          * Read-only
      
      - message_count (int)
          * Total number of non-deleted messages sent to or received from this contact
          * Read-only
      
      - incoming_message_count (int)
          * Number of messages received from this contact
          * Read-only
      
      - outgoing_message_count (int)
          * Number of messages sent to this contact
          * Read-only
      
      - last_message_id
          * ID of the last message sent to or received from this contact (null if no messages
              have been sent or received)
          * Read-only
      
      - default_route_id
          * ID of the basic route (phone) or custom route that Telerivet will use by default to
              send messages to this contact (null if using project default route)
          * Updatable via API
      
      - group_ids (array of strings)
          * List of IDs of groups that this contact belongs to
          * Read-only
      
      - vars (object)
          * Custom variables stored for this contact
          * Updatable via API
      
      - project_id
          * ID of the project this contact belongs to
          * Read-only
 */ 
 
var util = require('./util'),
    Entity = require('./entity');
 
var Contact = util.makeClass('Contact', Entity);

/**
    contact.isInGroup(group)
    
    Returns true if this contact is in a particular group, false otherwise.
    
    Arguments:
      - group (Group)
          * Required
      
    Returns:
        bool
 */
Contact.prototype.isInGroup = function(group)
{
    if (!this.groupIdsSet)
    {
        throw new Error("Contact data not loaded yet - call load(callback) before hasGroup");
    }
    return !!this.groupIdsSet[group.id];    
};
    
/**
    contact.addToGroup(group, callback)
    
    Adds this contact to a group.
    
    Arguments:
      - group (Group)
          * Required
      
      - callback : function(err)
          * Required
 */
Contact.prototype.addToGroup = function(group, callback)
{
    var self = this;
    this.api.doRequest("PUT", group.getBaseApiPath() + "/contacts/" + this.get('id'), null, function(err, res) {
        if (!err)
        {
            self.groupIdsSet[group.id] = true;
        }
        callback(err, res);
    });    
};
    
/**
    contact.removeFromGroup(group, callback)
    
    Removes this contact from a group.
    
    Arguments:
      - group (Group)
          * Required
      
      - callback : function(err)
          * Required
 */
Contact.prototype.removeFromGroup = function(group, callback)
{
    var self = this;
    this.api.doRequest("DELETE", group.getBaseApiPath() + "/contacts/" + this.get('id'), null, function(err, res) {
        if (!err)
        {
            delete self.groupIdsSet[group.id];
        }
        callback(err, res);
    });    
};    
      
/**
    contact.queryMessages(options)
    
    Queries messages sent or received by this contact.
    
    Arguments:
      - options (object)
        
        - direction
            * Filter messages by direction
            * Allowed values: incoming, outgoing
        
        - message_type
            * Filter messages by message_type
            * Allowed values: sms, mms, ussd, ussd_session, call, chat, service
        
        - source
            * Filter messages by source
            * Allowed values: phone, provider, web, api, service, webhook, scheduled,
                integration
        
        - starred (bool)
            * Filter messages by starred/unstarred
        
        - status
            * Filter messages by status
            * Allowed values: ignored, processing, received, sent, queued, failed,
                failed_queued, cancelled, delivered, not_delivered, read
        
        - time_created[min] (UNIX timestamp)
            * Filter messages created on or after a particular time
        
        - time_created[max] (UNIX timestamp)
            * Filter messages created before a particular time
        
        - external_id
            * Filter messages by ID from an external provider
            * Allowed modifiers: external_id[ne], external_id[exists]
        
        - contact_id
            * ID of the contact who sent/received the message
            * Allowed modifiers: contact_id[ne], contact_id[exists]
        
        - phone_id
            * ID of the phone (basic route) that sent/received the message
        
        - broadcast_id
            * ID of the broadcast containing the message
            * Allowed modifiers: broadcast_id[ne], broadcast_id[exists]
        
        - scheduled_id
            * ID of the scheduled message that created this message
            * Allowed modifiers: scheduled_id[ne], scheduled_id[exists]
        
        - group_id
            * Filter messages sent or received by contacts in a particular group. The group must
                be a normal group, not a dynamic group.
        
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
        APICursor (of Message)
    */
Contact.prototype.queryMessages = function(options)
{
    return this.api.cursor(require('./message'), this.getBaseApiPath() + "/messages", options);
};

/**
    contact.queryGroups(options)
    
    Queries groups for which this contact is a member.
    
    Arguments:
      - options (object)
        
        - name
            * Filter groups by name
            * Allowed modifiers: name[ne], name[prefix], name[not_prefix], name[gte], name[gt],
                name[lt], name[lte]
        
        - dynamic (bool)
            * Filter groups by dynamic/non-dynamic
        
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
        APICursor (of Group)
    */
Contact.prototype.queryGroups = function(options)
{
    return this.api.cursor(require('./group'), this.getBaseApiPath() + "/groups", options);
};

/**
    contact.queryScheduledMessages(options)
    
    Queries messages scheduled to this contact (not including messages scheduled to groups that
    this contact is a member of)
    
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
Contact.prototype.queryScheduledMessages = function(options)
{
    return this.api.cursor(require('./scheduledmessage'), this.getBaseApiPath() + "/scheduled", options);
};

/**
    contact.queryDataRows(options)
    
    Queries data rows associated with this contact (in any data table).
    
    Arguments:
      - options (object)
        
        - time_created (UNIX timestamp)
            * Filter data rows by the time they were created
            * Allowed modifiers: time_created[min], time_created[max]
        
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
        APICursor (of DataRow)
    */
Contact.prototype.queryDataRows = function(options)
{
    return this.api.cursor(require('./datarow'), this.getBaseApiPath() + "/rows", options);
};

/**
    contact.queryServiceStates(options)
    
    Queries this contact's current states for any service
    
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
Contact.prototype.queryServiceStates = function(options)
{
    return this.api.cursor(require('./contactservicestate'), this.getBaseApiPath() + "/states", options);
};

/**
    contact.save(callback)
    
    Saves any fields or custom variables that have changed for this contact.
    
      - callback : function(err)
          * Required
    */
Contact.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    contact.delete(callback)
    
    Deletes this contact.
    
      - callback : function(err)
          * Required
    */
Contact.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(Contact.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(Contact.prototype, 'name', {
    enumerable: true,
    get: function() { return this.get('name'); },
    set: function(value) { this.set('name', value); }
});

Object.defineProperty(Contact.prototype, 'phone_number', {
    enumerable: true,
    get: function() { return this.get('phone_number'); },
    set: function(value) { this.set('phone_number', value); }
});

Object.defineProperty(Contact.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});

Object.defineProperty(Contact.prototype, 'time_updated', {
    enumerable: true,
    get: function() { return this.get('time_updated'); },
    set: function(value) { throw new Error('time_updated is not writable'); }
});

Object.defineProperty(Contact.prototype, 'send_blocked', {
    enumerable: true,
    get: function() { return this.get('send_blocked'); },
    set: function(value) { this.set('send_blocked', value); }
});

Object.defineProperty(Contact.prototype, 'conversation_status', {
    enumerable: true,
    get: function() { return this.get('conversation_status'); },
    set: function(value) { this.set('conversation_status', value); }
});

Object.defineProperty(Contact.prototype, 'last_message_time', {
    enumerable: true,
    get: function() { return this.get('last_message_time'); },
    set: function(value) { throw new Error('last_message_time is not writable'); }
});

Object.defineProperty(Contact.prototype, 'last_incoming_message_time', {
    enumerable: true,
    get: function() { return this.get('last_incoming_message_time'); },
    set: function(value) { throw new Error('last_incoming_message_time is not writable'); }
});

Object.defineProperty(Contact.prototype, 'last_outgoing_message_time', {
    enumerable: true,
    get: function() { return this.get('last_outgoing_message_time'); },
    set: function(value) { throw new Error('last_outgoing_message_time is not writable'); }
});

Object.defineProperty(Contact.prototype, 'message_count', {
    enumerable: true,
    get: function() { return this.get('message_count'); },
    set: function(value) { throw new Error('message_count is not writable'); }
});

Object.defineProperty(Contact.prototype, 'incoming_message_count', {
    enumerable: true,
    get: function() { return this.get('incoming_message_count'); },
    set: function(value) { throw new Error('incoming_message_count is not writable'); }
});

Object.defineProperty(Contact.prototype, 'outgoing_message_count', {
    enumerable: true,
    get: function() { return this.get('outgoing_message_count'); },
    set: function(value) { throw new Error('outgoing_message_count is not writable'); }
});

Object.defineProperty(Contact.prototype, 'last_message_id', {
    enumerable: true,
    get: function() { return this.get('last_message_id'); },
    set: function(value) { throw new Error('last_message_id is not writable'); }
});

Object.defineProperty(Contact.prototype, 'default_route_id', {
    enumerable: true,
    get: function() { return this.get('default_route_id'); },
    set: function(value) { this.set('default_route_id', value); }
});

Object.defineProperty(Contact.prototype, 'group_ids', {
    enumerable: true,
    get: function() { return this.get('group_ids'); },
    set: function(value) { throw new Error('group_ids is not writable'); }
});

Object.defineProperty(Contact.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

Contact.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/contacts/" + this.get("id");
};

    
Contact.prototype.setData = function(data)
{
    this.base(Contact, 'setData')(data);
    
    var groupIds = data.group_ids;
    this.groupIdsSet = {};
    if (groupIds)
    {
        for (var i = 0; i < groupIds.length; i++)
        {
            this.groupIdsSet[groupIds[i]] = true;
        }
    }
};

module.exports = Contact;
