/**
 * Construct an ElpmisCustomComponent object
 *
 * @param {object} config
 * @param {array of string} types - The main function options.types array
 */
var ElpmisCustomComponent = (function elpmisCustomComponentWrapper(){
  var customComponentsLength = 1;

  return function elpmisCustomComponent(config, types){
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
    }
  };
})();