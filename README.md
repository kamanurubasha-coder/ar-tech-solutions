# AR TECH SOLUTIONS

A modern full-stack company website built with Node.js, Express, MongoDB, and responsive front-end animations.

## Features
- Responsive multi-page website
- Business profile and service pages
- Animated hero and scroll reveal section effects
- Contact form with MongoDB storage
- Email sending via SMTP (optional but supported)
- SEO-friendly structure

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Email: Nodemailer

## Project Structure
```bash
ar-tech-solutions/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── portfolio.html
│   └── contact.html
├── models/
│   └── Contact.js
├── .env.example
├── package.json
├── server.js
├── README.md
└── .gitignore
```

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update your MongoDB and SMTP settings inside `.env`.

## Run locally
```bash
npm run dev
```

Then open:
```bash
http://localhost:3000
```

## Production note
If SMTP details are not configured, the form will still save data in MongoDB and skip email delivery.

## Contact
AR TECH SOLUTIONS  
Rayachoti, Andhra Pradesh  
Phone: +91 95151 39866  
Email: kamanurubasha@gmail.com
