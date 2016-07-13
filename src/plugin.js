document.addEventListener("DOMContentLoaded", function(event) { 
  
  var hook = document.getElementById("reactions");

  if(hook.length < 1)
    return;

  hook.innerHTML = Reactions.ui.render();

  Reactions.initialize();

  Reactions.track.impression();

});

var Reactions = {

  initialize: function() {
    Reactions.customer.initialize();
  },

  customer: {
    id: null,
    initialize: function() {
      i = Reactions.cookies.get('reaction_customer_id');
      if(!i) {
        i = 'getnew()';
        Reactions.cookies.set('reaction_customer_id', i);
      }
      Reactions.customer.id = i;
    },
    createID: function() {

    }
  },

  ui: {
    render: function() {
      return '<button type="button" onclick="Reactions.send(\'Reaction 1\');">Reaction 1</button> &nbsp; <button type="button" onclick="Reactions.send(\'Reaction 2\');">Reaction 2</button>';
    }
  },

  send: function(reaction) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', encodeURI('http://reactions-backend.vertaxe.com/create-reaction'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //xhr.onload = function() {
    //  console.log(xhr.status);
    //  console.log(xhr.responseText);
    //};
    xhr.send(encodeURI(`name=${reaction}&referrer=${window.location.hostname}`));
  },

  cookies: Cookies.noConflict(),

  track: {
    impression: function() {

    }
  }

}
