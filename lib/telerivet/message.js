/**
    Message
    
    Represents a single message.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the message
          * Read-only
      
      - direction
          * Direction of the message: incoming messages are sent from one of your contacts to
              your phone; outgoing messages are sent from your phone to one of your contacts
          * Allowed values: incoming, outgoing
          * Read-only
      
      - status
          * Current status of the message
          * Allowed values: ignored, processing, received, sent, queued, failed, failed_queued,
              cancelled, delivered, not_delivered
          * Read-only
      
      - message_type
          * Type of the message
          * Allowed values: sms, mms, ussd, call
          * Read-only
      
      - source
          * How the message originated within Telerivet
          * Allowed values: phone, provider, web, api, service, webhook, scheduled
          * Read-only
      
      - time_created (UNIX timestamp)
          * The time that the message was created on Telerivet's servers
          * Read-only
      
      - time_sent (UNIX timestamp)
          * The time that the message was reported to have been sent (null for incoming messages
              and messages that have not yet been sent)
          * Read-only
      
      - from_number (string)
          * The phone number that the message originated from (your number for outgoing
              messages, the contact's number for incoming messages)
          * Read-only
      
      - to_number (string)
          * The phone number that the message was sent to (your number for incoming messages,
              the contact's number for outgoing messages)
          * Read-only
      
      - content (string)
          * The text content of the message (null for USSD messages and calls)
          * Read-only
      
      - starred (bool)
          * Whether this message is starred in Telerivet
          * Updatable via API
      
      - simulated (bool)
          * Whether this message is was simulated within Telerivet for testing (and not actually
              sent to or received by a real phone)
          * Read-only
      
      - label_ids (array)
          * List of IDs of labels applied to this message
          * Read-only
      
      - vars (associative array)
          * Custom variables stored for this message
          * Updatable via API
      
      - error_message
          * A description of the error encountered while sending a message. (This field is
              omitted from the API response if there is no error message.)
          * Updatable via API
      
      - external_id
          * The ID of this message from an external SMS gateway provider (e.g. Twilio or Nexmo),
              if available.
          * Read-only
      
      - price
          * The price of this message, if known. By convention, message prices are negative.
          * Read-only
      
      - price_currency
          * The currency of the message price, if applicable.
          * Read-only
      
      - mms_parts (array)
          * A list of parts in the MMS message, the same as returned by the
              [getMMSParts](#Message.getMMSParts) method.
              
              Note: This property is only present when retrieving an individual
              MMS message by ID, not when querying a list of messages. In other cases, use
              [getMMSParts](#Message.getMMSParts).
          * Read-only
      
      - phone_id (string, max 34 characters)
          * ID of the phone that sent or received the message
          * Read-only
      
      - contact_id (string, max 34 characters)
          * ID of the contact that sent or received the message
          * Read-only
      
      - project_id
          * ID of the project this contact belongs to
          * Read-only
 */ 
 
var util = require('./util'),
    Entity = require('./entity');
 
var Message = util.makeClass('Message', Entity);

/**
    message.hasLabel(label)
    
    Returns true if this message has a particular label, false otherwise.
    
    Arguments:
      - label (Label)
          * Required
      
    Returns:
        bool
 */
Message.prototype.hasLabel = function(label)
{
    if (!this.labelIdsSet)
    {
        throw new Error("Message data not loaded yet - call load(callback) before hasLabel");
    }
    return !!this.labelIdsSet[label.id];    
};
    
/**
    message.addLabel(label, callback)
    
    Adds a label to the given message.
    
    Arguments:
      - label (Label)
          * Required
      
      - callback : function(err)
          * Required
 */
Message.prototype.addLabel = function(label, callback)
{
    var self = this;
    this.api.doRequest("PUT", label.getBaseApiPath() + "/messages/" + this.get('id'), null, function(err, res) {
        if (!err)
        {
            self.labelIdsSet[label.id] = true;
        }
        callback(err, res);
    });    
};
    
/**
    message.removeLabel(label, callback)
    
    Removes a label from the given message.
    
    Arguments:
      - label (Label)
          * Required
      
      - callback : function(err)
          * Required
 */
Message.prototype.removeLabel = function(label, callback)
{
    var self = this;
    this.api.doRequest("DELETE", label.getBaseApiPath() + "/messages/" + this.get('id'), null, function(err, res) {
        if (!err)
        {
            delete self.labelIdsSet[label.id];
        }
        callback(err, res);
    });    
};    
      
/**
    message.getMMSParts(callback)
    
    Retrieves a list of MMS parts for this message (empty for non-MMS messages).
    
    Each MMS part in the list is an object with the following
    properties:
    
    - cid: MMS content-id
    - type: MIME type
    - filename: original filename
    - size (int): number of bytes
    - url: URL where the content for this part is stored (secret but
    publicly accessible, so you could link/embed it in a web page without having to re-host it
    yourself)
    
      - callback : function(err, res)
          * Required
    */
Message.prototype.getMMSParts = function(callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/mms_parts", null, callback);
};

/**
    message.save(callback)
    
    Saves any fields that have changed for this message.
    
      - callback : function(err)
          * Required
    */
Message.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    message.delete(callback)
    
    Deletes this message.
    
      - callback : function(err)
          * Required
    */
Message.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(Message.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});    

Object.defineProperty(Message.prototype, 'direction', {
    enumerable: true,
    get: function() { return this.get('direction'); },
    set: function(value) { throw new Error('direction is not writable'); }
});    

Object.defineProperty(Message.prototype, 'status', {
    enumerable: true,
    get: function() { return this.get('status'); },
    set: function(value) { throw new Error('status is not writable'); }
});    

Object.defineProperty(Message.prototype, 'message_type', {
    enumerable: true,
    get: function() { return this.get('message_type'); },
    set: function(value) { throw new Error('message_type is not writable'); }
});    

Object.defineProperty(Message.prototype, 'source', {
    enumerable: true,
    get: function() { return this.get('source'); },
    set: function(value) { throw new Error('source is not writable'); }
});    

Object.defineProperty(Message.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});    

Object.defineProperty(Message.prototype, 'time_sent', {
    enumerable: true,
    get: function() { return this.get('time_sent'); },
    set: function(value) { throw new Error('time_sent is not writable'); }
});    

Object.defineProperty(Message.prototype, 'from_number', {
    enumerable: true,
    get: function() { return this.get('from_number'); },
    set: function(value) { throw new Error('from_number is not writable'); }
});    

Object.defineProperty(Message.prototype, 'to_number', {
    enumerable: true,
    get: function() { return this.get('to_number'); },
    set: function(value) { throw new Error('to_number is not writable'); }
});    

Object.defineProperty(Message.prototype, 'content', {
    enumerable: true,
    get: function() { return this.get('content'); },
    set: function(value) { throw new Error('content is not writable'); }
});    

Object.defineProperty(Message.prototype, 'starred', {
    enumerable: true,
    get: function() { return this.get('starred'); },
    set: function(value) { this.set('starred', value); }
});    

Object.defineProperty(Message.prototype, 'simulated', {
    enumerable: true,
    get: function() { return this.get('simulated'); },
    set: function(value) { throw new Error('simulated is not writable'); }
});    

Object.defineProperty(Message.prototype, 'label_ids', {
    enumerable: true,
    get: function() { return this.get('label_ids'); },
    set: function(value) { throw new Error('label_ids is not writable'); }
});    

Object.defineProperty(Message.prototype, 'error_message', {
    enumerable: true,
    get: function() { return this.get('error_message'); },
    set: function(value) { this.set('error_message', value); }
});    

Object.defineProperty(Message.prototype, 'external_id', {
    enumerable: true,
    get: function() { return this.get('external_id'); },
    set: function(value) { throw new Error('external_id is not writable'); }
});    

Object.defineProperty(Message.prototype, 'price', {
    enumerable: true,
    get: function() { return this.get('price'); },
    set: function(value) { throw new Error('price is not writable'); }
});    

Object.defineProperty(Message.prototype, 'price_currency', {
    enumerable: true,
    get: function() { return this.get('price_currency'); },
    set: function(value) { throw new Error('price_currency is not writable'); }
});    

Object.defineProperty(Message.prototype, 'mms_parts', {
    enumerable: true,
    get: function() { return this.get('mms_parts'); },
    set: function(value) { throw new Error('mms_parts is not writable'); }
});    

Object.defineProperty(Message.prototype, 'phone_id', {
    enumerable: true,
    get: function() { return this.get('phone_id'); },
    set: function(value) { throw new Error('phone_id is not writable'); }
});    

Object.defineProperty(Message.prototype, 'contact_id', {
    enumerable: true,
    get: function() { return this.get('contact_id'); },
    set: function(value) { throw new Error('contact_id is not writable'); }
});    

Object.defineProperty(Message.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});    

Message.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/messages/" + this.get("id") + "";
};

    
Message.prototype.setData = function(data)
{
    this.base(Message, 'setData')(data);
    
    var labelIds = data.label_ids;
    this.labelIdsSet = {};
    if (labelIds)
    {
        for (var i = 0; i < labelIds.length; i++)
        {
            this.labelIdsSet[labelIds[i]] = true;
        }
    }
};

module.exports = Message;
