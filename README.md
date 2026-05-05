# SportAgora

SportAgora is a web system for managing sports events, user registrations, and ticket sales.
It allows users to sign up, log in, browse events, and purchase tickets (full or half-price), all integrated with a database and email notifications.

---

## Technologies Used

* Node.js
* Express
* EJS (templating)
* MySQL
* Express-validator (form validation)
* Bcrypt (password hashing)
* Express-session (user sessions)
* Leaflet (interactive map)
* Mercado Pago API (ticket payments)

---

## Prerequisites

* Node.js installed
* MySQL installed
* Valid email account for notifications
* Mercado Pago account for payments (optional)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/SportAgora/SportAgoraWebSite
cd sportagora
```

2. If necessary, disable strict SSL:

```bash
npm config set strict-ssl false
```

3. Install dependencies:

```bash
npm install --save
```

4. Create the database using the script:

```sql
-- script.sql
```

5. Create a `.env` file in the root directory with the following variables:

```env
DB_HOST        =
DB_USER        =
DB_PASSWORD    =
DB_NAME        =
DB_PORT        =
APP_PORT       =
EMAIL_USER     =
SECRET_KEY     =
EMAIL_SERVICE  =
URL_BASE       =
MP_ACCESS_TOKEN =
```

Example:

```env
DB_HOST        = localhost
DB_USER        = root
DB_PASSWORD    =
DB_NAME        = sportagora
DB_PORT        = 3306
APP_PORT       = 3000
EMAIL_USER     = email@email.com
SECRET_KEY     = your_secret_key
EMAIL_SERVICE  = gmail
URL_BASE       = https://localhost:3000
MP_ACCESS_TOKEN = YOUR_MERCADO_PAGO_TOKEN
```

---

## Running the Project

```bash
npm start
```

The system will be available at: `http://localhost:3000` (or the port defined in `.env`).

---

## Features

* User registration and login
* Profile editing
* Browse sports events
* Ticket selection (full/half-price) and quantity
* Event registration
* Online payment via Mercado Pago
* Email notifications
* Interactive event map using Leaflet

---

## Project Structure

* `controllers/` → control logic
* `models/` → database access
* `views/` → EJS files
* `public/` → static files (CSS, JS, images)
* `routes/` → Express routes
* `.env` → environment variables

---

## Contact

📧 Email: [kaiquecerrifialho1@gmail.com](mailto:kaiquecerrifialho1@gmail.com)
