# Kaleab Abduke — Portfolio

The personal portfolio of Kaleab Abduke, an Odoo developer based in Addis Ababa, Ethiopia. It presents ERP work, selected projects, experience, and contact details.

[View the live site](https://sosaportfolio.netlify.app) · [GitHub profile](https://github.com/Kalabduke)

## Highlights

- Odoo ERP development, workflow configuration, customisation, and automation
- Responsive portfolio with light and dark themes
- Downloadable CV and a Formspree-powered contact form
- Featured projects: Pulse, SignLang, and a network traffic and log-analysis pipeline

## Featured projects

- **[Pulse](https://pulse-gray-eight.vercel.app/):** a realtime status-sharing and messaging app built with JavaScript, Supabase Realtime, Capacitor, and Firebase Cloud Messaging.
- **[SignLang](https://signlang1.netlify.app/):** a sign-language learning app built with React, TypeScript, Tailwind, Vite, and Flutter.
- **[Network Traffic & Log Analysis](https://github.com/Kalabduke/network-analysis):** a real-time network and system-log pipeline using Python, Kafka, Spark, Elasticsearch, Kibana, and Filebeat.

## Technology

The site uses plain HTML, CSS, and JavaScript. It loads Google Fonts and Font Awesome 6.7.0 from a CDN, so there is no build step or package installation required.

## Run locally

Clone the repository and serve the files from the project directory:

```bash
git clone https://github.com/Kalabduke/Portfolio.git
cd Portfolio
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in a browser.

## Project structure

```text
.
├── index.html       # Main portfolio page
├── projects.html    # Project listing
├── contact.html     # Contact page
├── style.css        # Shared site styles
├── script.js        # Theme, interactions, CV, and contact-form behavior
├── manifest.json    # Web app metadata
├── assets/          # Images and icons
└── cv/              # Downloadable CV
```

## Contact form

The contact form submits messages through Formspree. Its form ID is configured in `script.js`:

```js
const FORMSPREE_FORM_ID = 'mwvrprgw';
```

To use a different Formspree form, replace that value with the new form ID before deploying.

## Deploy

The site is deployed on Netlify. To publish changes, push them to the repository branch connected to the Netlify site.

## License

All rights reserved. Do not reuse the portfolio’s personal content or assets without permission.
