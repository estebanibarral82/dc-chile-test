document.addEventListener('DOMContentLoaded', () => {
  // Acordeón +/–
  document.querySelectorAll('.accordion details').forEach(detail => {
    const icon = detail.querySelector('.icon');
    detail.addEventListener('toggle', () => {
      icon.textContent = detail.open ? '-' : '+';
    });
  });

  // Menú hamburguesa
  const btnMenu = document.getElementById('btn-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const btnClose = document.getElementById('btn-close');

  btnMenu.addEventListener('click', () => {
    mobileMenu.classList.add('open');
  });
  btnClose.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });

  // Cerrar menú al hacer clic en enlace
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
});
