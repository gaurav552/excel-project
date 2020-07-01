function getTemplate(TId) {
    if (!window.templates) {
        window.templates = {}
    }

    if (!window.templates[TId]) {
        window.templates[TId] = document.querySelector(`template#${TId}`).content
    }
    return document.importNode(window.templates[TId], true)
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

let stdzone = new drzon("student")
let teazone = new drzon("teacher")



document.querySelector("#download").addEventListener("click", e => {
    let temp = [
        { "one": "one", 'two': "two", "thr": "three" }
    ]
    var workSheet = XLSX.utils.json_to_sheet(finalFile);
    console.log("THis is Worksheet", workSheet);
    var wb = XLSX.utils.book_new();
    console.log("THis is workbook", wb)
    XLSX.utils.book_append_sheet(wb, workSheet);
    var bin = XLSX.write(wb, { bookType: 'xlsx', type: "binary" });
    saveAs(new Blob([s2ab(bin)], { type: "application/octet-stream" }), 'book.xlsx')
})

function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf); //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}

document.getElementById("finder").addEventListener("click", e => {
    let down = document.querySelector("#download")
    if (f1 && f2) {
        for (var arrayIndex in f1) {
            let data = {
                'Student Name': "",
                'Program': "",
                'Teacher Name': "",
                'Teacher Program': ""
            }
            if (f1.hasOwnProperty(arrayIndex)) {
                // console.log(arrayIndex+" : key")
                let row = f1[arrayIndex]
                    // console.log(d+" : d")
                let name = ""
                for (var columnName in row) {
                    if (row.hasOwnProperty(columnName)) {
                    
                        if (columnName == 'First Name') {
                            name += row[columnName]
                        } else if (columnName == 'Last Name'){
                            name += ' '+row[columnName]
                        }
                        if (columnName == 'Program Name') {
                            data["Program"] = row[columnName]
                        }
                        // console.log(columnName + " -> " + row[columnName])
                    }
                }
                data["Student Name"] = name
                let teachr = findTeacher(data['Program'])
                // console.log(data['Program'])
                // console.log(teachr.Name)
                data['Teacher Name'] = teachr.Name
                data['Teacher Program'] = teachr.Program

                finalFile.push(data)
            }
        }


        down.style.display = "block"
        down.classList.add("slideInDown")
    } else {
        document.querySelector(".content").classList.add("shakeX")
        setTimeout(() => {
            document.querySelector(".content").classList.remove("shakeX")
        }, 500);
    }
})

function findTeacher(program) {
    // console.log("match : "+ program)
    let selected = {
        'Name': '',
        'Program':''
    }
    for (var arrayIndex in f2) {
        if (f2.hasOwnProperty(arrayIndex)) {
            let row = f2[arrayIndex]
            for (var columName in row) {
                if (row.hasOwnProperty(columName)) {
                    // console.log(columName+" : "+program)
                    if(columName == 'Program of Study'){
                        if (row[columName] == program){
                            // console.log(row[columName] +" : "+ program)
                            selected.Name = row['Name']
                            selected.Program = row[columName]
                        }
                    }
                }
            }
        }
    }
    return selected
}

// 

// document.getElementById("stdfile").addEventListener("change", e => {
//     f1 = e.target.files[0]
// })

// document.getElementById("teachfile").addEventListener("change", e => {
//     f2 = e.target.files[0]
// })

// document.getElementById("finder").addEventListener("click", e => {

//     if (f1 && f2) {

//         var r1 = new FileReader();
//         let col1, col2
//         r1.onload = function(e) {
//             let data = e.target.result
//             let wb = XLSX.read(data, { type: 'binary' })
//             wb.SheetNames.forEach(sheet => {
//                 col1 = JSON.stringify(XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheet]))
//             });
//         }
//         r1.readAsBinaryString(f1);

//         var r2 = new FileReader();
//         r2.onload = function(e) {
//             let data = e.target.result
//             let wb = XLSX.read(data, { type: 'binary' })
//             wb.SheetNames.forEach(sheet => {
//                 col2 = JSON.stringify(XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheet]))
//             });
//         }
//         r2.readAsBinaryString(f2);

//         setTimeout(() => {
//             let c = JSON.parse(col1)
//             for (var key in c) {
//                 if (c.hasOwnProperty(key)) {
//                     let d = c[key]
//                     console.log(d)
//                         // for (var key2 in d){
//                         //     if (d.hasOwnProperty(key2)){
//                         //         console.log(key2 + " -> " + d[key2])
//                         //     } 
//                         // }
//                 }
//             }

//         }, 100);

//     }
// })