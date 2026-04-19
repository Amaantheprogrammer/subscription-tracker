SubDub: Subscription Tracker API
SubDub is a high-performance, secure, and automated Subscription Management API built with the MERN stack. It empowers users to track their recurring expenses and provides an automated notification system that sends email reminders before subscription renewals.

🚀 Key Features
Automated Email Reminders: Utilizes Upstash Workflows and QStash to schedule and send professional email notifications (7, 5, 2, and 1 day before renewal).

Secure Authentication: Implements JWT-based user authentication and authorization.

Advanced Security: Integrated with Arcjet for rate limiting and bot protection to safeguard API endpoints.

Smart Subscription Management: Automatically calculates renewal dates and manages subscription statuses (active, expired, cancelled).

Professional Templates: Custom HTML email templates for a consistent and branded user experience.

🛠️ Tech Stack
Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Automation: Upstash Workflow & QStash

Security: Arcjet (Rate Limiting, Shield)

Mailing: Nodemailer (SMTP)

Utilities: Day.js (Date manipulation)

⚙️ Getting Started
Prerequisites
Node.js (v18+ recommended)

MongoDB Atlas Account or local MongoDB

Upstash Account (for QStash/Workflow)

Installation
Clone the repository:

Bash
git clone https://github.com/Amaantheprogrammer/subscription-tracker.git
cd subscription-tracker
Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env.development.local file in the root directory and add the keys listed in .env.example.

Start the server:

Bash
npm run dev
📧 Email Workflow Logic
The system follows a distributed architecture to handle long-running reminder tasks:

Subscription Created: A POST request triggers the Upstash Workflow.

Workflow Initialization: The workflow fetches the subscription and populates user data.

Scheduled Reminders: The workflow enters a "sleep" state until the calculated reminder date.

SMTP Delivery: Upon "waking up," the system uses Nodemailer to deliver the branded HTML email to the user.

🔒 Security
The project uses Arcjet to protect against:

Brute-force attacks on Auth routes

Bot scraping of subscription data

API abuse via global rate limiting
