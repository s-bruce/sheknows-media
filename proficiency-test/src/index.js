document.addEventListener('DOMContentLoaded', function(){
  // Get timestamp
  let date = new Date()

  // Get the page title
  let title = document.title

  // Get the hostname
  let hostname = window.location.hostname

  // Whether tag was invoked inside a frame
  function inIframe () {
    try {
      if (window.self !== window.top){
        return "Yes"
      } else {
        return "No"
      }
    } catch (e) {
      return "Yes"
    }
  }

  let frame = inIframe()

  // Get client IP
  function getUserIP(onNewIP) {
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
    var pc = new myPeerConnection({
      iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key

    function iterateIP(ip) {
      if (!localIPs[ip]) onNewIP(ip)
      localIPs[ip] = true
    }

    //create a bogus data channel
    pc.createDataChannel("")

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
      sdp.sdp.split('\n').forEach(function(line) {
        if (line.indexOf('candidate') < 0) return
        line.match(ipRegex).forEach(iterateIP)
      })

      pc.setLocalDescription(sdp, noop, noop)
    }).catch(function(reason) {
       
    })

    //listen for candidate events
    pc.onicecandidate = function(ice) {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
    }
  }

  getUserIP(function(ip){
    let remoteip = ip

    let params = "inventory={" + "date=" + date + "&title=" + title + "&hostname=" + hostname + "&frame=" + frame + "&remoteip=" + remoteip + "}"

    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", "http://localhost:3000/inventories", true)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    // I wasn't able to properly format the params on the frontend, so we're getting back a 500 error
    xhttp.send(params)
  })

  // The order that the tag was invoked on the page: I was not able to get this working

}, false)
