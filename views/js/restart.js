function resetChain() {
    if(confirm('Are you sure you want to reset the program and delete all previous images?')) {
        const caption = document.getElementById('firstCaption').value
        const data = {
            name: caption,
            reset: "true"
        }
        $.ajax({
            type: 'POST',
            url: 'https://inspirations-trace.herokuapp.com/api/caption',
            data: data,
            success: (id) => {
                console.log('It worked!')
                sessionStorage.setItem('last_id', id)
                window.location.href = 'index.html'
            },
            error: (error) => {
                console.log(error)
            }
        })
    }
}