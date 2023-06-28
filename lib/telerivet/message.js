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
              cancelled, delivered, not_delivered, read
          * Read-only
      
      - message_type
          * Type of the message
          * Allowed values: sms, mms, ussd, ussd_session, call, chat, service
          * Read-only
      
      - source
          * How the message originated within Telerivet
          * Allowed values: phone, provider, web, api, service, webhook, scheduled, integration
          * Read-only
      
      - time_created (UNIX timestamp)
          * The time that the message was created on Telerivet's servers
          * Read-only
      
      - time_sent (UNIX timestamp)
          * The time that the message was reported to have been sent (null for incoming messages
              and messages that have not yet been sent)
          * Read-only
      
      - time_updated (UNIX timestamp)
          * The time that the message was last updated in Telerivet.
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
          * Whether this message was simulated within Telerivet for testing (and not actually
              sent to or received by a real phone)
          * Read-only
      
      - label_ids (array)
          * List of IDs of labels applied to this message
          * Read-only
      
      - route_params (object)
          * Route-specific parameters for the message. The parameters object may have keys
              matching the `phone_type` field of a phone (basic route) that may be used to send the
              message. The corresponding value is an object with route-specific parameters to use
              when the message is sent by that type of route.
          * Read-only
      
      - vars (object)
          * Custom variables stored for this message
          * Updatable via API
      
      - priority (int)
          * Priority of this message. Telerivet will attempt to send messages with higher
              priority numbers first. Only defined for outgoing messages.
          * Read-only
      
      - error_message
          * A description of the error encountered while sending a message. (This field is
              omitted from the API response if there is no error message.)
          * Updatable via API
      
      - external_id
          * The ID of this message from an external SMS gateway provider (e.g. Twilio or
              Vonage), if available.
          * Read-only
      
      - num_parts (number)
          * The number of SMS parts associated with the message, if applicable and if known.
          * Read-only
      
      - price (number)
          * The price of this message, if known.
          * Read-only
      
      - price_currency
          * The currency of the message price, if applicable.
          * Read-only
      
      - duration (number)
          * The duration of the call in seconds, if known, or -1 if the call was not answered.
          * Read-only
      
      - ring_time (number)
          * The length of time the call rang in seconds before being answered or hung up, if
              known.
          * Read-only
      
      - audio_url
          * For voice calls, the URL of an MP3 file to play when the contact answers the call
          * Read-only
      
      - tts_lang
          * For voice calls, the language of the text-to-speech voice
          * Allowed values: en-US, en-GB, en-GB-WLS, en-AU, en-IN, da-DK, nl-NL, fr-FR, fr-CA,
              de-DE, is-IS, it-IT, pl-PL, pt-BR, pt-PT, ru-RU, es-ES, es-US, sv-SE
          * Read-only
      
      - tts_voice
          * For voice calls, the text-to-speech voice
          * Allowed values: female, male
          * Read-only
      
      - track_clicks (boolean)
          * If true, URLs in the message content are short URLs that redirect to a destination
              URL.
          * Read-only
      
      - short_urls (array)
          * For text messages containing short URLs, this is an array of objects with the
              properties `short_url`, `link_type`, `time_clicked` (the first time that URL was
              clicked), and `expiration_time`. If `link_type` is "redirect", the object also
              contains a `destination_url` property. If `link_type` is "media", the object also
              contains an `media_index` property (the index in the media array). If `link_type` is
              "service", the object also contains a `service_id` property. This property is
              undefined for messages that do not contain short URLs.
          * Read-only
      
      - network_code (string)
          * A string identifying the network that sent or received the message, if known. For
              mobile networks, this string contains the 3-digit mobile country code (MCC) followed
              by the 2- or 3-digit mobile network code (MNC), which results in a 5- or 6-digit
              number. For lists of mobile network operators and their corresponding MCC/MNC values,
              see [Mobile country code Wikipedia
              article](https://en.wikipedia.org/wiki/Mobile_country_code). The network_code property
              may be non-numeric for messages not sent via mobile networks.
          * Read-only
      
      - media (array)
          * For text messages containing media files, this is an array of objects with the
              properties `url`, `type` (MIME type), `filename`, and `size` (file size in bytes).
              Unknown properties are null. This property is undefined for messages that do not
              contain media files. Note: For files uploaded via the Telerivet web app, the URL is
              temporary and may not be valid for more than 1 day.
          * Read-only
      
      - mms_parts (array)
          * A list of parts in the MMS message (only for incoming MMS messages received via
              Telerivet Gateway Android app).
              
              Each MMS part in the list is an object with the following
              properties:
              
              - cid: MMS content-id
              - type: MIME type
              - filename: original filename
              - size (int): number of bytes
              - url: URL where the content for this part is stored (secret but
              publicly accessible, so you could link/embed it in a web page without having to
              re-host it yourself)
              
              In general, the `media` property of the message is recommended for
              retrieving information about MMS media files, instead of `mms_parts`.
              The `mms_parts` property is also only present when retrieving an
              individual MMS message by ID, not when querying a list of messages.
          * Read-only
      
      - time_clicked (UNIX timestamp)
          * If the message contains any short URLs, this is the first time that a short URL in
              the message was clicked.  This property is undefined for messages that do not contain
              short URLs.
          * Read-only
      
      - service_id (string, max 34 characters)
          * ID of the service that handled the message (for voice calls, the service defines the
              call flow)
          * Read-only
      
      - phone_id (string, max 34 characters)
          * ID of the phone (basic route) that sent or received the message
          * Read-only
      
      - contact_id (string, max 34 characters)
          * ID of the contact that sent or received the message
          * Read-only
      
      - route_id (string, max 34 characters)
          * ID of the custom route that sent the message (if applicable)
          * Read-only
      
      - broadcast_id (string, max 34 characters)
          * ID of the broadcast that this message is part of (if applicable)
          * Read-only
      
      - scheduled_id (string, max 34 characters)
          * ID of the scheduled message that created this message is part of (if applicable)
          * Read-only
      
      - user_id (string, max 34 characters)
          * ID of the Telerivet user who sent the message (if applicable)
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
    
    (Deprecated) Retrieves a list of MMS parts for this message (only for incoming MMS messages
    received via Telerivet Gateway Android app).
    Note: This only works for MMS messages received via the Telerivet
    Gateway Android app.
    In general, the `media` property of the message is recommended for
    retrieving information about MMS media files.
    
    The return value has the same format as the `mms_parts` property of
    the Message object.
    
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
    message.resend(options, callback)
    
    Resends a message, for example if the message failed to send or if it was not delivered. If
    the message was originally in the queued, retrying, failed, or cancelled states, then
    Telerivet will return the same message object. Otherwise, Telerivet will create and return a
    new message object.
    
    Arguments:
      - options (object)
        
        - route_id
            * ID of the phone or route to send the message from
      
      - callback : function(err, message)
          * Required
    */
Message.prototype.resend = function(options, callback)
{
    this.api.doRequest("POST", this.getBaseApiPath() + "/resend", options, this.api.wrapCallback(require('./message'), callback));
};

/**
    message.cancel(callback)
    
    Cancels sending a message that has not yet been sent. Returns the updated message object.
    Only valid for outgoing messages that are currently in the queued, retrying, or cancelled
    states. For other messages, the API will return an error with the code 'not_cancellable'.
    
      - callback : function(err, message)
          * Required
    */
Message.prototype.cancel = function(callback)
{
    this.api.doRequest("POST", this.getBaseApiPath() + "/cancel", null, this.api.wrapCallback(require('./message'), callback));
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

Object.defineProperty(Message.prototype, 'time_updated', {
    enumerable: true,
    get: function() { return this.get('time_updated'); },
    set: function(value) { throw new Error('time_updated is not writable'); }
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

Object.defineProperty(Message.prototype, 'route_params', {
    enumerable: true,
    get: function() { return this.get('route_params'); },
    set: function(value) { throw new Error('route_params is not writable'); }
});

Object.defineProperty(Message.prototype, 'priority', {
    enumerable: true,
    get: function() { return this.get('priority'); },
    set: function(value) { throw new Error('priority is not writable'); }
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

Object.defineProperty(Message.prototype, 'num_parts', {
    enumerable: true,
    get: function() { return this.get('num_parts'); },
    set: function(value) { throw new Error('num_parts is not writable'); }
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

Object.defineProperty(Message.prototype, 'duration', {
    enumerable: true,
    get: function() { return this.get('duration'); },
    set: function(value) { throw new Error('duration is not writable'); }
});

Object.defineProperty(Message.prototype, 'ring_time', {
    enumerable: true,
    get: function() { return this.get('ring_time'); },
    set: function(value) { throw new Error('ring_time is not writable'); }
});

Object.defineProperty(Message.prototype, 'audio_url', {
    enumerable: true,
    get: function() { return this.get('audio_url'); },
    set: function(value) { throw new Error('audio_url is not writable'); }
});

Object.defineProperty(Message.prototype, 'tts_lang', {
    enumerable: true,
    get: function() { return this.get('tts_lang'); },
    set: function(value) { throw new Error('tts_lang is not writable'); }
});

Object.defineProperty(Message.prototype, 'tts_voice', {
    enumerable: true,
    get: function() { return this.get('tts_voice'); },
    set: function(value) { throw new Error('tts_voice is not writable'); }
});

Object.defineProperty(Message.prototype, 'track_clicks', {
    enumerable: true,
    get: function() { return this.get('track_clicks'); },
    set: function(value) { throw new Error('track_clicks is not writable'); }
});

Object.defineProperty(Message.prototype, 'short_urls', {
    enumerable: true,
    get: function() { return this.get('short_urls'); },
    set: function(value) { throw new Error('short_urls is not writable'); }
});

Object.defineProperty(Message.prototype, 'network_code', {
    enumerable: true,
    get: function() { return this.get('network_code'); },
    set: function(value) { throw new Error('network_code is not writable'); }
});

Object.defineProperty(Message.prototype, 'media', {
    enumerable: true,
    get: function() { return this.get('media'); },
    set: function(value) { throw new Error('media is not writable'); }
});

Object.defineProperty(Message.prototype, 'mms_parts', {
    enumerable: true,
    get: function() { return this.get('mms_parts'); },
    set: function(value) { throw new Error('mms_parts is not writable'); }
});

Object.defineProperty(Message.prototype, 'time_clicked', {
    enumerable: true,
    get: function() { return this.get('time_clicked'); },
    set: function(value) { throw new Error('time_clicked is not writable'); }
});

Object.defineProperty(Message.prototype, 'service_id', {
    enumerable: true,
    get: function() { return this.get('service_id'); },
    set: function(value) { throw new Error('service_id is not writable'); }
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

Object.defineProperty(Message.prototype, 'route_id', {
    enumerable: true,
    get: function() { return this.get('route_id'); },
    set: function(value) { throw new Error('route_id is not writable'); }
});

Object.defineProperty(Message.prototype, 'broadcast_id', {
    enumerable: true,
    get: function() { return this.get('broadcast_id'); },
    set: function(value) { throw new Error('broadcast_id is not writable'); }
});

Object.defineProperty(Message.prototype, 'scheduled_id', {
    enumerable: true,
    get: function() { return this.get('scheduled_id'); },
    set: function(value) { throw new Error('scheduled_id is not writable'); }
});

Object.defineProperty(Message.prototype, 'user_id', {
    enumerable: true,
    get: function() { return this.get('user_id'); },
    set: function(value) { throw new Error('user_id is not writable'); }
});

Object.defineProperty(Message.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

Message.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/messages/" + this.get("id");
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
