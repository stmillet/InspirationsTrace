//First thing call to see if the latest has a nextImage name or not. 
window.addEventListener('load', () => {
    let latest;
    $.ajax({
            type: 'GET',
            url: 'https://inspirations-trace.herokuapp.com/api/latest',
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
    const el = document.getElementById("canvas");
    el.height = window.innerHeight - 300;
    el.width = window.innerWidth - 182;
    let ctx = el.getContext('2d')
    ctx.fillStyle = start_background_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("touchmove", handleMove, false);
  }
  
  document.addEventListener("DOMContentLoaded", startup);
  var ongoingTouches = [];
  let start_background_color = 'white';


  function handleStart(evt) {
    evt.preventDefault();
    console.log("touchstart.");
    var el = document.getElementById("canvas");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
  
    for (var i = 0; i < touches.length; i++) {
      console.log("touchstart:" + i + "...");
      ongoingTouches.push(copyTouch(touches[i]));
      var color = colorForTouch(touches[i]);
      ctx.beginPath();
      ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
      ctx.fillStyle = color;
      ctx.fill();
      console.log("touchstart:" + i + ".");
    }
  }

  function handleMove(evt) {
    evt.preventDefault();
    var el = document.getElementById("canvas");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
  
    for (var i = 0; i < touches.length; i++) {
      var color = colorForTouch(touches[i]);
      var idx = ongoingTouchIndexById(touches[i].identifier);
  
      if (idx >= 0) {
        console.log("continuing touch "+idx);
        ctx.beginPath();
        console.log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
        ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.stroke();
  
        ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        console.log(".");
      } else {
        console.log("can't figure out which touch to continue");
      }
    }
  }

  function handleEnd(evt) {
    evt.preventDefault();
    log("touchend");
    var el = document.getElementById("canvas");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
  
    for (var i = 0; i < touches.length; i++) {
      var color = colorForTouch(touches[i]);
      var idx = ongoingTouchIndexById(touches[i].identifier);
  
      if (idx >= 0) {
        ctx.lineWidth = 4;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
        ongoingTouches.splice(idx, 1);  // remove it; we're done
      } else {
        console.log("can't figure out which touch to end");
      }
    }
  }

  function colorForTouch(touch) {
    var r = touch.identifier % 16;
    var g = Math.floor(touch.identifier / 3) % 16;
    var b = Math.floor(touch.identifier / 7) % 16;
    r = r.toString(16); // make it a hex digit
    g = g.toString(16); // make it a hex digit
    b = b.toString(16); // make it a hex digit
    var color = "#" + r + g + b;
    console.log("color for touch with identifier " + touch.identifier + " = " + color);
    return color;
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

  function log(msg) {
    
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

//Resizing
// canvas.height = window.innerHeight - 300;
// canvas.width = window.innerWidth - 182;
// ctx.strokeStyle = "#222222";
// ctx.lineWidth = 10;
// ctx.lineCap = 'round';
// ctx.lineJoin = "round"


//Variables
// let start_background_color = 'white';
// ctx.fillStyle = start_background_color;
// ctx.fillRect(0, 0, canvas.width, canvas.height)

// let painting = false;
// let mousePos = {x: 0, y: 0}
// let lastPos = mousePos;
// let restore_array = [];
// let index = -1;



// function startPosition(e) {
//     console.log('started')
//     painting = true;
//     ctx.beginPath()
//     ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
//     event.preventDefault()
// }

// function finishedPosition(e) {
//     console.log('finished')
//     if (painting) {
//         ctx.stroke()
//         ctx.closePath()
//         painting = false;
//         ctx.beginPath();
//         if (e.type != 'mouseout') {
//             restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
//             index += 1
//             console.log(restore_array)
//         }
//     }
//     event.preventDefault()
// }

// function draw(e) {
    
//     if (painting) {
//         console.log('drawing')
//         ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
//         ctx.stroke()
//     }
//     event.preventDefault()
// }
// //EventListeners
// canvas.addEventListener('touchstart', startPosition, false)
// canvas.addEventListener('touchmove', draw, false)
// canvas.addEventListener('touchend', finishedPosition)
// canvas.addEventListener('mousedown', startPosition)
// canvas.addEventListener('mousemove', draw)
// canvas.addEventListener('mouseup', finishedPosition)



function clear_canvas() {
    ctx.fillStyle = start_background_color
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    restore_array = []
    index = -1
}

function undo_last() {
    if (index <= 0) {
        clear_canvas()
    } else {
        index -= 1;
        restore_array.pop();
        ctx.putImageData(restore_array[index], 0, 0)
    }

}

function save_image() {
    if (index !== -1) {
        var dataUrl = canvas.toDataURL('image/png')
        $.ajax({
            type: 'POST',
            url: 'https://inspirations-trace.herokuapp.com/api/image',
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
                url: 'https://inspirations-trace.herokuapp.com/api/caption',
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