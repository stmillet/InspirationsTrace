//First thing call to see if the latest has a nextImage name or not. 
window.addEventListener('load', () => {
    let latest;
    $.ajax({
            type: 'GET',
            url: 'http://localhost:5500/api/latest',
            success: (data) => {
                latest = JSON.parse(data)[0]
                console.log(latest)
                if (latest.nextImage == null) {
                    document.getElementById('caption').innerText = latest.name
                    document.getElementById('createCanvas').style.display = "block"
                } 
                else {
                    const b64image = 'data:image/png;base64,' + latest.base64
                    document.getElementById("latestImage").src = b64image
                    document.getElementById('createCaption').style.display = "block"
            }
        }
    })
})

function startup() {
    var el = document.getElementById("canvas");
      el.height = window.innerHeight - 300;
      el.width = window.innerWidth - 182;
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("touchmove", handleMove, false);
  }
  
  document.addEventListener("DOMContentLoaded", startup);
  var ongoingTouches = [];
  var index = -1
  var restore_array = []
  
  function handleStart(evt) {
    evt.preventDefault();
    var el = document.getElementById("canvas");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
  
    for (var i = 0; i < touches.length; i++) {
      ongoingTouches.push(copyTouch(touches[i]));
    }
  }
  
  function handleMove(evt) {
    evt.preventDefault();
    var el = document.getElementById("canvas");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
  
    for (var i = 0; i < touches.length; i++) {
      var idx = ongoingTouchIndexById(touches[i].identifier);
  
      if (idx >= 0) {
        ctx.beginPath();
        ctx.moveTo(ongoingTouches[idx].pageX - el.offsetLeft, ongoingTouches[idx].pageY - el.offsetTop - 272);
        ctx.lineTo(touches[i].pageX - el.offsetLeft, touches[i].pageY - el.offsetTop - 272);
        ctx.lineWidth = 10;
        ctx.lineCap = 'round'
        ctx.stroke();
        ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
      } else {
        console.log("can't figure out which touch to continue");
      }
    }
  }
  
  function handleEnd(evt) {
    evt.preventDefault();
    var el = document.getElementById("canvas");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
  
    for (var i = 0; i < touches.length; i++) {
      var idx = ongoingTouchIndexById(touches[i].identifier);
  
      if (idx >= 0) {
        ongoingTouches.splice(idx, 1);
        restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
        index += 1
      } else {
        console.log("can't figure out which touch to end");
      }
    }
  }
  
  function handleCancel(evt) {
    evt.preventDefault();
    console.log("touchcancel.");
    var touches = evt.changedTouches;
  
    for (var i = 0; i < touches.length; i++) {
      var idx = ongoingTouchIndexById(touches[i].identifier);
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
  }
  
  function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
  }
  
  function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
      var id = ongoingTouches[i].identifier;
  
      if (id == idToFind) {
        return i;
      }
    }
    return -1;    // not found
  }
  
  function clear_canvas() {
      const el = document.getElementById('canvas')
      el.width = el.width
  
      restore_array = []
      index = -1
  }
  
  function undo_last() {
      const el = document.getElementById('canvas')
      const ctx = el.getContext('2d')
      if (index <= 0) {
          clear_canvas()
      } else {
          index -= 1;
          restore_array.pop();
          ctx.putImageData(restore_array[index], 0, 0)
          console.log("put the data")
      }
  
  }

function save_image() {
    if (index !== -1) {
        var dataUrl = canvas.toDataURL('image/png')
        $.ajax({
            type: 'POST',
            url: 'http://localhost:5500/api/image',
            data: encodeURIComponent(dataUrl)
        });
        document.location.reload(true);
    }
    else {
        alert('The drawing is empty. Plese draw something before submitting.')
    }
    
}

function save_caption() {
    const caption = document.getElementById('nextCaption').value;
    if (caption !== "") {

        const data = {name: caption}
        $.ajax({
                type: 'POST',
                url: 'http://localhost:5500/api/caption',
                data: data,
                success: (id) => {
                    console.log('It worked!')
                    sessionStorage.setItem('last_id', id)
                    document.location.reload(true);
                },
                error: (error) => {
                    console.log(error);
                }
            })
    }
    else {
        alert("Caption cannot be empty.")
    }
}

function updateCount(value) {
    console.log(value.length);
    document.getElementById("wordCounter").innerText = `${value.length}/100`
}
//window.addEventListener('resize', call function above)