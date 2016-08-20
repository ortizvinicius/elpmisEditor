var ElpmisPreviewElement = {

  /**
   * @param {HTMLElement} textareaElement
   */
  init: function initFn(textareaElement){

    this.textareaElement = textareaElement;
    this.domElement = document.createElement('div');

    this.domElement.classList.add('elpmisPreviewElement');
    this.domElement.classList.add('active');
    this.domElement.id = 'elpmisPreviewElement' + this.textareaElement.elpmisId;
  },

  //Update the content according to textarea value
  updatePreview: function updatePreview(){
    this.domElement.innerHTML = this.textareaElement.value;
  },

  //Add the preview element to DOM, just before the textarea element
  addToDOM: function addToDOM(){
    document.body.insertBefore(this.domElement, this.textareaElement);
  },

  //Watchs for changes in textarea element value
  watch: function watch(){
    var self = this;
    addMultipleEventListeners(self.textareaElement, ['input', 'change', 'keyup', 'keydown', 'keypress'], function(){
      self.updatePreview();
    });
  }

};

