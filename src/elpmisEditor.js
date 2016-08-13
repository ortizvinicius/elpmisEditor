;(function elpmisWrapper (global, document){
  'use strict';

  var elpmisElements = [],
      optionsDefault = {
        wysiwyg        : true, //boolean
        textMode       : true, //boolean
        types          : ["basicFormat", "header", "blocks", "lists", "special", "colors", "hyperlink"], //array
        basicFormat    : ["strong", "em", "mark", "sup", "sub", "del"], //false or array
        header         : ["h1", "h2", "h3", "h4", "h5", "h6"], //false or array
        blocks         : ["p", "blockquote", "pre"], //false or array
        lists          : ["ul", "ol", "dl"], //false or array
        special        : ["abbr", "code", "hr"], //false or array
        colors         : "class", //class, inline or false
        hyperlink      : true, //boolean
        customComponents : [] //Array of customComponent objects
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

    function elpmisCustomComponent(config){
      if(typeof config == 'object' && config !== null){
        this.name = config.name || "customComponent" + options.customComponents.length;
        this.element = config.element || "span"; //HTML element
        this.class = config.class || "customClass" + options.customComponents.length; //CSS class
        this.type = options.types.indexOf(config.type) > -1 ? config.type : "special";
      }
    }

    function elpmisAddCustomComponent(config){
      options.customComponents.push(new elpmisCustomComponent(config));
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
        options            : options,
        elements           : elements,
        destroy            : elpmisDestroy,
        addCustomComponent : elpmisAddCustomComponent
      };

    } else { //Element already used
      throw new ElpmisException(0, [elSelector]);
    }

  };

  global.ElpmisEditor = ElpmisEditor;

})(window, document);