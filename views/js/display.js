window.addEventListener('load', () => {
    let latest;
    $.ajax({
            type: 'GET',
            url: 'https://inspirations-trace.herokuapp.com/api/latest',
            success: (data) => {
                const theSource = JSON.parse(data)
                let latest = theSource[0]
                console.log(latest)
                if (latest.nextImage == null) {
                    
                } 
                else {
            }
        }
    })
})

const text = "You look at your plate and your chicken's slowly rotting into something that looks like cheese"
const image = "banana.jpg"
let theArray = []
const source = {
    id: 0,
    name: text,
    nextImage: image,
    base64: "./images/banana.jpg"

}
function generateContent() {
    for (let i = 0; i < 40; i++) {
        let insert = source;
        insert.id = i;
        theArray.push(insert);
    }
    let index = theArray.length - 1;
    theArray[index].nextImage = null;
    const theGrid = document.getElementById('grid')
    for (let i = 0; i < 23; i++) {
        
        if(theArray[index].nextImage !== null) {
            const imageDiv = document.createElement('div')
            imageDiv.className = "image"
            const imageTag = document.createElement('img')
            imageTag.src = theArray[index].base64
            imageDiv.appendChild(imageTag)
            theGrid.appendChild(imageDiv)
        }
        const wordDiv = document.createElement('div')
        wordDiv.className = "text"
        wordDiv.innerText = theArray[index].name
        theGrid.appendChild(wordDiv)
        index--;
    }
}


//const b64image = 'data:image/png;base64,' + latest.base64