document.addEventListener("DOMContentLoaded", () => { 
  
  Kaanjo.socket.on_open = function(data) {
    console.log(`Connection established: ${data.connection_id}`)
    setTimeout(() => { 
      Kaanjo.init()
    },500);
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
          Kaanjo.request('customer.impress', {
            device: detectBrowser(navigator.userAgent).name
          },(success) => {console.log('Recorded impression')})
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
      Kaanjo.customer.id = Kaanjo.cookies.get('kaanjo_cid');
      if(!Kaanjo.customer.id) {
        Kaanjo.request( 'customer.create', {}, 
          (success) => { 
            Kaanjo.customer.id = success.sid;
            Kaanjo.cookies.set('kaanjo_cid', success.sid);
            console.log(`Created customer with ID: ${success.sid}`)
            cb();
          }, 
          (fail) => { console.log(`Failed to create customer: ${fail.error}`); }
        );
      } else {
        Kaanjo.request( 'customer.find', {
          id: Kaanjo.customer.id
        },
        (success) => {
          console.log(`Found & initialized cookie for customer: ${Kaanjo.customer.id}`)
          cb()
        },
        (fail) => {
          console.log(`Failed to initialize customer: ${Kaanjo.customer.id}`)
        })
      }
    }
  },

  product: {
    init(cb) {
      Kaanjo.request( 'product.find', {
        product: Kaanjo.attributes.product,
        url: window.location.href
      }, 
        (success) => {
          Kaanjo.product.data = success.data;
          if(success.created) {
            console.log(`Created product: ${Kaanjo.attributes.product}`)
          } else {
            console.log(`Found product: ${Kaanjo.attributes.product}`)
          }
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

  //socket: new WebSocketRails('kaanjo.com/websocket'),
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
