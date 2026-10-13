const sampleProperties = [
  { id: 1, title: "The Olive House", type: "House", location: "Marrakech, Morocco", price: 92, rating: "4.92", beds: 3, baths: 2, guests: 6, area: "145 m²", tag: "Guest favorite", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85", description: "A calm, light-filled home with a private garden and a comfortable outdoor space. Ideal for families or friends looking for a relaxed stay." },
  { id: 2, title: "City Light Apartment", type: "Apartment", location: "Casablanca, Morocco", price: 68, rating: "4.86", beds: 2, baths: 1, guests: 3, area: "74 m²", tag: "Great value", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85", description: "A modern apartment close to cafés and city life, with a welcoming living area and a practical layout for a short city break." },
  { id: 3, title: "Blue Horizon Villa", type: "Villa", location: "Agadir, Morocco", price: 145, rating: "4.98", beds: 4, baths: 3, guests: 8, area: "210 m²", tag: "Popular choice", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85", description: "A spacious coastal-style villa with bright rooms and plenty of space to unwind after a day exploring the coast." },
  { id: 4, title: "The Medina Hideaway", type: "House", location: "Fes, Morocco", price: 74, rating: "4.89", beds: 2, baths: 2, guests: 4, area: "98 m²", tag: "Full of character", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85", description: "A characterful home inspired by traditional details, with a comfortable interior and a peaceful place to recharge." },
  { id: 5, title: "Palm View Studio", type: "Apartment", location: "Rabat, Morocco", price: 55, rating: "4.78", beds: 1, baths: 1, guests: 2, area: "48 m²", tag: "Simple & cozy", image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1000&q=85", description: "A compact, thoughtfully arranged studio for solo travelers or couples who want a simple, comfortable base." },
  { id: 6, title: "Garden Courtyard Villa", type: "Villa", location: "Tangier, Morocco", price: 128, rating: "4.95", beds: 3, baths: 2, guests: 6, area: "176 m²", tag: "Room to relax", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85", description: "A generous villa with warm materials, an airy layout, and a garden courtyard for slow mornings and shared meals." }
];

function getUserProperties() {
  try { return JSON.parse(localStorage.getItem("houseRentUserProperties")) || []; }
  catch { return []; }
}
let userProperties = getUserProperties();
let properties = [...sampleProperties, ...userProperties];

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

const DEFAULT_PROPERTY_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85";

const propertyGrid = document.querySelector("#propertyGrid");
const locationSearch = document.querySelector("#locationSearch");
const typeFilter = document.querySelector("#typeFilter");
const priceFilter = document.querySelector("#priceFilter");
const resultsCount = document.querySelector("#resultsCount");
const emptyState = document.querySelector("#emptyState");
const modal = document.querySelector("#propertyModal");
const toast = document.querySelector("#toast");
let toastTimer;

function getFavorites() {
  try { return JSON.parse(localStorage.getItem("houseRentFavorites")) || []; }
  catch { return []; }
}
let favorites = getFavorites();

function renderProperties() {
  const query = locationSearch.value.trim().toLowerCase();
  const selectedType = typeFilter.value;
  const maxPrice = priceFilter.value === "all" ? Infinity : Number(priceFilter.value);

  const filtered = properties.filter(property => {
    const matchesQuery = `${property.title} ${property.location} ${property.type}`.toLowerCase().includes(query);
    const matchesType = selectedType === "all" || property.type === selectedType;
    return matchesQuery && matchesType && property.price <= maxPrice;
  });

  resultsCount.textContent = tr("showing").replace("{shown}", filtered.length).replace("{total}", properties.length);
  emptyState.hidden = filtered.length !== 0;
  propertyGrid.innerHTML = filtered.map((property, index) => {
    const isUserProperty = userProperties.some(userProperty => userProperty.id === property.id);
    return `
    <article class="property-card" style="animation-delay:${index * 70}ms">
      <div class="card-image-wrap">
        <img class="card-image" src="${escapeHTML(property.image || DEFAULT_PROPERTY_IMAGE)}" alt="${escapeHTML(property.title)}" loading="lazy" onerror="this.onerror=null;this.src='${DEFAULT_PROPERTY_IMAGE}'">
        <span class="card-badge">${escapeHTML(property.tag)}</span>
        <button class="favorite-button ${favorites.includes(property.id) ? "is-favorite" : ""}" data-favorite="${property.id}" aria-label="${favorites.includes(property.id) ? "Remove from" : "Add to"} favorites" aria-pressed="${favorites.includes(property.id)}">${favorites.includes(property.id) ? "♥" : "♡"}</button>
      </div>
      <div class="card-content">
        <p class="card-location">⌖ ${escapeHTML(property.location)}</p>
        <div class="card-title-row"><h3 class="card-title">${escapeHTML(property.title)}</h3><span class="rating"><span>★</span>${property.rating}</span></div>
        <p class="card-description">${escapeHTML(property.description)}</p>
        <div class="card-footer"><div class="price"><strong>$${property.price}</strong> <small>${tr("night")}</small></div><button class="details-button" data-details="${property.id}">${tr("detailsButton")}</button></div>
        ${isUserProperty ? `<button class="delete-property-button" data-delete-property="${property.id}" aria-label="Delete ${escapeHTML(property.title)}">${tr("deleteButton")}</button>` : ""}
      </div>
    </article>`;
  }).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
  try { localStorage.setItem("houseRentFavorites", JSON.stringify(favorites)); }
  catch { showToast("Favorites cannot be saved in this browser."); }
  renderProperties();
  showToast(favorites.includes(id) ? "Added to your favorites ♥" : "Removed from your favorites");
}

function openProperty(id) {
  const property = properties.find(item => item.id === id);
  if (!property) return;
  document.querySelector("#modalImage").onerror = function () { this.onerror = null; this.src = DEFAULT_PROPERTY_IMAGE; };
  document.querySelector("#modalImage").src = property.image || DEFAULT_PROPERTY_IMAGE;
  document.querySelector("#modalImage").alt = property.title;
  document.querySelector("#modalType").textContent = `${property.type.toUpperCase()} · ${property.tag.toUpperCase()}`;
  document.querySelector("#modalTitle").textContent = property.title;
  document.querySelector("#modalLocation").textContent = `⌖ ${property.location}`;
  document.querySelector("#modalDescription").textContent = property.description;
  document.querySelector("#modalMeta").innerHTML = `<span>🛏 ${property.beds} ${tr("beds")}</span><span>♧ ${property.baths} ${tr("baths")}</span><span>♙ ${tr("upto")} ${property.guests} ${tr("guests")}</span><span>↗ ${property.area}</span>`;
  document.querySelector("#modalPrice").innerHTML = `$${property.price} <small>${tr("night")}</small>`;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  document.querySelector("#modalClose").focus();
}
function closeModal() { modal.hidden = true; document.body.style.overflow = ""; }

propertyGrid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const detailsButton = event.target.closest("[data-details]");
  const deleteButton = event.target.closest("[data-delete-property]");

  if (favoriteButton) toggleFavorite(Number(favoriteButton.dataset.favorite));
  if (detailsButton) openProperty(Number(detailsButton.dataset.details));

  if (deleteButton) {
    const propertyId = Number(deleteButton.dataset.deleteProperty);
    const propertyToDelete = userProperties.find(property => property.id === propertyId);
    if (!propertyToDelete) return; // Never delete built-in sample listings.
    if (!confirm(`Delete your listing "${propertyToDelete.title}"? This cannot be undone.`)) return;

    const previousUserProperties = userProperties;
    userProperties = userProperties.filter(property => property.id !== propertyId);
    try {
      localStorage.setItem("houseRentUserProperties", JSON.stringify(userProperties));
    } catch {
      userProperties = previousUserProperties;
      showToast("Could not delete the listing. Please check browser storage.");
      return;
    }

    properties = [...sampleProperties, ...userProperties];
    favorites = favorites.filter(id => id !== propertyId);
    try { localStorage.setItem("houseRentFavorites", JSON.stringify(favorites)); } catch { }
    renderProperties();
    showToast("Your listing was deleted.");
  }
});
document.querySelector("#searchButton").addEventListener("click", () => {
  renderProperties();
  document.querySelector("#listings").scrollIntoView({ behavior: "smooth" });
});
locationSearch.addEventListener("input", renderProperties);
typeFilter.addEventListener("change", renderProperties);
priceFilter.addEventListener("change", renderProperties);
document.querySelector("#clearFilters").addEventListener("click", () => {
  locationSearch.value = "";
  typeFilter.value = "all";
  priceFilter.value = "all";
  renderProperties();
});
document.querySelector("#modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && !modal.hidden) closeModal(); });
document.querySelector("#modalContact").addEventListener("click", () => {
  closeModal();
  document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
  showToast("Use the demo contact form to send a sample message.");
});
document.querySelector("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  document.querySelector("#formMessage").textContent = "Thanks! This demo form works visually, but it does not send email yet.";
  form.reset();
  showToast("Message demo submitted ✓");
});
document.querySelector("#year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Reveal elements as they enter the viewport. The fallback supports older browsers.
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
}


const addPropertyForm = document.querySelector("#addPropertyForm");
const addPropertyMessage = document.querySelector("#addPropertyMessage");

addPropertyForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!addPropertyForm.reportValidity()) return;

  const title = document.querySelector("#newPropertyTitle").value.trim();
  const location = document.querySelector("#newPropertyLocation").value.trim();
  const type = document.querySelector("#newPropertyType").value;
  const price = Number(document.querySelector("#newPropertyPrice").value);
  const beds = Number(document.querySelector("#newPropertyBeds").value);
  const baths = Number(document.querySelector("#newPropertyBaths").value);
  const imageUrl = document.querySelector("#newPropertyImage").value.trim();
  const description = document.querySelector("#newPropertyDescription").value.trim();

  if (!title || !location || !type || !description || !Number.isFinite(price) || price <= 0) {
    addPropertyMessage.textContent = tr("invalid");
    return;
  }

  const newProperty = {
    id: Math.max(0, ...properties.map(property => Number(property.id) || 0)) + 1,
    title, type, location, price, beds, baths,
    guests: Math.max(1, beds * 2),
    area: "Not specified",
    tag: "New listing",
    rating: "New",
    image: imageUrl || DEFAULT_PROPERTY_IMAGE,
    description
  };

  userProperties.push(newProperty);
  try {
    localStorage.setItem("houseRentUserProperties", JSON.stringify(userProperties));
  } catch {
    userProperties.pop();
    addPropertyMessage.textContent = tr("saveError");
    return;
  }

  properties = [...sampleProperties, ...userProperties];
  addPropertyForm.reset();
  document.querySelector("#newPropertyBeds").value = "1";
  document.querySelector("#newPropertyBaths").value = "1";
  locationSearch.value = "";
  typeFilter.value = "all";
  priceFilter.value = "all";
  renderProperties();
  addPropertyMessage.textContent = tr("added");
  showToast("New property added ✓");
  document.querySelector("#listings").scrollIntoView({ behavior: "smooth" });
});

// renderProperties();


const translations = {
  en: { home: "Home", listings: "Listings", why: "Why us", contact: "Contact", explore: "Explore homes", heroEyebrow: "FIND YOUR NEXT STAY", heroTitle: 'A place that feels<br><em>like your own.</em>', heroDesc: "Thoughtfully selected homes for weekends away, work trips, and new adventures.", browse: "Browse properties", how: "How it works", share: "SHARE YOUR SPACE", addTitle: 'Have a home to <em>rent out?</em>', addIntro: "Add your property details below and your new listing will appear in the collection.", name: "Property name", location: "City / location", type: "Property type", choose: "Choose a type", price: "Price per night ($)", bedsLabel: "Bedrooms", bathsLabel: "Bathrooms", photo: "Photo URL (optional)", description: "Description", add: "＋ Add your property", inspire: "A LITTLE INSPIRATION", listTitle: 'Places worth <em>staying for.</em>', listIntro: "From a quiet city apartment to a sunlit villa, find a space that fits your plans.", clear: "Clear filters ↺", empty: "No homes match those filters. Try another destination or price.", whyEyebrow: "A BETTER WAY TO STAY", whyTitle: 'Good trips begin<br>with <em>the right place.</em>', whyDesc: "HouseRent is a front-end learning demo for browsing a collection of homes.", find: "Find your stay", talk: "LET'S TALK", contactTitle: 'Have a question? <em>Say hello.</em>', yourName: "Your name", email: "Email address", message: "Message", send: "Send message", night: "/ night", detailsButton: "View details ↗", deleteButton: "Delete my listing", beds: "bedrooms", baths: "bathrooms", upto: "Up to", guests: "guests", showing: "Showing {shown} of {total} homes", added: "Your property was added and saved in this browser.", invalid: "Please complete all required fields with valid values.", saveError: "This browser could not save the listing.", confirmDelete: "Delete this property? This cannot be undone.", deleted: "Property deleted.", newListing: "New listing" },
  fr: { home: "Accueil", listings: "Logements", why: "Pourquoi nous", contact: "Contact", explore: "Explorer les logements", heroEyebrow: "TROUVEZ VOTRE PROCHAIN SÉJOUR", heroTitle: 'Un lieu où vous vous sentez<br><em>comme chez vous.</em>', heroDesc: "Des logements choisis pour les week-ends, les voyages professionnels et les aventures.", browse: "Parcourir les biens", how: "Comment ça marche", share: "PARTAGEZ VOTRE ESPACE", addTitle: 'Un logement à <em>louer ?</em>', addIntro: "Ajoutez les détails de votre bien pour le faire apparaître dans la collection.", name: "Nom du bien", location: "Ville / emplacement", type: "Type de bien", choose: "Choisir un type", price: "Prix par nuit ($)", bedsLabel: "Chambres", bathsLabel: "Salles de bain", photo: "URL de la photo (facultatif)", description: "Description", add: "＋ Ajouter votre bien", inspire: "UN PEU D'INSPIRATION", listTitle: 'Des lieux où il fait bon <em>séjourner.</em>', listIntro: "D'un appartement calme à une villa ensoleillée, trouvez le lieu idéal.", clear: "Effacer les filtres ↺", empty: "Aucun logement correspondant. Essayez une autre destination ou un autre prix.", whyEyebrow: "UNE MEILLEURE FAÇON DE SÉJOURNER", whyTitle: 'Les beaux voyages commencent<br><em>par le bon endroit.</em>', whyDesc: "HouseRent est une démonstration front-end pour parcourir des logements.", find: "Trouver votre séjour", talk: "PARLONS-EN", contactTitle: 'Une question ? <em>Écrivez-nous.</em>', yourName: "Votre nom", email: "Adresse e-mail", message: "Message", send: "Envoyer", night: "/ nuit", detailsButton: "Voir les détails ↗", deleteButton: "Supprimer mon annonce", beds: "chambres", baths: "salles de bain", upto: "Jusqu'à", guests: "voyageurs", showing: "Affichage de {shown} sur {total} logements", added: "Votre annonce a été ajoutée et enregistrée.", invalid: "Veuillez remplir correctement tous les champs obligatoires.", saveError: "Impossible d'enregistrer l'annonce dans ce navigateur.", confirmDelete: "Supprimer ce logement ? Cette action est irréversible.", deleted: "Logement supprimé.", newListing: "Nouvelle annonce" },
  nl: { home: "Home", listings: "Woningen", why: "Waarom wij", contact: "Contact", explore: "Bekijk woningen", heroEyebrow: "VIND JE VOLGENDE VERBLIJF", heroTitle: 'Een plek die voelt<br><em>als je eigen thuis.</em>', heroDesc: "Zorgvuldig gekozen woningen voor weekendjes weg, zakenreizen en avonturen.", browse: "Bekijk woningen", how: "Hoe het werkt", share: "DEEL JE RUIMTE", addTitle: 'Een woning om <em>te verhuren?</em>', addIntro: "Voeg hieronder de gegevens toe; je woning verschijnt in het overzicht.", name: "Naam van de woning", location: "Stad / locatie", type: "Woningtype", choose: "Kies een type", price: "Prijs per nacht ($)", bedsLabel: "Slaapkamers", bathsLabel: "Badkamers", photo: "Foto-URL (optioneel)", description: "Beschrijving", add: "＋ Woning toevoegen", inspire: "EEN BEETJE INSPIRATIE", listTitle: 'Plekken om voor te <em>blijven.</em>', listIntro: "Vind van stadsappartement tot zonnige villa een plek die bij je past.", clear: "Filters wissen ↺", empty: "Geen woningen gevonden. Probeer een andere bestemming of prijs.", whyEyebrow: "EEN BETERE MANIER OM TE VERBLIJVEN", whyTitle: 'Een goede reis begint<br><em>met de juiste plek.</em>', whyDesc: "HouseRent is een front-end leerproject om woningen te bekijken.", find: "Vind je verblijf", talk: "NEEM CONTACT OP", contactTitle: 'Een vraag? <em>Laat van je horen.</em>', yourName: "Je naam", email: "E-mailadres", message: "Bericht", send: "Bericht versturen", night: "/ nacht", detailsButton: "Bekijk details ↗", deleteButton: "Mijn advertentie verwijderen", beds: "slaapkamers", baths: "badkamers", upto: "Tot", guests: "gasten", showing: "Toont {shown} van {total} woningen", added: "Je woning is toegevoegd en opgeslagen.", invalid: "Vul alle verplichte velden correct in.", saveError: "De woning kon niet worden opgeslagen.", confirmDelete: "Deze woning verwijderen? Dit kan niet ongedaan worden gemaakt.", deleted: "Woning verwijderd.", newListing: "Nieuwe advertentie" },
  de: { home: "Startseite", listings: "Unterkünfte", why: "Warum wir", contact: "Kontakt", explore: "Unterkünfte entdecken", heroEyebrow: "FINDEN SIE IHREN NÄCHSTEN AUFENTHALT", heroTitle: 'Ein Ort, der sich anfühlt<br><em>wie Ihr Zuhause.</em>', heroDesc: "Sorgfältig ausgewählte Unterkünfte für Wochenenden, Geschäftsreisen und Abenteuer.", browse: "Unterkünfte ansehen", how: "So funktioniert es", share: "TEILEN SIE IHREN RAUM", addTitle: 'Ein Zuhause zu <em>vermieten?</em>', addIntro: "Fügen Sie Ihre Unterkunftsdaten hinzu, damit Ihr Angebot angezeigt wird.", name: "Name der Unterkunft", location: "Stadt / Standort", type: "Unterkunftstyp", choose: "Typ auswählen", price: "Preis pro Nacht ($)", bedsLabel: "Schlafzimmer", bathsLabel: "Badezimmer", photo: "Foto-URL (optional)", description: "Beschreibung", add: "＋ Unterkunft hinzufügen", inspire: "EINE KLEINE INSPIRATION", listTitle: 'Orte, an denen man gern <em>bleibt.</em>', listIntro: "Finden Sie vom Stadtapartment bis zur sonnigen Villa den passenden Ort.", clear: "Filter löschen ↺", empty: "Keine passenden Unterkünfte. Versuchen Sie ein anderes Ziel oder einen anderen Preis.", whyEyebrow: "BESSER ÜBERNACHTEN", whyTitle: 'Gute Reisen beginnen<br><em>am richtigen Ort.</em>', whyDesc: "HouseRent ist ein Frontend-Lernprojekt zum Durchsuchen von Unterkünften.", find: "Unterkunft finden", talk: "SPRECHEN WIR", contactTitle: 'Eine Frage? <em>Schreiben Sie uns.</em>', yourName: "Ihr Name", email: "E-Mail-Adresse", message: "Nachricht", send: "Nachricht senden", night: "/ Nacht", detailsButton: "Details ansehen ↗", deleteButton: "Mein Angebot löschen", beds: "Schlafzimmer", baths: "Badezimmer", upto: "Bis zu", guests: "Gäste", showing: "Zeige {shown} von {total} Unterkünften", added: "Ihre Unterkunft wurde hinzugefügt und gespeichert.", invalid: "Bitte füllen Sie alle Pflichtfelder korrekt aus.", saveError: "Die Unterkunft konnte nicht gespeichert werden.", confirmDelete: "Diese Unterkunft löschen? Dies kann nicht rückgängig gemacht werden.", deleted: "Unterkunft gelöscht.", newListing: "Neues Angebot" },
  ar: { home: "الرئيسية", listings: "المساكن", why: "لماذا نحن", contact: "اتصل بنا", explore: "استكشف المساكن", heroEyebrow: "اعثر على إقامتك القادمة", heroTitle: 'مكان تشعر فيه<br><em>وكأنه منزلك.</em>', heroDesc: "مساكن مختارة بعناية للعطلات ورحلات العمل والمغامرات الجديدة.", browse: "تصفح العقارات", how: "كيف يعمل الموقع", share: "شارك مساحتك", addTitle: 'هل لديك منزل <em>للإيجار؟</em>', addIntro: "أضف تفاصيل عقارك ليظهر إعلانك الجديد ضمن المساكن.", name: "اسم العقار", location: "المدينة / الموقع", type: "نوع العقار", choose: "اختر النوع", price: "السعر لليلة (دولار)", bedsLabel: "غرف النوم", bathsLabel: "الحمامات", photo: "رابط الصورة (اختياري)", description: "الوصف", add: "＋ أضف عقارك", inspire: "بعض الإلهام", listTitle: 'أماكن تستحق <em>الإقامة فيها.</em>', listIntro: "من شقة هادئة إلى فيلا مشمسة، اختر ما يناسبك.", clear: "مسح عوامل التصفية ↺", empty: "لا توجد مساكن مطابقة. جرّب وجهة أو سعرًا آخر.", whyEyebrow: "طريقة أفضل للإقامة", whyTitle: 'الرحلات الجميلة تبدأ<br><em>باختيار المكان المناسب.</em>', whyDesc: "HouseRent نموذج تعليمي لتصفح مجموعة من المساكن.", find: "اعثر على إقامتك", talk: "لنتحدث", contactTitle: 'لديك سؤال؟ <em>تواصل معنا.</em>', yourName: "اسمك", email: "البريد الإلكتروني", message: "الرسالة", send: "إرسال الرسالة", night: "/ الليلة", detailsButton: "عرض التفاصيل ↗", deleteButton: "حذف إعلاني", beds: "غرف نوم", baths: "حمامات", upto: "حتى", guests: "ضيوف", showing: "عرض {shown} من {total} مساكن", added: "تمت إضافة عقارك وحفظه في هذا المتصفح.", invalid: "يرجى إكمال جميع الحقول المطلوبة بشكل صحيح.", saveError: "تعذر حفظ الإعلان في هذا المتصفح.", confirmDelete: "هل تريد حذف هذا العقار؟ لا يمكن التراجع.", deleted: "تم حذف العقار.", newListing: "إعلان جديد" }
};
let currentLanguage = localStorage.getItem("houseRentLanguage") || "en";
if (!translations[currentLanguage]) currentLanguage = "en";
const tr = key => translations[currentLanguage][key] || translations.en[key] || key;
function applyLanguage() {
  const t = translations[currentLanguage]; document.documentElement.lang = currentLanguage; document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  const text = (s, k) => { const e = document.querySelector(s); if (e) e.textContent = tr(k) };
  document.querySelectorAll('.main-nav a').forEach((e, i) => e.textContent = tr(["home", "listings", "why", "contact"][i]));
  text('.header-cta', 'explore'); text('.hero-copy .eyebrow', 'heroEyebrow'); document.querySelector('.hero-copy h1').innerHTML = tr('heroTitle'); text('.hero-description', 'heroDesc');
  const heroLinks = document.querySelectorAll('.hero-actions a'); if (heroLinks[0]) heroLinks[0].textContent = tr('browse'); if (heroLinks[1]) heroLinks[1].textContent = tr('how');
  const sh = document.querySelectorAll('.section-heading'); if (sh[0]) { sh[0].querySelector('.eyebrow').textContent = tr('share'); sh[0].querySelector('h2').innerHTML = tr('addTitle'); sh[0].querySelector('.section-intro').textContent = tr('addIntro') } if (sh[1]) { sh[1].querySelector('.eyebrow').textContent = tr('inspire'); sh[1].querySelector('h2').innerHTML = tr('listTitle'); sh[1].querySelector('.section-intro').textContent = tr('listIntro') } if (sh[2]) { sh[2].querySelector('.eyebrow').textContent = tr('talk'); sh[2].querySelector('h2').innerHTML = tr('contactTitle') }
  const labels = document.querySelectorAll('#addPropertyForm > label');['name', 'location', 'type', 'price', 'bedsLabel', 'bathsLabel', 'photo', 'description'].forEach((k, i) => { if (labels[i]) labels[i].childNodes[0].textContent = tr(k) + ' ' }); document.querySelector('#newPropertyType').options[0].textContent = tr('choose'); document.querySelector('#newPropertyDescription').placeholder = tr('description'); document.querySelector('#addPropertyForm button[type="submit"]').textContent = tr('add'); text('#clearFilters', 'clear'); text('#emptyState', 'empty');
  const why = document.querySelector('.why-copy'); if (why) { why.querySelector('.eyebrow').textContent = tr('whyEyebrow'); why.querySelector('h2').innerHTML = tr('whyTitle'); why.querySelector('p:not(.eyebrow)').textContent = tr('whyDesc'); why.querySelector('a').textContent = tr('find') }
  const cl = document.querySelectorAll('#contactForm label');['yourName', 'email', 'message'].forEach((k, i) => { if (cl[i]) cl[i].childNodes[0].textContent = tr(k) + ' ' }); text('#contactForm button', 'send'); renderProperties();
}
const languageSelect = document.querySelector('#languageSelect'); languageSelect.value = currentLanguage; 
languageSelect.addEventListener('change', e => { 
  currentLanguage = e.target.value;
   try { localStorage.setItem('houseRentLanguage', currentLanguage) } catch { } applyLanguage() });

applyLanguage();
