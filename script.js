$(window).on('load', getIdeasFromStorage);
$('#save-button').on('click',genCard);
$('#idea-card-section').on('click', '.delete', deleteButton);
$('#idea-card-section').on('click', '.downvote', changeImportance);
$('#idea-card-section').on('click', '.upvote', changeImportance);
$('#idea-card-section').on('blur', '.idea-title, .idea-description', editCard);
$('#search-input').keyup(searchFunction);

function Idea(title, body, idNum, importance) {
  this.title = title;
  this.body = body;
  this.idNum = idNum;
  this.importance = importance || 2;
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
      <form id="card-meta-data-form">
        <div id="idea-card-title-container">
        <h2 contenteditable=true id="card-title" class="card-headings idea-title">${idea['title']}</h2>
        <label for="delete-button">Delete</label>
        <button id="delete-button" class="small-grey-button delete" name="delete-button"></button>
        </div>
        <p contenteditable=true id="card-description" class="idea-description">${idea['body']}</p>
      </form>  
          <button id="up-vote-button" class="small-grey-button upvote" name="up-vote-button"></button>
          <button id="down-vote-button" class="small-grey-button downvote" name="down-vote-button"></button>
          <h3 id="quality-display-text" class="card-headings">importance : <span class="quality">${idea['importance']}</span></h3>
    </article>`);
}

function getIdeasFromStorage() {
  for(var i = 0; i < localStorage.length; i++) {
    var retrievedIdea = localStorage.getItem(localStorage.key(i));
    var parsedIdea = JSON.parse(retrievedIdea);
    prependIdea(parsedIdea);
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
  var newTitle = $(`#${currentId} .idea-title`).text();
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
  var currentImportance = JSON.parse(localStorage.getItem(currentId)).importance;
  var indexChange = $(this).hasClass('upvote') ? 1 : -1;
  var arr = ['none', 'low', 'normal', 'high', 'critical'];
  var newImportance = arr[currentImportance + indexChange];
  if (newImportance !== undefined) {
    parsedObject['importance'] = currentImportance + indexChange;
    $(this).siblings('.card-headings').children('.quality').text(newImportance);
  }
  putIntoStorage(parsedObject);
}





