/**
    DataRow
    
    Represents a row in a custom data table.
    
    For example, each response to a poll is stored as one row in a data table.
    If a poll has a question with ID 'q1', the verbatim response to that question would be
    stored in row.vars.q1, and the response code would be stored in row.vars.q1_code.
    
    Each custom variable name within a data row corresponds to a different
    column/field of the data table.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the data row
          * Read-only
      
      - contact_id
          * ID of the contact this row is associated with (or null if not associated with any
              contact)
          * Updatable via API
      
      - from_number (string)
          * Phone number that this row is associated with (or null if not associated with any
              phone number)
          * Updatable via API
      
      - vars (object)
          * Custom variables stored for this data row
          * Updatable via API
      
      - time_created (UNIX timestamp)
          * The time this row was created in Telerivet
          * Read-only
      
      - time_updated (UNIX timestamp)
          * The time this row was last updated in Telerivet
          * Read-only
      
      - table_id
          * ID of the table this data row belongs to
          * Read-only
      
      - project_id
          * ID of the project this data row belongs to
          * Read-only
 */

var util = require('./util'),
    Entity = require('./entity');

var DataRow = util.makeClass('DataRow', Entity);

/**
    row.save(callback)
    
    Saves any fields or custom variables that have changed for this data row.
    
      - callback : function(err)
          * Required
    */
DataRow.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    row.delete(callback)
    
    Deletes this data row.
    
      - callback : function(err)
          * Required
    */
DataRow.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(DataRow.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(DataRow.prototype, 'contact_id', {
    enumerable: true,
    get: function() { return this.get('contact_id'); },
    set: function(value) { this.set('contact_id', value); }
});

Object.defineProperty(DataRow.prototype, 'from_number', {
    enumerable: true,
    get: function() { return this.get('from_number'); },
    set: function(value) { this.set('from_number', value); }
});

Object.defineProperty(DataRow.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});

Object.defineProperty(DataRow.prototype, 'time_updated', {
    enumerable: true,
    get: function() { return this.get('time_updated'); },
    set: function(value) { throw new Error('time_updated is not writable'); }
});

Object.defineProperty(DataRow.prototype, 'table_id', {
    enumerable: true,
    get: function() { return this.get('table_id'); },
    set: function(value) { throw new Error('table_id is not writable'); }
});

Object.defineProperty(DataRow.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

DataRow.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/tables/" + this.get("table_id") + "/rows/" + this.get("id");
};

module.exports = DataRow;

