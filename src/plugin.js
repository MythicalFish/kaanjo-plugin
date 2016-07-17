document.addEventListener("DOMContentLoaded", () => { 
  
  Reactions.socket.on_open = function(data) {
    console.log('Connection has been established: ', data);
    Reactions.init();
  }

});

const Reactions = {

  init() {
    
    let hook = document.getElementById("reactions");

    if(!Reactions.valid(hook))
      return false;

    for(const attribute in Reactions.attributes) {
      Reactions.attributes[attribute] = hook.getAttribute(`data-${attribute}`);
    }

    Reactions.webmaster.init(() => {
      Reactions.customer.init(() => {
        Reactions.product.init(() => {

        });
      });
    });
    

  },

  webmaster: {
    init(cb) {
      Reactions.request( 'webmaster.find', 
        {
          website: window.location.host 
        }, 
        (success) => { 
          console.log(`Found webmaster for: ${window.location.host}`)
          cb();
        }, 
        (fail) => { console.log(`Failed to find webmaster for current host: ${window.location.host}`); }
      );
    }
  },

  customer: {
    init(cb) {
      Reactions.customer.id = Reactions.cookies.get('reactions_sid');
      if(!Reactions.customer.id) {
        Reactions.request( 'customer.create', {}, 
          (success) => { 
            Reactions.customer.id = success.sid;
            Reactions.cookies.set('reactions_sid', success.sid);
            console.log(`Created customer with ID: ${success.id}`)
            cb();
          }, 
          (fail) => { console.log(`Failed to create customer: ${fail.error}`); }
        );
      } else {
        console.log(`Found cookie for customer: ${Reactions.customer.id}`)
        cb();
      }
    }
  },

  product: {
    init(cb) {
      Reactions.request( 'product.find', {
        product_name: Reactions.attributes.name,
        customer_id: Reactions.customer.id
      }, 
        (success) => {
          Reactions.product.data = success.data;
          console.log(`Found product: ${Reactions.attributes.name}`);
          console.log(success.data);
          cb();
        }, 
        (fail) => { console.log(`Failed to find product: ${Reactions.attributes.name}`); }
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

      for(const attribute in Reactions.attributes) {

        if(!hook.hasAttribute(`data-${attribute}`)) {
          console.error(`Reactions error: You are missing the '${attribute}' attribute in your HTML.`);
          is_valid = false;
        } 

      }
    }

    return is_valid;

  },

  attributes: {
    name: null
  }

}
