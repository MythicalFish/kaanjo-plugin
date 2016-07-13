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
    initialize() {
      let i = Reactions.cookies.get('reaction_customer_id');
      if(!i) {
        i = 'getnew()';
        Reactions.cookies.set('reaction_customer_id', i);
      }
      Reactions.customer.id = i;
    },
    createID() {
      Reactions.ajaxGet('http://trippyporn.com/videos/dildo-fun.json')
        .then(JSON.parse)
        .then((r) => { console.log(r); })
        .catch(function(error) { console.log(error) });
    }
  },

  ui: {
    render() {
      return '<button type="button" onclick="Reactions.send(\'Reaction 1\');">Reaction 1</button> &nbsp; <button type="button" onclick="Reactions.send(\'Reaction 2\');">Reaction 2</button>';
    }
  },

  send(reaction) {
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
    impression() {

    }
  },

  ajaxGet(url) {
    return new Promise(function(resolve, reject) {
      let req = new XMLHttpRequest();
      req.open("GET", url);
      req.onload = function() {
        if (req.status === 200) {
            resolve(req.response);
        } else {
            reject(new Error(req.statusText));
        }
      };

      req.onerror = function() {
        reject(new Error("Network error"));
      };

      req.send();
    });
  }

}
