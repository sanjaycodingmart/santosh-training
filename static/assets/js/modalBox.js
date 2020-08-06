// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Get the modal
var modaltwo = document.getElementById("myModaltwo");

// Get the button that opens the modal
var btntwo = document.getElementById("myBtntwo");

// Get the <span> element that closes the modal
var spantwo = document.getElementsByClassName("closetwo")[0];

// When the user clicks the button, open the modal
btntwo.onclick = function () {
  modaltwo.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
spantwo.onclick = function () {
  modaltwo.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modaltwo.style.display = "none";
  }
};
