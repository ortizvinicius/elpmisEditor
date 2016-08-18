/**
 * Construct an ElpmisException object
 *
 * @param {int} code
 * @param {array of string} placeholders
 */
var ElpmisException = (function elpmisExceptionWrapper(){
  var messages = [
    'The element {{0}} is already been used. Use the destroy method before set it again.',
    'Cannot add a customComponent to an element already started, set the autoInit option to false, add the customComponent then use init() or initAll(). You can look at the status property to check if the element was already started.'
  ];

  function getMessage(code, placeholders){
    var message = messages[code];

    if(placeholders){
      placeholders.forEach(function placeholdersIterator(placeholder, placeholderIndex){
        message = message.split('{{' + placeholderIndex + '}}').join(placeholder);
      });
    }

    return message;
  }

  return function elpmisException(code, placeholders){
    this.name = 'ElpmisError';
    this.code = code;
    this.message = getMessage(code, placeholders);

    //Log error in console
    this.logError = function(){
      console.error(this.name + ':', this.code, this.message);
    };
  };
})();