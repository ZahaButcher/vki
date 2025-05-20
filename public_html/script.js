let addCase = document.getElementById("addCase");
let addNote = document.getElementById("addNote");
// let selectTopic = document.getElementById("selectTopic");

let cases = document.querySelectorAll(".case");

// let tempTopic = document.getElementById("tempTopic");
let tempCase = document.getElementById("tempCase");


let note = document.getElementById("note");
let btnNoteClose = document.getElementById("btnNoteClose");

addCase.addEventListener("click",function(){
    note.style.display = "flex";
});

btnNoteClose.addEventListener("click", function(){
    note.style.display = "none";

});

addNote.addEventListener("click", function(){ // Add Note
    let rd = new Date(); //row Date
    let date = `${String(rd.getDate()).padStart(2,"0")}.${String(rd.getMonth()%12+1).padStart(2,"0")}.${rd.getFullYear()}`;
    console.log(date);
    let obj = tempCase.content.cloneNode(true);
    let noteh3 = document.getElementById("noteh3");
    let noteTextArea = document.getElementById("noteTextArea");

    if(!noteh3.value || !noteTextArea.value){
        noteh3.style.borderBottom = "2 px solid red";
        noteTextArea.style.borderBottom = "2 px solid red";

        return;
    }
    obj.querySelector("h3").textContent = noteh3.value;
    obj.querySelector("p").textContent = noteTextArea.value;
    document.querySelector("main").append(obj);
    noteh3.value = "";
    noteTextArea.value = "";    
    async function send(){
 
        // получаем введеное в поле имя и возраст
        username = "Zaha";
        userage = 23;
 
        // отправляем запрос
        const response = await fetch("/about", {
                method: "POST",
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name: username,
                    age: userage
                })
            });
            if (response.ok) {
                const data = await response.json();
                // document.getElementById("message").textContent = data.message;
                console.log(data.message);
            }
            else
                console.log(response);
    }
    // send();
    note.style.display = "none";
});


cases.forEach(elem => {
    
    elem.addEventListener("click", function(){
        // console.log(elem);
        // elem.style.position = "absolute";
        // elem.style.left = "50%";

        // elem.classList.add("caseClick");
    });
});


advertisement = {
    title: "title",
    content: "content",
    publication_date: "",
    last_update_date: "",
    expiry_date: ""
}