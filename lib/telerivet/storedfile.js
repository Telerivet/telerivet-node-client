/**
    StoredFile
    
    Represents a file stored in a Telerivet project, such as a media attachment for outgoing
    messages.
    
    Stored files are also automatically created for media attachments for
    incoming messages.
    
    Files can be uploaded via [project.uploadFile](#Project.uploadFile), then
    attached to outgoing messages by passing the file ID as a `file_id` item in the `media`
    parameter when sending a message or broadcast.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the stored file
          * Read-only
      
      - filename (string, max 127 characters)
          * Filename of the stored file
          * Updatable via API
      
      - type
          * MIME type of the file
          * Read-only
      
      - size (int)
          * Size of the file in bytes
          * Read-only
      
      - description (string, max 1000 characters)
          * Description of the file
          * Updatable via API
      
      - category
          * Category of the stored file
          * Allowed values: outgoing_media, incoming_media, call_audio, test_recording,
              script_module, icon
          * Read-only
      
      - source
          * How the stored file was created
          * Allowed values: upload, recording, message, api
          * Read-only
      
      - message_id
          * ID of the message associated with this file, if any. Files associated with a message
              are deleted automatically when the message is deleted.
          * Read-only
      
      - sha256
          * SHA-256 hash of the file content (lowercase hex), if available
          * Read-only
      
      - time_created (UNIX timestamp)
          * Time the file was created in Telerivet
          * Read-only
      
      - user_id (string, max 34 characters)
          * ID of the Telerivet user who created the file (if applicable)
          * Read-only
      
      - url
          * URL where the file content can be downloaded. Note: this URL is temporary and may
              not be valid for more than 1 day; retrieve the stored file again to get a fresh URL.
          * Read-only
      
      - thumbnail_url
          * URL of a thumbnail image for video files, if available. Note: this URL is temporary
              and may not be valid for more than 1 day.
          * Read-only
      
      - project_id
          * ID of the project this file belongs to
          * Read-only
 */

var util = require('./util'),
    Entity = require('./entity');

var StoredFile = util.makeClass('StoredFile', Entity);

/**
    file.save(callback)
    
    Saves any fields that have changed for this stored file.
    
      - callback : function(err)
          * Required
    */
StoredFile.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    file.delete(callback)
    
    Deletes this stored file.
    
    A stored file may only be deleted by the user who created it or by a
    project administrator, and may not be deleted while it is attached to an existing message.
    
      - callback : function(err)
          * Required
    */
StoredFile.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(StoredFile.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(StoredFile.prototype, 'filename', {
    enumerable: true,
    get: function() { return this.get('filename'); },
    set: function(value) { this.set('filename', value); }
});

Object.defineProperty(StoredFile.prototype, 'type', {
    enumerable: true,
    get: function() { return this.get('type'); },
    set: function(value) { throw new Error('type is not writable'); }
});

Object.defineProperty(StoredFile.prototype, 'size', {
    enumerable: true,
    get: function() { return this.get('size'); },
    set: function(value) { throw new Error('size is not writable'); }
});

Object.defineProperty(StoredFile.prototype, 'description', {
    enumerable: true,
    get: function() { return this.get('description'); },
    set: function(value) { this.set('description', value); }
});

Object.defineProperty(StoredFile.prototype, 'category', {
    enumerable: true,
    get: function() { return this.get('category'); },
    set: function(value) { throw new Error('category is not writable'); }
});

Object.defineProperty(StoredFile.prototype, 'source', {
    enumerable: true,
    get: function() { return this.get('source'); },
    set: function(value) { throw new Error('source is not writable'); }
});

Object.defineProperty(StoredFile.prototype, 'message_id', {
    enumerable: true,
    get: function() { return this.get('message_id'); },
    set: function(value) { throw new Error('message_id is not writable'); }
});

Object.defineProperty(StoredFile.prototype, 'sha256', {
    enumerable: true,
    get: function() { return this.get('sha256'); },
    set: function(value) { throw new Error('sha256 is not writable'); }
});

Object.defineProperty(StoredFile.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});

Object.defineProperty(StoredFile.prototype, 'user_id', {
    enumerable: true,
    get: function() { return this.get('user_id'); },
    set: function(value) { throw new Error('user_id is not writable'); }
});

Object.defineProperty(StoredFile.prototype, 'url', {
    enumerable: true,
    get: function() { return this.get('url'); },
    set: function(value) { throw new Error('url is not writable'); }
});

Object.defineProperty(StoredFile.prototype, 'thumbnail_url', {
    enumerable: true,
    get: function() { return this.get('thumbnail_url'); },
    set: function(value) { throw new Error('thumbnail_url is not writable'); }
});

Object.defineProperty(StoredFile.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

StoredFile.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/files/" + this.get("id");
};

module.exports = StoredFile;

