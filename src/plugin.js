document.addEventListener("DOMContentLoaded", () => { 
  
  Reactions.socket.on_open = function(data) {
    console.log('Connection has been established: ', data);
    Reactions.init();
  }

});

const Reactions = {

  init() {
    
    let hook = document.getElementById("reactions");

    if(Reactions.valid(hook))
      return false;

    Reactions.customer.init(() => {
      Reactions.product.init();
    });

    

  },

  customer: {
    init(cb) {
      //Reactions.customer.id = Reactions.cookies.get('reactions_sid');
      Reactions.customer.id = false;
      if(!Reactions.customer.id) {
        Reactions.request( 'customer.create', {}, 
          (success) => { 
            Reactions.customer.id = success.sid;
            Reactions.cookies.set('reactions_sid', success.sid);
            cb();
          }, 
          (fail) => { console.log(`Failed to create customer: ${fail.error}`); }
        );
      } else {
        cb();
      }
    }
  },

  product: {
    init(cb) {
      Reactions.request( 'product.find', {}, 
        (success) => { 
          cb();
        }, 
        (fail) => { console.log(`Failed to find product: ${fail.error}`); }
      );
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
  request(action,data,success,fail) {
    Reactions.socket.trigger(action,data,success,fail);
  },

  valid(hook) {

    let is_valid = true;

    if(hook.length < 1) {
      is_valid = false;
    } else {
      for(const attribute of Reactions.attributes.required) {
        if(!hook.hasAttribute(attribute)) {
          console.error(`Reactions error: You are missing the '${attribute}' attribute in your HTML.`);
          is_valid = false;
        }
      }
    }

    return is_valid;

  },

  attributes: {
    required: ['data-productID'],
    values: {}
  }

}
