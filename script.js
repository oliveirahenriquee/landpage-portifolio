
const reveals = document.querySelectorAll('.reveal');
const toggleButton = document.getElementById('themeToggle');
const projectCards = document.querySelectorAll('.project-card');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light');
}

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});


function revealOnScroll() {
  const windowHeight = window.innerHeight;
  reveals.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      element.classList.add('active');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

projectCards.forEach(card => {
  card.addEventListener('click', () => {

    
    card.classList.add('clicked');

    setTimeout(() => {
      card.classList.remove('clicked');
    }, 400);
  });
});