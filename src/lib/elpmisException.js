var ElpmisException = {

  name: 'ElpmisError',
  code: 0,
  placeholders: false,

  /**
   * Inits the object
   *
   * @param {int} code
   * @param {array of string} placeholders
   */
  init: function initFn(code, placeholders){
    this.code = code;
    this.placeholders = placeholders;
  },

  /**
   * Log the error in browser console
   */
  logError: function logErrorFn(){
    console.error(this.name + ':', this.code, this.message);
  }

};

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
  get: function getMessage(){
    var message = this.messages[this.code];

    if(this.placeholders){
      this.placeholders.forEach(function placeholdersIterator(placeholder, placeholderIndex){
        message = message.split('{{' + placeholderIndex + '}}').join(placeholder);
      });
    }

    return message;
  }
});
