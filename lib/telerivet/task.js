/**
    Task
    
    Represents an asynchronous task that is applied to all entities matching a filter.
    
    Tasks include services applied to contacts, messages, or data rows; adding
    or removing contacts from a group; blocking or unblocking sending messages to a contact;
    updating a custom variable; deleting contacts, messages, or data rows; or
    exporting data to CSV.
    
    Fields:
    
      - id (string, max 34 characters)
          * ID of the task
          * Read-only
      
      - task_type (string)
          * The task type
          * Read-only
      
      - task_params (object)
          * Parameters applied to all matching rows (specific to `task_type`). See
              [project.createTask](#Project.createTask).
          * Read-only
      
      - filter_type
          * Type of filter defining the rows that the task is applied to
          * Read-only
      
      - filter_params (object)
          * Parameters defining the rows that the task is applied to (specific to
              `filter_type`). See [project.createTask](#Project.createTask).
          * Read-only
      
      - time_created (UNIX timestamp)
          * Time the task was created in Telerivet
          * Read-only
      
      - time_active (UNIX timestamp)
          * Time Telerivet started executing the task
          * Read-only
      
      - time_complete (UNIX timestamp)
          * Time Telerivet finished executing the task
          * Read-only
      
      - total_rows (int)
          * The total number of rows matching the filter (null if not known)
          * Read-only
      
      - current_row (int)
          * The number of rows that have been processed so far
          * Read-only
      
      - status (string)
          * The current status of the task
          * Allowed values: created, queued, active, complete, failed, cancelled
          * Read-only
      
      - vars (object)
          * Custom variables stored for this task
          * Read-only
      
      - table_id (string, max 34 characters)
          * ID of the data table this task is applied to (if applicable)
          * Read-only
      
      - user_id (string, max 34 characters)
          * ID of the Telerivet user who created the task (if applicable)
          * Read-only
      
      - project_id
          * ID of the project this task belongs to
          * Read-only
 */

var util = require('./util'),
    Entity = require('./entity');

var Task = util.makeClass('Task', Entity);

/**
    task.cancel(callback)
    
    Cancels a task that is not yet complete.
    
      - callback : function(err, task)
          * Required
    */
Task.prototype.cancel = function(callback)
{
    this.api.doRequest("POST", this.getBaseApiPath() + "/cancel", null, this.api.wrapCallback(require('./task'), callback));
};

Object.defineProperty(Task.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(Task.prototype, 'task_type', {
    enumerable: true,
    get: function() { return this.get('task_type'); },
    set: function(value) { throw new Error('task_type is not writable'); }
});

Object.defineProperty(Task.prototype, 'task_params', {
    enumerable: true,
    get: function() { return this.get('task_params'); },
    set: function(value) { throw new Error('task_params is not writable'); }
});

Object.defineProperty(Task.prototype, 'filter_type', {
    enumerable: true,
    get: function() { return this.get('filter_type'); },
    set: function(value) { throw new Error('filter_type is not writable'); }
});

Object.defineProperty(Task.prototype, 'filter_params', {
    enumerable: true,
    get: function() { return this.get('filter_params'); },
    set: function(value) { throw new Error('filter_params is not writable'); }
});

Object.defineProperty(Task.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});

Object.defineProperty(Task.prototype, 'time_active', {
    enumerable: true,
    get: function() { return this.get('time_active'); },
    set: function(value) { throw new Error('time_active is not writable'); }
});

Object.defineProperty(Task.prototype, 'time_complete', {
    enumerable: true,
    get: function() { return this.get('time_complete'); },
    set: function(value) { throw new Error('time_complete is not writable'); }
});

Object.defineProperty(Task.prototype, 'total_rows', {
    enumerable: true,
    get: function() { return this.get('total_rows'); },
    set: function(value) { throw new Error('total_rows is not writable'); }
});

Object.defineProperty(Task.prototype, 'current_row', {
    enumerable: true,
    get: function() { return this.get('current_row'); },
    set: function(value) { throw new Error('current_row is not writable'); }
});

Object.defineProperty(Task.prototype, 'status', {
    enumerable: true,
    get: function() { return this.get('status'); },
    set: function(value) { throw new Error('status is not writable'); }
});

Object.defineProperty(Task.prototype, 'table_id', {
    enumerable: true,
    get: function() { return this.get('table_id'); },
    set: function(value) { throw new Error('table_id is not writable'); }
});

Object.defineProperty(Task.prototype, 'user_id', {
    enumerable: true,
    get: function() { return this.get('user_id'); },
    set: function(value) { throw new Error('user_id is not writable'); }
});

Object.defineProperty(Task.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

Task.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/tasks/" + this.get("id");
};

module.exports = Task;

