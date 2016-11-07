const Kaanjo = {

  socket: new WebSocketRails('localhost:3000/websocket'),
  //socket: new WebSocketRails('dashboard.kaanjo.co/websocket'),

  init() {
    
    Kaanjo.script_tag = document.getElementById("kaanjo")
    Kaanjo.container = document.getElementById("kaanjo-container")

    if(!Kaanjo.valid(Kaanjo.container))
      return false

    for(const attribute in Kaanjo.attributes) {
      Kaanjo.attributes[attribute] = Kaanjo.container.getAttribute(`data-${attribute}`)
    }

    Kaanjo.attributes.campaign_id = Kaanjo.script_tag.getAttribute('data-cid');

    Kaanjo.request( 'init', 
      {
        w_sid:  Kaanjo.attributes.key,
        w_cid:  Kaanjo.attributes.campaign_id,
        p_sid:  Kaanjo.attributes.product,
        c_sid:  Kaanjo.cookies.get('kaanjo_cid'),
        url:    window.location.href,
        device: detectBrowser(navigator.userAgent).name
      }, 
      (success) => {
        Kaanjo.log('Kaanjo initialized')
        if(success.msg)
          Kaanjo.log(success.msg)
        if(success.c_sid) {
          Kaanjo.cookies.set('kaanjo_cid', success.c_sid)
        }
        Kaanjo.render_buttons()
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
    Kaanjo.render_status()
  },

  render_buttons() {
    Kaanjo.request('get_buttons',{},
    (html) => {
      Kaanjo.container.innerHTML = html
    })
  },

  render_status() {
    Kaanjo.request('get_status',{},
    (html) => {
      document.getElementById('kaanjo-status').innerHTML = html
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
