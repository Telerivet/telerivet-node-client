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
          * Number of rows in the table. For performance reasons, this number may sometimes be
              out-of-date.
          * Read-only
      
      - show_add_row (bool)
          * Whether to allow adding or importing rows via the web app
          * Updatable via API
      
      - show_stats (bool)
          * Whether to show summary charts (pie charts, bar charts, tables of top values) for
              this data table in the web app
          * Updatable via API
      
      - show_contact_columns (bool)
          * Whether to show 'Contact Name' and 'Phone Number' columns in the web app
          * Updatable via API
      
      - vars (object)
          * Custom variables stored for this data table. Variable names may be up to 32
              characters in length and can contain the characters a-z, A-Z, 0-9, and _.
              Values may be strings, numbers, or boolean (true/false).
              String values may be up to 4096 bytes in length when encoded as UTF-8.
              Up to 100 variables are supported per object.
              Setting a variable to null will delete the variable.
          * Updatable via API
      
      - project_id
          * ID of the project this data table belongs to
          * Read-only
      
      - url
          * URL to this data table in the Telerivet web app
          * Read-only
 */

var util = require('./util'),
    Entity = require('./entity');

var DataTable = util.makeClass('DataTable', Entity);

/**
    table.queryRows(options)
    
    Queries rows in this data table.
    
    Arguments:
      - options (object)
        
        - time_created (UNIX timestamp)
            * Filter data rows by the time they were created
            * Allowed modifiers: time_created[min], time_created[max]
        
        - contact_id
            * Filter data rows associated with a particular contact
        
        - vars (object)
            * Filter data rows by value of a custom variable (e.g. vars[q1], vars[foo], etc.)
            * Allowed modifiers: vars[foo][ne], vars[foo][prefix], vars[foo][not_prefix],
                vars[foo][gte], vars[foo][gt], vars[foo][lt], vars[foo][lte], vars[foo][min],
                vars[foo][max], vars[foo][exists]
        
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
      - options (object)
        
        - contact_id
            * ID of the contact that this row is associated with (if applicable)
        
        - from_number (string)
            * Phone number that this row is associated with (if applicable)
        
        - vars
            * Custom variables and values to set for this data row. Variable names may be up to
                32 characters in length and can contain the characters a-z, A-Z, 0-9, and _.
                Values may be strings, numbers, or boolean (true/false).
                String values may be up to 4096 bytes in length when encoded as UTF-8.
                Up to 100 variables are supported per object.
                Setting a variable to null will delete the variable.
      
      - callback : function(err, row)
          * Required
    */
DataTable.prototype.createRow = function(options, callback)
{
    this.api.doRequest("POST", this.getBaseApiPath() + "/rows", options, this.api.wrapCallback(require('./datarow'), callback));
};

/**
    table.importRows(options, callback)
    
    Creates and/or updates up to 200 rows in a single API call. When creating or updating a
    large number of rows, this method is significantly faster than sending a separate API
    request for each row.
    
    By default, a new row will be created for each item. To update
    existing rows, set the `lookup_key` parameter to match rows by ID, contact, or the value of
    a custom variable.
    
    Arguments:
      - options (object)
          * Required
        
        - rows (array)
            * Array of up to 200 objects which may contain the properties `vars` (object),
                `contact_id` (string), `from_number` (string), and `id` (string). All properties are
                optional, unless used as a lookup key.
            * Required
        
        - lookup_key
            * The field used to search for a matching row, or 'none' to always create a new row.
                To search by a custom variable, precede the variable name with 'vars.'.
            * Allowed values: none, id, contact_id, vars.variable_name
            * Default: none
      
      - callback : function(err, res)
          * Required
    */
DataTable.prototype.importRows = function(options, callback)
{
    this.api.doRequest("POST", this.getBaseApiPath() + "/import_rows", options, callback);
};

/**
    table.getRowById(row_id, callback)
    
    Retrieves the row in the given table with the given ID.
    
    Arguments:
      - row_id
          * ID of the row
          * Required
      
      - callback : function(err, row)
          * Required
    */
DataTable.prototype.getRowById = function(row_id, callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/rows/" + row_id, null, this.api.wrapCallback(require('./datarow'), callback));
};

/**
    table.initRowById(row_id)
    
    Initializes the row in the given table with the given ID, without making an API request.
    
    Arguments:
      - row_id
          * ID of the row
          * Required
      
    Returns:
        DataRow
    */
DataTable.prototype.initRowById = function(row_id)
{
    var DataRow = require('./datarow');
    return new DataRow(this.api, {'project_id': this.project_id, 'table_id': this.id, 'row_id': row_id}, false);
};

/**
    table.queryViews(options)
    
    Queries views of this data table.
    
    Arguments:
      - options (object)
        
        - name
            * Filter views by name
            * Allowed modifiers: name[ne], name[prefix], name[not_prefix], name[gte], name[gt],
                name[lt], name[lte]
        
        - sort
            * Sort the results based on a field
            * Allowed values: default, name
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
        APICursor (of DataView)
    */
DataTable.prototype.queryViews = function(options)
{
    return this.api.cursor(require('./dataview'), this.getBaseApiPath() + "/views", options);
};

/**
    table.createView(options, callback)
    
    Creates a new view of this data table, defined by a filter on its rows. The view's filter
    conditions cannot be changed after the view is created (although the view can be renamed or
    deleted).
    
    Telerivet will automatically store the count of rows matching each
    data view once a day, making it possible to retrieve historical statistics for the number of
    rows matching the filter, but only for dates after the view is created.
    
    Arguments:
      - options (object)
          * Required
        
        - name (string, max 64 characters)
            * Name of the view (must be unique within the data table)
            * Required
        
        - filters (object)
            * Key-value pairs of conditions that rows must match to be included in the view. To
                filter by a custom variable, precede the variable name with 'vars.' (conditions on
                custom variables may also be provided as a nested object under a `vars` key, e.g.
                `{"vars": {"q1": "yes"}}`); other supported keys are `id`, `time_created`,
                `time_updated`, `contact_id`, `contact_name`, and `from_number`. Each value is
                either a value to match exactly, or an object with an operator such as `ne`,
                `prefix`, `gte`, `gt`, `lte`, `lt`, `exists`, or `not_exists` as the key (e.g.
                `{"gte": 10}`).
            * Required
      
      - callback : function(err, view)
          * Required
    */
DataTable.prototype.createView = function(options, callback)
{
    this.api.doRequest("POST", this.getBaseApiPath() + "/views", options, this.api.wrapCallback(require('./dataview'), callback));
};

/**
    table.getViewById(view_id, callback)
    
    Retrieves the view of the given table with the given ID.
    
    Arguments:
      - view_id
          * ID of the view
          * Required
      
      - callback : function(err, view)
          * Required
    */
DataTable.prototype.getViewById = function(view_id, callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/views/" + view_id, null, this.api.wrapCallback(require('./dataview'), callback));
};

/**
    table.initViewById(view_id)
    
    Initializes the view of the given table with the given ID, without making an API request.
    
    Arguments:
      - view_id
          * ID of the view
          * Required
      
    Returns:
        DataView
    */
DataTable.prototype.initViewById = function(view_id)
{
    var DataView = require('./dataview');
    return new DataView(this.api, {'project_id': this.project_id, 'table_id': this.id, 'view_id': view_id}, false);
};

/**
    table.getFields(callback)
    
    Gets a list of all fields (columns) defined for this data table. The return value is an
    array of objects with the properties 'name', 'variable', 'type', 'order', 'readonly', and
    'lookup_key'. (Fields are automatically created any time a DataRow's 'vars' property is
    updated.)
    
      - callback : function(err, res)
          * Required
    */
DataTable.prototype.getFields = function(callback)
{
    this.api.doRequest("GET", this.getBaseApiPath() + "/fields", null, callback);
};

/**
    table.setFieldMetadata(variable, options, callback)
    
    Allows customizing how a field (column) is displayed in the Telerivet web app.
    
    The variable path parameter can contain the characters a-z, A-Z,
    0-9, and _, and may be up to 32 characters in length.
    
    Arguments:
      - variable
          * The variable name of the field to create or update.
          * Required
      
      - options (object)
          * Required
        
        - name (string, max 64 characters)
            * Display name for the field
        
        - type (string)
            * Field type
            * Allowed values: text, long_text, secret, phone_number, email, url, audio, date,
                date_time, number, boolean, checkbox, select, radio, route
        
        - order (int)
            * Order in which to display the field
        
        - items (array)
            * Array of up to 100 objects containing `value` and `label` string properties to
                show when type is `select` or `radio`. Each `value` and `label` must be between 1
                and 256 characters in length.
            * Required if type is `select` or `radio`
        
        - readonly (bool)
            * Set to true to prevent editing the field in the Telerivet web app
        
        - lookup_key (bool)
            * Set to true to allow using this field as a lookup key when importing rows via the
                Telerivet web app
      
      - callback : function(err, res)
          * Required
    */
DataTable.prototype.setFieldMetadata = function(variable, options, callback)
{
    this.api.doRequest("POST", this.getBaseApiPath() + "/fields/" + variable, options, callback);
};

/**
    table.updateFields(options, callback)
    
    Updates metadata for one or more fields (columns) in the data table. Only the specified
    fields are updated; other fields are not affected.
    
    To delete a field, include an object with the `variable` and
    `delete` properties set (e.g. `{"variable": "my_field", "delete": true}`). Deleting a field
    will also clear the corresponding variable on all rows in the table.
    
    Arguments:
      - options (object)
          * Required
        
        - metadata (array)
            * Array of up to 100 objects describing the fields to create, update, or delete.
                Each object must contain a `variable` property. Only the properties provided for
                each field will be updated.
            * Required
      
      - callback : function(err, res)
          * Required
    */
DataTable.prototype.updateFields = function(options, callback)
{
    this.api.doRequest("POST", this.getBaseApiPath() + "/fields", options, callback);
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

Object.defineProperty(DataTable.prototype, 'show_add_row', {
    enumerable: true,
    get: function() { return this.get('show_add_row'); },
    set: function(value) { this.set('show_add_row', value); }
});

Object.defineProperty(DataTable.prototype, 'show_stats', {
    enumerable: true,
    get: function() { return this.get('show_stats'); },
    set: function(value) { this.set('show_stats', value); }
});

Object.defineProperty(DataTable.prototype, 'show_contact_columns', {
    enumerable: true,
    get: function() { return this.get('show_contact_columns'); },
    set: function(value) { this.set('show_contact_columns', value); }
});

Object.defineProperty(DataTable.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

Object.defineProperty(DataTable.prototype, 'url', {
    enumerable: true,
    get: function() { return this.get('url'); },
    set: function(value) { throw new Error('url is not writable'); }
});

DataTable.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/tables/" + this.get("id");
};

module.exports = DataTable;

