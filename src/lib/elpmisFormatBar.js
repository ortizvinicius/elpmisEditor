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
    this.domElement.classList.toggle('inactive');
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

      				this.config.basic[tag].innerHTML = '<strong>S</strong>';
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

            } else if(tag === 'mark'){

              //FALTA ISSO

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

      if(this.config.hasOwnProperty('special') && typeof this.config.special === 'object'){

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

    }
  }

};