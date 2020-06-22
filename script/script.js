function getTemplate(TId) {
    if (!window.templates) {
        window.templates = {}
    }

    if (!window.templates[TId]) {
        window.templates[TId] = document.querySelector(`template#${TId}`).content
    }
    return document.importNode(window.templates[TId], true)
}

document.querySelector("#analyse").addEventListener("click", e => {
    let card = document.querySelectorAll(".card")
    if(card.length <= 1){
        let other = getTemplate("complete_template").querySelector(".card")
        document.querySelector(".cards").appendChild(other)
    }
})