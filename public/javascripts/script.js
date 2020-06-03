var sidebarList = document.querySelector(".sidebar-list");
var crossBtn = document.querySelector(".cross-btn");
var toggleBtn = document.querySelector(".sidebar-btn");
var prevStars = document.querySelector('.prevStars').value || null;


toggleBtn.addEventListener("click", function (e) {
  sidebarList.classList.add("active");
  crossBtn.classList.add("active");
});

crossBtn.addEventListener("click", function (e) {
  sidebarList.classList.remove("active");
  crossBtn.classList.remove("active");
});

// Rating

document.addEventListener("DOMContentLoaded", function (e) {
  var stars = document.querySelectorAll(".starCheckBox");
  stars.forEach((star) => {
    star.addEventListener("click", setRating);
  });
});


document.addEventListener("DOMContentLoaded", function(event) {
    if(prevStars) {
        prevRating(prevStars); 
    }
})

function prevRating(prevStars) {
  event.stopPropagation();
  var starCheckBox = document.querySelectorAll(".starCheckBox");
  var stars = document.querySelectorAll(".star");
  var rating = prevStars

  for (let i = 0; i < 5; i++) {
    if (i <= rating - 1) {
      stars[i].classList.add("rated");
      if(i==rating) {
        starCheckBox[i].checked = true;
      }
    } else {
      if (stars[i].classList.contains("rated")) {
        stars[i].classList.remove("rated");
      }
    }

    if (i != rating - 1) {
      starCheckBox[i].checked = false;
    }
  }
}


function setRating(event) {
  event.stopPropagation();
  var starCheckBox = document.querySelectorAll(".starCheckBox");
  var stars = document.querySelectorAll(".star");
  var rating = event.target.value;

  for (let i = 0; i < 5; i++) {
    if (i <= rating - 1 && event.target.checked) {
      stars[i].classList.add("rated");
    } else {
      if (stars[i].classList.contains("rated")) {
        stars[i].classList.remove("rated");
      }
    }

    if (i != rating - 1) {
      starCheckBox[i].checked = false;
    }
  }
  console.log("Rating: ", rating);
  console.log(event.target.checked);
}
