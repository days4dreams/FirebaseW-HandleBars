// Initialize Firebase
 var config = {
    apiKey: "AIzaSyBiSoERAugmtNs5JTR_B_MS2Ug-Kyns83c",
    authDomain: "lw-one.firebaseapp.com",
    databaseURL: "https://lw-one.firebaseio.com",
    projectId: "lw-one",
    storageBucket: "lw-one.appspot.com",
    messagingSenderId: "915909847564"
  };
  firebase.initializeApp(config);


// Connect to Database
var database = firebase.database();

$('#comment-form').on('submit', function (e) {
  // prevent the page from reloading
  e.preventDefault();
  // grab user's comment from input field
  var userInput = $('#comment').val();
  // clear the user's comment from the input (for UX purposes)
  $('#comment').val('')
  // create a section for comments data in your db
  var commentsReference = database.ref('comments');
  // use the set method to save data to the comments
  commentsReference.push({
    comment: userInput,
    likes: 0
  });
});

function getComments() {
  database.ref('comments').on('value', function (results) {
    var allComments = results.val();
    var comments = [];
    for (var item in allComments) {
      var context = {
        comment: allComments[item].comment,
        likes: allComments[item].likes,
        commentId: item
      };
      // Get the HTML from our Handlebars comment template
      var source = $("#comment-template").html();
      // Compile our Handlebars template
      var template = Handlebars.compile(source);
      // Pass the data for this comment (context) into the template
      var commentListElement = template(context);
      // push newly created element to array of comments
      comments.push(commentListElement)
    }
    // Update the DOM
    // remove all list items from DOM before appending list items
    $('.comments').empty()
    // append each comment to the list of comments in the DOM
    for (var i in comments) {
      $('.comments').append(comments[i])
    }

$('.comments').on('click', '.like', function (e) {

  // Get the ID from the parent of the like button we clicked on
  var id = $(e.target).parent().data('id');

  // find comment whose objectId is equal to the id we're searching with
  var commentReference = database.ref('comments/' + id);

  // Get number of likes from HTML
  var likes = $('#likes').html();

  // Convert likes to a number and add a like
  likes = parseInt(likes, 10) + 1;

  // Update likes property in database using Firebase's update() method.
  commentReference.update({
    likes: likes
  });

});

$('.comments').on('click', '.delete', function (e) {
  // Get the ID for the comment we want to update
  var id = $(e.target).parent().data('id')

  // find comment whose objectId is equal to the id we're searching with
  var commentReference = database.ref('comments/' + id)


  // Use remove method to remove the comment from the database
  commentReference.remove()
});

  });
}

// When page loads, call getComments function
getComments();
