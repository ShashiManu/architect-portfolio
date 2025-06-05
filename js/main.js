// Project filtering
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");
    projectCards.forEach((card) => {
      if (filter === "all" || card.getAttribute("data-category") === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

window.addEventListener("load", function () {
  document.body.classList.add("page-loaded");
});

// Modal functionality
const modalBtns = document.querySelectorAll(".modal-btn");
const modals = document.querySelectorAll(".modal");
const closeBtns = document.querySelectorAll(".close-btn");

modalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modalId = btn.getAttribute("data-modal");
    document.getElementById(modalId).style.display = "flex";
  });
});

closeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modalId = btn.getAttribute("data-close");
    document.getElementById(modalId).style.display = "none";
  });
});

window.onclick = function (event) {
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

// GSAP Animations
window.addEventListener("DOMContentLoaded", () => {
  if (window.gsap) {
    gsap.set(".btn", { opacity: 1 });
    gsap.from("nav", { y: -50, opacity: 0, duration: 1 });
    gsap.from(".hero h1", { x: -100, opacity: 0, duration: 1, delay: 0.5 });
    gsap.from(".hero p", { x: 100, opacity: 0, duration: 1, delay: 0.7 });
    gsap.from(".btn", { 
      y: 10,
      scale: 0.95,
      duration: 0.5, 
      delay: 1,
      ease: "power2.out"
    });
  }
});

$(document).ready(function(){
    $('.container ul.toggle').click(function(){
        $(this).toggleClass('active');
        $('.container .sidebar').toggleClass('active');
    });
    
    // Set initial state - sidebar hidden, toggle button visible as burger
    $('.container .sidebar').removeClass('active');
    $('.container ul.toggle').removeClass('active');
})
