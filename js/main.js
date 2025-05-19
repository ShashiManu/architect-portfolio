// Project filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Modal functionality
const modalBtns = document.querySelectorAll('.modal-btn');
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close-btn');

modalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-modal');
    document.getElementById(modalId).style.display = 'flex';
  });
});

closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-close');
    document.getElementById(modalId).style.display = 'none';
  });
});

window.onclick = function(event) {
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
};

// GSAP Animations
window.addEventListener('DOMContentLoaded', () => {
  if (window.gsap) {
    gsap.from('nav', {y: -50, opacity: 0, duration: 1});
    gsap.from('.hero h1', {x: -100, opacity: 0, duration: 1, delay: 0.5});
    gsap.from('.hero p', {x: 100, opacity: 0, duration: 1, delay: 0.7});
    gsap.from('.btn', {scale: 0.8, opacity: 0, duration: 0.8, delay: 1});
    gsap.from('.project-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      delay: 1.2
    });
  }
}); 