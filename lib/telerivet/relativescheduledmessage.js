/**
    RelativeScheduledMessage
    
    A relative scheduled message is a message that is scheduled relative to a date stored as a
    custom field for each recipient contact.
    This allows scheduling messages on a different date for each contact, for
    example on their birthday, a certain number of days before an appointment, or a certain
    number of days after enrolling in a campaign.
    
    Telerivet will automatically create a [ScheduledMessage](#ScheduledMessage)
    for each contact matching a RelativeScheduledMessage.
    
    Any service that can be manually triggered for a contact (including polls)
    may also be scheduled via a relative scheduled message, whether or not the service actually
    sends a message.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the relative scheduled message
          * Read-only
      
      - content
          * Text content of the relative scheduled message
          * Updatable via API
      
      - time_of_day
          * Time of day when scheduled messages will be sent in HH:MM format (with hours from 00
              to 23)
          * Updatable via API
      
      - date_variable
          * Custom contact variable storing date or date/time values relative to which messages
              will be scheduled.
          * Updatable via API
      
      - offset_scale
          * The type of interval (day/week/month/year) that will be used to adjust the scheduled
              date relative to the date stored in the contact's date_variable, when offset_count is
              non-zero (D=day, W=week, M=month, Y=year)
          * Allowed values: D, W, M, Y
          * Updatable via API
      
      - offset_count (int)
          * The number of days/weeks/months/years to adjust the date of the scheduled message
              relative relative to the date stored in the contact's date_variable. May be positive,
              negative, or zero.
          * Updatable via API
      
      - rrule
          * Recurrence rule for recurring scheduled messages, e.g. 'FREQ=MONTHLY' or
              'FREQ=WEEKLY;INTERVAL=2'; see
              [RFC2445](https://tools.ietf.org/html/rfc2445#section-4.3.10).
          * Updatable via API
      
      - end_time (UNIX timestamp)
          * Time after which recurring messages will stop (not applicable to non-recurring
              scheduled messages)
          * Updatable via API
      
      - timezone_id
          * Timezone ID used to compute times for recurring messages; see [List of tz database
              time zones Wikipedia
              article](http://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
          * Updatable via API
      
      - recipients_str
          * A string with a human readable description of the recipient
          * Read-only
      
      - group_id
          * ID of the group to send the message to (null if the recipient is an individual
              contact)
          * Updatable via API
      
      - contact_id
          * ID of the contact to send the message to (null if the recipient is a group)
          * Updatable via API
      
      - to_number
          * Phone number to send the message to (null if the recipient is a group)
          * Updatable via API
      
      - route_id
          * ID of the phone or route the message will be sent from
          * Updatable via API
      
      - service_id (string, max 34 characters)
          * The service associated with this message (for voice calls, the service defines the
              call flow)
          * Updatable via API
      
      - audio_url
          * For voice calls, the URL of an MP3 file to play when the contact answers the call
          * Updatable via API
      
      - tts_lang
          * For voice calls, the language of the text-to-speech voice
          * Allowed values: en-US, en-GB, en-GB-WLS, en-AU, en-IN, da-DK, nl-NL, fr-FR, fr-CA,
              de-DE, is-IS, it-IT, pl-PL, pt-BR, pt-PT, ru-RU, es-ES, es-US, sv-SE
          * Updatable via API
      
      - tts_voice
          * For voice calls, the text-to-speech voice
          * Allowed values: female, male
          * Updatable via API
      
      - message_type
          * Type of scheduled message
          * Allowed values: sms, mms, ussd, ussd_session, call, chat, service
          * Read-only
      
      - time_created (UNIX timestamp)
          * Time the relative scheduled message was created in Telerivet
          * Read-only
      
      - replace_variables (bool)
          * Set to true if Telerivet will render variables like [[contact.name]] in the message
              content, false otherwise
          * Updatable via API
      
      - track_clicks (boolean)
          * If true, URLs in the message content will automatically be replaced with unique
              short URLs
          * Updatable via API
      
      - media (array)
          * For text messages containing media files, this is an array of objects with the
              properties `url`, `type` (MIME type), `filename`, and `size` (file size in bytes).
              Unknown properties are null. This property is undefined for messages that do not
              contain media files. Note: For files uploaded via the Telerivet web app, the URL is
              temporary and may not be valid for more than 1 day.
          * Read-only
      
      - route_params (object)
          * Route-specific parameters to use when sending the message. The parameters object may
              have keys matching the `phone_type` field of a phone (basic route) that may be used to
              send the message. The corresponding value is an object with route-specific parameters
              to use when sending a message with that type of route.
          * Updatable via API
      
      - vars (object)
          * Custom variables stored for this scheduled message (copied to each ScheduledMessage
              and Message when sent)
          * Updatable via API
      
      - label_ids (array)
          * IDs of labels to add to the Message
          * Updatable via API
      
      - project_id
          * ID of the project this relative scheduled message belongs to
          * Read-only
 */

var util = require('./util'),
    Entity = require('./entity');

var RelativeScheduledMessage = util.makeClass('RelativeScheduledMessage', Entity);

/**
    rel_scheduled_msg.save(callback)
    
    Saves any fields or custom variables that have changed for this relative scheduled message.
    
      - callback : function(err)
          * Required
    */
RelativeScheduledMessage.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    rel_scheduled_msg.delete(callback)
    
    Deletes this relative scheduled message and any associated scheduled messages.
    
      - callback : function(err)
          * Required
    */
RelativeScheduledMessage.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(RelativeScheduledMessage.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'content', {
    enumerable: true,
    get: function() { return this.get('content'); },
    set: function(value) { this.set('content', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'time_of_day', {
    enumerable: true,
    get: function() { return this.get('time_of_day'); },
    set: function(value) { this.set('time_of_day', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'date_variable', {
    enumerable: true,
    get: function() { return this.get('date_variable'); },
    set: function(value) { this.set('date_variable', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'offset_scale', {
    enumerable: true,
    get: function() { return this.get('offset_scale'); },
    set: function(value) { this.set('offset_scale', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'offset_count', {
    enumerable: true,
    get: function() { return this.get('offset_count'); },
    set: function(value) { this.set('offset_count', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'rrule', {
    enumerable: true,
    get: function() { return this.get('rrule'); },
    set: function(value) { this.set('rrule', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'end_time', {
    enumerable: true,
    get: function() { return this.get('end_time'); },
    set: function(value) { this.set('end_time', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'timezone_id', {
    enumerable: true,
    get: function() { return this.get('timezone_id'); },
    set: function(value) { this.set('timezone_id', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'recipients_str', {
    enumerable: true,
    get: function() { return this.get('recipients_str'); },
    set: function(value) { throw new Error('recipients_str is not writable'); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'group_id', {
    enumerable: true,
    get: function() { return this.get('group_id'); },
    set: function(value) { this.set('group_id', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'contact_id', {
    enumerable: true,
    get: function() { return this.get('contact_id'); },
    set: function(value) { this.set('contact_id', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'to_number', {
    enumerable: true,
    get: function() { return this.get('to_number'); },
    set: function(value) { this.set('to_number', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'route_id', {
    enumerable: true,
    get: function() { return this.get('route_id'); },
    set: function(value) { this.set('route_id', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'service_id', {
    enumerable: true,
    get: function() { return this.get('service_id'); },
    set: function(value) { this.set('service_id', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'audio_url', {
    enumerable: true,
    get: function() { return this.get('audio_url'); },
    set: function(value) { this.set('audio_url', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'tts_lang', {
    enumerable: true,
    get: function() { return this.get('tts_lang'); },
    set: function(value) { this.set('tts_lang', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'tts_voice', {
    enumerable: true,
    get: function() { return this.get('tts_voice'); },
    set: function(value) { this.set('tts_voice', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'message_type', {
    enumerable: true,
    get: function() { return this.get('message_type'); },
    set: function(value) { throw new Error('message_type is not writable'); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'replace_variables', {
    enumerable: true,
    get: function() { return this.get('replace_variables'); },
    set: function(value) { this.set('replace_variables', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'track_clicks', {
    enumerable: true,
    get: function() { return this.get('track_clicks'); },
    set: function(value) { this.set('track_clicks', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'media', {
    enumerable: true,
    get: function() { return this.get('media'); },
    set: function(value) { throw new Error('media is not writable'); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'route_params', {
    enumerable: true,
    get: function() { return this.get('route_params'); },
    set: function(value) { this.set('route_params', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'label_ids', {
    enumerable: true,
    get: function() { return this.get('label_ids'); },
    set: function(value) { this.set('label_ids', value); }
});

Object.defineProperty(RelativeScheduledMessage.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

RelativeScheduledMessage.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/relative_scheduled/" + this.get("id");
};

module.exports = RelativeScheduledMessage;

