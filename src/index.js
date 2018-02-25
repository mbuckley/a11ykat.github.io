
import "./index.css";

const teamName = "template";

// Populate UI using team name
const properName = teamName.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
document.title = properName;
document.querySelector('#header').innerText = properName;

// Initialize Firebase
var config = {
  authDomain: "initiative-list.firebaseapp.com",
  projectId: "initiative-list"
};
firebase.initializeApp(config);
var firestore = firebase.firestore();
const db = firestore.collection(teamName);

firestore.collection(teamName).orderBy("priority").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    var currentID = `${doc.id}`;

    db.doc(currentID).get().then(function (doc) {
      if (doc && doc.exists) {
        var newData = doc.data();

        var temp = document.querySelector("template");

        temp.content.querySelector(".card").id = currentID;

        temp.content.querySelector("h1").textContent = newData.title;
        temp.content.querySelector("h2").textContent = newData.description;

        temp.content.querySelectorAll(".kpi")[0].textContent = newData.primaryKpi;
        temp.content.querySelectorAll(".metric")[0].textContent = newData.primaryMetric;
        temp.content.querySelectorAll(".kpi")[1].textContent = newData.secondaryKpi;
        temp.content.querySelectorAll(".metric")[1].textContent = newData.secondaryMetric;
        temp.content.querySelector(".value").textContent = newData.priority;
        temp.content.querySelector("input").value = newData.colour;
        temp.content.querySelector(".card").style.backgroundColor = newData.colour;
        temp.content.querySelectorAll('button')[0].style.backgroundColor = 'transparent';
        temp.content.querySelectorAll('button')[1].style.backgroundColor = 'transparent';
        temp.content.querySelectorAll('button')[2].style.backgroundColor = 'transparent';
        temp.content.querySelectorAll('button')[1].style.color = newData.textColour;
        temp.content.querySelectorAll('button')[2].style.color = newData.textColour;
        temp.content.querySelector(".card").style.color = newData.textColour;
        temp.content.querySelector(".card").querySelectorAll('h2')[0].style.color = newData.textColour;
        temp.content.querySelector(".card").querySelectorAll('h2')[1].style.color = newData.textColour;
        temp.content.querySelector(".card").querySelectorAll('h2')[2].style.color = newData.textColour;
        temp.content.querySelector(".card").querySelector('h4').style.color = newData.textColour;

        // clone the entire node which was just stored temporarily
        var clone = temp.content.cloneNode(true);

        //Create a new node, based on the template:
        const card = document.importNode(clone, true);
        //append the new node wherever you like:
        document.body.appendChild(card);
      }  else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  });
});

function toggleAddButton() {
  document.querySelector('#addNew').classList.toggle('slide-down');
  document.querySelector('#addNew').classList.toggle('slide-up');
}

function showEdit(event) {
  var saveButton = event.target.parentNode.parentNode.querySelectorAll('button')[1];
  var deleteButton = event.target.parentNode.parentNode.querySelectorAll('button')[2];
  var options = event.target.parentNode.parentNode.querySelector('.options');
  saveButton.classList.toggle('hide');
  deleteButton.classList.toggle('hide');
  options.classList.toggle('hide');
}

function updateColour(event) {
  var chosenColour = event.target.parentNode.parentNode.querySelector('input').value;
  var textColour = getCorrectTextColour(chosenColour.substr(1,6));
  setCorrectTextColour(event, textColour, chosenColour);
}

function getCorrectTextColour(hex) {

  /* about half of 256. Lower threshold equals more dark text on dark background  */
  const threshold = 200;

  const hRed = hexToR(hex);
  const hGreen = hexToG(hex);
  const hBlue = hexToB(hex);


  function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
  function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
  function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
  function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

  cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
  if (cBrightness > threshold) {
    return "#090909";
  } else {
    return "#ffffff";
  }
}

function setCorrectTextColour (event, textColour, chosenColour) {
  event.target.parentNode.parentNode.style.backgroundColor = chosenColour;
  event.target.parentNode.parentNode.style.color = textColour;
  event.target.parentNode.parentNode.querySelectorAll('h2')[0].style.color = textColour;
  event.target.parentNode.parentNode.querySelectorAll('h2')[1].style.color = textColour;
  event.target.parentNode.parentNode.querySelectorAll('h2')[2].style.color = textColour;
  event.target.parentNode.parentNode.querySelector('h4').style.color = textColour;
  event.target.parentNode.parentNode.querySelectorAll('button')[0].style.transition = "none";
  event.target.parentNode.parentNode.querySelectorAll('button')[0].style.backgroundColor = chosenColour;
  event.target.parentNode.parentNode.querySelectorAll('button')[0].style.color = textColour;
  event.target.parentNode.parentNode.querySelectorAll('button')[1].style.backgroundColor = 'transparent';
  event.target.parentNode.parentNode.querySelectorAll('button')[2].style.backgroundColor = 'transparent';
  event.target.parentNode.parentNode.querySelectorAll('button')[0].style.backgroundColor = 'transparent';
  event.target.parentNode.parentNode.querySelectorAll('button')[1].style.color = textColour;
  event.target.parentNode.parentNode.querySelectorAll('button')[2].style.color = textColour;
}

function toggleToast(message) {
  document.querySelector('#toast').innerText = message;
  document.querySelector('#toast').classList.toggle('slide-down');
  document.querySelector('#toast').classList.toggle('slide-up');
  setTimeout(function(){
    document.querySelector('#toast').classList.toggle('slide-down');
    document.querySelector('#toast').classList.toggle('slide-up');
  }, 2000);
}

function save(event) {
  var item = event.target.parentNode.id;
  var initiativeRef = firestore.collection(teamName).doc(item);
  var tempTitleRef = document.querySelector('#'+item);

  // Set fields of the mobileApps initiative that was clicked
  return initiativeRef.update({
    title: tempTitleRef.querySelector("h1").textContent,
    description: tempTitleRef.querySelector("h2").textContent,
    primaryKpi: tempTitleRef.querySelectorAll(".kpi")[0].textContent,
    primaryMetric: tempTitleRef.querySelectorAll(".metric")[0].textContent,
    secondaryKpi: tempTitleRef.querySelectorAll(".kpi")[1].textContent,
    secondaryMetric: tempTitleRef.querySelectorAll(".metric")[1].textContent,
    priority: tempTitleRef.querySelector(".value").textContent,
    colour: tempTitleRef.querySelector("input").value,
    textColour: tempTitleRef.querySelector("h2").style.color
  })
          .then(function() {
            console.log("Document successfully updated!");
            toggleToast("Save successful!");
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
            toggleToast("Sorry, something went wrong saving. Please try again.");
          });
}

function removeThis(event) {
  var item = event.target.parentNode.id;
  var initiativeRef = firestore.collection(teamName).doc(item);

  document.querySelector('body').removeChild(document.querySelector('#'+item));

  initiativeRef.delete().then(function() {
    console.log("Document successfully deleted!");
    toggleToast("Initiative successfully deleted!");
  }).catch(function(error) {
    console.error("Error removing document: ", error);
    toggleToast("Sorry, something went wrong removing this initiative. Please try again.");
  });
}

function addNew() {
  var tempID = ("initiative" + Math.round(Math.random()*100000000).toString());

  firebase.firestore().collection(teamName).doc(tempID).set({
    title: "Title",
    description: "Description.",
    primaryKpi: "KPI",
    primaryMetric: "Metric",
    secondaryKpi: "KPI",
    secondaryMetric: "Metric"
  })
          .then(function() {
//                  console.log("Document successfully written!");
            toggleToast("New initiative created!");
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
            toggleToast("Sorry, there was a problem creating a new initiative. Please try again.");
          });

  var temp = document.querySelector("template");

  temp.content.querySelector(".card").id = (tempID);

  temp.content.querySelector("h1").textContent = "Title";
  temp.content.querySelector("h2").textContent = "Description.";

  temp.content.querySelectorAll(".kpi")[0].textContent = "KPI";
  temp.content.querySelectorAll(".metric")[0].textContent = "metric";
  temp.content.querySelectorAll(".kpi")[1].textContent = "";
  temp.content.querySelectorAll(".metric")[1].textContent = "";

  // clone the entire node which was stored temporarily
  var clone = temp.content.cloneNode(true);

  //Create a new node, based on the template:
  var card = document.importNode(clone, true);
  //append the new node wherever you like:
  document.body.appendChild(card);
}

// Hide toolbar if embedded as a component
var urlParam = window.location.search;
if (urlParam != ('?embed')) {
  document.querySelector('header').classList.remove('hide');
}

//Drag and drop

var dragSrcEl = null;

function handleDragStart(e) {
  // Target (this) element is the source node.
//    this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);

//    console.log('dragging ' + e.target.id);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add('over');
//    console.log('dragging over ' + this.id);
//    console.log(e.target);
}

function handleDragLeave(e) {
  this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) {
  // this/e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }


  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    var newID = this.id;
    var srcID = dragSrcEl.id;
    dragSrcEl.innerHTML = this.innerHTML;
    dragSrcEl.id = newID;
    this.id = srcID;
    this.innerHTML = e.dataTransfer.getData('text/html');

    var cards = document.querySelectorAll('.card');
    var iterator;
    for (iterator = 1; iterator < cards.length; iterator++) {
      if (srcID == cards[iterator].id) {
        document.querySelector('#'+srcID).querySelector('.value').innerText = iterator;
      }
    }
  }
  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.
  var cards = document.querySelectorAll('.card');
  [].forEach.call(cards, function (card) {
    card.classList.remove('over');
  });
}

setTimeout(function() {
  var cards = document.querySelectorAll('.card');
  if (cards.length > 0) {
    console.log('loaded list!');
    toggleToast('App initialized!');
  }
  [].forEach.call(cards, function(card) {
    card.addEventListener('dragstart', handleDragStart, false);
    card.addEventListener('dragenter', handleDragEnter, false);
    card.addEventListener('dragover', handleDragOver, false);
    card.addEventListener('dragleave', handleDragLeave, false);
    card.addEventListener('drop', handleDrop, false);
    card.addEventListener('dragend', handleDragEnd, false);
  });
}, 2000);

// event listeners (just a demo / clean up)
// -- toggle add button
var links = document.getElementsByTagName("header");
var linkList = Array.prototype.slice.call(links);
linkList.forEach(function(link) {
  link.onclick = toggleAddButton;
});

// -- toggle add new
document.getElementById("addNew").onclick = addNew;
