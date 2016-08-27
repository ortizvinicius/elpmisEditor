var ElpmisCustomComponent = {

  customComponentsLength: 0,

  init: function elpmisCustomComponentInit(config, types){
      
    if(typeof config === 'object' && config !== null){

      this.id = ++ElpmisCustomComponent.customComponentsLength;

      //{string}
      this.name = config.name || 'customComponent' + this.id;

      //{string} HTML element
      this.element = config.element || 'span';

      //{string} CSS class
      this.class = config.class || 'customClass' + this.id; 

      //{string} - Test if the type given is in the types array
      this.type = types.indexOf(config.type) > -1 ? config.type : 'special';

      this.init = function(){ return false; };
    }
  }

};