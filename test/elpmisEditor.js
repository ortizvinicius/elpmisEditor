;(function elpmisWrapper (global, document){
  'use strict';

  //List the selectors used
  var elpmisElements = [],

      optionsDefault = {
        //{boolean} - If true the initiAll() function is called as soon as the main function is called
        autoInit   : true,

        //{boolean} - If true Exceptions will not be thrown, instead the errors will just be logged
        silentMode : false,

        //{boolean} - If true creates a div that changes as the user type in the textarea with its value
        previewMode: true,

        //{boolean} - If true listen for some default keys (eg. enter, shift+enter) to add HTML elements
        keyListen  : true,

        //{array of strings with valid HTML elements|false}
        types      : ['basic', 'header', 'blocks', 'lists', 'special', 'colors', 'hyperlink'],
        basic      : ['strong', 'em', 'mark', 'sup', 'sub', 'del', 'br'], 
        header     : ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        blocks     : ['p', 'blockquote', 'pre'], 
        lists      : ['ul', 'ol', 'dl'],
        special    : ['abbr', 'code', 'hr'],

        //{'class'|'inline'|false} this will determine how colors will be added to elements
        colors     : 'class', 

        //{boolean} - If true adds the hyperlink element (a) option
        hyperlink  : true
      };


  //Concatenate the files here
  function addMultipleEventListeners(element, events, eventFunction){
  events.forEach(function(event){
    element.addEventListener(event, eventFunction);
  });
}

  /**
   * Main function which takes one or more textarea elements with the options (or default options) and returns
   * a object to handle with these elements. If option.autoInit is true (default), the initAll is called then the elements
   * will already be ready to use
   *
   * @param {String} selector - Accepts the css selectors: tagname, .classname or #idname
   * @param {Object} op - Options with same properties of optionsDefault
   * @return {Object} 
   */
  var ElpmisEditor = function elpmisEditor(selector, op){

    //Check if the selector was given, if not uses this parameter as the options object
    if(typeof selector === 'object'){ 
      op = selector;
      selector = false;
    }

    //If selector was not given uses the default
    var elSelector = selector || '.elpmis',

        //To check if is a class, tagName or id selector
        elSelectorType = elSelector.substr(0, 1),
        elSelectorName = elSelector.substr(1),

        options = {},

        //To check if the elements was initiated
        status = false,

        //List the textarea elements
        elements = [],

        //True if it is a class or tag name selector 
        multipleElements = false,

        //List the custom components added to the Elpmis bar
        customComponents = [],

        //List the preview elements linked to each textarea elements
        previewElements = [];

    //Check if the options parameter was given
    if(typeof op === 'object' && op !== null){

      //Iterates over the options default keys to check it it was given in the options parameter
      Object.keys(optionsDefault).forEach(function optionsIterator(option){
        if(op.hasOwnProperty(option)){
          options[option] = op[option];
        } else {
          options[option] = optionsDefault[option];
        }
      });
    } else { options = optionsDefault; }

    /**
     * Create a customComponent object then add this to the custom components array and to the Elpmis bar
     *
     * @param {Object} config - properties: {string} name, {string} element, {string} class, {string} type
     */
    function addCustomComponent(config){

      //Only creates the element if it was not already initated
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

    /**
     * Listen for keyboard events to add HTML elements to textarea value
     *
     * @param {string} element
     */
    function addKeyListeners(element){

      element.addEventListener('keypress', function elementKeyPress(event){  
        
        var key = event.which || event.keyCode,
            shift = event.shiftKey;

        //Enter key = paragraph
        if(options.blocks.indexOf('p') > -1){
          
          if(key === 13 && !shift){
            event.preventDefault();
            addHTMLElement(element, {
              element: 'p',
              newLineBefore: true,
              inline: false
            });
          }
        }

        //Shift+Enter key = line break
        if(options.basic.indexOf('br') > -1){
          
          if(key === 13 && shift){
            event.preventDefault();
            addHTMLElement(element, {
              element: 'br',
              newLineAfter: true,
              close: false
            });
          }
        }

      });
    }

    /**
     * Add a HTML element to textarea value
     *
     * @param {string} element
     * @param {object} config
     */
    function addHTMLElement(element, config){

      if(element){
        config = typeof config == 'object' ? config : {};

        //string
        config.element = config.element || 'p';

        //boolean
        config.newLineBefore = config.hasOwnProperty('newLineBefore') ? config.newLineBefore : false; 

        //boolean
        config.newLineAfter = config.hasOwnProperty('newLineAfter') ? config.newLineAfter : false;

        //boolean - true for <br>, <hr> like elements, false for <p></p> like elements
        config.close = config.hasOwnProperty('close') ? config.close : true;

        //boolean - false for block elements
        config.inline = config.hasOwnProperty('inline') ? config.inline : true;

        //Search for the caret position
        var selectionStart = element.selectionStart,
            selectionEnd = element.selectionEnd,

            newSelection = 0,
            elValue = element.value,
            newValue = '';

        //If it is an inline element (like a br)
        if(config.inline){
          newValue  = elValue.substring(0, selectionStart);
          newValue += config.newLineBefore ? '\n' : '';
          newValue += '<' + config.element + '>';
          newValue += elValue.substring(selectionStart, selectionEnd);

          if(config.newLineBefore) newSelection = newValue.length;
          
          newValue += config.close ? '</' + config.element + '>' : '';
          newValue += config.newLineAfter ? '\n' : '';

          if(config.newLineAfter) newSelection = newValue.length;

          newValue += elValue.substring(selectionEnd);

        } else {
          newValue  = elValue;
          newValue += config.newLineBefore ? '\n' : '';
          newValue += '<' + config.element + '>';
          
          if(config.newLineBefore) newSelection = newValue.length;

          newValue += config.close ? '</' + config.element + '>' : '';
          newValue += config.newLineAfter ? '\n' : '';

          if(config.newLineAfter) newSelection = newValue.length;
        }

        element.value = newValue;
        element.selectionStart = element.selectionEnd = newSelection;
      }

    }

    /**
     * Add a preview element to DOM, linked to textarea element, and watch the textarea element to update its content
     *
     * @param {string} element
     */
    function addPreviewElement(element){
      var elpmisId = element.elpmisId;
      previewElements[elpmisId] = new ElpmisPreviewElement(element);
      previewElements[elpmisId].addToDOM();
      previewElements[elpmisId].watch();
    }
    
    /**
     * Inits the functions, so the textarea will be ready to use
     *
     * @param {string} element
     */
    function init(element){
      if(!status) status = true;

      if(options.keyListen){
        addKeyListeners(element);
      }

      if(options.previewMode){
        addPreviewElement(element);
      }
    }

    /**
     * Inits all the textarea elements
     */
    function initAll(){
      elements.forEach(init);
    }

    /**
     * Destroy all the textarea elements (removes bar, preview elements, event listeners etc)
     */
    function destroy(){
      elpmisElements[elSelector] = false;
      var destroyProperties = Object.keys(this);

      destroyProperties.forEach(function destroyIterator(destroyProperty){
        delete this[destroyProperty];
      }, this);

      //REMOVE THE EVENT LISTENERS
    }

    //Test if the element is already used to avoid duplicates
    if(!elpmisElements[elSelector]){
      
      elpmisElements[elSelector] = true;

      //Check if it is a class, tag name or id selector
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

      //Set elpmisId propertie to each textarea element for control
      elements.forEach(function elementsIdIterator(element, index){
        element.elpmisId = index;
      });

      if(options.autoInit){
        initAll();
      }

      return {
        //{boolean}
        status             : status,

        //{string}
        selector           : elSelector,

        //{object}
        options            : options,

        //{array of string}
        elements           : elements,

        //{array of elpmisCustomComponent objects}
        customComponents   : customComponents,

        //{array of elpmisPreviewElements objects}
        previewElements    : previewElements,

        //{functions}
        destroy            : destroy,
        addCustomComponent : addCustomComponent,
        init               : init,
        initAll            : initAll,
        addHTMLElement     : addHTMLElement
      };

    } else {
      if(!options.silentMode){
        throw new ElpmisException(0, [elSelector]);
      } else {
        new ElpmisException(0, [elSelector]).logError();
      }
    }

  };

  global.ElpmisEditor = ElpmisEditor;

})(window, document);