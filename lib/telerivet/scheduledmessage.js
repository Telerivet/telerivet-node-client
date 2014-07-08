/**
    ScheduledMessage
    
    Represents a scheduled message within Telerivet.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the scheduled message
          * Read-only
      
      - content
          * Text content of the scheduled message
          * Read-only
      
      - rrule
          * Recurrence rule for recurring scheduled messages, e.g. 'FREQ=MONTHLY' or
              'FREQ=WEEKLY;INTERVAL=2'; see <https://tools.ietf.org/html/rfc2445#section-4.3.10>
          * Read-only
      
      - timezone_id
          * Timezone ID used to compute times for recurring messages; see
              <http://en.wikipedia.org/wiki/List_of_tz_database_time_zones>
          * Read-only
      
      - group_id
          * ID of the group to send the message to (null if scheduled to an individual contact)
          * Read-only
      
      - contact_id
          * ID of the contact to send the message to (null if scheduled to a group)
          * Read-only
      
      - to_number
          * Phone number to send the message to (null if scheduled to a group)
          * Read-only
      
      - route_id
          * ID of the phone or route to the message will be sent from
          * Read-only
      
      - message_type
          * Type of scheduled message
          * Allowed values: sms, ussd
          * Read-only
      
      - time_created (UNIX timestamp)
          * Time the scheduled message was created in Telerivet
          * Read-only
      
      - start_time (UNIX timestamp)
          * The time that the message will be sent (or first sent for recurring messages)
          * Read-only
      
      - end_time (UNIX timestamp)
          * Time after which a recurring message will stop (not applicable to non-recurring
              scheduled messages)
          * Read-only
      
      - prev_time (UNIX timestamp)
          * The most recent time that Telerivet has sent this scheduled message (null if it has
              never been sent)
          * Read-only
      
      - next_time (UNIX timestamp)
          * The next upcoming time that Telerivet will sent this scheduled message (null if it
              will not be sent again)
          * Read-only
      
      - occurrences (int)
          * Number of times this scheduled message has already been sent
          * Read-only
      
      - is_template (bool)
          * Set to true if Telerivet will render variables like [[contact.name]] in the message
              content, false otherwise
          * Read-only
      
      - vars (associative array)
          * Custom variables stored for this scheduled message (copied to Message when sent)
          * Updatable via API
      
      - label_ids (array)
          * IDs of labels to add to the Message
          * Read-only
      
      - project_id
          * ID of the project this scheduled message belongs to
          * Read-only
 */ 
 
var util = require('./util'),
    Entity = require('./entity');
 
var ScheduledMessage = util.makeClass('ScheduledMessage', Entity);

/**
    scheduled_msg.save(callback)
    
    Saves any fields or custom variables that have changed for this scheduled message.
    
      - callback : function(err)
          * Required
    */
ScheduledMessage.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    scheduled_msg.delete(callback)
    
    Cancels this scheduled message.
    
      - callback : function(err)
          * Required
    */
ScheduledMessage.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(ScheduledMessage.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'content', {
    enumerable: true,
    get: function() { return this.get('content'); },
    set: function(value) { throw new Error('content is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'rrule', {
    enumerable: true,
    get: function() { return this.get('rrule'); },
    set: function(value) { throw new Error('rrule is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'timezone_id', {
    enumerable: true,
    get: function() { return this.get('timezone_id'); },
    set: function(value) { throw new Error('timezone_id is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'group_id', {
    enumerable: true,
    get: function() { return this.get('group_id'); },
    set: function(value) { throw new Error('group_id is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'contact_id', {
    enumerable: true,
    get: function() { return this.get('contact_id'); },
    set: function(value) { throw new Error('contact_id is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'to_number', {
    enumerable: true,
    get: function() { return this.get('to_number'); },
    set: function(value) { throw new Error('to_number is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'route_id', {
    enumerable: true,
    get: function() { return this.get('route_id'); },
    set: function(value) { throw new Error('route_id is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'message_type', {
    enumerable: true,
    get: function() { return this.get('message_type'); },
    set: function(value) { throw new Error('message_type is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'start_time', {
    enumerable: true,
    get: function() { return this.get('start_time'); },
    set: function(value) { throw new Error('start_time is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'end_time', {
    enumerable: true,
    get: function() { return this.get('end_time'); },
    set: function(value) { throw new Error('end_time is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'prev_time', {
    enumerable: true,
    get: function() { return this.get('prev_time'); },
    set: function(value) { throw new Error('prev_time is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'next_time', {
    enumerable: true,
    get: function() { return this.get('next_time'); },
    set: function(value) { throw new Error('next_time is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'occurrences', {
    enumerable: true,
    get: function() { return this.get('occurrences'); },
    set: function(value) { throw new Error('occurrences is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'is_template', {
    enumerable: true,
    get: function() { return this.get('is_template'); },
    set: function(value) { throw new Error('is_template is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'label_ids', {
    enumerable: true,
    get: function() { return this.get('label_ids'); },
    set: function(value) { throw new Error('label_ids is not writable'); }
});    

Object.defineProperty(ScheduledMessage.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});    

ScheduledMessage.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/scheduled/" + this.get("id");
};

module.exports = ScheduledMessage;

