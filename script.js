$(window).on('load', getIdeasFromStorage);
$('#save-button').on('click',genCard);
$('#idea-card-section').on('click', '.delete', deleteButton);
$('#idea-card-section').on('click', '.downvote', downvoteButton);
$('#idea-card-section').on('click', '.upvote', upvoteButton);
$('#idea-card-section').on('blur', '.idea-title, .idea-description', editCard);
$('#search-input').keyup(searchFunction);
$('#idea-card-section').on('click', '.complete-btn', completeCard);
$('#show-complete').on('click', ifCompleted);

//When button clicked, loop through local storage
//Grab only those cards with this.completed = true and append

function ifCompleted() {
  $('article').hide();
  if ($('#show-complete').hasClass('clicked') === true) {
    $('#show-complete').removeClass('clicked');
    for(var i = 0; i < localStorage.length; i++) {
      var retrievedIdea = localStorage.getItem(localStorage.key(i));
      var parsedIdea = JSON.parse(retrievedIdea);  
      prependIdea(parsedIdea);
    }
  } 
  else {
    $('#show-complete').addClass('clicked');
    genCompleted()
  }
}

function genCompleted () {
  $('article').hide();
  $('#show-complete').addClass('clicked');
  for(var i = 0; i < localStorage.length; i++) {
    var retrievedIdea = localStorage.getItem(localStorage.key(i));
    var parsedIdea = JSON.parse(retrievedIdea);
    if (parsedIdea.completed === true) {
      prependIdea(parsedIdea)
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
};

function Idea(title, body, idNum, quality, completed) {
  this.title = title;
  this.body = body;
  this.idNum = idNum;
  this.quality = quality || 'swill';
  this.completed = false;
}

function genCard() {
  var title = $('#title-input').val();
  var body = $('#description-input').val();
  var newIdea = new Idea(title, body, Date.now());
  prependIdea(newIdea);
  putIntoStorage(newIdea);
  var $form = $('#user-input-form');
  $form[0].reset();
}

function putIntoStorage(object) {
  var stringIdea = JSON.stringify(object);
  localStorage.setItem(object['idNum'], stringIdea);
} 

function prependIdea(idea) {
  $('#idea-card-section').prepend(`<article id="${idea['idNum']}" class="idea-card">
      <section id="card-meta-data-form">
        <div id="idea-card-title-container">
          <h2 contenteditable=true id="card-title" class="card-headings idea-title">${idea['title']}</h2>
          <label for="delete-button">Delete</label>
          <button class="complete-btn">Completed Task</button>
          <button id="delete-button" class="small-grey-button delete" name="delete-button"></button>
        </div>
        <p contenteditable=true id="card-description" class="idea-description">${idea['body']}</p>
          <button id="up-vote-button" class="small-grey-button upvote" name="up-vote-button"></button>
          <button id="down-vote-button" class="small-grey-button downvote" name="down-vote-button"></button>
          <h3 id="quality-display-text" class="card-headings">quality : <span class="quality">${idea['quality']}</span></h3>
      </section>  
    </article>`);
};

function getIdeasFromStorage() {
  for(var i = 0; i < localStorage.length; i++) {
    var retrievedIdea = localStorage.getItem(localStorage.key(i));
    var parsedIdea = JSON.parse(retrievedIdea);
    if (parsedIdea.completed === false) {
      prependIdea(parsedIdea)
    };
    // parsedIdea.completed === false ? prependIdea(parsedIdea) : hide(parsedIdea);
  }
};

function deleteButton() {
  var currentId = event.target.closest('.idea-card').id
  localStorage.removeItem(currentId);
  $(this).closest('.idea-card').remove();
};

function downvoteButton() {
  var currentId = event.target.closest('.idea-card').id;
  var parsedObject = JSON.parse(localStorage.getItem(currentId));
  if( parsedObject.quality === 'genius') {
    parsedObject.quality = 'plausible';
    $(`#${currentId} .quality`).text('plausible');
  } else if (parsedObject.quality === 'plausible'){
    parsedObject.quality = 'swill';
    $(`#${currentId} .quality`).text('swill');
  }
  putIntoStorage(parsedObject);
};

function upvoteButton() {
  var currentId = event.target.closest('.idea-card').id;
  var parsedObject = JSON.parse(localStorage.getItem(currentId));
  if( parsedObject.quality === 'swill') {
    parsedObject.quality = 'plausible';
    $(`#${currentId} .quality`).text('plausible');
  } else if (parsedObject.quality === 'plausible'){
    parsedObject.quality = 'genius';
    $(`#${currentId} .quality`).text('genius');
  }
  putIntoStorage(parsedObject);
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
};