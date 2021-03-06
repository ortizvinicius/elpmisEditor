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
      types      : ['basic', 'header', 'blocks', 'special', 'colors', 'hyperlink'],
      basic      : ['strong', 'em', 'sup', 'sub', 'del', 'br'], 
      header     : ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      blocks     : ['p', 'blockquote', 'pre'], 
      special    : ['abbr', 'code', 'hr'],

      //{'class'|'inline'|false} this will determine how css attributes will be added to elements
      css        : 'class', 

      //{boolean} - If true adds the hyperlink element (a) option
      hyperlink  : true
    };


//Concatenate the files here
var ElpmisCustomComponent = {

  customComponentsLength: 0,
  element: 'span',
  type: 'special',

  init: function elpmisCustomComponentInit(config, types){
      
    if(typeof config === 'object' && config !== null){

      this.id = ++ElpmisCustomComponent.customComponentsLength;

      //{string}
      this.name = config.name || 'customComponent' + this.id;

      //{string} HTML element
      if(config.element) this.element = config.element;

      //{string} CSS class
      this.class = config.class || 'customClass' + this.id; 

      //{string} - Test if the type given is in the types array
      if(types.indexOf(config.type) > -1) this.type = config.type;

      this.init = function(){ return false; };
    }
  }

};
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

var ElpmisFormatBar = {

	blocks : {},

	/**
   * @param {HTMLElement} textareaElement
   * @param {object} config (types, basic, header, blocks, list, special, css, hyperlink, addHTMLElement function)
   */
  init: function elpmisFormatBarInit(textareaElement, config){

  	if(typeof config !== 'object') return false;

  	this.config = config;

    this.textareaElement = textareaElement;
    this.domElement = document.createElement('div');

    this.domElement.classList.add('elpmisFormatBar');
    this.domElement.id = 'elpmisFormatBar' + this.textareaElement.elpmisId;

    this.init = function(){ return false; };

    return true;
  },

  //Add the format bar to DOM, after the textarea element
  addToDOM: function elpmisFormatBarAddToDOM(){
    if(!this.init()) document.body.insertBefore(this.domElement, this.textareaElement);
  },

  //Add the blocks to bar
  addBlocks: function elpmisFormatBarAddToDOM(){
    if(!this.init()){ 

    	var self = this;
      
      //Basic
      if(this.config.types.indexOf('basic') > -1){

      	this.blocks.basic = {};
      	this.blocks.basic.domElement = document.createElement('div');
      	this.blocks.basic.domElement.classList.add('elpmisFormatBar-basicBlock');
      	this.blocks.basic.domElement.id = 'elpmisFormatBar-basicBlock' + this.textareaElement.elpmisId;

      	if(this.config.hasOwnProperty('basic') && typeof this.config.basic === 'object'){
      		this.config.basic.forEach(function basicBlockIterator(tag){

      			var clickConfig = {};

      			this.config.basic[tag] = document.createElement('button');
      			this.config.basic[tag].classList.add('elpmisFormatBar-basicBlock-' + tag + 'Button');
      			this.config.basic[tag].id = 'elpmisFormatBar-basicBlock-' + tag + 'Button' + this.textareaElement.elpmisId;

      			clickConfig.element = tag;

      			if(tag === 'strong'){

      				this.config.basic[tag].innerHTML = '<strong>B</strong>';
      				this.config.basic[tag].setAttribute('title', 'Bold');

      				clickConfig.newLineBefore = false;
      				clickConfig.newLineAfter = false;
      				clickConfig.close = true;
      				clickConfig.inline = true;

      			} else if(tag === 'em'){

              this.config.basic[tag].innerHTML = '<em>I</em>';
              this.config.basic[tag].setAttribute('title', 'Italic');

              clickConfig.newLineBefore = false;
              clickConfig.newLineAfter = false;
              clickConfig.close = true;
              clickConfig.inline = true;

            } else if(tag === 'em'){

              this.config.basic[tag].innerHTML = '<em>I</em>';
              this.config.basic[tag].setAttribute('title', 'Italic');

              clickConfig.newLineBefore = false;
              clickConfig.newLineAfter = false;
              clickConfig.close = true;
              clickConfig.inline = true;

            } else if(tag === 'sup'){

              this.config.basic[tag].innerHTML = '<sup>sup</sup>';
              this.config.basic[tag].setAttribute('title', 'Superscript');

              clickConfig.newLineBefore = false;
              clickConfig.newLineAfter = false;
              clickConfig.close = true;
              clickConfig.inline = true;

            } else if(tag === 'sub'){

              this.config.basic[tag].innerHTML = '<sub>sub</sub>';
              this.config.basic[tag].setAttribute('title', 'Subscript');

              clickConfig.newLineBefore = false;
              clickConfig.newLineAfter = false;
              clickConfig.close = true;
              clickConfig.inline = true;

            } else if(tag === 'del'){

              this.config.basic[tag].innerHTML = '<del>del</del>';
              this.config.basic[tag].setAttribute('title', 'Deleted text');

              clickConfig.newLineBefore = false;
              clickConfig.newLineAfter = false;
              clickConfig.close = true;
              clickConfig.inline = true;

            } else {

              this.config.basic[tag].innerHTML = '&crarr;';
              this.config.basic[tag].setAttribute('title', 'Break line');

              clickConfig.newLineBefore = false;
              clickConfig.newLineAfter = true;
              clickConfig.close = false;
              clickConfig.inline = true;

            }

      			this.config.basic[tag].addEventListener('click', function elpmisBasicButtonClick(){
      				self.config.addHTMLElement(self.textareaElement, clickConfig);
      			});

      			this.blocks.basic.domElement.appendChild(this.config.basic[tag]);

      		}, this);
      	}

      	this.domElement.appendChild(this.blocks.basic.domElement);
      }

      //Header
      if(this.config.types.indexOf('header') > -1){

        this.blocks.header = {};
        this.blocks.header.domElement = document.createElement('div');
        this.blocks.header.domElement.classList.add('elpmisFormatBar-headerBlock');
        this.blocks.header.domElement.id = 'elpmisFormatBar-headerBlock' + this.textareaElement.elpmisId;

        if(this.config.hasOwnProperty('header') && typeof this.config.header === 'object'){
          
          this.blocks.header.selectElement = document.createElement('select');
          this.blocks.header.selectElement.id = 'elpmisFormatBar-headerBlock-select' + this.textareaElement.elpmisId;

          this.config.header.forEach(function headerBlockIterator(tag){ 

            this.config.header[tag] = document.createElement('option');
            this.config.header[tag].setAttribute('value', tag);
            this.config.header[tag].innerHTML = 'Header ' + tag.substring(1);
            this.config.header[tag].changeConfig = {
              element: tag,
              newLineBefore: true,
              newLineAfter: true,
              close: true,
              inline: false
            };

            this.blocks.header.selectElement.appendChild(this.config.header[tag]);

          }, this);

          this.blocks.header.selectElement.addEventListener('change', function elpmisHeaderSelectChange(){
            var tag = self.blocks.header.selectElement.value;
            self.config.addHTMLElement(self.textareaElement, self.config.header[tag].changeConfig);
          });

          this.blocks.header.domElement.appendChild(this.blocks.header.selectElement);

        }

        this.domElement.appendChild(this.blocks.header.domElement);
      }

      //Blocks
      if(this.config.types.indexOf('blocks') > -1){

        this.blocks.blocks = {};
        this.blocks.blocks.domElement = document.createElement('div');
        this.blocks.blocks.domElement.classList.add('elpmisFormatBar-blocksBlock');
        this.blocks.blocks.domElement.id = 'elpmisFormatBar-blocksBlock' + this.textareaElement.elpmisId;

        if(this.config.hasOwnProperty('blocks') && typeof this.config.blocks === 'object'){
          this.config.blocks.forEach(function blocksBlockIterator(tag){

            var clickConfig = {};

            this.config.blocks[tag] = document.createElement('button');
            this.config.blocks[tag].classList.add('elpmisFormatBar-blocksBlock-' + tag + 'Button');
            this.config.blocks[tag].id = 'elpmisFormatBar-blocksBlock-' + tag + 'Button' + this.textareaElement.elpmisId;

            clickConfig.element = tag;

            if(tag === 'p'){

              this.config.blocks[tag].innerHTML = 'Paragraph';

              clickConfig.newLineBefore = true;
              clickConfig.newLineAfter = true;
              clickConfig.close = true;
              clickConfig.inline = false;

            } else if(tag === 'blockquote'){

              this.config.blocks[tag].innerHTML = '&ldquo;Quotes&rdquo;';

              clickConfig.newLineBefore = true;
              clickConfig.newLineAfter = true;
              clickConfig.close = true;
              clickConfig.inline = false;

            } else if(tag === 'pre'){

              this.config.blocks[tag].innerHTML = '<pre>Pre</pre>';
              this.config.blocks[tag].setAttribute('title', 'Preformatted text');

              clickConfig.newLineBefore = true;
              clickConfig.newLineAfter = true;
              clickConfig.close = true;
              clickConfig.inline = false;

            }

            this.config.blocks[tag].addEventListener('click', function elpmisBlocksButtonClick(){
              self.config.addHTMLElement(self.textareaElement, clickConfig);
            });

            this.blocks.blocks.domElement.appendChild(this.config.blocks[tag]);

          }, this);
        }

        this.domElement.appendChild(this.blocks.blocks.domElement);
      }

      //Special
      if(this.config.types.indexOf('special') > -1){

        this.blocks.special = {};
        this.blocks.special.domElement = document.createElement('div');
        this.blocks.special.domElement.classList.add('elpmisFormatBar-specialBlock');
        this.blocks.special.domElement.id = 'elpmisFormatBar-specialBlock' + this.textareaElement.elpmisId;

        if(this.config.hasOwnProperty('special') && typeof this.config.special === 'object'){

          this.config.special.forEach(function specialBlockIterator(tag){

            var clickConfig = {};

            this.config.special[tag] = document.createElement('button');
            this.config.special[tag].classList.add('elpmisFormatBar-specialBlock-' + tag + 'Button');
            this.config.special[tag].id = 'elpmisFormatBar-specialBlock-' + tag + 'Button' + this.textareaElement.elpmisId;

            clickConfig.element = tag;

            if(tag === 'abbr'){

              this.config.special[tag].innerHTML = 'Abbr';
              this.config.special[tag].setAttribute('title', 'Abbreviation');

              clickConfig.newLineBefore = false;
              clickConfig.newLineAfter = false;
              clickConfig.close = true;
              clickConfig.inline = true;

            } else if(tag === 'code'){

              this.config.special[tag].innerHTML = '<code>Code</code>';

              clickConfig.newLineBefore = false;
              clickConfig.newLineAfter = false;
              clickConfig.close = true;
              clickConfig.inline = true;

            } else if(tag === 'hr'){

              this.config.special[tag].innerHTML = 'Line';

              clickConfig.newLineBefore = true;
              clickConfig.newLineAfter = true;
              clickConfig.close = false;
              clickConfig.inline = true;

            } 

            this.config.special[tag].addEventListener('click', function elpmisSpecialButtonClick(){
              self.config.addHTMLElement(self.textareaElement, clickConfig);
            });

            this.blocks.special.domElement.appendChild(this.config.special[tag]);

          }, this);
        }

        this.domElement.appendChild(this.blocks.special.domElement);
      }

      //Link
      if(this.config.types.indexOf('hyperlink') > -1){

        this.blocks.hyperlink = {};
        this.blocks.hyperlink.domElement = document.createElement('div');
        this.blocks.hyperlink.domElement.classList.add('elpmisFormatBar-hyperlinkBlock');
        this.blocks.hyperlink.domElement.id = 'elpmisFormatBar-hyperlinkBlock' + this.textareaElement.elpmisId;

        if(this.config.hasOwnProperty('hyperlink') && !!this.config.hyperlink){

          this.blocks.hyperlink.input = document.createElement('input');
          this.blocks.hyperlink.input.setAttribute('placeholder', 'Hyperlink');
          this.blocks.hyperlink.input.setAttribute('type', 'url');
          this.blocks.hyperlink.input.classList.add('elpmisFormatBar-hyperlinkBlock-input');
          this.blocks.hyperlink.input.id = 'elpmisFormatBar-hyperlinkBlock-input' + this.textareaElement.elpmisId;
          this.blocks.hyperlink.domElement.appendChild(this.blocks.hyperlink.input);

          this.blocks.hyperlink.button = document.createElement('button');
          this.blocks.hyperlink.button.innerHTML = 'Ok';
          this.blocks.hyperlink.button.classList.add('elpmisFormatBar-hyperlinkBlock-button');
          this.blocks.hyperlink.button.id = 'elpmisFormatBar-hyperlinkBlock-button' + this.textareaElement.elpmisId;
          this.blocks.hyperlink.domElement.appendChild(this.blocks.hyperlink.button);

          var clickConfig = {
            element: 'a',
            newLineBefore: false,
            newLineAfter: false,
            close: true,
            inline: true,
            href: this.blocks.hyperlink.input.id
          };

          this.blocks.hyperlink.button.addEventListener('click', function elpmisHyperlinkButtonClick(){
            self.config.addHTMLElement(self.textareaElement, clickConfig);
          });


        }

        this.domElement.appendChild(this.blocks.hyperlink.domElement);
      }

    }
  }

};
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

  pinStatus: false,
  pinBtnOver: false,
  contentElement: {},

  /**
   * @param {HTMLElement} textareaElement
   */
  init: function elpmisPreviewElementInit(textareaElement){
    this.textareaElement = textareaElement;
    this.domElement = document.createElement('div');

    this.domElement.classList.add('elpmisPreviewElement');
    this.domElement.classList.toggle('inactive');
    this.domElement.setAttribute('tabindex', -1);
    this.domElement.id = 'elpmisPreviewElement' + this.textareaElement.elpmisId;

    this.init = function(){ return false; };
  },

  //Show/hide the element
  toggle: function elpmisPreviewElementToggle(){
    if(!this.init() && !this.pinStatus && !this.pinBtnOver){
      this.domElement.classList.toggle('active');
      this.domElement.classList.toggle('inactive');
    }
  },

  //hide the element
  hide: function elpmisPreviewElementHide(){
    if(!this.init()){
      this.domElement.classList.remove('active');
      this.domElement.classList.add('inactive');
    }
  },

  //pin the element
  pinToggle: function elpmisPreviewElementPin(){
    if(!this.init()){
      if(this.pinStatus === false){
        this.pinStatus = true;

        this.domElement.classList.remove('inactive');
        this.domElement.classList.add('active');
        this.domElement.classList.remove('pined');
        this.domElement.classList.add('pined');
      } else {
        this.pinStatus = false;

        this.domElement.classList.remove('active');
        this.domElement.classList.add('inactive');
        this.domElement.classList.remove('pined');
        this.domElement.classList.add('unpined');
      }
    }
  },

  //Update the content according to textarea value
  updatePreview: function elpmisPreviewElementUpdatePreview(){
    if(!this.init()) this.contentElement.innerHTML = this.textareaElement.value;
  },

  //Add the preview element to DOM, just before the textarea element
  addToDOM: function elpmisPreviewElementAddToDOM(){
    if(!this.init()){ 
      var self = this;

      document.body.insertBefore(this.domElement, this.textareaElement);

      this.closeBtn = document.createElement('button');
      this.closeBtn.classList.add('elpmisPreviewElement-closeBtn');
      this.closeBtn.id = 'elpmisPreviewElement-closeBtn' + this.textareaElement.elpmisId;
      this.closeBtn.innerHTML = '&times;';
      this.closeBtn.setAttribute('title', 'Close Elpmis Preview Element');
      
      this.domElement.appendChild(this.closeBtn);

      this.closeBtn.addEventListener('click', function elpmisPreviewElementCloseBtnClick(){
        if(self.pinStatus) self.pinToggle();
        self.hide();
      });

      this.pinBtn = document.createElement('button');
      this.pinBtn.classList.add('elpmisPreviewElement-pinBtn');
      this.pinBtn.id = 'elpmisPreviewElement-pinBtn' + this.textareaElement.elpmisId;
      this.pinBtn.innerHTML = '&nabla;';
      this.pinBtn.setAttribute('title', 'Pin Elpmis Preview Element');
      
      this.domElement.appendChild(this.pinBtn);

      this.pinBtn.addEventListener('click', function elpmisPreviewElementClosePinClick(){
        self.pinToggle();
      });

      this.pinBtn.addEventListener('mouseover', function elpmisPreviewElementClosePinOver(){
        self.pinBtnOver = true;
      });

      this.pinBtn.addEventListener('mouseout', function elpmisPreviewElementClosePinOut(){
        self.pinBtnOver = false;
      });

      this.contentElement = document.createElement('div');
      this.domElement.appendChild(this.contentElement);

    }
  },

  //Watchs for changes in textarea element value
  watch: function elpmisPreviewElementWatch(){
    if(!this.init()){
      
      var self = this;
      addMultipleEventListeners(self.textareaElement, ['input', 'change', 'keyup', 'keydown', 'keypress'], function(){
        self.updatePreview();
      });

      addMultipleEventListeners(self.textareaElement, ['focus', 'blur'], function(){
        self.toggle();
      }); 

    }
  },

  destroy: function elpmisPreviewElementDestroy(){
    if(!this.init()) this.domElement.remove();
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
      previewElements = [],

      //List the format bars elements linked to each textarea elements
      formatBars = [];

  //Check if the options parameter was given
  if(typeof op === 'object' && op !== null){

    //Iterates over the options default keys to check if it was given in the options parameter
    Object.keys(optionsDefault).forEach(function optionsIterator(option){
      if(op.hasOwnProperty(option)){
        options[option] = op[option];
      } else {
        options[option] = optionsDefault[option];
      }
    });
  } else options = optionsDefault; 

  /**
   * Create a customComponent object then add this to the custom components array and to the Elpmis bar
   *
   * @param {Object} config - properties: {string} name, {string} element, {string} class, {string} type
   */
  function addCustomComponent(config){

    //Only creates the element if it was not already initated
    if(!status){
    
      config = typeof config === 'object' ? config : {};
      var customComponent = Object.create(ElpmisCustomComponent);
      customComponent.init(config, options.types);
      
      if(customComponent) customComponents.push(customComponent);
    
    } else {
      if(!options.silentMode){
        throw newElpmisException(2);
      } else {
        var ex = newElpmisException(2);
        console.error(ex.toString());
      }
    }
  }    

  /**
   * Listen for keyboard events to add HTML elements to textarea value
   *
   * @param {object} event
   */
  function elementKeyPress(event){  
    var key = event.which || event.keyCode,
        shift = event.shiftKey;

    //Enter key = paragraph
    if(options.blocks.indexOf('p') > -1){
      
      if(key === 13 && !shift){
        event.preventDefault();
        addHTMLElement(this, {
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
        addHTMLElement(this, {
          element: 'br',
          newLineAfter: true,
          close: false
        });
      }
    }
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

      //string|boolean - ID of element contains href
      config.href = config.href || '#';

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
        newValue += config.element === 'a' ?  '<' + config.element + ' href="' + document.getElementById(config.href).value + '">' : '<' + config.element + '>';
        newValue += elValue.substring(selectionStart, selectionEnd);

        newSelection = newValue.length;
        
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

      element.focus();
      element.value = newValue;
      element.selectionStart = element.selectionEnd = newSelection;

      if(options.previewMode) previewElements[element.elpmisId].updatePreview();
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
    previewElements[elpmisId].addToDOM();
    previewElements[elpmisId].watch();
    previewElements[elpmisId].updatePreview();
  }

  /**
   * Remove a preview element of DOM
   *
   * @param {string} element
   */
  function removePreviewElement(element){
    var elpmisId = element.elpmisId;
    previewElements[elpmisId].destroy();
  }

  /**
   * Add a format bar to DOM, linked to textarea element
   *
   * @param {string} element
   */
  function addFormatBar(element){ 
    var elpmisId = element.elpmisId;
    formatBars[elpmisId] = Object.create(ElpmisFormatBar);
    if(formatBars[elpmisId].init(element, {
      types         : options.types,
      basic         : options.basic, 
      header        : options.header, 
      blocks        : options.blocks,
      special       : options.special,
      css           : options.css,
      hyperlink     : options.hyperlink,
      addHTMLElement: addHTMLElement
    })){
      formatBars[elpmisId].addBlocks();
      formatBars[elpmisId].addToDOM();
    }
    
  }

  /**
   * Remove a format element of DOM
   *
   * @param {string} element
   */
  function removeFormatBar(element){
    var elpmisId = element.elpmisId;
    formatBars[elpmisId].destroy();
  }
  
  /**
   * Inits the functions, so the textarea will be ready to use
   *
   * @param {string} element
   */
  function init(element){
    if(!status){
      status = true;

      if(options.keyListen) element.addEventListener('keypress', elementKeyPress);

      if(options.previewMode) addPreviewElement(element);

      addFormatBar(element);
    }
  }

  /**
   * Inits all the textarea elements
   */
  function initAll(){
    elements.forEach(init);
  }

  /**
   * Destroy (or pause) all the textarea elements (removes bar, preview elements, event listeners etc)
   * With initi/initAll the element returns with all functions
   */
  function destroy(){
    elements.forEach(function destroyIterator(element){
      if(options.keyListen) element.removeEventListener('keypress', elementKeyPress);
      if(options.previewMode) removePreviewElement(element);
    });
    status = false;
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

    //Set elpmisId property to each textarea element for control
    elements.forEach(function elementsIdIterator(element, index){
      element.elpmisId = index + 1;
    });

    if(options.autoInit) initAll();

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
      var ex = newElpmisException(1, [elSelector]);
      console.error(ex.toString());
    }
  }

};

global.ElpmisEditor = ElpmisEditor;

})(window, document);