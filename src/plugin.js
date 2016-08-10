const Kaanjo = {

  socket: new WebSocketRails('localhost:3000/websocket'),
  //socket: new WebSocketRails('kaanjo.co/websocket'),

  init() {
    
    Kaanjo.hook = document.getElementById("kaanjo")

    if(!Kaanjo.valid(Kaanjo.hook))
      return false

    for(const attribute in Kaanjo.attributes) {
      Kaanjo.attributes[attribute] = Kaanjo.hook.getAttribute(`data-${attribute}`)
    }

    Kaanjo.request( 'init', 
      {
        wid:    Kaanjo.attributes['key'],
        cid:    Kaanjo.cookies.get('kaanjo_cid'),
        pid:    Kaanjo.attributes.product,
        url:    window.location.href,
        device: detectBrowser(navigator.userAgent).name
      }, 
      (success) => {
        console.log(success.msg)
        if(success.cid)
          Kaanjo.cookies.set('kaanjo_cid', success.cid)
        Kaanjo.get_html()
      }, 
      (fail) => { console.log(fail.msg) }
    )   

  },

  get_html() {
    Kaanjo.request('html',{},
    (html) => {
      Kaanjo.hook.innerHTML = html.msg
    })
  },

  cookies: Cookies.noConflict(),

  request(action,data,success,fail) {
    Kaanjo.socket.trigger(action,data,success,fail)
  },

  react(reaction_id) {
    Kaanjo.request('react',{
      id: reaction_id
    },
    (success) => {
      console.log(success.msg)
    },
    (fail) => {
      console.log(fail.msg)
    })
  },

  valid(hook) {

    let is_valid = true

    if(hook == null) {
      is_valid = false

    } else {

      for(const attribute in Kaanjo.attributes) {

        if(!hook.hasAttribute(`data-${attribute}`)) {
          console.error(`Kaanjo: You are missing the '${attribute}' attribute in your HTML.`)
          is_valid = false
        } 

      }
    }

    return is_valid

  },

  attributes: {
    key: null,
    product: null
  }

}

Kaanjo.socket.on_open = function(data) {
  console.log(`Connection established: ${data.connection_id}`)
  setTimeout(() => { 
    Kaanjo.init()
  },500)
}
