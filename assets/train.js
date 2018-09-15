//firebase config to link to my firebase
var config = {
    apiKey: "AIzaSyCEgNQpY13fQkERfVnwEJN11DxRZUhj7Uk",
    authDomain: "train-homework-6faa9.firebaseapp.com",
    databaseURL: "https://train-homework-6faa9.firebaseio.com",
    projectId: "train-homework-6faa9",
    storageBucket: "train-homework-6faa9.appspot.com",
    messagingSenderId: "476808478622"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  $("#form-row").hide(0);

  $("#add-train").on("click", function() {
    $("#trainimg-row").slideUp(500);
    $("#form-row").show(500);
  })

  //on submit, capture values of text fields for train info, and push them to firebase
$("#submit").on("click", function(){
    event.preventDefault();

    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    })

    //reset form
    document.getElementById("show-form").reset();

    $("#form-row").slideUp(500);
    $("#trainimg-row").show(500);
})

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    fillTable(childSnapshot);
})

function fillTable(train) {

    // stuff for getting next train time and minutes until next train
   var newDateConverted = moment(train.val().firstTrain, "HH:mm").subtract(1, "years");
   var trainFreq = train.val().frequency;

   // Difference between the times
   var diffTime = moment().diff(moment(newDateConverted), "minutes");

   // Time apart (remainder)
   var tRemainder = diffTime % trainFreq;

   // Minute Until Train
   var tMinutesTillTrain = trainFreq - tRemainder;

   // If minutes til next train = 0, display that the train is now boarding
   if (tRemainder === 0) {
       tMinutesTillTrain = "NOW BOARDING";
   }

   // Next Train
   var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    // add stored info and calculations from stored info to the table
   $("#train-table-body").append(
       "<tr>"
       + "<td><p>" +  train.val().name + "</p></td>"
       + "<td><p>" +  train.val().destination + "</p></td>"
       + "<td><p>" +  train.val().frequency + "</p></td>"
       + "<td><p>" +  moment(nextTrain).format("hh:mm") + "</p></td>"
       + "<td><p>" + tMinutesTillTrain + "</p></td>"
       +    "</tr>"
   )
}