/**
    MessageTemplate
    
    Represents a reusable message template that can be used when composing or scheduling
    messages.
    
    Message templates can include placeholder variables using double square
    brackets (e.g. `[[contact.name]]`) that are replaced with actual values when the message is
    sent. For available variables, see [Variable Reference](#variables). The double square
    brackets may also include [filters](/api/rules_engine#filters) to transform variables, such
    as to set a default value.
    
    Templates synchronized from a WhatsApp Business Account are read-only and
    cannot be modified or deleted via the API.
    (When using Telerivet to send messages via a WhatsApp route, Telerivet tries
    to match the content of each outgoing message to one of these WhatsApp message templates. If
    a template matches, Telerivet sends a WhatsApp template message instead of a session
    message.)
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the message template
          * Read-only
      
      - name (string)
          * Name of the template (max 127 characters)
          * Updatable via API
      
      - content (string)
          * Content of the message template (max 2000 characters)
          * Updatable via API
      
      - track_clicks (bool)
          * If true, URLs in the content will be replaced with short links that track clicks
              when the template is used
          * Updatable via API
      
      - readonly (bool)
          * True if the template cannot be modified or deleted (i.e., it was synchronized from a
              WhatsApp Business Account)
          * Read-only
      
      - short_link_params (object)
          * Custom parameters for short links (only if track_clicks is true)
          * Updatable via API
      
      - attachments (array)
          * List of attachment objects with file URLs
          * Updatable via API
      
      - route_params (object)
          * Route-specific parameters to use when sending messages with this template.
              
              When sending messages via chat apps such as WhatsApp, the route_params
              parameter can be used to send messages with app-specific features such as quick
              replies and link buttons.
              
              For more details, see [Route-Specific Parameters](#route_params).
          * Updatable via API
      
      - waba_id (string)
          * ID of the WhatsApp Business Account that this template is associated with (only
              present for WhatsApp templates)
          * Read-only
      
      - whatsapp_template (object)
          * For templates synchronized from a WhatsApp Business Account, contains the full
              template data from WhatsApp with properties including `id`, `name`, `language`,
              `status`, `category`, and `components`. The full format is defined in the [WhatsApp
              Template API
              documentation](https://developers.facebook.com/documentation/business-messaging/whatsapp/reference/whatsapp-business-account/template-api#get-version-template-id).
              Only present for WhatsApp templates.
          * Read-only
      
      - time_created (UNIX timestamp)
          * Time the template was created in Telerivet
          * Read-only
      
      - time_updated (UNIX timestamp)
          * Time the template was last updated
          * Read-only
      
      - vars (object)
          * Custom variables stored for this template. Variable names may be up to 32 characters
              in length and can contain the characters a-z, A-Z, 0-9, and _.
              Values may be strings, numbers, or boolean (true/false).
              String values may be up to 4096 bytes in length when encoded as UTF-8.
              Up to 100 variables are supported per object.
              Setting a variable to null will delete the variable.
          * Updatable via API
      
      - project_id
          * ID of the project this template belongs to
          * Read-only
 */

var util = require('./util'),
    Entity = require('./entity');

var MessageTemplate = util.makeClass('MessageTemplate', Entity);

/**
    template.save(callback)
    
    Saves any fields that have changed for the message template.
    
      - callback : function(err)
          * Required
    */
MessageTemplate.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    template.delete(callback)
    
    Deletes the message template.
    
    Note: Templates synchronized from a WhatsApp Business Account cannot be deleted via the API.
    
      - callback : function(err)
          * Required
    */
MessageTemplate.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(MessageTemplate.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(MessageTemplate.prototype, 'name', {
    enumerable: true,
    get: function() { return this.get('name'); },
    set: function(value) { this.set('name', value); }
});

Object.defineProperty(MessageTemplate.prototype, 'content', {
    enumerable: true,
    get: function() { return this.get('content'); },
    set: function(value) { this.set('content', value); }
});

Object.defineProperty(MessageTemplate.prototype, 'track_clicks', {
    enumerable: true,
    get: function() { return this.get('track_clicks'); },
    set: function(value) { this.set('track_clicks', value); }
});

Object.defineProperty(MessageTemplate.prototype, 'readonly', {
    enumerable: true,
    get: function() { return this.get('readonly'); },
    set: function(value) { throw new Error('readonly is not writable'); }
});

Object.defineProperty(MessageTemplate.prototype, 'short_link_params', {
    enumerable: true,
    get: function() { return this.get('short_link_params'); },
    set: function(value) { this.set('short_link_params', value); }
});

Object.defineProperty(MessageTemplate.prototype, 'attachments', {
    enumerable: true,
    get: function() { return this.get('attachments'); },
    set: function(value) { this.set('attachments', value); }
});

Object.defineProperty(MessageTemplate.prototype, 'route_params', {
    enumerable: true,
    get: function() { return this.get('route_params'); },
    set: function(value) { this.set('route_params', value); }
});

Object.defineProperty(MessageTemplate.prototype, 'waba_id', {
    enumerable: true,
    get: function() { return this.get('waba_id'); },
    set: function(value) { throw new Error('waba_id is not writable'); }
});

Object.defineProperty(MessageTemplate.prototype, 'whatsapp_template', {
    enumerable: true,
    get: function() { return this.get('whatsapp_template'); },
    set: function(value) { throw new Error('whatsapp_template is not writable'); }
});

Object.defineProperty(MessageTemplate.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});

Object.defineProperty(MessageTemplate.prototype, 'time_updated', {
    enumerable: true,
    get: function() { return this.get('time_updated'); },
    set: function(value) { throw new Error('time_updated is not writable'); }
});

Object.defineProperty(MessageTemplate.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

MessageTemplate.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/message_templates/" + this.get("id");
};

module.exports = MessageTemplate;

