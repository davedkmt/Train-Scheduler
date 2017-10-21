  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBzl7cXRhc3xYBNL6NkmRog_e_um_mYTrQ",
    authDomain: "train-3312e.firebaseapp.com",
    databaseURL: "https://train-3312e.firebaseio.com",
    projectId: "train-3312e",
    storageBucket: "train-3312e.appspot.com",
    messagingSenderId: "1090813195958"
  };
  firebase.initializeApp(config);

  setInterval(function(){
      $('#clocking').html(moment().format('hh:mm:ss A'));
    }, 1000);

  var database = firebase.database();
  // Initial Values
  var trainName = "";
  var destination = "";
  var firstTrain = "";
  var frequency = "";

      $(document).ready(function() {


        $("#submit").on("click", function(event) {
          event.preventDefault();

          // Grabbed values from text boxes
          trainName = $("#trainName").val().trim();
          destination = $("#destination").val().trim();
          firstTrain = $("#firstTrain").val().trim();
          frequency = $("#frequency").val().trim();

          // console.log(trainName); // console.log(destination); // console.log(firstTrain); // console.log(frequency);
          // return false;
          // Code for handling the push
          database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
          });

        });
        // Calculating time using moment.js

        database.ref().on("child_added", function(childSnapshot) {
          var cv = childSnapshot.val();
          // console.log(cv);
          var tFrequency = cv.frequency;
          // console.log(tFrequency);
          var firstTime = cv.firstTrain;
          var newDestination = cv.destination;
          var name = cv.trainName;
          var newFrequency = cv.frequency;
          var timer = moment().format('MMMM Do YYYY, h:mm:ss a');

          // First Time (pushed back 1 year to make sure it comes before current time)
          var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
          // console.log(firstTimeConverted);
          // Current Time
          var currentTime = moment();

          // Difference between the times
          // console.log(currentTime);
          var diffTime = moment().diff(moment.unix(firstTimeConverted), "minutes");
          // console.log(typeof(diffTime));
          // Time apart (remainder)
          var tRemainder = moment().diff(moment.unix(firstTimeConverted), "minutes") % tFrequency;
          // console.log(typeof(tRemainder));
          // Minute Until Train
          var tMinutesTillTrain = tFrequency - tRemainder;
          // console.log(typeof(tMinutesTillTrain));
          // Next Train
          var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
          // console.log(nextTrain);

          // displaying the stored data in to the table

          $("#usersTable").append("<tr><td>" + name +
            "</td><td>" + newDestination +
            "</td><td>" + newFrequency +
            "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
        });

      })
