/**
    Phone
    
    Represents a basic route (i.e. a phone or gateway) that you use to send/receive messages via
    Telerivet.
    
    Basic Routes were formerly referred to as "Phones" within Telerivet. API
    methods, parameters, and properties related to Basic Routes continue to use the term "Phone"
    to maintain backwards compatibility.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the phone
          * Read-only
      
      - name
          * Name of the phone
          * Updatable via API
      
      - phone_number (string)
          * Phone number or sender ID
          * Updatable via API
      
      - phone_type
          * Type of this phone/route (e.g. android, twilio, nexmo, etc)
          * Read-only
      
      - country
          * 2-letter country code (ISO 3166-1 alpha-2) where phone is from
          * Read-only
      
      - send_paused (bool)
          * True if sending messages is currently paused, false if the phone can currently send
              messages
          * Updatable via API
      
      - time_created (UNIX timestamp)
          * Time the phone was created in Telerivet
          * Read-only
      
      - last_active_time (UNIX timestamp)
          * Approximate time this phone last connected to Telerivet
          * Read-only
      
      - vars (object)
          * Custom variables stored for this phone
          * Updatable via API
      
      - project_id
          * ID of the project this phone belongs to
          * Read-only
      
      - battery (int)
          * Current battery level, on a scale from 0 to 100, as of the last time the phone
              connected to Telerivet (only present for Android phones)
          * Read-only
      
      - charging (bool)
          * True if the phone is currently charging, false if it is running on battery, as of
              the last time it connected to Telerivet (only present for Android phones)
          * Read-only
      
      - internet_type
          * String describing the current type of internet connectivity for an Android phone,
              for example WIFI or MOBILE (only present for Android phones)
          * Read-only
      
      - app_version
          * Currently installed version of Telerivet Android app (only present for Android
              phones)
          * Read-only
      
      - android_sdk (int)
          * Android SDK level, indicating the approximate version of the Android OS installed on
              this phone; see [list of Android SDK
              levels](http://developer.android.com/guide/topics/manifest/uses-sdk-element.html#ApiLevels)
              (only present for Android phones)
          * Read-only
      
      - mccmnc
          * Code indicating the Android phone's current country (MCC) and mobile network
              operator (MNC); see [Mobile country code Wikipedia
              article](https://en.wikipedia.org/wiki/Mobile_country_code) (only present for Android
              phones). Note this is a string containing numeric digits, not an integer.
          * Read-only
      
      - manufacturer
          * Android phone manufacturer (only present for Android phones)
          * Read-only
      
      - model
          * Android phone model (only present for Android phones)
          * Read-only
      
      - send_limit (int)
          * Maximum number of SMS messages per hour that can be sent by this Android phone. To
              increase this limit, install additional SMS expansion packs in the Telerivet Gateway
              app. (only present for Android phones)
          * Read-only
 */

var util = require('./util'),
    Entity = require('./entity');

var Phone = util.makeClass('Phone', Entity);

/**
    phone.queryMessages(options)
    
    Queries messages sent or received by this basic route.
    
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
Phone.prototype.queryMessages = function(options)
{
    return this.api.cursor(require('./message'), this.getBaseApiPath() + "/messages", options);
};

/**
    phone.save(callback)
    
    Saves any fields or custom variables that have changed for this basic route.
    
      - callback : function(err)
          * Required
    */
Phone.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

Object.defineProperty(Phone.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(Phone.prototype, 'name', {
    enumerable: true,
    get: function() { return this.get('name'); },
    set: function(value) { this.set('name', value); }
});

Object.defineProperty(Phone.prototype, 'phone_number', {
    enumerable: true,
    get: function() { return this.get('phone_number'); },
    set: function(value) { this.set('phone_number', value); }
});

Object.defineProperty(Phone.prototype, 'phone_type', {
    enumerable: true,
    get: function() { return this.get('phone_type'); },
    set: function(value) { throw new Error('phone_type is not writable'); }
});

Object.defineProperty(Phone.prototype, 'country', {
    enumerable: true,
    get: function() { return this.get('country'); },
    set: function(value) { throw new Error('country is not writable'); }
});

Object.defineProperty(Phone.prototype, 'send_paused', {
    enumerable: true,
    get: function() { return this.get('send_paused'); },
    set: function(value) { this.set('send_paused', value); }
});

Object.defineProperty(Phone.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});

Object.defineProperty(Phone.prototype, 'last_active_time', {
    enumerable: true,
    get: function() { return this.get('last_active_time'); },
    set: function(value) { throw new Error('last_active_time is not writable'); }
});

Object.defineProperty(Phone.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

Object.defineProperty(Phone.prototype, 'battery', {
    enumerable: true,
    get: function() { return this.get('battery'); },
    set: function(value) { throw new Error('battery is not writable'); }
});

Object.defineProperty(Phone.prototype, 'charging', {
    enumerable: true,
    get: function() { return this.get('charging'); },
    set: function(value) { throw new Error('charging is not writable'); }
});

Object.defineProperty(Phone.prototype, 'internet_type', {
    enumerable: true,
    get: function() { return this.get('internet_type'); },
    set: function(value) { throw new Error('internet_type is not writable'); }
});

Object.defineProperty(Phone.prototype, 'app_version', {
    enumerable: true,
    get: function() { return this.get('app_version'); },
    set: function(value) { throw new Error('app_version is not writable'); }
});

Object.defineProperty(Phone.prototype, 'android_sdk', {
    enumerable: true,
    get: function() { return this.get('android_sdk'); },
    set: function(value) { throw new Error('android_sdk is not writable'); }
});

Object.defineProperty(Phone.prototype, 'mccmnc', {
    enumerable: true,
    get: function() { return this.get('mccmnc'); },
    set: function(value) { throw new Error('mccmnc is not writable'); }
});

Object.defineProperty(Phone.prototype, 'manufacturer', {
    enumerable: true,
    get: function() { return this.get('manufacturer'); },
    set: function(value) { throw new Error('manufacturer is not writable'); }
});

Object.defineProperty(Phone.prototype, 'model', {
    enumerable: true,
    get: function() { return this.get('model'); },
    set: function(value) { throw new Error('model is not writable'); }
});

Object.defineProperty(Phone.prototype, 'send_limit', {
    enumerable: true,
    get: function() { return this.get('send_limit'); },
    set: function(value) { throw new Error('send_limit is not writable'); }
});

Phone.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/phones/" + this.get("id");
};

module.exports = Phone;

