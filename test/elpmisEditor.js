;(function elpmisWrapper (global, document){
  'use strict';

  var elpmisElements = [],
      optionsDefault = {
        autoInit   : true, //boolean
        silentMode : false, //boolean

        wysiwyg    : true, //boolean
        textMode   : true, //boolean
        keyListen  : true, //boolean

        types      : ["basic", "header", "blocks", "lists", "special", "colors", "hyperlink"], //array
        basic      : ["strong", "em", "mark", "sup", "sub", "del"], //false or array
        header     : ["h1", "h2", "h3", "h4", "h5", "h6"], //false or array
        blocks     : ["p", "blockquote", "pre"], //false or array
        lists      : ["ul", "ol", "dl"], //false or array
        special    : ["abbr", "code", "hr"], //false or array
        colors     : "class", //class, inline or false
        hyperlink  : true //boolean
      };

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
      this.name = "ElpmisError";
      this.code = code;
      this.message = getMessage(code, placeholders);

      this.logError = function(){
        console.error(this.name + ":", this.code, this.message);
      };
    };
  })();

  var ElpmisCustomComponent = (function elpmisCustomComponentWrapper(){
    var customComponentsLength = 1;

    return function elpmisCustomComponent(config, types){
      if(typeof config == 'object' && config !== null){
        this.name = config.name || "customComponent" + customComponentsLength;
        this.element = config.element || "span"; //HTML element
        this.class = config.class || "customClass" + customComponentsLength; //CSS class
        this.type = types.indexOf(config.type) > -1 ? config.type : "special";

        customComponentsLength++;
      }
    };
  })();

  var ElpmisEditor = function elpmisEditor(selector, op){

    var elSelector = selector || '.elpmis',
        elSelectorType = elSelector.substr(0, 1),
        elSelectorName = elSelector.substr(1),

        options = {},
        elements = [],
        multipleElements = false,
        customComponents = [],
        status = false;

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

    function elpmisAddCustomComponent(config){
      if(!status){
        config = typeof config == 'object' ? config : {};
        var customComponent = new ElpmisCustomComponent(config, options.types);
        if(customComponent) customComponents.push(customComponent);
      } else {
        if(!options.silentMode){
          throw new ElpmisException(1);
        } else {
          new ElpmisException(1).logError();
        }
      }
    }    

    function elpmisAddKeyListeners(element){
      if(options.blocks.indexOf("p") > -1){

      }
    }
    
    function elpmisInit(element){
      if(!status) status = true;
      if(options.keyListen){
        elpmisAddKeyListeners(element);
      }
    }

    function elpmisInitAll(){
      elements.forEach(elpmisInit);
    }

    function elpmisDestroy(){
      elpmisElements[elSelector] = false;
      var destroyProperties = Object.keys(this);

      destroyProperties.forEach(function destroyIterator(destroyProperty){
        delete this[destroyProperty];
      }, this);

      //REMOVE THE EVENT LISTENERS
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

      if(options.autoInit){
        elpmisInitAll();
      }

      return {
        status             : status,
        selector           : elSelector,
        options            : options,
        elements           : elements,
        customComponents   : customComponents,

        destroy            : elpmisDestroy,
        addCustomComponent : elpmisAddCustomComponent,
        init               : elpmisInit,
        initAll            : elpmisInitAll
      };

    } else { //Element already used
      if(!options.silentMode){
        throw new ElpmisException(0, [elSelector]);
      } else {
        new ElpmisException(0, [elSelector]).logError();
      }
    }

  };

  global.ElpmisEditor = ElpmisEditor;

})(window, document);