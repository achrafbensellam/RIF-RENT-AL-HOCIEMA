# HouseRent — beginner front-end project

A responsive sample house-rental listing website built with **HTML, CSS, and vanilla JavaScript**. It is a learning/demo project inspired by common accommodation-search patterns; it is not affiliated with Booking.com.

## Run it
1. Extract the ZIP.
2. Open `index.html` in a browser. For a smoother local development experience, use VS Code with the Live Server extension.
3. Internet access is required for Google Fonts and the sample Unsplash photos.

## Features
- Responsive navigation and layout
- Sample property cards generated from a JavaScript array
- Add a rental property using the owner listing form (name, location, type, price, rooms, photo URL, description)
- New listings persist in this browser using `localStorage`
- Updated sea-blue and white color palette
- Search by city, property name, or type
- Filter by property type and maximum nightly price
- Favorites saved in `localStorage`
- Property details modal with Escape/backdrop close
- Demo contact form validation and confirmation
- Scroll reveal and card/modal animations
- Reduced-motion preference support

## Project structure
```text
house-rent-starter/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

## Important limitations
- Properties, prices, and ratings are sample data; user-created listings are saved only in the current browser.
- The contact form does not send email.
- There is no real booking, login, payment, calendar availability, database, or owner dashboard.
- `localStorage` is browser-local and is not suitable for storing sensitive data.
- Before publishing a commercial service, use licensed photos, accurate listings, clear terms, privacy/security protections, and a backend.

## Suggested next steps
1. Replace sample property data and photos with your own licensed content.
2. Add date and guest filters.
3. Add a backend/API and database for listings and contact requests.
4. Add secure authentication and owner listing management.
5. Add real booking availability and payment integration only after the backend and legal requirements are understood.
6. Deploy a static demo with GitHub Pages or Netlify; backend features need a backend host too.
