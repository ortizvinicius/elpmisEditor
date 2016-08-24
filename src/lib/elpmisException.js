var ElpmisException = Object.create(Error);

Object.defineProperty(ElpmisException, 'name', {
  enumerable: true,
  value: 'ElpmisError'
});

Object.defineProperty(ElpmisException, 'started', {
  writable: true,
  value: false,
});

Object.defineProperty(ElpmisException, 'messages', {
  value: [
    'The code was not defined.',
    'The element {{0}} is already been used. Use the destroy method before set it again.',
    'Cannot add a customComponent to an element already started, set the autoInit option to false, add the customComponent then use init() or initAll(). You can look at the status property to check if the element was already started.'
  ]
});

Object.defineProperty(ElpmisException, 'message', {
  enumerable: true,

  /**
   * Get a message from the list based on the code (index) and put the placeholders inside it
   */
  get: function elpmisExceptionGetMessage(){
    if(this.started){
      var message = this.messages[this.code];

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
});

Object.defineProperty(ElpmisException, 'init', {
  enumerable: true,
  /**
   * Inits the object
   *
   * @param {int} code
   * @param {array of string} placeholders
   */
  value: function elpmisExceptionInit(code, placeholders){
    if(!this.started){
      this.started = true;
      this.code = code;
      this.placeholders = placeholders;
    }
  }
});

Object.defineProperty(ElpmisException, 'logError', {
  enumerable: true,
  /**
   * Log the error in browser console
   */
  value: function elpmisExceptionLogError(){
    if(this.started){
      console.error(this.name + ':', this.code, this.message);
    }
  }
});
