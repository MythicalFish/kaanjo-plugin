document.addEventListener("DOMContentLoaded", () => { 
  
  Kaanjo.socket.on_open = function(data) {
    console.log(`Connection established: ${data.connection_id}`)
    Kaanjo.init()
  }

});

const Kaanjo = {

  init() {
    
    let hook = document.getElementById("kaanjo");

    if(!Kaanjo.valid(hook))
      return false

    for(const attribute in Kaanjo.attributes) {
      Kaanjo.attributes[attribute] = hook.getAttribute(`data-${attribute}`);
    }

    Kaanjo.webmaster.init(() => {
      Kaanjo.customer.init(() => {
        Kaanjo.product.init(() => {

        })
      })
    })
    

  },

  webmaster: {
    init(cb) {
      Kaanjo.request( 'webmaster.find', 
        {
          key: Kaanjo.attributes['key']
        }, 
        (success) => { 
          console.log(`Found webmaster`)
          cb();
        }, 
        (fail) => { console.log(`Failed to find webmaster`); }
      );
    }
  },

  customer: {
    init(cb) {
      Kaanjo.customer.id = Kaanjo.cookies.get('reactions_sid');
      if(!Kaanjo.customer.id) {
        Kaanjo.request( 'customer.create', {}, 
          (success) => { 
            Kaanjo.customer.id = success.sid;
            Kaanjo.cookies.set('reactions_sid', success.sid);
            console.log(`Created customer with ID: ${success.id}`)
            cb();
          }, 
          (fail) => { console.log(`Failed to create customer: ${fail.error}`); }
        );
      } else {
        console.log(`Found cookie for customer: ${Kaanjo.customer.id}`)
        cb();
      }
    }
  },

  product: {
    init(cb) {
      Kaanjo.request( 'product.find', {
        product: Kaanjo.attributes.product,
        customer_id: Kaanjo.customer.id
      }, 
        (success) => {
          Kaanjo.product.data = success.data;
          console.log(`Found product: ${Kaanjo.attributes.product}`)
          cb();
        }, 
        (fail) => { console.log(`Failed to find product: ${Kaanjo.attributes.product}`) }
      );
    }
  },

  ui: {
    render() {
      return '<button type="button" onclick="Kaanjo.send(\'Reaction 1\');">Reaction 1</button> &nbsp; <button type="button" onclick="Kaanjo.send(\'Reaction 2\');">Reaction 2</button>';
    }
  },

  cookies: Cookies.noConflict(),

  track: {
    impression() {

    }
  },
  socket: new WebSocketRails('localhost:3000/websocket'),
  request(action,data,success,fail) {
    Kaanjo.socket.trigger(action,data,success,fail)
  },

  valid(hook) {

    let is_valid = true;

    if(hook == null) {
      is_valid = false;

    } else {

      for(const attribute in Kaanjo.attributes) {

        if(!hook.hasAttribute(`data-${attribute}`)) {
          console.error(`Kaanjo error: You are missing the '${attribute}' attribute in your HTML.`)
          is_valid = false;
        } 

      }
    }

    return is_valid;

  },

  attributes: {
    key: null,
    product: null
  }

}
