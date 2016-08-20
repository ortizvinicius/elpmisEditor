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