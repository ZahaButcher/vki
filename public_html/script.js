
//Типо база данных записей
let db = {
    "Проверка":{
        "info":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi numquam ducimus dolorum ad dolore obcaecati. Veniam, eum quis nemo adipisci praesentium natus officiis dignissimos ducimus deleniti. Corrupti deserunt illo accusantium? Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi numquam ducimus dolorum ad dolore obcaecati. Veniam, eum quis nemo adipisci praesentium natus officiis dignissimos ducimus deleniti. Corrupti deserunt illo accusantium? Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi numquam ducimus dolorum ad dolore obcaecati. Veniam, eum quis nemo adipisci praesentium natus officiis dignissimos ducimus deleniti. Corrupti deserunt illo accusantium?",
        "author":"Барков Захар",
        "date":"21.05.2025"
    },
    "Завоз":{
        "info":"Невероятно, в университетский буфет завезли пиво!",
        "author":"Завьялов Андрей",
        "date":"20.05.2025"
    },
    "Реклама":{
        "info":"Невероятно, в университетский дворик поставили автомасетрскую!",
        "author":"Мирзоматов Саиджон",
        "date":"18.05.2025"
    }
};

let addCase = document.getElementById("addCase");
let addNote = document.getElementById("addNote");
// let selectTopic = document.getElementById("selectTopic");


// let tempTopic = document.getElementById("tempTopic");
let tempCase = document.getElementById("tempCase"); //Шаблон заметки


let note = document.getElementById("note");
let noteh3 = document.getElementById("noteh3"); // Тема из окна создания
let btnNoteClose = document.getElementById("btnNoteClose");

addCase.addEventListener("click", function(){
    note.style.display = "flex";
    noteh3.focus();
});

btnNoteClose.addEventListener("click", function(){
    note.style.display = "none";
    
});

function addNotesDb(){
    for(let i in db){
        // console.log(i);
        let temp = tempCase.content.cloneNode(true);
        temp.querySelector(".heading").textContent = i;
        temp.querySelector(".info").textContent = db[i]["info"];
        temp.querySelector(".author").textContent = db[i]["author"];
        temp.querySelector(".date").textContent = db[i]["date"];
        document.querySelector("main").append(temp);
    }
}

addNotesDb();
let cases = document.querySelectorAll(".case");

addNote.addEventListener("click", function(){ // Add Note
    let rd = new Date(); //row Date
    let date = `${String(rd.getDate()).padStart(2,"0")}.${String(rd.getMonth()%12+1).padStart(2,"0")}.${rd.getFullYear()}`;
    
    let temp = tempCase.content.cloneNode(true); //Клонировал заметку из шаблона
    
    let noteTextArea = document.getElementById("noteTextArea"); //Текст

    if(!noteh3.value || !noteTextArea.value){
        noteh3.style.border = "2 px solid red";
        noteTextArea.style.borderBottom = "2 px solid red";
        
        return;
    }
    temp.querySelector(".heading").textContent = noteh3.value;
    temp.querySelector(".info").textContent = noteTextArea.value;
    temp.querySelector(".author").textContent = "Zaha";
    temp.querySelector(".date").textContent = date;
    document.querySelector("main").append(temp);
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
    console.log(elem);
    elem.addEventListener("click", function(){
        console.log(elem);
        elem.classList.add("caseClick");
        elem.classList.remove("case");
        // elem.style.width = "90%";
        // elem.style.height = "90vh";
        // elem.style.position = "absolute";
        // elem.style.zIndex = "9";
        // elem.style.marginLeft = "auto";
        // elem.style.marginRight = "auto";
        // elem.style.left = "0";
        // elem.style.right = "0";
        // elem.style.textAlign = "center";

        // elem.classList.add("caseClick");
        let files = document.createElement("div");
        files.className = "files";
        elem.append(files);
        let no = document.createElement("div"); //no - nwe object
        
    });
});


advertisement = {
    title: "title",
    content: "content",
    publication_date: "",
    last_update_date: "",
    expiry_date: ""
}