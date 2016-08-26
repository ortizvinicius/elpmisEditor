;(function elpmisWrapper (global, document){
'use strict';

//List the selectors used
var elpmisElements = [],

    optionsDefault = {
      //{boolean} - If true the initiAll() function is called as soon as the main function is called
      autoInit   : true,

      //{boolean} - If true Exceptions will not be thrown, instead the errors will just be logged
      silentMode : true,

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
var ElpmisCustomComponent = (function elpmisCustomComponentWrapper(){
  var customComponentsLength = 1;

  return {

    /**
     * @param {object} config
     * @param {array of string} types - The main function options.types array
     */
    init: function elpmisCustomComponentInit(config, types){
      
      if(typeof config === 'object' && config !== null){
        //{string}
        this.name = config.name || 'customComponent' + customComponentsLength;

        //{string} HTML element
        this.element = config.element || 'span';

        //{string} CSS class
        this.class = config.class || 'customClass' + customComponentsLength; 

        //{string} - Test if the type given is in the types array
        this.type = types.indexOf(config.type) > -1 ? config.type : 'special';

        customComponentsLength++;

        this.init = false;
      }
    }
  };

})();
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
    'The number was not defined.',
    'The element {{0}} is already been used. Use the destroy method before set it again.',
    'Cannot add a customComponent to an element already started, set the autoInit option to false, add the customComponent then use init() or initAll(). You can look at the status property to check if the element was already started.'
  ]
});

Object.defineProperty(ElpmisException, 'message', {
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
});

Object.defineProperty(ElpmisException, 'init', {
  enumerable: true,
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
      this.stack = (new Error()).stack;
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
      console.error(this.name + ':', this.number, this.message);
    }
  }
});

function addMultipleEventListeners(element, events, eventFunction){
  events.forEach(function(event){
    element.addEventListener(event, eventFunction);
  });
}

function newElpmisException(code, placeholders){
  var exception = Object.create(ElpmisException);
  exception.init(code, placeholders);
  
  return exception;
}
var ElpmisPreviewElement = {

  /**
   * @param {HTMLElement} textareaElement
   */
  init: function elpmisPreviewElementInit(textareaElement){
    this.textareaElement = textareaElement;
    this.domElement = document.createElement('div');

    this.domElement.classList.add('elpmisPreviewElement');
    this.domElement.classList.add('active');
    this.domElement.id = 'elpmisPreviewElement' + this.textareaElement.elpmisId;

    this.init = false;
  },

  //TOOGLE BUTTON AND METHOD

  //Update the content according to textarea value
  updatePreview: function elpmisPreviewElementUpdatePreview(){
    this.domElement.innerHTML = this.textareaElement.value;
  },

  //Add the preview element to DOM, just before the textarea element
  addToDOM: function elpmisPreviewElementAddToDOM(){
    document.body.insertBefore(this.domElement, this.textareaElement);
  },

  //Watchs for changes in textarea element value
  watch: function elpmisPreviewElementWatch(){
    var self = this;
    addMultipleEventListeners(self.textareaElement, ['input', 'change', 'keyup', 'keydown', 'keypress'], function(){
      self.updatePreview();
    });

    //TOOGLE on textarea focus/blur
  }

};



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
      var customComponent = Object.create(ElpmisCustomComponent);
      customComponent.init(config, options.types);
      
      if(customComponent) customComponents.push(customComponent);
    
    } else {
      if(!options.silentMode){
        throw newElpmisException(2);
      } else {
        newElpmisException(2).logError();
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
            newLineAfter: true,
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
          selectionRangeText = '',
          lineRangeText,
          linesToStart,
          linesAfterEnd,

          newSelection = 0,
          elValue = element.value,
          newValue = '',
          hasTag = false,
          tagCheck = /<*>/i;

      //check if was selected a text part
      if(selectionStart !== selectionEnd){
        selectionRangeText = elValue.substring(selectionStart, selectionEnd);

        //Check if the range text has a tag
        hasTag = tagCheck.test(selectionRangeText);
      }

      linesToStart = elValue.substring(0, selectionStart).split('\n');
      linesAfterEnd = elValue.substring(selectionEnd).split('\n');

      //Gets the entire line
      lineRangeText = linesToStart[linesToStart.length - 1] + selectionRangeText + linesAfterEnd[0];
      
      //Check if the entire line has a tag
      if(!hasTag) hasTag = tagCheck.test(lineRangeText);

      //If it is an inline element (like a br)
      if(config.inline || (selectionRangeText !== '' && !hasTag)){
        newValue  = elValue.substring(0, selectionStart);
        newValue += config.inline && config.newLineBefore ? '\n' : '';
        newValue += '<' + config.element + '>';
        newValue += elValue.substring(selectionStart, selectionEnd);

        if(config.newLineBefore) newSelection = newValue.length;
        
        newValue += config.close ? '</' + config.element + '>' : '';
        newValue += config.inline && config.newLineAfter ? '\n' : '';

        if(config.newLineAfter) newSelection = newValue.length;

        newValue += elValue.substring(selectionEnd);

      } else {
        
        //Remove the last line
        linesToStart.pop();

        //Remove the first line
        linesAfterEnd.shift();

        newValue  = linesToStart.join('\n');
        newValue += config.newLineBefore ? '\n' : '';
        newValue += lineRangeText;
        newValue += config.newLineBefore ? '\n' : '';
        newValue += '<' + config.element + '>';
        
        newSelection = newValue.length;

        newValue += config.close ? '</' + config.element + '>' : '';
        newValue += config.newLineAfter ? '\n' : '';
        newValue += linesAfterEnd.join('\n');

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
    previewElements[elpmisId] = Object.create(ElpmisPreviewElement);
    previewElements[elpmisId].init(element);
    previewElements[elpmisId].updatePreview();
    previewElements[elpmisId].addToDOM();
    previewElements[elpmisId].watch();
  }
  
  /**
   * Inits the functions, so the textarea will be ready to use
   *
   * @param {string} element
   */
  function init(element){
    if(!status){
      status = true;
      if(options.keyListen){
        addKeyListeners(element);
      }

      if(options.previewMode){
        addPreviewElement(element);
      }
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
      throw newElpmisException(1, [elSelector]);
    } else {
      newElpmisException(1, [elSelector]).logError();
    }
  }

};

global.ElpmisEditor = ElpmisEditor;

})(window, document);