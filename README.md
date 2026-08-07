# Senior Care Visit Management System

A lightweight, mobile-friendly web application for recording caregiver visits to senior beneficiaries under the **Care for Life Programme**. The application is designed for field use and integrates with **Google Apps Script**, **Google Sheets**, and **Google Drive** to provide a simple, cloud-based electronic visit verification (EVV) and reporting system.

---

## Overview

The Senior Care Visit Management System digitizes caregiver visit records, replacing paper-based forms with an easy-to-use mobile interface.

Field caregivers can:

- Record daily visits
- Document services provided
- Capture observations
- Take beneficiary photographs
- Record GPS coordinates
- Submit data directly to Google Sheets

The system is suitable for NGOs, healthcare organizations, community care programmes, and home-based elderly care initiatives.

---

## Key Features

### Beneficiary Information

- Beneficiary Name
- Visit Date
- Caregiver Name
- Supervisor Name

### Daily Care Activities

- Bathroom Assistance
- Mobility / Transfer
- Meals Served
- Laundry
- House Keeping
- Medication
- General Observation

### Mobile Features

- Responsive Design
- Android Friendly
- Camera Capture
- Image Preview
- Automatic Timestamp
- GPS Location Capture

### Cloud Integration

- Google Apps Script
- Google Sheets
- Google Drive

---

## System Architecture

```
Android Phone
        │
        ▼
GitHub Pages
(HTML + CSS + JavaScript)
        │
        ▼
Google Apps Script
        │
        ├────────────► Google Sheets
        │
        └────────────► Google Drive
```

---

## Folder Structure

```
senior-visit-system/

│── index.html
│── README.md
│── LICENSE
│── .gitignore

├── css/
│   ├── style.css
│   ├── forms.css
│   └── print.css

├── js/
│   ├── app.js
│   ├── gps.js
│   ├── camera.js
│   ├── validation.js
│   ├── api.js
│   └── helper.js

├── images/
│   ├── logo.png
│   └── icons/

├── data/
│   └── communities.json

├── manifest.json

├── service-worker.js

└── docs/
```

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Google Apps Script
- Google Sheets
- Google Drive
- GitHub Pages

No external frameworks are required.

---

## Installation

### Step 1

Clone the repository.

```bash
git clone https://github.com/YOUR_USERNAME/senior-visit-system.git
```

---

### Step 2

Open

```
index.html
```

or publish the repository using GitHub Pages.

---

### Step 3

Create a Google Spreadsheet.

Rename the first sheet to

```
Visits
```

---

### Step 4

Create a Google Drive folder for beneficiary photographs.

Copy the Folder ID.

---

### Step 5

Create a Google Apps Script project.

Paste the provided `Code.gs` file.

Replace:

```
YOUR_FOLDER_ID
```

with your Google Drive folder ID.

---

### Step 6

Deploy as a Web App.

Settings:

```
Execute As:
Me

Access:
Anyone
```

Copy the Web App URL.

---

### Step 7

Edit

```javascript
const SCRIPT_URL = "...";
```

Replace it with your deployed Apps Script URL.

---

## Running the Application

Simply open

```
index.html
```

or visit your GitHub Pages URL.

The application runs entirely inside the browser.

---

## Data Flow

```
Open Form

↓

Fill Visit Information

↓

Capture Beneficiary Photo

↓

GPS Location Recorded

↓

Submit

↓

Google Apps Script

↓

Google Sheets

+

Google Drive
```

---

## Spreadsheet Columns

The system records:

- Submission Time
- Beneficiary
- Bathroom Assistance
- Mobility / Transfer
- Meals Served
- Laundry
- House Keeping
- Medication
- Observation
- Visit Date
- Caregiver
- Supervisor
- Latitude
- Longitude
- Device Timestamp
- Photo URL

---

## Recommended Enhancements

Future improvements may include:

- Beneficiary ID
- QR Code Scanning
- Barcode Support
- Offline Mode
- Synchronization
- Electronic Signature
- Health Assessment
- Blood Pressure
- Temperature
- Pulse Rate
- Blood Sugar
- Dashboard
- Supervisor Approval
- User Authentication
- Visit Scheduling
- Reminder Notifications

---

## Security Considerations

The current version is intended for trusted internal use.

For production deployments consider implementing:

- User Login
- HTTPS Only
- OAuth Authentication
- Google Workspace Restrictions
- Input Validation
- Role-Based Access Control
- Audit Logs

---

## Browser Support

Tested for:

- Google Chrome (Android)
- Microsoft Edge
- Mozilla Firefox
- Safari

Chrome on Android is recommended.

---

## Use Cases

Suitable for:

- Elderly Care Programmes
- Home Care Services
- NGOs
- Community Health Workers
- Medical Outreach Programmes
- Social Welfare Programmes
- Home Nursing Services

---

## License

This project may be distributed under the MIT License or any license chosen by the project owner.

---

## Acknowledgements

Developed to support the digitization of caregiver field activities and improve programme monitoring, accountability, and reporting through simple cloud-based technologies.
