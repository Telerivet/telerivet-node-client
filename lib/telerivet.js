var URL = require('url'),
    fs = require('fs'), 
    https = require('https'),
    APICursor = require('./telerivet/apicursor'),
    http = require('http');
    
var CLIENT_VERSION = '1.0.2';

/*
    tr = new API(api_key)
    
    Initializes a client handle to the Telerivet REST API.
    
    Each API key is associated with a Telerivet user account, and all
    API actions are performed with that user's permissions. If you want to restrict the
    permissions of an API client, simply add another user account at
    <https://telerivet.com/dashboard/users> with the desired permissions.
    
    Arguments:
      - api_key (Your Telerivet API key; see <https://telerivet.com/dashboard/api>)
          * Required
 */
var API = function(apiKey, apiUrl)
{
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || 'https://api.telerivet.com/v1';    
    this.numRequests = 0;
    this.agent = null;
};

API.prototype = {

/*
    tr.getProjectById(id, callback)
    
    Retrieves the Telerivet project with the given ID.
    
    Note: This does not make any API requests if the callback is omitted.
    
    Arguments:
      - id
          * ID of the project -- see <https://telerivet.com/dashboard/api>
          * Required
      
      - callback : function(err, project)
          * Optional
      
    Returns:
        Project
 */  
    getProjectById: function(id, callback)
    {
        var Project = require('./telerivet/project');
        var res = new Project(this, {id:id}, false);        
        if (callback)
        {        
            res.load(callback);
        }
        return res;
    },
    
/*
    tr.queryProjects(options)
    
    Queries projects accessible to the current user account.
    
    Arguments:
      - options (associative array)
        
        - name
            * Filter projects by name
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
            * Number of results returned per page (max 200)
            * Default: 50
        
        - offset (int)
            * Number of items to skip from beginning of result set
            * Default: 0
      
    Returns:
        APICursor (of Project)
 */      
    queryProjects: function(options)
    {   
        var Project = require('./telerivet/project');
        return this.cursor(Project, '/projects', options);
    },
    
    cursor: function(itemCls, path, params)
    {
        return new APICursor(this, itemCls, path, params);
    },
    
    wrapCallback: function(itemCls, callback)
    {
        if (!callback)
        {
            throw new Error("Missing callback");
        }
        
        var self = this;
        return function(err, res) {
            if (err)
            {
                callback(err);
            }
            else
            {
                callback(null, new itemCls(self, res));
            }
        };
    },
    
    doRequest: function(method, path, params, callback)
    {       
        if (!callback)
        {
            throw new Error("Missing callback");
        }    
    
        var hasParams = params && Object.keys(params).length > 0;
        var hasPostData = (method == 'POST' || method == 'PUT') && hasParams;

        var url = this.apiUrl + path;
        
        if (!callback)
        {
            callback = function(e, res){ if (e) { throw e; } };
        }
        
        if (!hasPostData && hasParams)
        {
            url += '?' + encodeParams(params);
        }
        
        var parsedUrl = URL.parse(url);
         
        var httpType = parsedUrl.protocol == 'https:' ? https : http;
         
        if (!this.agent)
        {        
            this.agent = new httpType.Agent({
                hostname: parsedUrl.hostname,
                port: parsedUrl.port
            });
        }
                
        var requestOptions = {
            method: method,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.path,
            auth: this.apiKey + ':',
            headers: {
                'User-Agent': "Telerivet Node.JS Client/" +CLIENT_VERSION+ " Node.JS/" + process.version + " OS/" + process.platform
            },
            agent: this.agent
        };
                    
        if (hasPostData)
        {
            requestOptions.headers['Content-Type'] = "application/json";
        }
            
        this.numRequests += 1;

        var req = httpType.request(requestOptions, function(res) {        
            var responseJson = '';
            res.on('data', function (chunk) {
                responseJson += chunk;
            });
        
            res.on('end', function(){
                var responseData;
                try
                {
                    responseData = JSON.parse(responseJson);
                }
                catch (e)
                {
                    callback(e, null);
                    return;
                }
                
                if (responseData.error)
                {
                    var error = responseData.error;
                    var errorCode = error.code;           

                    var errorObj = new Error(error.message);
                    
                    if (errorCode == 'invalid_param')
                    {
                        errorObj.name = 'InvalidParameterError';
                        errorObj.param = error.param;                    
                    }
                    else if (errorCode == 'not_found')
                    {
                        errorObj.name = 'NotFoundError';                        
                    }
                    else
                    {
                        errorObj.name = 'APIError';                    
                    }
                    callback(errorObj, null);                    
                }
                else
                {
                    callback(null, responseData);
                }
            });        
        });
        
        req.on("error", function(e) {
            callback(e, null);
        });
        
        if (hasPostData)
        {
            req.write(JSON.stringify(params));
        }
        
        req.end();
    }
};

function encodeParamsRec(paramName, value, paramArr)
{        
    if (value === null || value === undefined)
    {
        return;
    }
    
    var type = typeof(value);
    
    if (value.splice)
    {    
        for (var i = 0; i < value.length; i++)
        {
            encodeParamsRec(paramName + '['+i+']', value[i], paramArr);
        }
    }
    else if (type === 'object')
    {
        for (var key in value)
        {
            if (value.hasOwnProperty(key))
            {
                encodeParamsRec(paramName + '[' + key + ']', value[key], paramArr);
            }
        }
    }
    else
    {
        paramArr.push(paramName + '=' + encodeURIComponent(value));
    }
}

function encodeParams(params) {
    var paramArr = [];            
    for (var name in params)
    {
        encodeParamsRec(name, params[name], paramArr);
    }
    return paramArr.join('&');
}


module.exports = {
    API: API
};