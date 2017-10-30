$(window).on('load', getTodosFromStorage);
$('#save-button').on('click',genCard);
$('#todo-card-section').on('click', '.delete-btn', deleteButton);
$('#todo-card-section').on('click', '.downvote-btn', changeImportance);
$('#todo-card-section').on('click', '.upvote-btn', changeImportance);
$('#todo-card-section').on('blur', '.todo-title, .todo-description', editCard);
$('#search-input').keyup(searchFunction);
$('#todo-card-section').on('click', '.complete-btn', completeCard);
$('#show-complete').on('click', ifCompleted);


function Todo(title, body, idNum, importance, completed) {
  this.title = title;
  this.body = body;
  this.idNum = idNum;
  this.importance = importance || 'normal';
  this.completed = false;
}

//When button clicked, loop through local storage
//Grab only those cards with this.completed = true and append
function ifCompleted() {
  $('article').hide();
  if ($('#show-complete').hasClass('clicked') === true) {
    $('#show-complete').removeClass('clicked');
    for(var i = 0; i < localStorage.length; i++) {
      var retrievedTodo = localStorage.getItem(localStorage.key(i));
      var parsedTodo = JSON.parse(retrievedTodo);  
       if (parsedTodo.completed === false) {
        prependTodo(parsedTodo);
        };
    }
  } 
  else {
    $('#show-complete').addClass('clicked');
    genCompleted();
  }
}

function genCompleted () {
  $('article').hide();
  $('#show-complete').addClass('clicked');
  for(var i = 0; i < localStorage.length; i++) {
    var retrievedTodo = localStorage.getItem(localStorage.key(i));
    var parsedTodo = JSON.parse(retrievedTodo);
    if (parsedTodo.completed === true) {
      prependTodo(parsedTodo);
    };
    // parsedTodo.completed === false ? prependTodo(parsedTodo) : hide(parsedTodo);
  }
}

//when button clicked, grab id of specific card from local storage
function completeCard() {
  var currentId = event.target.closest('.todo-card').id;
  var parsedObject = JSON.parse(localStorage.getItem(currentId));
  var numId = parsedObject.idNum;
  $(`#${numId}`).toggleClass('completed');
  parsedObject.completed === false ? parsedObject.completed = true : parsedObject.completed = false;
  putIntoStorage(parsedObject);
}

function genCard() {
  var title = $('#title-input').val();
  var body = $('#description-input').val();
  var newTodo = new Todo(title, body, Date.now());
  prependTodo(newTodo);
  putIntoStorage(newTodo);
  $('#user-input-form').reset();
}

function putIntoStorage(object) {
  var stringTodo = JSON.stringify(object);
  localStorage.setItem(object['idNum'], stringTodo);
} 

function prependTodo(todo) {
  $('#todo-card-section').prepend(`<article id="${todo['idNum']}" class="todo-card">
      <section>
        <div class="title-container">
          <h2 class="todo-title" contenteditable="true">${todo['title']}</h2>
          <button class="complete-btn">Completed Task</button>
          <button class="circle-btn delete-btn" name="delete-button"></button>
        </div>
        <p class="todo-description" contenteditable="true">${todo['body']}</p> 
          <button class="circle-btn upvote-btn" name="up-vote-button"></button>
          <button class="circle-btn downvote-btn" name="down-vote-button"></button>
          <h3 class="importance-text">importance : <span class="quality">${todo['importance']}</span></h3>
      </section>  
    </article>`);
}

function getTodosFromStorage() {
  for(var i = 0; i < localStorage.length; i++) {
    var retrievedTodo = localStorage.getItem(localStorage.key(i));
    var parsedTodo = JSON.parse(retrievedTodo);
    if (parsedTodo.completed === false) {
      prependTodo(parsedTodo)
    };
    // parsedTodo.completed === false ? prependTodo(parsedTodo) : hide(parsedTodo);
  }
}

function deleteButton() {
  var currentId = event.target.closest('.todo-card').id
  localStorage.removeItem(currentId);
  $(this).closest('.todo-card').remove();
}

function editCard() {
  var currentId = event.target.closest('.todo-card').id;
  var parsedObject = JSON.parse(localStorage.getItem(currentId));
  var newTitle = $(`#${currentId} .todo-title`).text();
  var newDescription = $(`#${currentId} .todo-description`).text();
  parsedObject['title'] = newTitle;
  parsedObject['body'] = newDescription;
  putIntoStorage(parsedObject);
}

function searchFunction() {
  var filteredText = $(this).val().toUpperCase();
  for (var i = 0; i < localStorage.length; i++) {
    var retrievedTodo = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedTodo);
    var currentId = parsedObject['idNum'];
    if (parsedObject['title'].toUpperCase().includes(filteredText) || parsedObject['body'].toUpperCase().includes(filteredText)) {
      $(`#${currentId}`).css( "display", "" );
    } else {
      $(`#${currentId}`).css( "display", "none");
    }
  }
}

function changeImportance() {
  var currentId = event.target.closest('.todo-card').id;
  var parsedObject = JSON.parse(localStorage.getItem(currentId)); 
  var indexChange = $(this).hasClass('upvote-btn') ? 1 : -1;
  var arr = ['none', 'low', 'normal', 'high', 'critical'];
  var currentImportance = arr.indexOf(parsedObject.importance);
  var newImportance = arr[currentImportance + indexChange];
  if (newImportance !== undefined) {
    parsedObject['importance'] = arr[currentImportance + indexChange];
    $(this).siblings('.importance-text').children('.quality').text(newImportance);
  }
  putIntoStorage(parsedObject);
}




