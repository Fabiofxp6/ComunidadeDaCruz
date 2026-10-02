/* ==========================================================================
   IGREJA REFORMADA COMUNIDADE DA CRUZ - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initScrollReveal();
  initPhoneMask();
  initVisitorForm();
});

/* --------------------------------------------------------------------------
   NAVBAR & SCROLL EFFECTS
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  const openDrawer = () => {
    toggleBtn.classList.add('active');
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    toggleBtn.classList.remove('active');
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* --------------------------------------------------------------------------
   SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback
    reveals.forEach(el => el.classList.add('active'));
  }
}

/* --------------------------------------------------------------------------
   PHONE NUMBER AUTO-MASKING
   -------------------------------------------------------------------------- */
function initPhoneMask() {
  const phoneInput = document.getElementById('visitor-phone');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      e.target.value = `(${value}`;
    } else {
      e.target.value = '';
    }
  });
}

/* --------------------------------------------------------------------------
   VISITOR FORM SUBMISSION -> WHATSAPP
   -------------------------------------------------------------------------- */
function initVisitorForm() {
  const form = document.getElementById('visitor-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('visitor-name').value.trim();
    const phone = document.getElementById('visitor-phone').value.trim();
    const source = document.getElementById('visitor-source').value;
    const isChristianEl = document.querySelector('input[name="is_christian"]:checked');
    const isChristian = isChristianEl ? isChristianEl.value : 'Não informado';

    if (!name || !phone || !source) {
      showToast('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const message = 
      `*Cartão de Visitante - Comunidade da Cruz*\n\n` +
      `👤 *Nome:* ${name}\n` +
      `📱 *WhatsApp:* ${phone}\n` +
      `🔍 *Como conheceu a igreja:* ${source}\n` +
      `✝️ *Já é cristão evangélico:* ${isChristian}\n\n` +
      `_Enviado através do site oficial da Igreja Reformada Comunidade da Cruz._`;

    const encodedMessage = encodeURIComponent(message);
    const churchPhone = '5582996298697';
    const whatsappUrl = `https://wa.me/${churchPhone}?text=${encodedMessage}`;

    showToast('Redirecionando para o WhatsApp da igreja...');
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      form.reset();
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   COPY TO CLIPBOARD WITH TOAST
   -------------------------------------------------------------------------- */
window.copyToClipboard = function(text, successMsg = 'Copiado para a área de transferência!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
};

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('Erro ao copiar. Selecione manualmente.');
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   MODAL CONTROLS (MISSIONARIES & EVENTS)
   -------------------------------------------------------------------------- */
window.openMissionaryModal = function(title, region, details) {
  const content = `
    <span class="eyebrow" style="font-size: 0.6875rem;">Campo Missionário</span>
    <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-brown-dark); margin-bottom: 0.5rem;">${title}</h3>
    <div style="font-size: 0.875rem; color: var(--color-primary); font-weight: 700; margin-bottom: 1.25rem;">
      <i class="fa-solid fa-map-location-dot"></i> ${region}
    </div>
    <p style="font-size: 0.9375rem; color: var(--color-text-muted); line-height: 1.7; margin-bottom: 2rem;">
      ${details}
    </p>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <a href="https://wa.me/5582996298697?text=Gostaria%20de%20apoiar%20ou%20saber%20mais%20sobre%20o%20campo%20missionário:%20${encodeURIComponent(title)}" target="_blank" class="btn btn-primary btn-sm" style="flex: 1;">
        <i class="fa-brands fa-whatsapp"></i> Como Apoiar
      </a>
      <button class="btn btn-secondary btn-sm" onclick="closeGenericModal()">Fechar</button>
    </div>
  `;
  showModalContent(content);
};

window.openEventModal = function(name, date, location, details) {
  const content = `
    <span class="eyebrow" style="font-size: 0.6875rem;">Detalhes do Evento</span>
    <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-brown-dark); margin-bottom: 0.5rem;">${name}</h3>
    <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; font-size: 0.875rem; color: var(--color-brown-dark);">
      <div><i class="fa-regular fa-calendar-check" style="color: var(--color-primary);"></i> <strong>Data/Horário:</strong> ${date}</div>
      <div><i class="fa-solid fa-location-dot" style="color: var(--color-primary);"></i> <strong>Local:</strong> ${location}</div>
    </div>
    <p style="font-size: 0.9375rem; color: var(--color-text-muted); line-height: 1.7; margin-bottom: 2rem;">
      ${details}
    </p>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <a href="https://wa.me/5582996298697?text=Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20evento:%20${encodeURIComponent(name)}" target="_blank" class="btn btn-primary btn-sm" style="flex: 1;">
        <i class="fa-brands fa-whatsapp"></i> Tirar Dúvidas
      </a>
      <button class="btn btn-secondary btn-sm" onclick="closeGenericModal()">Fechar</button>
    </div>
  `;
  showModalContent(content);
};

function showModalContent(html) {
  const modal = document.getElementById('generic-modal');
  const modalContent = document.getElementById('modal-content');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = html;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.closeGenericModal = function() {
  const modal = document.getElementById('generic-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

// Close modal when clicking outside or pressing ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeGenericModal();
  }
});

const genericModal = document.getElementById('generic-modal');
if (genericModal) {
  genericModal.addEventListener('click', (e) => {
    if (e.target === genericModal) {
      closeGenericModal();
    }
  });
}
