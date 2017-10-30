$(window).on('load', getIdeasFromStorage);
$('#save-button').on('click',genCard);
$('#idea-card-section').on('click', '.delete-btn', deleteButton);
$('#idea-card-section').on('click', '.downvote-btn', changeImportance);
$('#idea-card-section').on('click', '.upvote-btn', changeImportance);
$('#idea-card-section').on('blur', '.todo-title, .idea-description', editCard);
$('#search-input').keyup(searchFunction);
$('#idea-card-section').on('click', '.complete-btn', completeCard);
$('#show-complete').on('click', ifCompleted);


function Idea(title, body, idNum, importance, completed) {
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
      var retrievedIdea = localStorage.getItem(localStorage.key(i));
      var parsedIdea = JSON.parse(retrievedIdea);  
       if (parsedIdea.completed === false) {
        prependIdea(parsedIdea);
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
    var retrievedIdea = localStorage.getItem(localStorage.key(i));
    var parsedIdea = JSON.parse(retrievedIdea);
    if (parsedIdea.completed === true) {
      prependIdea(parsedIdea);
    };
    // parsedIdea.completed === false ? prependIdea(parsedIdea) : hide(parsedIdea);
  }
}

//when button clicked, grab id of specific card from local storage
function completeCard() {
  var currentId = event.target.closest('.idea-card').id;
  var parsedObject = JSON.parse(localStorage.getItem(currentId));
  var numId = parsedObject.idNum;
  $(`#${numId}`).toggleClass('completed');
  parsedObject.completed === false ? parsedObject.completed = true : parsedObject.completed = false;
  putIntoStorage(parsedObject);
}

function genCard() {
  var title = $('#title-input').val();
  var body = $('#description-input').val();
  var newIdea = new Idea(title, body, Date.now());
  prependIdea(newIdea);
  putIntoStorage(newIdea);
  $('#user-input-form').reset();
}

function putIntoStorage(object) {
  var stringIdea = JSON.stringify(object);
  localStorage.setItem(object['idNum'], stringIdea);
} 

function prependIdea(idea) {
  $('#idea-card-section').prepend(`<article id="${idea['idNum']}" class="idea-card">
      <section>
        <div class="title-container">
          <h2 class="todo-title" contenteditable="true">${idea['title']}</h2>
          <button class="complete-btn">Completed Task</button>
          <button class="circle-btn delete-btn" name="delete-button"></button>
        </div>
        <p class="idea-description" contenteditable="true">${idea['body']}</p> 
          <button class="circle-btn upvote-btn" name="up-vote-button"></button>
          <button class="circle-btn downvote-btn" name="down-vote-button"></button>
          <h3 class="importance-text">importance : <span class="quality">${idea['importance']}</span></h3>
      </section>  
    </article>`);
}

function getIdeasFromStorage() {
  for(var i = 0; i < localStorage.length; i++) {
    var retrievedIdea = localStorage.getItem(localStorage.key(i));
    var parsedIdea = JSON.parse(retrievedIdea);
    if (parsedIdea.completed === false) {
      prependIdea(parsedIdea)
    };
    // parsedIdea.completed === false ? prependIdea(parsedIdea) : hide(parsedIdea);
  }
}

function deleteButton() {
  var currentId = event.target.closest('.idea-card').id
  localStorage.removeItem(currentId);
  $(this).closest('.idea-card').remove();
}

function editCard() {
  var currentId = event.target.closest('.idea-card').id;
  var parsedObject = JSON.parse(localStorage.getItem(currentId));
  var newTitle = $(`#${currentId} .todo-title`).text();
  var newDescription = $(`#${currentId} .idea-description`).text();
  parsedObject['title'] = newTitle;
  parsedObject['body'] = newDescription;
  putIntoStorage(parsedObject);
}

function searchFunction() {
  var filteredText = $(this).val().toUpperCase();
  for (var i = 0; i < localStorage.length; i++) {
    var retrievedIdea = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedIdea);
    var currentId = parsedObject['idNum'];
    if (parsedObject['title'].toUpperCase().includes(filteredText) || parsedObject['body'].toUpperCase().includes(filteredText)) {
      $(`#${currentId}`).css( "display", "" );
    } else {
      $(`#${currentId}`).css( "display", "none");
    }
  }
}

function changeImportance() {
  var currentId = event.target.closest('.idea-card').id;
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




