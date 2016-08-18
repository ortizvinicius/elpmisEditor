function addMultipleEventListeners(element, events, eventFunction){
  events.forEach(function(event){
    element.addEventListener(event, eventFunction);
  });
}