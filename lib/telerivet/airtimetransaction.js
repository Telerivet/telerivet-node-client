/**
    AirtimeTransaction
    
    Represents a transaction where airtime is sent to a mobile phone number.
    
    To send airtime, first [create a Custom Actions service to send a particular amount of
    airtime](/dashboard/add_service?subtype_id=main.service.rules.contact&action_id=main.rule.sendairtime),
    then trigger the service using [service.invoke](#Service.invoke),
    [project.sendBroadcast](#Project.sendBroadcast), or
    [project.scheduleMessage](#Project.scheduleMessage).
    
    Fields:
    
      - id
          * ID of the airtime transaction
          * Read-only
      
      - to_number
          * Destination phone number in international format (no leading +)
          * Read-only
      
      - operator_name
          * Operator name
          * Read-only
      
      - country
          * Country code
          * Read-only
      
      - status
          * Current status of airtime transaction (`successful`, `failed`, `cancelled`,
              `queued`, `pending_approval`, or `pending_payment`)
          * Read-only
      
      - status_text
          * Error or success message returned by airtime provider, if available
          * Read-only
      
      - value
          * Value of airtime sent to destination phone number, in units of value_currency
          * Read-only
      
      - value_currency
          * Currency code of price
          * Read-only
      
      - price
          * Price charged for airtime transaction, in units of price_currency
          * Read-only
      
      - price_currency
          * Currency code of price
          * Read-only
      
      - contact_id
          * ID of the contact the airtime was sent to
          * Read-only
      
      - service_id
          * ID of the service that sent the airtime
          * Read-only
      
      - project_id
          * ID of the project that the airtime transaction belongs to
          * Read-only
      
      - vars (associative array)
          * Custom variables stored for this transaction
          * Updatable via API
 */

var util = require('./util'),
    Entity = require('./entity');

var AirtimeTransaction = util.makeClass('AirtimeTransaction', Entity);

Object.defineProperty(AirtimeTransaction.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});

Object.defineProperty(AirtimeTransaction.prototype, 'to_number', {
    enumerable: true,
    get: function() { return this.get('to_number'); },
    set: function(value) { throw new Error('to_number is not writable'); }
});

Object.defineProperty(AirtimeTransaction.prototype, 'operator_name', {
    enumerable: true,
    get: function() { return this.get('operator_name'); },
    set: function(value) { throw new Error('operator_name is not writable'); }
});

Object.defineProperty(AirtimeTransaction.prototype, 'country', {
    enumerable: true,
    get: function() { return this.get('country'); },
    set: function(value) { throw new Error('country is not writable'); }
});

Object.defineProperty(AirtimeTransaction.prototype, 'status', {
    enumerable: true,
    get: function() { return this.get('status'); },
    set: function(value) { throw new Error('status is not writable'); }
});

Object.defineProperty(AirtimeTransaction.prototype, 'status_text', {
    enumerable: true,
    get: function() { return this.get('status_text'); },
    set: function(value) { throw new Error('status_text is not writable'); }
});

Object.defineProperty(AirtimeTransaction.prototype, 'value', {
    enumerable: true,
    get: function() { return this.get('value'); },
    set: function(value) { throw new Error('value is not writable'); }
});

Object.defineProperty(AirtimeTransaction.prototype, 'value_currency', {
    enumerable: true,
    get: function() { return this.get('value_currency'); },
    set: function(value) { throw new Error('value_currency is not writable'); }
});

Object.defineProperty(AirtimeTransaction.prototype, 'price', {
    enumerable: true,
    get: function() { return this.get('price'); },
    set: function(value) { throw new Error('price is not writable'); }
});

Object.defineProperty(AirtimeTransaction.prototype, 'price_currency', {
    enumerable: true,
    get: function() { return this.get('price_currency'); },
    set: function(value) { throw new Error('price_currency is not writable'); }
});

Object.defineProperty(AirtimeTransaction.prototype, 'contact_id', {
    enumerable: true,
    get: function() { return this.get('contact_id'); },
    set: function(value) { throw new Error('contact_id is not writable'); }
});

Object.defineProperty(AirtimeTransaction.prototype, 'service_id', {
    enumerable: true,
    get: function() { return this.get('service_id'); },
    set: function(value) { throw new Error('service_id is not writable'); }
});

Object.defineProperty(AirtimeTransaction.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});

AirtimeTransaction.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/airtime_transactions/" + this.get("id");
};

module.exports = AirtimeTransaction;

