;(function elpmisWrapper (global, document){
  'use strict';

  var elpmisElements = [],
      optionsDefault = {
        wysiwyg : true
      };

  var ElpmisException = (function elpmisExceptionWrapper(){

    var messages = [
      'The element {{0}} is already been used. Use the destroy method before set it again.'
    ];

    function getMessage(code, placeholders){
      var message = messages[code];

      placeholders.forEach(function placeholdersIterator(placeholder, placeholderIndex){
        message = message.split('{{' + placeholderIndex + '}}').join(placeholder);
      });

      return message;
    }

    return function elpmisException(code, placeholders){
      this.code = code;
      this.message = getMessage(code, placeholders);
    };
  })();

  var ElpmisEditor = function elpmisEditor(selector, op){

    var elSelector = selector || '.elpmis',
        elSelectorType = elSelector.substr(0, 1),
        elSelectorName = elSelector.substr(1),

        options = {},
        elements = [],
        multipleElements = false;

    function elpmisDestroy(){
      elpmisElements[elSelector] = false;
      var destroyProperties = Object.keys(this);

      destroyProperties.forEach(function destroyIterator(destroyProperty){
        delete this[destroyProperty];
      }, this);

      //REMOVE THE EVENT LISTENERS
    }

    if(typeof op == 'object' && op !== null){
      Object.keys(optionsDefault).forEach(function optionsIterator(option){
        if(op.hasOwnProperty(option)){
          options[option] = op[option];
        } else {
          options[option] = optionsDefault[option];
        }
      });
    } else {
      options = optionsDefault;
    }
    
    if(!elpmisElements[elSelector]){
      
      elpmisElements[elSelector] = true;

      switch (elSelectorType){
        case '#': //Id
          elements[0] = document.getElementById(elSelectorName);
          break;
        case '.': //Class
          multipleElements = document.getElementsByClassName(elSelectorName);
          break;
        default: //Tag Name
          multipleElements = document.getElementsByTagName(elSelector);
          break;
      }

      if(multipleElements){
        Array.prototype.forEach.call(multipleElements, function multipleElementsIterator(element){
          elements.push(element);
        });
      }

      return {
        options  : options,
        elements : elements,
        destroy  : elpmisDestroy
      };

    } else { //Element already used
      throw new ElpmisException(0, [elSelector]);
    }

  };

  global.ElpmisEditor = ElpmisEditor;

})(window, document);