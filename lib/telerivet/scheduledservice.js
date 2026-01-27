/**
    ScheduledService
    
    Represents a scheduled service within Telerivet.
    
    Scheduled services allow services to be triggered automatically at specified
    times.
    The ScheduledService object is only used for services that are triggered for
    a project (e.g. `scheduled_actions` or `scheduled_script`).
    
    Note: To schedule services that are triggered for a contact, the
    [ScheduledMessage](#ScheduledMessage) object should be used instead, with
    `message_type`=`service`.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the scheduled service
          * Read-only
      
      - service_id (string, max 34 characters)
          * ID of the service to be triggered
          * Read-only
      
      - rrule
          * Recurrence rule for recurring scheduled services, e.g. 'FREQ=MONTHLY' or
              'FREQ=WEEKLY;INTERVAL=2'; see
              [RFC2445](https://tools.ietf.org/html/rfc2445#section-4.3.10).
          * Updatable via API
      
      - timezone_id
          * Timezone ID used to compute times for recurring scheduled services; see [List of tz
              database time zones Wikipedia
              article](http://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
          * Updatable via API
      
      - time_created (UNIX timestamp)
          * Time the scheduled service was created in Telerivet
          * Read-only
      
      - start_time (UNIX timestamp)
          * The time that the service will be triggered (or first triggered for recurring
              scheduled services)
          * Updatable via API
      
      - end_time (UNIX timestamp)
          * Time after which a recurring scheduled service will stop (not applicable to
              non-recurring scheduled services)
          * Updatable via API
      
      - prev_time (UNIX timestamp)
          * The most recent time that Telerivet triggered this scheduled service (null if it has
              never been triggered)
          * Read-only
      
      - next_time (UNIX timestamp)
          * The next upcoming time that Telerivet will trigger this scheduled service (null if
              it will not be triggered again)
          * Read-only
      
      - occurrences (int)
          * Number of times this scheduled service has already been triggered
          * Read-only
      
      - vars (object)
          * Custom variables stored for this scheduled service. Variable names may be up to 32
              characters in length and can contain the characters a-z, A-Z, 0-9, and _.
              Values may be strings, numbers, or boolean (true/false).
              String values may be up to 4096 bytes in length when encoded as UTF-8.
              Up to 100 variables are supported per object.
              Setting a variable to null will delete the variable.
          * Updatable via API
      
      - project_id
          * ID of the project this scheduled service belongs to
          * Read-only
 */

var util = require('./util'),
    Entity = require('./entity');

var ScheduledService = util.makeClass('ScheduledService', Entity);

/**
    scheduled_service.save(callback)
    
    Saves any fields or custom variables that have changed for this scheduled service.
    
      - callback : function(err)
          * Required
    */
ScheduledService.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    scheduled_service.delete(callback)
    
    Cancels this scheduled service.
    
      - callback : function(err)
          * Required
    */
ScheduledService.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(ScheduledService.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(ScheduledService.prototype, 'service_id', {
    enumerable: true,
    get: function() { return this.get('service_id'); },
    set: function(value) { throw new Error('service_id is not writable'); }
});

Object.defineProperty(ScheduledService.prototype, 'rrule', {
    enumerable: true,
    get: function() { return this.get('rrule'); },
    set: function(value) { this.set('rrule', value); }
});

Object.defineProperty(ScheduledService.prototype, 'timezone_id', {
    enumerable: true,
    get: function() { return this.get('timezone_id'); },
    set: function(value) { this.set('timezone_id', value); }
});

Object.defineProperty(ScheduledService.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});

Object.defineProperty(ScheduledService.prototype, 'start_time', {
    enumerable: true,
    get: function() { return this.get('start_time'); },
    set: function(value) { this.set('start_time', value); }
});

Object.defineProperty(ScheduledService.prototype, 'end_time', {
    enumerable: true,
    get: function() { return this.get('end_time'); },
    set: function(value) { this.set('end_time', value); }
});

Object.defineProperty(ScheduledService.prototype, 'prev_time', {
    enumerable: true,
    get: function() { return this.get('prev_time'); },
    set: function(value) { throw new Error('prev_time is not writable'); }
});

Object.defineProperty(ScheduledService.prototype, 'next_time', {
    enumerable: true,
    get: function() { return this.get('next_time'); },
    set: function(value) { throw new Error('next_time is not writable'); }
});

Object.defineProperty(ScheduledService.prototype, 'occurrences', {
    enumerable: true,
    get: function() { return this.get('occurrences'); },
    set: function(value) { throw new Error('occurrences is not writable'); }
});

Object.defineProperty(ScheduledService.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

ScheduledService.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/scheduled_services/" + this.get("id");
};

module.exports = ScheduledService;

