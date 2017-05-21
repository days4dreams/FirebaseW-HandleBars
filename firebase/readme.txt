readme.txt

We'll start by opening up the HTML file for our project and adding a script tag that points to the CDN- hosted version of the Firebase.js library. Be sure to place this before the script tag pointing to your main.js file. Example:

<!-- Firebase CDN -->
  <script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>
  <script src="js/handlebars-v4.0.5.js"></script>
  <script src="js/jquery-3.0.0.min.js"></script>
<!-- Main js file -->
  <script src="js/main.js"></script>


The library we just added gives you the ability to connect and interact with your Firebase db.
But you may be asking yourself, how do I connect with my database and not to anyone else's?
Well, in order to do this, we'll need to configure the database in our JavaScript file.

Click on the button to add Firebase to your web app
An overlay will pop up with some information you'll need to configure your database.

This will include a unique URL for your db. Copy this. example:

<script src="https://www.gstatic.com/firebasejs/4.0.0/firebase.js"></script>
<script>
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
</script>

After retrieving our configuration information, we'll want to paste that code at the top of our main.js file like so:

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

---

After we’ve entered this block of code, we'll want to paste in the line at the bottom to connect with our database service:

// Connect to Database
var database = firebase.database();

---

By default, read and write access to your database is restricted to authenticated users only.

If you want to get started without setting up authentication, you can configure your rules for public access. But, be aware that this makes your database open to anyone, even people not using your app.
To configure your read and write access, click on the database tab in the lefthand menu, Then click on the "RULES" tab and paste in the following code:

{
  "rules": {
    ".read": true,
    ".write": true
  }
}

---

You've now successfully created a Firebase database and connected it to the client-side of your application. Let's move on to the next step: Creating data.

We’re going to work through the entire CRUD cycle of our data — creating a comment, getting comments, liking comments (and updating how many likes they have), and deleting comments.

In order to gather data from a user, we must first provide him or her with something in the view.

Here we have a form with an input that allows the user to enter a comment.

<form id="comment-form" class="cf">
    <input id="comment" type="text" placeholder="Leave a comment">
</form>

Let's take a look at this form’s jQuery:

// After we have initialized Firebase and created a reference to our database…
// When the comment form is submitted (the user hits enter)
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


---

We can see that the main purpose of this jQuery is to capture the message input supplied by the user when he or she submits the #comment-form:

var comment = $('#comment').val();
Once this comment is obtained, we can go ahead and use Firebase to save the new item and create the data.

We’ll then need to distinguish a new type of data and create a section in our database to store the packing items:

var commentsReference = database.ref('comments');

We’ll use the push() method to append new data to the comments section we just created in our database.

Firebase uses the JSON format for data — you'll recall that JSON data consists of key/value pairs, just like JavaScript objects.

In this case, the key is comment and its value is the comment input value grabbed from the DOM (userInput).

We can also set a key, likes, to keep track of how many likes a comment receives. Because we know that the item was just added and has not yet been liked, we can initialize the value to 0.

With the data configured, we can go ahead and save it using Firebase's push() method.

commentsReference.push({
  comment: userInput,
  likes: 0
  });

  To double-check that your data was saved as intended look at your dashboard.

When you expand your individual items data you should see something. Within comments you'll see many different keys, such as KMQgVFnCxNr7h7T6kn1.

These are the unique identifiers to each of your comments.

Firebase relies heavily on URLs, which means you can also find data by using Firebase's structured URL format for querying: https://<app name>.firebaseio.com/<db key>/<key of db key>.

https://js-circuits.firebaseio.com/comments/-KMQgVFnCxNr7h7T6kn1:

When we access data with a structured URL request, we’re essentially calling on the Firebase API that we custom created by dynamically creating data.

This will come into play as we seek to update specific pieces of data later in this lesson.

After an item has been saved to our back-end database, we’ll then want to display (Read) it in our app. To do so, we’ll need to complete a few simple steps:

Create a function that queries our database for comments data.
Display the comments we retrieve within the function.
Call this function when the page loads.

First, we'll create a function that queries the database for comments.

// Step 1: Create a function that queries our database for comments
function getComments() {
  // Listen for changes in comments data
  database.ref('comments').on('value', function (results) {
    // Get all comments stored in the results we received back from Firebase
    // Update the DOM
  });
}



Within our new querying function, getComments, we can use the reference to our application's database to listen for changes with our comments data.

Just use database.ref('comments') to connect to the comments database and .on() to listen to any 'value' changes within it.


One unique feature of a Firebase database is that it works in real time, meaning we can run methods like .on() which will update our application whenever there's a change.

You can use this feature to create a variety of “live” elements, such as chat rooms.

The second argument to .on() is a callback function that returns the results of the database call, which in this case is our comments object.

Remember, comments is really just a subkey of our overarching application's database.

To get the data we're seeking to bind to our UI, we must iterate through the object and access each data object's comment and likes properties.

Note: .val() is used to access the JSON data object, results, that is returned to us.

The next step is creating Handlebars template to which we will add our data.

Let's take a look at the Handlebars template in our HTML file:
Here, we have a basic template containing a list item. The list item has a data-id attribute where we will store the unique ID for the comment.

<script id="comment-template" type="text/x-handlebars-template">
  <li data-id="{{commentId}}">
    <span>{{likes}}</span>
    <p>{{comment}}</p>
    <i class="fa fa-trash delete"></i>
    <i class="fa fa-heart-o like"></i>
  </li>
</script>



Now, let's take a look at the JavaScript we will use to add data to our Handlebars template:


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


    Finally, we need to call the function when the page loads:

// retrieve comments data when page loads and when comments are added/updated
function getComments() {
  // ...
}

// When page loads, call getComments function
getComments();

We now have a function that queries our database and displays comments.

The comment list will refresh whenever the page loads, as well as when comments are updated (in this case, when a user likes a comment).
\---

Update with Firebase

Now let's take a look at how we can perform the U in CRUD.

It’s easy to use Firebase to update the data in your database. You just:

Find the data you want to update.
Update its value with the new value.


Let's create a function to run when a user clicks on the button with the class ".like".

Because we are adding these comments after the page has already loaded, we'll want to use event delegation by passing a second parameter to the on() method, which allows us to listen for an event on an element that hasn't yet been added to the DOM.

Check it out:

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


Note that, in Firebase, update() will only update the specific fields for which you pass in new values .set() will overwrite all fields with new values.


Up until this point, we haven't been concerned with specific comment data. We have either created a new JSON object or retrieved all data objects at once.

However, for update, we are concerned with updating specific comments. So, how are we able to identify and retrieve a specific piece of data?


Firebase makes data access fairly easy by creating an API based off the structure of our data objects.

Do you remember Firebase's data URL structure that we covered a little earlier? Here it is in case you forgot:

https://<app name>.firebaseio.com/<db key>/<key of db key>.


If you are wondering where to retrieve the data object ID, note that the message object ID is returned when you query your database.

You can take the ID and attach it to an element (like a data attribute) and call upon it when you need it.

Delete with Firebase

Finally, let's take a look at the D in CRUD.

To delete data with Firebase, you’ll need to:

Find the data you want to delete.
Use the .remove() method to delete it.

Let's see this in action:

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

