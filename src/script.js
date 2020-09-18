const toDoForm = document.querySelector(".js-toDoForm"),
      toDoInput = toDoForm.querySelector("input"),
      toDoList = document.querySelector(".js-pendingList"),
      finishList = document.querySelector(".js-finishList");

const TODOS_LS = "PENDING";
const FINISH_LS = "FINISHED";


let PENDING = [];
let FINISHED = [];

function deleteTodo(event) {
    const btn = event.target;
    const li = btn.parentNode;
    toDoList.removeChild(li);
    const cleanToDos = PENDING.filter(function(toDo) {
        return toDo.id !== parseInt(li.id);
      });
      PENDING = cleanToDos;
      saveToDos();
}

function deleteFinish(event) {
    const btn = event.target;
    const li = btn.parentNode;
    finishList.removeChild(li);
    const cleanToDos = FINISHED.filter(function(toFinish) {
        return toFinish.id !== parseInt(li.id);
      });
      FINISHED = cleanToDos;
      saveFinishList();
}

function saveToDos() {
    localStorage.setItem(TODOS_LS, JSON.stringify(PENDING));
    //JSON = Javascript Object Notation
    //Object를 String으로, String을 Object로 다 바꿀 수 있다.
    //JSON.stringify 는 자바스크립트의 object를 string으로 바꿔준다.
}

function saveFinishList() {
    localStorage.setItem(FINISH_LS, FINISHED);
}

function paintTodo(text) {
    const li  = document.createElement("li");
    const span = document.createElement("span");
    const delBtn = document.createElement("button");
    const finishBtn = document.createElement("button");
    const newId = PENDING.length + 1;

    span.innerHTML = text;
    delBtn.innerHTML = "&#10060;";
    delBtn.addEventListener("click", deleteTodo);
    finishBtn.innerHTML = "&#9989;";
    finishBtn.addEventListener("click", paintFinishList);
    finishBtn.addEventListener("click", deleteTodo);
    li.appendChild(span);
    li.appendChild(delBtn);
    li.appendChild(finishBtn);
    li.id = newId;

    toDoList.appendChild(li);
    const toDoObj = {
        text: text,
        id: newId
    };
    PENDING.push(toDoObj);
    saveToDos(); // toDos.push(toDoObj); 한 후에 호출할 것.
}


function paintFinishList(text) {
    const li  = document.createElement("li");
    const span = document.createElement("span");
    const delBtn = document.createElement("button");
    const backBtn = document.createElement("button");
    const oldId = FINISHED.length + 1;
    span.innerHTML = text;
    delBtn.innerHTML = "&#10060;";
    delBtn.addEventListener("click", deleteFinish);
    backBtn.innerHTML = "&#128281;";
    backBtn.addEventListener("click", saveToDos);
    li.appendChild(span);
    li.appendChild(delBtn);
    li.appendChild(backBtn);

    finishList.appendChild(li);

    const finishObj = FINISHED;
    let finishedToDos = localStorage.getItem(FINISH_LS);
    if(finishedToDos !== null) {
        let parsedFinishToDo = saveToDos();
        parsedFinishToDo.push(function(toDo){
            //.forEach는 array를 위한 function
            paintFinishTodo(toDo.text);
        });
    }

    // {
    //     text: text,
    //     id: oldID
    // };
    FINISHED.push(finishObj);
    saveFinishList();
}

function handleSubmit(event) {
    event.preventDefault();
    const currentValue = toDoInput.value;
    paintTodo(currentValue);
    toDoInput.value = "";
}

function handleFinish(event) {
    event.preventDefault();
    const currentValue = toDoList.innerHTML;
    paintFinishList(currentValue);
    finishList.innerHTML = "";
}

function loadToDos() {
    const loadedToDos = localStorage.getItem(TODOS_LS);
    if(loadedToDos !== null) {
        const parsedToDos = JSON.parse(loadedToDos);
        parsedToDos.forEach(function(toDo){
            //.forEach는 array를 위한 function
            paintTodo(toDo.text);
        });
    }
}

function loadFinishList(){
    const finishedToDos = saveToDos();
    if(finishedToDos !== null) {
        const parsedToDos = JSON.parse(finishedToDos);
        parsedToDos.forEach(function(toFinish){
            //.forEach는 array를 위한 function
            paintFinishList(toFinish.text);
        });
    }
}


function init() {
    loadToDos();
    toDoForm.addEventListener("submit", handleSubmit);
}

init();
