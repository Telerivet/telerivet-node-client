/**
    MobileMoneyReceipt
    
    Represents a receipt received from a mobile money system such as Safaricom M-Pesa (Kenya),
    Vodacom M-Pesa (Tanzania), or Tigo Pesa (Tanzania).
    
    When your Android phone receives a SMS receipt from a supported mobile money
    service that Telerivet can understand, Telerivet will automatically parse it and create a
    MobileMoneyReceipt object.
    
    Fields:
    
      - id (string, max 34 characters)
          * Telerivet's internal ID for the receipt
          * Read-only
      
      - tx_id
          * Transaction ID from the receipt
          * Read-only
      
      - tx_type
          * Type of mobile money transaction
          * Allowed values: receive_money, send_money, pay_bill, deposit, withdrawal,
              airtime_purchase, balance_inquiry, reversal
          * Read-only
      
      - currency
          * [ISO 4217 Currency code](http://en.wikipedia.org/wiki/ISO_4217) for the transaction,
              e.g. KES or TZS. Amount, balance, and fee are expressed in units of this currency.
          * Read-only
      
      - amount (number)
          * Amount of this transaction; positive numbers indicate money added to your account,
              negative numbers indicate money removed from your account
          * Read-only
      
      - balance (number)
          * The current balance of your mobile money account (null if not available)
          * Read-only
      
      - fee (number)
          * The transaction fee charged by the mobile money system (null if not available)
          * Read-only
      
      - name
          * The name of the other person in the transaction (null if not available)
          * Read-only
      
      - phone_number
          * The phone number of the other person in the transaction (null if not available)
          * Read-only
      
      - time_created (UNIX timestamp)
          * The time this receipt was created in Telerivet
          * Read-only
      
      - other_tx_id
          * The other transaction ID listed in the receipt (e.g. the transaction ID for a
              reversed transaction)
          * Read-only
      
      - content
          * The raw content of the mobile money receipt
          * Read-only
      
      - provider_id
          * Telerivet's internal ID for the mobile money provider
          * Read-only
      
      - vars (associative array)
          * Custom variables stored for this mobile money receipt
          * Updatable via API
      
      - contact_id
          * ID of the contact associated with the name/phone number on the receipt. Note that
              some mobile money systems do not provide the other person's phone number, so it's
              possible Telerivet may not automatically assign a contact_id, or may assign it to a
              different contact with the same name.
          * Updatable via API
      
      - phone_id
          * ID of the phone that received the receipt
          * Read-only
      
      - message_id
          * ID of the message corresponding to the receipt
          * Read-only
      
      - project_id
          * ID of the project this receipt belongs to
          * Read-only
 */ 
 
var util = require('./util'),
    Entity = require('./entity');
 
var MobileMoneyReceipt = util.makeClass('MobileMoneyReceipt', Entity);

/**
    receipt.save(callback)
    
    Saves any fields or custom variables that have changed for this mobile money receipt.
    
      - callback : function(err)
          * Required
    */
MobileMoneyReceipt.prototype.save = function(callback)
{
    Entity.prototype.save.call(this, callback);
};

/**
    receipt.delete(callback)
    
    Deletes this receipt.
    
      - callback : function(err)
          * Required
    */
MobileMoneyReceipt.prototype.delete = function(callback)
{
    this.api.doRequest("DELETE", this.getBaseApiPath(), null, callback);
};

Object.defineProperty(MobileMoneyReceipt.prototype, 'id', {
    enumerable: true,
    get: function() { return this.get('id'); },
    set: function(value) { throw new Error('id is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'tx_id', {
    enumerable: true,
    get: function() { return this.get('tx_id'); },
    set: function(value) { throw new Error('tx_id is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'tx_type', {
    enumerable: true,
    get: function() { return this.get('tx_type'); },
    set: function(value) { throw new Error('tx_type is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'currency', {
    enumerable: true,
    get: function() { return this.get('currency'); },
    set: function(value) { throw new Error('currency is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'amount', {
    enumerable: true,
    get: function() { return this.get('amount'); },
    set: function(value) { throw new Error('amount is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'balance', {
    enumerable: true,
    get: function() { return this.get('balance'); },
    set: function(value) { throw new Error('balance is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'fee', {
    enumerable: true,
    get: function() { return this.get('fee'); },
    set: function(value) { throw new Error('fee is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'name', {
    enumerable: true,
    get: function() { return this.get('name'); },
    set: function(value) { throw new Error('name is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'phone_number', {
    enumerable: true,
    get: function() { return this.get('phone_number'); },
    set: function(value) { throw new Error('phone_number is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'time_created', {
    enumerable: true,
    get: function() { return this.get('time_created'); },
    set: function(value) { throw new Error('time_created is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'other_tx_id', {
    enumerable: true,
    get: function() { return this.get('other_tx_id'); },
    set: function(value) { throw new Error('other_tx_id is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'content', {
    enumerable: true,
    get: function() { return this.get('content'); },
    set: function(value) { throw new Error('content is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'provider_id', {
    enumerable: true,
    get: function() { return this.get('provider_id'); },
    set: function(value) { throw new Error('provider_id is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'contact_id', {
    enumerable: true,
    get: function() { return this.get('contact_id'); },
    set: function(value) { this.set('contact_id', value); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'phone_id', {
    enumerable: true,
    get: function() { return this.get('phone_id'); },
    set: function(value) { throw new Error('phone_id is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'message_id', {
    enumerable: true,
    get: function() { return this.get('message_id'); },
    set: function(value) { throw new Error('message_id is not writable'); }
});    

Object.defineProperty(MobileMoneyReceipt.prototype, 'project_id', {
    enumerable: true,
    get: function() { return this.get('project_id'); },
    set: function(value) { throw new Error('project_id is not writable'); }
});    

MobileMoneyReceipt.prototype.getBaseApiPath = function()
{
    return "/projects/" + this.get("project_id") + "/receipts/" + this.get("id");
};

module.exports = MobileMoneyReceipt;

