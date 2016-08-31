var ElpmisPreviewElement = {

  pinStatus: false,
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
    if(!this.init() && !this.pinStatus){
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
  }

};

