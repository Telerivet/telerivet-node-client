var URL = require('url'),
    fs = require('fs'),
    https = require('https'),
    zlib = require('zlib'),
    APICursor = require('./telerivet/apicursor'),
    http = require('http');

var CLIENT_VERSION = '1.7.0';

/*
    var tr = new telerivet.API(api_key)
    
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

        var isSSL = parsedUrl.protocol == 'https:';

        var httpType = isSSL ? https : http;

        var port = parsedUrl.port || (isSSL ? 443 : 80);

        if (!this.agent)
        {
            this.agent = new httpType.Agent({
                hostname: parsedUrl.hostname,
                maxSockets: 5,
                port: port
            });
        }

        var requestOptions = {
            method: method,
            hostname: parsedUrl.hostname,
            port: port,
            path: parsedUrl.path,
            auth: this.apiKey + ':',
            headers: {
                'User-Agent': "Telerivet Node.JS Client/" +CLIENT_VERSION+ " Node.JS/" + process.version + " OS/" + process.platform,
                "Accept-Encoding": "gzip",
            },
            agent: this.agent
        };

        var requestBody = null;

        if (hasPostData)
        {
            requestOptions.headers['Content-Type'] = "application/json";

            requestBody = JSON.stringify(params);

            if (requestBody.length >= 400)
            {
                requestOptions.headers['Content-Encoding'] = "gzip";
                requestBody = zlib.gzipSync(requestBody);
            }
        }

        this.numRequests += 1;

        var req = httpType.request(requestOptions, function(res) {
            var chunks = [];
            res.on('data', function (chunk) {
                chunks.push(chunk);
            });

            res.on('end', function() {
                var responseBody = Buffer.concat(chunks);
                var encoding = res.headers['content-encoding'];
                if (encoding == 'gzip')
                {
                    zlib.gunzip(responseBody, function(err, decoded) {
                        if (err)
                        {
                            callback(err, null);
                        }
                        else
                        {
                            processResponseJson(decoded.toString());
                        }
                    });
                }
                else
                {
                    processResponseJson(responseBody.toString());
                }
            });
        });

        req.on("error", function(e) {
            callback(e, null);
        });

        var processResponseJson = function(responseJson) {
            var responseData;
            try
            {
                responseData = JSON.parse(responseJson);
            }
            catch (e)
            {
                callback(new Error("Unexpected response from Telerivet API (HTTP " + res.statusCode + "): " + responseJson), null);
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
        };

        if (hasPostData)
        {
            req.write(requestBody);
        }

        req.end();
    }
};

/**
    tr.getProjectById(id, callback)
    
    Retrieves the Telerivet project with the given ID.
    
    Arguments:
      - id
          * ID of the project -- see <https://telerivet.com/dashboard/api>
          * Required
      
      - callback : function(err, project)
          * Required
    */
API.prototype.getProjectById = function(id, callback)
{
    this.doRequest("GET", this.getBaseApiPath() + "/projects/" + id, null, this.wrapCallback(require('./telerivet/project'), callback));
};

/**
    tr.initProjectById(id)
    
    Initializes the Telerivet project with the given ID without making an API request.
    
    Arguments:
      - id
          * ID of the project -- see <https://telerivet.com/dashboard/api>
          * Required
      
    Returns:
        Project
    */
API.prototype.initProjectById = function(id)
{
    var Project = require('./telerivet/project');
    return new Project(this, {'id': id}, false);
};

/**
    tr.queryProjects(options)
    
    Queries projects accessible to the current user account.
    
    Arguments:
      - options (object)
        
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
            * Number of results returned per page (max 500)
            * Default: 50
        
        - offset (int)
            * Number of items to skip from beginning of result set
            * Default: 0
      
    Returns:
        APICursor (of Project)
    */
API.prototype.queryProjects = function(options)
{
    return this.cursor(require('./telerivet/project'), this.getBaseApiPath() + "/projects", options);
};

/**
    tr.getOrganizationById(id, callback)
    
    Retrieves the Telerivet organization with the given ID.
    
    Arguments:
      - id
          * ID of the organization -- see <https://telerivet.com/dashboard/api>
          * Required
      
      - callback : function(err, organization)
          * Required
    */
API.prototype.getOrganizationById = function(id, callback)
{
    this.doRequest("GET", this.getBaseApiPath() + "/organizations/" + id, null, this.wrapCallback(require('./telerivet/organization'), callback));
};

/**
    tr.initOrganizationById(id)
    
    Initializes the Telerivet organization with the given ID without making an API request.
    
    Arguments:
      - id
          * ID of the organization -- see <https://telerivet.com/dashboard/api>
          * Required
      
    Returns:
        Organization
    */
API.prototype.initOrganizationById = function(id)
{
    var Organization = require('./telerivet/organization');
    return new Organization(this, {'id': id}, false);
};

/**
    tr.queryOrganizations(options)
    
    Queries organizations accessible to the current user account.
    
    Arguments:
      - options (object)
        
        - name
            * Filter organizations by name
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
        APICursor (of Organization)
    */
API.prototype.queryOrganizations = function(options)
{
    return this.cursor(require('./telerivet/organization'), this.getBaseApiPath() + "/organizations", options);
};

API.prototype.getBaseApiPath = function()
{
    return "";
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