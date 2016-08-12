;(function elpmisWrapper (global, document){
  'use strict';

  var elpmisElements = [];

  var ElpmisException = function(code, placeholders){
    var messages = [
      "The element '" + placeholders[0] + "' is already been used. Use the destroy method before set it again."
    ];

    this.code = code;
    this.message = messages[code];
  };

  var ElpmisEditor = function(selector){

    var self = this;
    
    var elSelector = selector || "#elpmisEditor";
    var elSelectorType = elSelector.substr(0, 1);
    var elSelectorName = elSelector.substr(1);

    var elements = [];

    function elpmisDestroy(){
      elpmisElements[elSelector] = false;
      this.elements = elements = [];

      //REMOVE THE EVENT LISTENERS
    }
    
    if(!elpmisElements[elSelector]){
      
      elpmisElements[elSelector] = true;

      var multipleElements = false;

      switch (elSelectorType){
        case "#": //Id
          elements[0] = document.getElementById(elSelectorName);
          break;
        case ".": //Class
          multipleElements = document.getElementsByClassName(elSelectorName);
          break;
        default: //Tag Name
          multipleElements = document.getElementsByTagName(elSelector);
          break;
      }

      if(multipleElements){
        Array.prototype.forEach.call(multipleElements, function(element){
          elements.push(element);
        });
      }

      return {
        elements: elements,
        destroy: elpmisDestroy
      };

    } else { //Element already used
      throw new ElpmisException(0, [elSelector]);
    }

  };

  global.ElpmisEditor = ElpmisEditor;

})(window, document);