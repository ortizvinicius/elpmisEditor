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

    this.init = function(){ return false; };
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

