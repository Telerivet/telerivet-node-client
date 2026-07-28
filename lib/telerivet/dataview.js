/**
    DataView
    
    Represents a view of a data table, defined by a saved filter on the table's rows.
    
    The view's filter conditions cannot be changed after the view is created
    (although the view can be renamed or deleted).
    
    Telerivet will automatically store the count of rows matching each data view
    once a day, making it possible to retrieve historical statistics for the number of rows
    matching the filter.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the data view
          * Read-only
      
      - name
          * Name of the data view
          * Updatable via API
      
      - num_rows (int)
          * Number of rows matching the view filter. For performance reasons, this number may
              sometimes be out-of-date.
          * Read-only
      
      - filters (object)
          * Key-value pairs of conditions that rows must match to be included in the view, in
              the same format as the `filters` parameter of
              [table.createView](#DataTable.createView)
          * Read-only
      
      - table_id
          * ID of the table this view belongs to
          * Read-only
      
      - project_id
          * ID of the project this view belongs to
          * Read-only
      
      - url
          * URL to this view in the Telerivet web app
          * Read-only
 */

var util = require('./util'),
    Entity = require('./entity');

var DataView = util.makeClass('DataView', Entity);

/**
    view.queryRows(options)
    
    Queries rows matching this view's filter conditions.
    
    Arguments:
      - options (object)
        
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
DataView.prototype.queryRows = function(options)
{
    return this.api.cursor(require('./datarow'), this.getBaseApiPath() + "/rows", options);
};

/**
    view.save(callback)
    
    Saves any fields that have changed for this view.
    
      - callback : function(err)
          * Required
    */
DataView.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    view.delete(callback)
    
    Permanently deletes the given view of a data table (does not delete any rows in the table)
    
      - callback : function(err)
          * Required
    */
DataView.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(DataView.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(DataView.prototype, 'name', {
    enumerable: true,
    get: function() { return this.get('name'); },
    set: function(value) { this.set('name', value); }
});

Object.defineProperty(DataView.prototype, 'num_rows', {
    enumerable: true,
    get: function() { return this.get('num_rows'); },
    set: function(value) { throw new Error('num_rows is not writable'); }
});

Object.defineProperty(DataView.prototype, 'filters', {
    enumerable: true,
    get: function() { return this.get('filters'); },
    set: function(value) { throw new Error('filters is not writable'); }
});

Object.defineProperty(DataView.prototype, 'table_id', {
    enumerable: true,
    get: function() { return this.get('table_id'); },
    set: function(value) { throw new Error('table_id is not writable'); }
});

Object.defineProperty(DataView.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

Object.defineProperty(DataView.prototype, 'url', {
    enumerable: true,
    get: function() { return this.get('url'); },
    set: function(value) { throw new Error('url is not writable'); }
});

DataView.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/tables/" + this.get("table_id") + "/views/" + this.get("id");
};

module.exports = DataView;

