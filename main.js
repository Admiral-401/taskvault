document.addEventListener('DOMContentLoaded', () => {

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const items = document.querySelector('.list');
    const input = document.querySelector('.typing-area');
    const add = document.querySelector('.add');
    const message = document.querySelector('.error-message');
    const remove = document.querySelector('.remove')


const errorMessages = {
    invalidText: 'Invalid user input...!',
    tooLong: `text too long shouldn't exeed 40 characters`,
    tooShort: `make sure input is more than 4 characters`,
    notDone: 'Task not complete'
}

// function modal funtion for errors

function handleError(message){
        const dialog = document.createElement('dialog');
        const error = document.createElement('p');
        const close = document.createElement('button');

        //dialog box styling
        dialog.style.backgroundColor = "brown";
        dialog.style.border = "none";
        dialog.style.borderRadius = "10px";
        dialog.style.color = "white";

        //close button styling

        close.style.backgroundColor = "grey"
        close.style.color = "white"
        close.style.borderRadius = "5px"

        error.innerText = message;
        close.innerText = 'Ok!';

        dialog.append(error, close)
        document.body.appendChild(dialog);

        dialog.showModal();

        close.addEventListener('click', () => {
            dialog.close();
            dialog.remove();
        })
        input.value = "";
}

//function that renders tasks on screen

 function renderTasks(){
    items.innerHTML = "";

    tasks.forEach(item => {
        const li = document.createElement('li');

        li.dataset.id = item.id;
        li.setAttribute('class', 'task-item')

        li.innerHTML = `
        <img src="/done.png" class="done ${item.complete ? 'complete' : ''}">
        <span class="task ${item.complete ? 'complete' : ''}">${item.text}</span>
        <img src="/remove.png" class="remove">
        `
        items.append(li)
    });
 }

 //function that handles input data

function addTask(inputText){
    const newTask = {
    id: Date.now(),
    text: "",
    complete: false,
    }

    if (typeof inputText !== "string" || inputText.trim() === ""){
        handleError(errorMessages.invalidText);
    } else if(inputText.length >= 40){
        handleError(errorMessages.tooLong);
    } else if(inputText.length < 3){
        handleError(errorMessages.tooShort);
    } else if(typeof inputText === "string" || inputText !== ""){
        
        newTask.text = inputText;

        tasks.push(newTask);
    
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();

        input.value = "";
        input.focus();
        } 
}

console.log(tasks);

add.addEventListener("click", () => addTask(input.value));
input.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
       addTask(input.value);
    }
})

document.addEventListener('click', e => {

    const li = e.target.closest('.task-item');
    if(!li) return;

    const id = Number(li.dataset.id)

    //handle complete
     if(e.target.classList.contains('done')){

        const task = tasks.find(task => task.id === id) 

        if(task){
            task.complete = !task.complete;
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
       renderTasks();
     }
         //handle delete
        if(e.target.classList.contains('remove')){

            const task = tasks.find(t => t.id === id)
           
            if(task && task.complete === false){
                handleError(errorMessages.notDone);
            }else if(task && task.complete === true){
                const index = tasks.findIndex(t => t.id === id);
                tasks.splice(index, 1);
            }
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks()
        }
    });


renderTasks();
})