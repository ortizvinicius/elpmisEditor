var ElpmisException = Object.create(Error.prototype);

Object.defineProperties(ElpmisException, {
  'name': {
    enumerable: true,
    value: 'ElpmisError'
  },
  'started': {
    writable: true,
    value: false
  },
  'messages': {
    value: [
      'The number was not defined.',
      'The element {{0}} is already been used. Use the destroy method before set it again.',
      'Cannot add a customComponent to an element already started, set the autoInit option to false, add the customComponent then use init() or initAll(). You can look at the status property to check if the element was already started.'
    ]
  },
  'message': {
    enumerable: true,

    /**
     * Get a message from the list based on the number (index) and put the placeholders inside it
     */
    get: function elpmisExceptionGetMessage(){
      if(this.started){
        var message = this.messages[this.number];

        if(this.placeholders){
          this.placeholders.forEach(function placeholdersIterator(placeholder, placeholderIndex){
            message = message.split('{{' + placeholderIndex + '}}').join(placeholder);
          });
        }

        return message;
      } else {
        return false;
      }
    }
  },
  'init': {
    
    /**
     * Inits the object
     *
     * @param {int} number
     * @param {array of string} placeholders
     */
    value: function elpmisExceptionInit(number, placeholders){
      if(!this.started){
        this.started = true;
        this.number = number;
        this.placeholders = placeholders;
      }
    }
  }
});
