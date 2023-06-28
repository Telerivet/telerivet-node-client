/**
    Label
    
    Represents a label used to organize messages within Telerivet.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the label
          * Read-only
      
      - name
          * Name of the label
          * Updatable via API
      
      - time_created (UNIX timestamp)
          * Time the label was created in Telerivet
          * Read-only
      
      - vars (object)
          * Custom variables stored for this label
          * Updatable via API
      
      - project_id
          * ID of the project this label belongs to
          * Read-only
 */

var util = require('./util'),
    Entity = require('./entity');

var Label = util.makeClass('Label', Entity);

/**
    label.queryMessages(options)
    
    Queries messages with the given label.
    
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
Label.prototype.queryMessages = function(options)
{
    return this.api.cursor(require('./message'), this.getBaseApiPath() + "/messages", options);
};

/**
    label.save(callback)
    
    Saves any fields that have changed for the label.
    
      - callback : function(err)
          * Required
    */
Label.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    label.delete(callback)
    
    Deletes the given label (Note: no messages are deleted.)
    
      - callback : function(err)
          * Required
    */
Label.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(Label.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(Label.prototype, 'name', {
    enumerable: true,
    get: function() { return this.get('name'); },
    set: function(value) { this.set('name', value); }
});

Object.defineProperty(Label.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});

Object.defineProperty(Label.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

Label.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/labels/" + this.get("id");
};

module.exports = Label;

