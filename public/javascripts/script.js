var sidebarList = document.querySelector('.sidebar-list');
var crossBtn = document.querySelector('.cross-btn');


var toggleBtn = document.querySelector('.sidebar-btn');


toggleBtn.addEventListener('click', function(e) {
    sidebarList.classList.add('active');
    crossBtn.classList.add('active');
})

crossBtn.addEventListener('click', function(e) {
    sidebarList.classList.remove('active');
    crossBtn.classList.remove('active');
})

