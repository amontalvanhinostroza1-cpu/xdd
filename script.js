// ============================================================
// NAYELI — Cocina de autor
// Personaliza aquí los datos reales del restaurante.
// ============================================================

// Escribe el WhatsApp del restaurante con código de país,
// sin +, espacios ni guiones. Ejemplo Perú: 51987654321
// Déjalo vacío hasta tener el número confirmado.
const WHATSAPP_NUMBER = "";

// Menú móvil
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    mainNav.classList.toggle("open", !isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
    });
  });
}

// Filtros de la carta
const filterButtons = document.querySelectorAll(".filter-button");
const menuCards = document.querySelectorAll(".menu-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    menuCards.forEach((card) => {
      const shouldShow = selectedCategory === "todos" || card.dataset.category === selectedCategory;
      card.hidden = !shouldShow;
    });
  });
});

// Fecha mínima: no permitir reservar en una fecha pasada.
const dateInput = document.getElementById("guestDate");
if (dateInput) {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  dateInput.min = localDate;
}

// Solicitud de reserva. Si el número de WhatsApp está configurado,
// se abre WhatsApp con el mensaje listo. Si no, se muestra una guía.
const reservationForm = document.getElementById("reservationForm");
const formFeedback = document.getElementById("formFeedback");

if (reservationForm && formFeedback) {
  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!reservationForm.reportValidity()) return;

    const formData = new FormData(reservationForm);
    const booking = {
      nombre: String(formData.get("nombre") || "").trim(),
      fecha: String(formData.get("fecha") || ""),
      hora: String(formData.get("hora") || ""),
      personas: String(formData.get("personas") || ""),
      telefono: String(formData.get("telefono") || "").trim(),
      mensaje: String(formData.get("mensaje") || "").trim()
    };

    const message = [
      "Hola, Nayeli. Quisiera consultar disponibilidad para una reserva:",
      "Nombre: " + booking.nombre,
      "Fecha: " + booking.fecha,
      "Hora: " + booking.hora,
      "Personas: " + booking.personas,
      "Teléfono: " + booking.telefono,
      booking.mensaje ? "Detalle: " + booking.mensaje : ""
    ].filter(Boolean).join("\n");

    if (/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      const whatsappUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      formFeedback.textContent = "Tu mensaje está preparado en WhatsApp. La reserva se confirma cuando el restaurante responda.";
    } else {
      formFeedback.textContent = "¡Gracias, " + booking.nombre + "! La solicitud está validada. Para enviarla, configura WHATSAPP_NUMBER en script.js con el número real del restaurante.";
    }
  });
}

// Año automático en el pie de página
const yearElement = document.getElementById("currentYear");
if (yearElement) yearElement.textContent = new Date().getFullYear();

// Botón volver arriba
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });
}
