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