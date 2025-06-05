    AOS.init();

    const slides = document.querySelectorAll(".slideshow img");
    let current = 0;

    setInterval(() => {
      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
    }, 9000); // 9s per image

    // Sidebar open/close
const sideNav = document.getElementById("sideNav");
const hamburger = document.getElementById("hamburger");
const mainMenu = document.getElementById('mainMenu');
const menuSeparator = document.getElementById('menuSeparator');
window.addEventListener("load", function () {
  document.body.classList.add("page-loaded");
});
hamburger.onclick = function() {
  const isOpen = sideNav.classList.toggle("open");
  hamburger.classList.toggle("active", isOpen);
  // Hide all submenus when opening/closing
  document.querySelectorAll('.submenu').forEach(s => s.classList.remove('active'));
  mainMenu.classList.remove('shifted');
  menuSeparator.classList.remove('active');
};

document.querySelectorAll('.has-submenu').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    // Hide all submenus
    document.querySelectorAll('.submenu').forEach(s => s.classList.remove('active'));
    // Show the correct submenu
    const menu = this.getAttribute('data-menu');
    const submenu = document.getElementById('submenu-' + menu);
    if (submenu) submenu.classList.add('active');
    // Shift main menu and show separator
    mainMenu.classList.add('shifted');
    menuSeparator.classList.add('active');
  });
});

// Hide submenu and reset menu on main link click
document.querySelectorAll('.side-links a:not(.has-submenu)').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.submenu').forEach(s => s.classList.remove('active'));
    mainMenu.classList.remove('shifted');
    menuSeparator.classList.remove('active');
    sideNav.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

    // Preloader animation with split logo
    window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    setTimeout(() => {
        preloader.classList.add("out");
        setTimeout(() => {
        preloader.style.display = "none";
        }, 1300); // Slightly longer to allow full fade
    }, 1000); // Delay before start
    });