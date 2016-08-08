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
          },(success) => {
            console.log(success.msg)
          })
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
          console.log(success.msg)
          cb();
        }, 
        (fail) => { console.log(fail.msg); }
      );
    }
  },

  customer: {
    init(cb) {
      
      params = { id: null }

      Kaanjo.customer.id = Kaanjo.cookies.get('kaanjo_cid')
      if(Kaanjo.customer.id) {
        params.id = Kaanjo.customer.id
      }

      Kaanjo.request( 'customer.find', params,
      (success) => {
        Kaanjo.cookies.set('kaanjo_cid', success.sid);
        Kaanjo.customer.id = success.sid;
        console.log(success.msg)
        cb()
      },
      (fail) => {
        console.log(fail.msg)
      })

    }
  },

  product: {
    init(cb) {
      Kaanjo.request( 'product.find', {
        product: Kaanjo.attributes.product,
        url: window.location.href
      }, 
        (success) => {
          Kaanjo.product.data = success.data
          console.log(success.msg)
          cb();
        }, 
        (fail) => { console.log(fail.msg) }
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

function cl(msg) {
  console.log(msg)
}
