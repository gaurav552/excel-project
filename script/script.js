function getTemplate(TId) {
    if (!window.templates) {
        window.templates = {}
    }

    if (!window.templates[TId]) {
        window.templates[TId] = document.querySelector(`template#${TId}`).content
    }
    return document.importNode(window.templates[TId], true)
}

localStorage.removeItem("uname")
localStorage.removeItem("pass")

if (!localStorage.getItem('uname') && !localStorage.getItem('pass')) {
    var uname = "admin"
    var pass = "Laurentian123"
    localStorage.setItem("uname", uname)
    localStorage.setItem("pass", pass)
}


document.querySelector("#login_form").addEventListener("submit", e => {
    e.preventDefault()
    let name = document.querySelector("#name").value
    let password = document.querySelector("#password").value


    if ((name == localStorage.getItem("uname")) && (password == localStorage.getItem("pass"))) {

        console.log("match")
        signin()

    } else {
        nomatch(name, localStorage.getItem("uname"), password, localStorage.getItem("pass"))
        e.target.reset()
    }
})

function nomatch(uname, iname, upass, ipass) {

    if (uname != iname) {
        shaker(document.querySelector(".content2"))
    } else if(upass != ipass) {
        shaker(document.querySelector("#password"))
    }

}

function signin(){
    document.querySelector(".login").remove()
    let apple = getTemplate("apple")
    let ball = getTemplate("ball")
    document.querySelector(".main").appendChild(apple.querySelector(".content"))
    document.querySelector("body").appendChild(ball.querySelector("button"))
    document.querySelector("body").appendChild(ball.querySelector("footer"))
    document.querySelector("body").appendChild(ball.querySelector("script"))
}

function shaker(el) {
    el.classList.add("shakeX")
    setTimeout(() => {
        el.classList.remove("shakeX")
    }, 500);
}

let f1, f2
let finalFile = []
Dropzone.autoDiscover = false;
let opt = {
    addRemoveLinks: true,
    maxFiles: 1,
    autoProcessQueue: false,
    url: '/',
    dictDefaultMessage: "",
    acceptedFiles: '.xls, .xlsx, .xlm, .xlsm'
}
class drzon {
    constructor(name) {
        opt.dictDefaultMessage = name == 'student' ? "Add Student File" : "Add Teacher File"
        let zone = new Dropzone("#" + name, opt)

        zone.on("addedfile", function(file) {
            document.querySelector("#" + name).parentElement.classList.add("dragger")
            var r = new FileReader();
            let col
            r.onload = function(e) {
                let data = e.target.result
                let wb = XLSX.read(data, { type: 'binary' })
                wb.SheetNames.forEach(sheet => {
                    col = JSON.stringify(XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheet]))
                    if (name == 'student') {
                        f1 = JSON.parse(col)
                    } else {
                        f2 = JSON.parse(col)
                    }

                });
            }
            r.readAsBinaryString(file);
            finalFile = []
        })
        zone.on("maxfilesexceeded", function(file) {
            zone.removeAllFiles();
            zone.addFile(file)
            finalFile = []
        });

        zone.on("removedfile", function() {
            document.querySelector("#" + name).parentElement.classList.remove("dragger")
            let down = document.querySelector("#download")
            down.classList.add("slideOutUp")
            finalFile = []
            setTimeout(() => {
                down.style.display = "none"
            }, 500);
            if (name == 'student') {
                f1 = null
            } else {
                f2 = null
            }
        })

        zone.on("dragenter", function() {
            document.querySelector("#" + name).parentElement.classList.add("dragger")
        })

        zone.on("dragleave", function() {
            document.querySelector("#" + name).parentElement.classList.remove("dragger")
        })

        return zone
    }
}



function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf); //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}


function findTeacher(student) {
    let selected = {
        'Name': '',
        'Program': ''
    }
    for (var arrayIndex in f2) {
        let row = f2[arrayIndex]
        console.log(row)
            // console.log(row['Program of Study'] +" :"+ student['Program Name'])
        if (row['Program of Study'] == student['Program Name']) {
            console.log(row['Name'] + " : " + student['First Name'])
            selected.Name = row['Name']
            selected.Program = row['Program of Study']
            return {
                'Name': row['Name'],
                'Program': row['Program of Study']
            }
        }
    }


    let rand = Math.floor(Math.random() * f2.length)
    let temprow = f2[rand]

    selected.Name = temprow['Name']
    selected.Program = temprow['Program of Study']
    return {
        'Name': temprow['Name'],
        'Program': temprow['Program of Study']
    }


    // for (var columName in row) {
    //     if (row.hasOwnProperty(columName)) {
    //         // console.log(columName+" : "+program)
    //         if (columName == 'Program of Study') {

    //         }
    //     }
    // }



}