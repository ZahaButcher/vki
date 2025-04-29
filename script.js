let addCase = document.getElementById("addCase");
let addNote = document.getElementById("addNote");
let selectTopic = document.getElementById("selectTopic");

let cases = document.querySelectorAll(".case");

let tempTopic = document.getElementById("tempTopic");
let tempCase = document.getElementById("tempCase");


let note = document.getElementById("note");
let btnNoteClose = document.getElementById("btnNoteClose");

addCase.addEventListener("click",function(){
    note.style.display = "flex";
});

btnNoteClose.addEventListener("click", function(){
    note.style.display = "none";

});

addNote.addEventListener("click", function(){
    let obj = tempCase.content.cloneNode(true);
    let noteh3 = document.getElementById("noteh3");
    let noteTextArea = document.getElementById("noteTextArea");

    obj.querySelector("h3").textContent = noteh3.value;
    obj.querySelector("p").textContent = noteTextArea.value;
    document.getElementById(selectTopic.value).append(obj);
    noteh3.value = "";
    noteTextArea.value = "";    

    note.style.display = "none";
});


cases.forEach(elem => {
    
    elem.addEventListener("click", function(){
        // console.log(elem);
        // elem.style.position = "absolute";
        // elem.style.left = "50%";

        elem.classList.add("caseClick");
    });
});
