var util = require('./util');

var Entity = util.makeClass('Entity', null, {

    init: function(api, data, isLoaded)
    {
        this.api = api;
        this.data = data;        
        this.isLoaded = arguments.length < 3 ? true : isLoaded;
        this.dirty = {};
        this.vars = null;
        this.data = {};
        this.setData(data);
    },
    
    setData: function(data)
    {
        this.data = data;        
        this.initialVars = data.vars || {};
        this.vars = util.extend({}, this.initialVars);        
    },
    
    load: function(callback)
    {
        if (!this.isLoaded)
        {
            this.isLoaded = true;          
            var self = this;            
            this.api.doRequest('GET', this.getBaseApiPath(), null, function(err, data) {
                if (err)
                {
                    callback(err, self);
                }
                self.setData(data);
                callback(null, self);
            });            
        }
        else
        {
            callback(null,this);
        }
    },
    
    get: function(name)
    {
        if (!this.isLoaded && !(name in this.data))
        {
            throw new Error("Entity data not loaded yet. Call entity.load(callback) first.");
        }
    
        return this.data[name];
    },
    
    set: function(name, value)
    {
        if (!this.isLoaded)
        {
            throw new Error("Entity data not loaded yet. Call entity.load(callback) first.");
        }
            
        this.data[name] = value;
        this.dirty[name] = value;
    },
    
    _clearDirtyVariables: function()
    {
        this.initialVars = util.extend({}, this.vars);
    },
    
    _getDirtyVariables: function()
    {
        var dirtyVars = {};
        for (var name in this.vars)
        {
            var value = this.vars[name];
            if (value !== this.initialVars[name])
            {
                dirtyVars[name] = value;
            }
        }
        
        // handle deleted vars
        for (var name in this.initialVars)
        {
            if (this.vars[name] === undefined)
            {
                dirtyVars[name] = null;
            }
        }
        
        return dirtyVars;
    },
    
    save: function(callback)    
    {
        if (this.vars)
        {
            var dirtyVars = this._getDirtyVariables();
            if (Object.keys(dirtyVars).length > 0)
            {
                this.dirty.vars = dirtyVars;
            }
        }
            
        var self = this;
        this.api.doRequest('POST', this.getBaseApiPath(), this.dirty, function(err, res) {
            if (err)
            {
                return callback(err, null);
            }
            
            self.dirty = {};
            if (self.vars)
            {
                self._clearDirtyVariables();
            }   
            callback(null, self);
        });
    },
    
    inspect: function()
    {
        return this.toString();
    },
    
    toString: function()
    {
        var res = '[object ' + this.getClassName() + ']';
        
        if (!this.isLoaded)
        {
            res += " (not loaded)";
        }

        res += " JSON: " + JSON.stringify(this.data, null, " ");        
        
        return res;
    },
    
    getBaseApiPath: null
    
});

module.exports = Entity;