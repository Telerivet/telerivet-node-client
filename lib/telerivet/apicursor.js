var util = require('./util');

/*
    APICursor
    
    An easy-to-use interface for interacting with API methods that return collections of objects
    that may be split into multiple pages of results.
    
    Using the APICursor, you can easily iterate over query results without
    having to manually fetch each page of results.
*/
function APICursor(api, itemCls, path, params)
{
    if (!params)
    {
        params = {};
    }

    if (params.count)
    {
        throw new Error("Cannot construct APICursor with 'count' parameter. Call the count() method instead.");
    }

    this.api = api;
    this.itemCls = itemCls;
    this.path = path;
    this.params = params;
    this._limit = null;
    this.offset = 0;
    this.data = null;
}

APICursor.prototype = {
    /*
        cursor.count(callback)

        Retrieves the count of all items matching this query, and
        passes it to the callback function.

        - callback : function(err, count)
            * Required
     */
    count: function(callback)
    {
        var params = util.extend({count:1}, this.params);
        this.api.doRequest("GET", this.path, params, function(err, res) {
            if (err)
            {
                return callback(err);
            }
            callback(null, res.count);
        });
    },

    /*
    cursor.limit(limit, callback)
    
    Limits the maximum number of entities fetched by this query.
    
    By default, iterating over the cursor will automatically fetch
    additional result pages as necessary. To prevent fetching more objects than you need, call
    this method to set the maximum number of objects retrieved from the API.
    
    Arguments:
      - limit (int)
          * The maximum number of entities to fetch from the server (may require multiple API
              calls if greater than 200)
          * Required
      
      - callback : function(err, res)
          * Required
     */
    limit: function(limit)
    {
        this._limit = limit;
        return this;
    },

    /*
        cursor.all(callback)

        Retrieves all items from the cursor, and passes an array of the items
        to the callback function.

        - callback : function(err, items)
            * Required
     */
    all: function(callback)
    {
        var self = this, items = [];

        var append = function(err, item) {
            if (err)
            {
                return callback(err);
            }
            if (item)
            {
                items.push(item);
                self.next(append);
            }
            else
            {
                callback(null, items);
            }
        };

        this.next(append);
    },

    /*
        cursor.each(callback)

        Calls a callback function for each item in the cursor, in order.

        - callback : function(err, item)
            * Required
            * Called once for each item in the cursor.
            * NOTE: When the iteration is complete, the callback function
                will be called once with item == null.
     */
    each: function(callback)
    {
        var self = this;

        var wrapper = function(err, item) {
            if (err)
            {
                return callback(err);
            }

            callback(null, item);
            if (item)
            {
                self.next(wrapper);
            }
        };

        this.next(wrapper);
    },

    /*
        cursor.next(callback)

        Retrieves the next item from the cursor and passes it to the callback function.

        - callback : function(err, item)
            * Required
     */
    next: function(callback)
    {
        if (this._limit != null && this.offset >= this._limit)
        {
            return callback(null, null);
        }

        var self = this;
        var _next = function(err)
        {
            if (err)
            {
                return callback(err);
            }

            if (self.pos < self.data.length)
            {
                var itemData = self.data[self.pos];
                self.pos++;
                self.offset++;
                var cls = self.itemCls;
                var item = cls ? (new cls(self.api, itemData, true)) : itemData;
                callback(null, item);
            }
            else
            {
                callback(null, null);
            }
        };

        if (this.data == null || this.pos >= this.data.length && this.truncated)
        {
            this.loadNextPage(_next);
        }
        else
        {
            process.nextTick(_next);
        }
    },

    loadNextPage: function(callback)
    {
        var requestParams = util.extend({}, this.params);

        if (this.nextMarker)
        {
            requestParams.marker = this.nextMarker;
        }

        if (this._limit != null && !requestParams.page_size)
        {
            requestParams.page_size = Math.min(this._limit, 200);
        }

        var self = this;
        this.api.doRequest("GET", this.path, requestParams, function(err, response) {
            if (err)
            {
                return callback(err);
            }

            self.data = response.data;
            self.truncated = response.truncated;
            self.nextMarker = response.next_marker;
            self.pos = 0;
            callback(null, self);
        });
    }
};

module.exports = APICursor;