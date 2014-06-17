/**
    DataTable
    
    Represents a custom data table that can store arbitrary rows.
    
    For example, poll services use data tables to store a row for each response.
    
    
    DataTables are schemaless -- each row simply stores custom variables. Each
    variable name is equivalent to a different "column" of the data table.
    Telerivet refers to these variables/columns as "fields", and automatically
    creates a new field for each variable name used in a row of the table.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the data table
          * Read-only
      
      - name
          * Name of the data table
          * Updatable via API
      
      - num_rows (int)
          * Number of rows in the table
          * Read-only
      
      - vars (associative array)
          * Custom variables stored for this data table
          * Updatable via API
      
      - project_id
          * ID of the project this data table belongs to
          * Read-only
 */ 
 
var util = require('./util'),
    Entity = require('./entity');
 
var DataTable = util.makeClass('DataTable', Entity);

/**
    table.queryRows(options)
    
    Queries rows in this data table.
    
    Arguments:
      - options (associative array)
        
        - time_created (UNIX timestamp)
            * Filter data rows by the time they were created
            * Allowed modifiers: time_created[ne], time_created[min], time_created[max]
        
        - vars (associative array)
            * Filter data rows by value of a custom variable (e.g. vars[q1], vars[foo], etc.)
            * Allowed modifiers: vars[foo][exists], vars[foo][ne], vars[foo][prefix],
                vars[foo][not_prefix], vars[foo][gte], vars[foo][gt], vars[foo][lt], vars[foo][lte],
                vars[foo][min], vars[foo][max]
        
        - sort
            * Sort the results based on a field
            * Allowed values: default
            * Default: default
        
        - sort_dir
            * Sort the results in ascending or descending order
            * Allowed values: asc, desc
            * Default: asc
        
        - page_size (int)
            * Number of results returned per page (max 200)
            * Default: 50
        
        - offset (int)
            * Number of items to skip from beginning of result set
            * Default: 0
      
    Returns:
        APICursor (of DataRow)
    */
DataTable.prototype.queryRows = function(options)
{
    return this.api.cursor(require('./datarow'), this.getBaseApiPath() + "/rows", options);
};

/**
    table.createRow(options, callback)
    
    Adds a new row to this data table.
    
    Arguments:
      - options (associative array)
        
        - contact_id
            * ID of the contact that this row is associated with (if applicable)
        
        - from_number (string)
            * Phone number that this row is associated with (if applicable)
        
        - vars
            * Custom variables and values to set for this data row
      
      - callback : function(err, row)
          * Required
    */
DataTable.prototype.createRow = function(options, callback)
{
    this.api.doRequest("POST", this.getBaseApiPath() + "/rows", options, this.api.wrapCallback(require('./datarow'), callback));
};

/**
    table.getRowById(id, callback)
    
    Retrieves the row in the given table with the given ID.
    
    Note: This does not make any API requests if the callback is omitted.
    
    Arguments:
      - id
          * ID of the row
          * Required
      
      - callback : function(err, row)
          * Optional
      
    Returns:
        DataRow
    */
DataTable.prototype.getRowById = function(id, callback)
{
    var DataRow = require('./datarow');
    var res = new DataRow(this.api, {'project_id': this.project_id, 'table_id': this.id, 'id': id}, false);
    if (callback) { res.load(callback); }
    return res;
};

/**
    table.getFields(callback)
    
    Gets a list of all fields (columns) defined for this data table. The return value is an
    array of objects with the properties 'name' and 'variable'. (Fields are automatically
    created any time a DataRow's 'vars' property is updated.)
    
      - callback : function(err, res)
          * Required
    */
DataTable.prototype.getFields = function(callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/fields", null, callback);
};

/**
    table.countRowsByValue(variable, callback)
    
    Returns the number of rows for each value of a given variable. This can be used to get the
    total number of responses for each choice in a poll, without making a separate query for
    each response choice. The return value is an object mapping values to row counts, e.g.
    `{"yes":7,"no":3}`
    
    Arguments:
      - variable
          * Variable of field to count by.
          * Required
      
      - callback : function(err, res)
          * Required
    */
DataTable.prototype.countRowsByValue = function(variable, callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/count_rows_by_value", {'variable': variable}, callback);
};

/**
    table.save(callback)
    
    Saves any fields that have changed for this data table.
    
      - callback : function(err)
          * Required
    */
DataTable.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    table.delete(callback)
    
    Permanently deletes the given data table, including all its rows
    
      - callback : function(err)
          * Required
    */
DataTable.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(DataTable.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});    

Object.defineProperty(DataTable.prototype, 'name', {
    enumerable: true,
    get: function() { return this.get('name'); },
    set: function(value) { this.set('name', value); }
});    

Object.defineProperty(DataTable.prototype, 'num_rows', {
    enumerable: true,
    get: function() { return this.get('num_rows'); },
    set: function(value) { throw new Error('num_rows is not writable'); }
});    

Object.defineProperty(DataTable.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});    

DataTable.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/tables/" + this.get("id") + "";
};

module.exports = DataTable;

