function Class() {}

/* 
 * Allows calling a base class implementation of a function without knowing
 * which base class the function is implemented in.         
 */
Class.prototype.base = function(cls, fnName) 
{
    var self = this,
        proto = cls.prototype._base.prototype; // start in prototype of base class of 'cls'
    
    // go up the prototype chain until this function is defined
    while (!proto[fnName])
    {
        proto = proto._base.prototype;
    }

    return function() { return proto[fnName].apply(self, arguments); };                       
};

function extend(to, from)
{
    for (var name in from)
    {
        to[name] = from[name];
    }
    return to;
}

function makeClass(name, base, protoProps, classProps)
{
    base = base || Class;
    
    var cls = function() { this.init.apply(this, arguments); },
        proto = function() 
        { 
            this._base = base; 
            this.getClassName = function() { return name; };
        };    
        
    proto.prototype = base.prototype;
    cls.prototype = new proto();
    
    if (protoProps)
    {
        extend(cls.prototype, protoProps);
    }
    if (classProps)
    {
        extend(cls, classProps);
    }
    
    return cls;
};

function timestampToDate(timestamp)
{
    return timestamp ? (new Date(timestamp * 1000)) : null;
}

function dateToTimestamp(date)
{
    return timestamp ? (new Date(timestamp * 1000)) : null;
}

exports.timestampToDate = timestampToDate;
exports.dateToTimestamp = dateToTimestamp;
exports.makeClass = makeClass;
exports.extend = extend;