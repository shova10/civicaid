# CivicAid Nepal

CivicAid Nepal is a civic engagement platform designed to bridge the gap between citizens and local authorities. It empowers citizens to report community issues—such as potholes, drainage issues, damaged power lines, and public safety concerns—directly to local government bodies, while giving administrators a powerful backend panel to track, manage, and analyze these reports on a map interface.

## ✨ Features

### 👤 Citizen Application
* Landing Page: Clean, modern onboarding screen introducing the application's core capabilities.
* Secure Authentication: User registration, secure login, password recovery featuring OTP verification via email.
* Intuitive Dashboard: A dedicated space welcoming citizens with quick access to common actions and an overview of their individual      contributions.
* Issue Reporting Form: Interactive form to describe infrastructure problems, upload photographic evidence, and attach geographic location coordinates.
* Interactive Issue Map: Geolocation map clustering reported incidents natively across Nepal for immediate visual awareness.
* Personal Tracking Profile: View specific user analytics (`Total Reported`, `In Progress`, `Resolved`) alongside personalized problem-submission feeds.

### 🛡️ Administrative Portal
* Unified Dashboard: An overview displaying system-wide analytics, key metrics, and problem status trends.
* Advanced Issue Management: A centralized data grid to filter, review, upvote, update status codes (`Reported`, `In Progress`, `Resolved`, `Rejected`), and assign priority matrix values (`High`, `Medium`, `Low`).
* Admin GIS Mapping System: Geographic Information System map visualizing nationwide high-priority hotspots to optimize local resource dispatching.
* User Registry Tracking: Monitor registered users, inspect detailed citizen background cards, and track historical metrics.

---

## 🛠️ Project Structure & Architecture

The application uses an explicit route structural design grouped clearly by user authorization status and access roles. 

### Core Layouts
* `MainLayout`: Implements standard layout wrappers with top/side navigation tailored for standard citizens.
* `AdminLayout`: Renders a structured, left-anchored professional sidebar navigation framework for system administrators.

### Route Map Matrix

| Path | Component | Access Privilege | Layout Wrapper | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `Landing` | Public | None | Introduction & Entry Portal |
| `/login` | `Login` | Public | None | Identity Authentication |
| `/register` | `Register` | Public | None | Registration Sign-Up Profile |
| `/home` | `Home` | Citizen | `MainLayout` | Citizen Activity Hub |
| `/submit` | `SubmitIssue` | Citizen | `MainLayout` | Create New Infrastructure Report |
| `/issues` | `Issues` | Citizen | `MainLayout` | Browse Nationwide Community Reports |
| `/issues/:id` | `IssueDetail` | Authenticated | None | Detail Inspection Panel for Issues |
| `/map` | `IssueMap` | Citizen | `MainLayout` | Public Map Location Visualization |
| `/profile` | `Profile` | Citizen | `MainLayout` | Citizen Statistics & Profile Center |
| `/admin` | `AdminDashboard`| Admin | `AdminLayout` | Central System Analytics Platform |
| `/admin/issues` | `AdminIssues` | Admin | `AdminLayout` | Dynamic Infrastructure Data Grid |
| `/admin/map` | `AdminMap` | Admin | `AdminLayout` | Core Administrative GIS Map Hub |
| `/admin/analytics`| `AdminAnalytics`| Admin | `AdminLayout` | System Metrics & Trends Platform |
| `/admin/users` | `AdminUsers` | Admin | `AdminLayout` | Global Accounts Registry Tracker |
| `/admin/users/:id`| `AdminUserDetail`| Admin | `AdminLayout` | Citizen Activity Analytics Review |
| `/admin/profile` | `AdminProfile` | Admin | `AdminLayout` | Administrative Account Controls |

---

## 🚀 Tech Stack

* **Frontend Library:** React (Functional components with Hooks)
* **Routing Architecture:** React Router DOM (v6 nested routes with protection wrappers)
* **State Management & Context:** React Context API (`AuthContext`)
* **Interactive Maps:** Leaflet / OpenStreetMap / Mapbox integration
* **User Notifications:** React Hot Toast
* **Styling:** Modern UI Framework (Tailwind CSS stylized design elements)

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/civicaid-nepal.git](https://github.com/yourusername/civicaid-nepal.git)
   cd civicaid-nepal

 
Install dependency packages:
Bash
npm install

Configure Environment Variables:
Create a .env file in the root directory and add your backend API paths and map token configurations:
Code snippet
REACT_APP_API_BASE_URL=your_backend_api_endpoint
REACT_APP_MAPBOX_TOKEN=your_mapbox_token

Launch the development application server:
Bash
npm start
Open http://localhost:3000 to view the application inside your web browser.


🔒 Security & Route Protection
The frontend uses nested protection components to ensure data integrity and strict role boundaries:

PrivateRoute: Validates user authorization. Unauthenticated requests are immediately blocked and rerouted to the security login gateway (/login).

ProtectedByRole: Restricts view privileges using string matching arrays. Standard accounts attempting to access administrative path components (/admin/*) are safely blocked.
