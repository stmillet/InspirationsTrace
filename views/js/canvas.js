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

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

//Resizing
canvas.height = window.innerHeight - 300;
canvas.width = window.innerWidth - 182;


//Variables
let start_background_color = 'white';
ctx.fillStyle = start_background_color;
ctx.fillRect(0, 0, canvas.width, canvas.height)

let painting = false;
let restore_array = [];
let index = -1;

function startPosition(e) {
    console.log('started')
    painting = true;
    ctx.beginPath()
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
    event.preventDefault()
}

function finishedPosition(e) {
    console.log('finished')
    if (painting) {
        ctx.stroke()
        ctx.closePath()
        painting = false;
        ctx.beginPath();
        if (e.type != 'mouseout') {
            restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
            index += 1
            console.log(restore_array)
        }
    }
    event.preventDefault()
}

function draw(e) {
    
    if (painting) {
        console.log('drawing')
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = "round"
        ctx.stroke()
    }
    event.preventDefault()
}
//EventListeners
canvas.addEventListener('touchstart', startPosition, false)
canvas.addEventListener('touchmove', draw, false)
canvas.addEventListener('touchend', finishedPosition)
canvas.addEventListener('mousedown', startPosition)
canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', finishedPosition)



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