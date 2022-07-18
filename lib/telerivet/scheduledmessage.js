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
      
      - recipients (array of objects)
          * List of recipients. Each recipient is an object with a string `type` property, which
              may be `"phone_number"`, `"group"`, or `"filter"`.
              
              If the type is `"phone_number"`, the `phone_number` property will
              be set to the recipient's phone number.
              
              If the type is `"group"`, the `group_id` property will be set to
              the ID of the group, and the `group_name` property will be set to the name of the
              group.
              
              If the type is `"filter"`, the `filter_type` property (string) and
              `filter_params` property (object) describe the filter used to send the broadcast. (API
              clients should not rely on a particular value or format of the `filter_type` or
              `filter_params` properties, as they may change without notice.)
          * Read-only
      
      - recipients_str
          * A string with a human readable description of the first few recipients (possibly
              truncated)
          * Read-only
      
      - group_id
          * ID of the group to send the message to (null if the recipient is an individual
              contact, or if there are multiple recipients)
          * Read-only
      
      - contact_id
          * ID of the contact to send the message to (null if the recipient is a group, or if
              there are multiple recipients)
          * Read-only
      
      - to_number
          * Phone number to send the message to (null if the recipient is a group, or if there
              are multiple recipients)
          * Read-only
      
      - route_id
          * ID of the phone or route the message will be sent from
          * Read-only
      
      - service_id (string, max 34 characters)
          * The service associated with this message (for voice calls, the service defines the
              call flow)
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
      
      - message_type
          * Type of scheduled message
          * Allowed values: sms, mms, ussd, call, service
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
      
      - track_clicks (boolean)
          * If true, URLs in the message content will automatically be replaced with unique
              short URLs
          * Read-only
      
      - media (array)
          * For text messages containing media files, this is an array of objects with the
              properties `url`, `type` (MIME type), `filename`, and `size` (file size in bytes).
              Unknown properties are null. This property is undefined for messages that do not
              contain media files. Note: For files uploaded via the Telerivet web app, the URL is
              temporary and may not be valid for more than 1 day.
          * Read-only
      
      - route_params (associative array)
          * Route-specific parameters to use when sending the message. The parameters object may
              have keys matching the `phone_type` field of a phone (basic route) that may be used to
              send the message. The corresponding value is an object with route-specific parameters
              to use when sending a message with that type of route.
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

Object.defineProperty(ScheduledMessage.prototype, 'recipients', {
    enumerable: true,
    get: function() { return this.get('recipients'); },
    set: function(value) { throw new Error('recipients is not writable'); }
});

Object.defineProperty(ScheduledMessage.prototype, 'recipients_str', {
    enumerable: true,
    get: function() { return this.get('recipients_str'); },
    set: function(value) { throw new Error('recipients_str is not writable'); }
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

Object.defineProperty(ScheduledMessage.prototype, 'service_id', {
    enumerable: true,
    get: function() { return this.get('service_id'); },
    set: function(value) { throw new Error('service_id is not writable'); }
});

Object.defineProperty(ScheduledMessage.prototype, 'audio_url', {
    enumerable: true,
    get: function() { return this.get('audio_url'); },
    set: function(value) { throw new Error('audio_url is not writable'); }
});

Object.defineProperty(ScheduledMessage.prototype, 'tts_lang', {
    enumerable: true,
    get: function() { return this.get('tts_lang'); },
    set: function(value) { throw new Error('tts_lang is not writable'); }
});

Object.defineProperty(ScheduledMessage.prototype, 'tts_voice', {
    enumerable: true,
    get: function() { return this.get('tts_voice'); },
    set: function(value) { throw new Error('tts_voice is not writable'); }
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

Object.defineProperty(ScheduledMessage.prototype, 'track_clicks', {
    enumerable: true,
    get: function() { return this.get('track_clicks'); },
    set: function(value) { throw new Error('track_clicks is not writable'); }
});

Object.defineProperty(ScheduledMessage.prototype, 'media', {
    enumerable: true,
    get: function() { return this.get('media'); },
    set: function(value) { throw new Error('media is not writable'); }
});

Object.defineProperty(ScheduledMessage.prototype, 'route_params', {
    enumerable: true,
    get: function() { return this.get('route_params'); },
    set: function(value) { throw new Error('route_params is not writable'); }
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

