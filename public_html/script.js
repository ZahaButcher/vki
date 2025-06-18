
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

function getCookie(name){
    let allcookie = document.cookie.split(";").map(str => str.trim());
    for(let i of allcookie){
        if(i.includes(name)){
            return i.slice(i.indexOf('=')+1);
        }
    }
    return false;
}
function formatDate(dateString) { //Нужно для преобразования даты 
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
}
function addNotesDb(db){
    for(let i in db){
        // console.log(i);
        let temp = tempCase.content.cloneNode(true);
        temp.querySelector(".heading").textContent = db[i].title;
        temp.querySelector(".info").textContent = db[i]["content"];
        temp.querySelector(".author").textContent = db[i]["author_name"];
        temp.querySelector(".date").textContent = formatDate(db[i]["publication_data"]);
        document.querySelector("main").append(temp);
    }
}
let main = document.querySelector("main");

let addCase = document.getElementById("addCase");
let addNote = document.getElementById("addNote");

// let selectTopic = document.getElementById("selectTopic");

if(getCookie("role") != "admin"){
    addCase.style.display = "none";
}

// let tempTopic = document.getElementById("tempTopic");
let tempCase = document.getElementById("tempCase"); //Шаблон заметки


let note = document.getElementById("note");
let noteh3 = document.getElementById("noteh3"); // Тема из окна создания
let btnNoteClose = document.getElementById("btnNoteClose");

document.addEventListener('DOMContentLoaded', async () => {
    // const container = document.getElementById('announcements-container');
    console.log("DOMContentLoaded");
    // try {
        // 1. Делаем запрос к API
        const response = await fetch('/anounce');
        
        // 2. Проверяем статус ответа
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        // 3. Парсим JSON
        const announcements = await response.json();
        console.log('Получены данные:', announcements);


        addNotesDb(announcements);
        let cases = document.querySelectorAll(".case");

        cases.forEach(elem => { //Нажатие на заметки
            // console.log(elem);
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
        // 4. Проверяем, что получили массив
        if (!Array.isArray(announcements)) {
            throw new Error('Ожидался массив объявлений');
        }
        
        // 5. Очищаем контейнер
        // container.innerHTML = '';
        
        // 6. Если нет объявлений
        // if (announcements.length === 0) {
        //     container.innerHTML = '<p>Нет доступных объявлений</p>';
        //     return;
        // }
        
        /*
        // 7. Создаем элементы для каждого объявления
        announcements.forEach(ann => {
            const announcementEl = document.createElement('div');
            announcementEl.className = 'announcement';
            
            // Проверяем и подставляем значения по умолчанию
            const title = ann.title || 'Без названия';
            const content = ann.content || ann.text || 'Нет содержимого';
            const authorId = ann.author_id || 'Неизвестный автор';
            const pubDate = ann.publication_data ? 
                new Date(ann.publication_data).toLocaleDateString() : 
                'Дата неизвестна';
            
            announcementEl.innerHTML = `
                <h3>${title}</h3>
                <p>${content}</p>
                <div class="meta">
                    <span>Автор: ${ann.author_name || authorId}</span>
                    <span>Опубликовано: ${pubDate}</span>
                </div>
            `;
            
            container.appendChild(announcementEl);
        });*/
        
    // } catch (error) {
    //     console.error('Ошибка при загрузке объявлений:', error);
    //     container.innerHTML = `
    //         <div class="error">
    //             <p>Не удалось загрузить объявления</p>
    //             <p>${error.message}</p>
    //         </div>
    //     `;
    // }
});

addCase.addEventListener("click", function(){
    note.style.display = "flex";
    noteh3.focus();
});

btnNoteClose.addEventListener("click", function(){
    note.style.display = "none";
    
});

async function search(){
    main.innerHTML = '';

    let response = await fetch("/search?search=" + document.getElementById("searchText").value);

    if(response.ok){
        let date = await response.json();
        
        console.log(date);
        addNotesDb(date);
    }
    else{
        console.log("Huinya");
    }
}
// async function search(){
//     let formData = new FormData();
//     formData.append("search", document.getElementById("searchText").value);     

//     let response = await fetch("/search",{
//         method:"POST",
//         body: formData
//     });

//     if(response.ok){
//         let date = await response.json();
        
//         console.log(date);
//     }
//     else{
//         console.log("Huinya");
//     }
// }

addNote.addEventListener("click", send);
// addNote.addEventListener("click", function(){ // Add Note
    /*let rd = new Date(); //row Date
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
    temp.querySelector(".date").textContent = date;*/

    // send();

    // document.querySelector("main").append(temp);
    // noteh3.value = "";
    // noteTextArea.value = "";    
    // async function send(){
 
    //     // получаем введеное в поле имя и возраст
    //     username = "Zaha";
    //     userage = 23;
 
    //     // отправляем запрос
    //     const response = await fetch("/about", {
    //         method: "POST",
    //         headers: { "Accept": "application/json", "Content-Type": "application/json" },
    //         body: JSON.stringify({ 
    //             name: username,
    //             age: userage
    //         })
    //     });
    //     if (response.ok) {
    //         const data = await response.json();
    //         // document.getElementById("message").textContent = data.message;
    //         console.log(data.message);
    //     }
    //     else
    //         console.log(response);
    // }

    
    
//     note.style.display = "none";
// });

async function send() {
    let form = document.getElementById("addNotes");
    let formData = new FormData(form);
    // formData.append('title',"aaaa");
    // formData.append('content',"sss");
    console.log(form);
    console.log(formData);
    let response = await fetch("/notes",{
        method:"POST",
        body: formData
    });

    if(response.ok){
        let date = await response.json();
        location.reload();
        console.log(date);
        noteh3.value = "";
        noteTextArea.value = ""; 
        note.style.display = "none";
    }
    else{
        console.log("Huinya");
    }
    
}




advertisement = {
    title: "title",
    content: "content",
    publication_date: "",
    last_update_date: "",
    expiry_date: ""
}