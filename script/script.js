function getTemplate(TId) {
    if (!window.templates) {
        window.templates = {}
    }

    if (!window.templates[TId]) {
        window.templates[TId] = document.querySelector(`template#${TId}`).content
    }
    return document.importNode(window.templates[TId], true)
}




window.addEventListener('load', (event) => {
    document.querySelectorAll(".dz-button").forEach((element, index) => {
        if(index == 0){
            element.innerHTML = 'Drop Student\'s File'
        }else{
            element.innerHTML = 'Drop Teacher\'s File'
        }
    });
});