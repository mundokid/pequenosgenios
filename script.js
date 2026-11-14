/* CONFIGURAÇÃO: substitua a URL abaixo pelo link HTTPS do seu checkout. */
const CHECKOUT_URL = 'COLE_AQUI_O_LINK_DO_CHECKOUT';

const buyButtons = document.querySelectorAll('.buy-button');
const toast = document.getElementById('checkout-toast');
buyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (/^https:\/\/[^\s]+$/i.test(CHECKOUT_URL)) {
      window.location.assign(CHECKOUT_URL);
    } else {
      toast.hidden = false;
      document.getElementById('close-toast').focus();
    }
  });
});
document.getElementById('close-toast').addEventListener('click', () => { toast.hidden = true; });

const modal = document.getElementById('preview-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
document.querySelectorAll('.preview-open').forEach((button) => {
  button.addEventListener('click', () => {
    modalImage.src = button.dataset.image;
    modalImage.alt = 'Atividade ampliada: ' + button.dataset.title;
    modalTitle.textContent = button.dataset.title;
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
  });
});
document.getElementById('close-modal').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

// Leve animação de entrada respeitando a preferência de movimento reduzido.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.topic-card,.age-card,.preview-card,.routine-card,.voice-card').forEach((e) => {
    e.classList.add('reveal'); observer.observe(e);
  });
}
