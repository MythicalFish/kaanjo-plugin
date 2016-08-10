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
        wid:    Kaanjo.attributes.key,
        pid:    Kaanjo.attributes.product,
        cid:    Kaanjo.cookies.get('kaanjo_cid'),
        url:    window.location.href,
        device: detectBrowser(navigator.userAgent).name
      }, 
      (success) => {
        Kaanjo.log('Kaanjo initialized')
        Kaanjo.log(success.msg)
        if(success.cid)
          Kaanjo.cookies.set('kaanjo_cid', success.cid)
        Kaanjo.get_html()
      }, 
      (fail) => { Kaanjo.log(fail.msg) }
    )   

  },

  react(reaction_id) {
    Kaanjo.request('react',{
      id: reaction_id
    },
    (success) => {
      Kaanjo.log(success.msg)
      Kaanjo.select(reaction_id)
    },
    (fail) => {
      Kaanjo.log(fail.msg)
    })
  },

  select(id) {
    let buttons = document.getElementsByClassName('kaanjo-reaction')
    for(let button of buttons) {
      button.classList.remove('kaanjo-selected')
    }
    e = document.getElementById(`kaanjo-reaction${id}`)
    e.classList.add('kaanjo-selected')
  },

  get_html() {
    Kaanjo.request('html',{},
    (html) => {
      Kaanjo.hook.innerHTML = html
    })
  },

  cookies: Cookies.noConflict(),

  request(action,data,success,fail) {
    Kaanjo.socket.trigger(action,data,success,fail)
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
  },

  log(msg) {
    if(msg) console.log(msg)
  }

}

Kaanjo.socket.on_open = function(data) {
  setTimeout(() => { 
    Kaanjo.init()
  },500)
}
