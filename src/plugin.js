

//Kaanjo.socket = new WebSocketRails('localhost:3000/websocket'),
Kaanjo.socket = new WebSocketRails('dashboard.kaanjo.co/websocket'),

Kaanjo.init = function() {

  Kaanjo.container = document.getElementById("kaanjo")

  if(!Kaanjo.valid(Kaanjo.container))
    return false

  for(const attribute in Kaanjo.attributes) {
    Kaanjo.attributes[attribute] = Kaanjo.container.getAttribute(`data-${attribute}`)
  }

  Kaanjo.request( 'init',
    {
      campaign_id:   Kaanjo.cid,
      webmaster_sid: Kaanjo.attributes.key,
      product_name:  Kaanjo.attributes.name,
      product_sid:   Kaanjo.attributes.id,
      customer_sid:  Kaanjo.cookies.get('kaanjo_cid'),
      url:           window.location.href,
      device:        detectBrowser(navigator.userAgent).name
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

}

Kaanjo.react = function(reaction_id) {
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
}

Kaanjo.select = function(id) {
  let buttons = document.getElementsByClassName('kaanjo-reaction')
  for(let button of buttons) {
    button.classList.add('kaanjo-unselected')
  }
  e = document.getElementById(`kaanjo-reaction${id}`)
  e.classList.remove('kaanjo-unselected')
  Kaanjo.render_status()
}

Kaanjo.render_buttons = function() {
  Kaanjo.request('get_buttons',{},
  (html) => {
    Kaanjo.container.innerHTML = html
  })
}

Kaanjo.render_status = function() {
  Kaanjo.request('get_status',{},
  (html) => {
    document.getElementById('kaanjo-status').innerHTML = html
  })
}

Kaanjo.cookies = Cookies.noConflict();

Kaanjo.request = function(action,data,success,fail) {
  Kaanjo.socket.trigger(action,data,success,fail)
}

Kaanjo.valid = function(hook) {

  let is_valid = true

  if(hook == null) {
    is_valid = false

  } else {

    for(const attribute in Kaanjo.attributes) {

      if(!hook.hasAttribute(`data-${attribute}`) && attribute !== 'id') {
        console.error(`Kaanjo: You are missing the '${attribute}' attribute in your HTML.`)
        is_valid = false
      }

    }
  }

  return is_valid

}

Kaanjo.attributes = {
  key: null,
  name: null,
  id: null
}

Kaanjo.log = function(msg) {
  if(msg) console.log(msg)
}

Kaanjo.socket.on_open = function(data) {
  setTimeout(() => {
    Kaanjo.init()
  },500)
}
