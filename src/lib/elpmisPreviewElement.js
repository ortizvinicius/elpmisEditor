/**
 * Construct an ElpmisPreviewElement object
 *
 * @param {HTMLElement} textareaElement
 */
var ElpmisPreviewElement = function elpmisPreviewElement(textareaElement){
    
  var domElement = document.createElement('div');
  var self = this;

  domElement.classList.add('elpmisPreviewElement');
  domElement.classList.add('active');
  domElement.id = 'elpmisPreviewElement' + textareaElement.elpmisId;
  
  //TOOGLE BUTTON and METHOD

  //Update the content according to textarea value
  this.updatePreview = function updatePreview(){
    domElement.innerHTML = textareaElement.value;
  };

  //Add the preview element to DOM, just before the textarea element
  this.addToDOM = function addToDOM(){
    document.body.insertBefore(domElement, textareaElement);
  };

  //Watchs for changes in textarea element value
  this.watch = function watch(){
    addMultipleEventListeners(textareaElement, ['input', 'change', 'keyup', 'keydown', 'keypress'], function(){
      self.updatePreview();
    });
  };

  this.updatePreview();

};