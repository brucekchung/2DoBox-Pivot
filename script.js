var $ideaCardSection = $('#idea-card-section');

// could potentially make these local variables...
var $saveButton = $('#save-button');

$saveButton.on('click', function(event) {
  event.preventDefault();
  genCard();
  resetInputFields();
});

$('#idea-card-section').on('click', '.idea-card .delete', function(event) {
  event.preventDefault();
  deleteButton(this);
  // look at this to refactor and put in function
  var currentId = event.target.closest('.idea-card').id
  localStorage.removeItem(currentId);
})

// this event listener is working and functions are working - missing text injection

$('#idea-card-section').on('click', '.idea-card .downvote', function(event) {
  event.preventDefault();
  console.log(this);
  downvoteButton();
})

// this event listener is working and functions are working - missing text injection

$('#idea-card-section').on('click', '.idea-card .upvote', function(event) {
  event.preventDefault();
  console.log(this);
  upvoteButton();
})

function prependIdea(title, body, idNum) {
  $ideaCardSection.prepend(`<article id="${idNum}" class="idea-card">
      <form id="card-meta-data-form">
        <div id="idea-card-title-container">
        <h2 id="card-title" class="card-headings">${title}</h2>
        <label for="delete-button">Delete</label>
        <input id="delete-button" class="small-grey-button delete" name="delete-button" type="image" src="FEE-ideabox-icon-assets/delete.svg"></input>
        </div>
        <p id="card-description">${body}</p>
        <label for="up-vote-button">Up</label>
        <div id="idea-card-quality-container">
        <input id="up-vote-button" class="small-grey-button upvote" name="up-vote-button" type="image" src="FEE-ideabox-icon-assets/upvote.svg"></input>
        <label for="down-vote-button">Down</label>
        <input id="down-vote-button" class="small-grey-button downvote" name="down-vote-button" type="image" src="FEE-ideabox-icon-assets/downvote.svg"></input>
        <h3 id="quality-display-text" class="card-headings">quality : <span class="quality">swill</span></h3>
        </div>
      </form>
    </article>`);
}

function resetInputFields() {
  var $form = $('#user-input-form');
  $form[0].reset();
}

function deleteButton(button) {
  button.closest('.idea-card').remove();
}

function downvoteButton() {
  var currentId = event.target.closest('.idea-card').id;
  var retrievedObject = localStorage.getItem(currentId);
  var parsedObject = JSON.parse(retrievedObject);
  if (parsedObject.quality === 'genius') {
    parsedObject.quality = 'plausible';
  } else if (parsedObject.quality === 'plausible'){
    parsedObject.quality = 'swill';
  }
  putIntoStorage(parsedObject);
}

function upvoteButton() {
  var currentId = event.target.closest('.idea-card').id;
  var retrievedObject = localStorage.getItem(currentId);
  var parsedObject = JSON.parse(retrievedObject);
  if(parsedObject.quality === 'swill') {
    parsedObject.quality = 'plausible';
  } else if (parsedObject.quality === 'plausible'){
    parsedObject.quality = 'genius';
  }
  putIntoStorage(parsedObject);
}

function Idea(title, body, idNum) {
  this.title = title;
  this.body = body;
  this.idNum = idNum;
  this.quality = 'swill';
}

function genCard(title, body) {
  var title = $('#title-input').val();
  var body = $('#description-input').val();
  var newIdea = new Idea(title, body, Date.now());
  prependIdea(newIdea['title'], newIdea['body'], newIdea['idNum']);
  putIntoStorage(newIdea);
}

function putIntoStorage(object) {
  var stringIdea = JSON.stringify(object);
  localStorage.setItem(object['idNum'], stringIdea);
} 



