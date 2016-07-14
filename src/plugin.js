document.addEventListener("DOMContentLoaded", function(event) { 
  
  var hook = document.getElementById("reactions");

  if(hook.length < 1)
    return;

  hook.innerHTML = Reactions.ui.render();

  Reactions.socket.on_open = function(data) {
  
    console.log('Connection has been established: ', data);
  
    Reactions.init();

    Reactions.track.impression();

  }

});

const Reactions = {

  init() {
    //Reactions.customer.init();

    Reactions.r = Reactions.do(
      'customer.create', {
        some: 'thing'
      }, 
      (r) => { // Success
        console.log(`success ${r}`);
      }, 
      (r) => { // Fail
        console.log(`fail ${r}`);
      }
    );

  },

  customer: {
    id: null,
    init() {
      let i = Reactions.cookies.get('reaction_sid');
      if(!i) {
        
        Reactions.cookies.set('reaction_sid', i);
      }
      Reactions.customer.id = i;
    }
  },

  ui: {
    render() {
      return '<button type="button" onclick="Reactions.send(\'Reaction 1\');">Reaction 1</button> &nbsp; <button type="button" onclick="Reactions.send(\'Reaction 2\');">Reaction 2</button>';
    }
  },

  cookies: Cookies.noConflict(),

  track: {
    impression() {

    }
  },
  socket: new WebSocketRails('localhost:3000/websocket'),
  do(action,data,success,fail) {
    Reactions.socket.trigger(action,data,success,fail);
  } 

}
