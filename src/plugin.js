document.addEventListener("DOMContentLoaded", function(event) { 
  
  var hook = document.getElementByID("reactions");

  if(hook.length < 1)
    return;

  for(var i = hooks.length - 1; i >= 0; i--) {
    hooks[i].innerHTML = reactions.buttonHTML();
  }

  reactions.initialize();

  if

  reactions.track.impression();

});

var reactions = {
  initialize: function() {
    if
    reactions.customer.id
  },
  customer: {},
  buttonHTML: function() {
    return '<button type="button" onclick="reactions.send(\'Reaction 1\');">Reaction 1</button> &nbsp; <button type="button" onclick="reactions.send(\'Reaction 2\');">Reaction 2</button>';
  },
  send: function(reaction) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', encodeURI('http://reactions-backend.vertaxe.com/create-reaction'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      console.log(xhr.status);
      console.log(xhr.responseText);
    };
    xhr.send(encodeURI('name=' + reaction + '&referrer=' + window.location.hostname ));
  },
  cookie: Cookies.noConflict()
}
