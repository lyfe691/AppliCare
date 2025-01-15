<!-- AppliCare Dokumentation -->

<div align="center">
  <h1>AppliCare</h1>
  <p><em>Dokumentation</em></p>
</div>

---

## 1. Titelblatt

<div style="text-align: left; margin: 20px 0;">
  <strong>Projekt:</strong> AppliCare<br>
  <strong>Module:</strong>
  - M294 (Frontend Entwicklung mit React + Vite)
  - M295 (Backend Entwicklung mit Spring Boot)<br>
  <strong>Autor:</strong> Yanis Sebastian Zürcher<br>
  <strong>Abgabedatum:</strong> 15.01.25
</div>

---

## 2. Inhaltsverzeichnis

1. [Titelblatt](#1-titelblatt)
2. [Inhaltsverzeichnis](#2-inhaltsverzeichnis)
3. [Projektidee](#3-projektidee)
4. [Anforderungskatalog](#4-anforderungskatalog)
5. [Klassendiagramm](#5-klassendiagramm)
6. [Storyboard &amp; Screen-Mockups](#6-storyboard--screen-mockups)
7. [REST-Schnittstellen](#7-rest-schnittstellen)
8. [Testplan &amp; Testdurchführung](#8-testplan--testdurchführung)
9. [Installationsanleitung](#9-installationsanleitung)
10. [Hilfestellungen](#10-hilfestellungen)
11. [Repository & Entwicklungshistorie](#11-repository--entwicklungshistorie)

---

## 3. Projektidee

### Elevator Pitch

<div style="padding: 15px;  border-radius: 5px; margin: 10px 0;">
AppliCare ist eine Full-Stack Anwendung zur Verwaltung von Job-Bewerbungen (Applications). User können Bewerbungen (Job Applications) anlegen und deren Status (applied, screening, interviewing usw.) verwalten. Zusätzlich lassen sich Tasks (Aufgaben) erfassen, die entweder allgemein sind oder einer bestimmten Bewerbung zugeordnet werden.
</div>

### User Stories

#### Authentication & Profile
- Als **neuer Benutzer** möchte ich mich registrieren können, damit ich die App nutzen kann
- Als **registrierter Benutzer** möchte ich mich einloggen können, um auf meine Daten zuzugreifen
- Als **Benutzer** möchte ich mein Passwort zurücksetzen können, falls ich es vergesse
- Als **Benutzer** möchte ich mein Profil (Username/E-Mail) bearbeiten können
- Als **Benutzer** möchte ich das Theme (Light/Dark/System) anpassen können

#### Bewerbungsverwaltung
- Als **Bewerber** möchte ich neue Bewerbungen erfassen können mit Details wie:
  - Firma, Position, Standort
  - Kontaktperson & Kontaktdaten
  - Bewerbungsstatus
  - Gehalt & Remote-Option
- Als **Bewerber** möchte ich den Status meiner Bewerbungen aktualisieren können (APPLIED → SCREENING → INTERVIEWING etc.)
- Als **Bewerber** möchte ich meine Bewerbungen aktualisieren können
- Als **Bewerber** möchte ich meine Bewerbungen löschen können
- Als **Bewerber** möchte ich meine Bewerbungen filtern und sortieren können
- Als **Bewerber** möchte ich eine Übersicht über alle meine Bewerbungen in Tabellenform sehen

#### Aufgabenverwaltung
- Als **Benutzer** möchte ich Aufgaben (Tasks) erstellen können mit:
  - Titel & Beschreibung
  - Deadline & Priorität
  - Optional: Zuordnung zu einer Bewerbung
- Als **Benutzer** möchte ich Tasks als erledigt/unerledigt markieren können
- Als **Benutzer** möchte ich Tasks bearbeiten und löschen können

#### Dashboard & Statistiken
- Als **Benutzer** möchte ich auf dem Dashboard sehen:
  - Aktuelle Bewerbungsstatistiken
  - Tasks
  - Erfolgsquote meiner Bewerbungen
  - Bewerbungsstatus

### Zentrale Nutzenargumentation

- Einfache Statusübersicht (Bewerbungsphase, Interview, Angebot etc.)
- Tasks erinnern an Folgeaktivitäten (z. B. „Follow up per email etc")
- Zwei-Komponenten-System mit React-Frontend (M294) und Spring-Boot-Backend (M295) zur Datenhaltung in MongoDB
- Einfache und intuitive Bedienung

---

## 4. Anforderungskatalog

### Benutzerverwaltung

- Registrieren (Username, E-Mail, Passwort)
- Login mit Username oder E-Mail & Passwort
- „Passwort vergessen" (Mail mit Token)
- Profilpflege, Username/E-Mail ändern, Passwort ändern, Account löschen (alle Daten)
- Theme-Einstellung (Light / Dark / System)

### Bewerbungsverwaltung (Job Applications)

- CRUD
- Verschiedene Status (APPLIED, SCREENING, INTERVIEWING …)
- Sortierung, Filterung
- Tabellenansicht (Manage)

### Aufgabenverwaltung (Tasks)

- CRUD (Titel, Beschreibung, Deadline, Priority)
- Zuordnung zu Bewerbung (optional)
- Anzeige im Dashboard
- completed/uncompleted

### Sicherheit & Validierung

- JWT-Authentifizierung, BCrypt-Hashing
- Spring Validation + clientseitige Validierung
- Sinnvolle HTTP-Statuscodes (400, 401/403, 404 etc.)

### Frontend-spezifische Anforderungen (M294)

- React-Routing (Landing, Login, Register, Dashboard, Manage, Settings)
- Komponentenstruktur, Fehlerhandling, min. 5 Unit-Tests

### Backend-spezifische Anforderungen (M295)

- Spring Boot, MongoDB
- REST-API, (min. 5 Unit-Tests)
- Validierung, Exception-Handling

---

## 5. Klassendiagramm

```mermaid
classDiagram
    direction TB

    %% ================ DOMAIN-KLASSEN =================
    class User {
      +String id
      +String username
      +String email
      +String password
      +String passwordResetToken
      --getter/setter--
    }
    class JobApplication {
      +String id
      +String userId
      +String companyName
      +String jobTitle
      +String jobUrl
      +String status
      +String location
      +String contactPerson
      +String contactEmail
      +String contactPhone
      +String notes
      +LocalDateTime appliedDate
      +LocalDateTime lastUpdated
      +LocalDateTime nextFollowUp
      +Double salary
      +String salaryPeriod
      +Boolean remote
      --getter/setter--
    }
    class Task {
      +String id
      +String title
      +String description
      +LocalDate deadline
      +boolean completed
      +String priority
      +String userId
      +String applicationId
      +LocalDate createdAt
      --getter/setter--
    }

    %% ================ REPOSITORIES =================
    class UserRepository {
      <<interface>>
      +findByUsername(String) : Optional<User>
      +findByEmail(String) : Optional<User>
      +findByPasswordResetToken(String) : Optional<User>
      +save(User) : User
      +deleteById(String)
      +deleteByUserId(String)
      ...
    }
    class JobApplicationRepository {
      <<interface>>
      +findByUserId(String) : List<JobApplication>
      +findByUserIdAndStatus(String, String) : List<JobApplication>
      +save(JobApplication) : JobApplication
      +deleteByUserId(String)
      +deleteById(String)
      ...
    }
    class TaskRepository {
      <<interface>>
      +findByUserIdOrderByDeadlineAsc(String) : List<Task>
      +findByUserIdAndCompletedOrderByDeadlineAsc(String, boolean) : List<Task>
      +findByApplicationIdOrderByDeadlineAsc(String) : List<Task>
      +save(Task) : Task
      +deleteByUserId(String)
      +deleteById(String)
      ...
    }

    %% ================ SERVICES =================
    class AuthService {
      +login(usernameOrEmail, password)
      +register(username, email, password)
      +forgotPassword(email)
      +resetPassword(token, newPassword)
      ...
    }
    class UserService {
      +updateProfile(userId, username, email)
      +updatePassword(userId, currentPW, newPW)
      +deleteAccount(userId)
      ...
    }
    class JobApplicationService {
      +createApplication(application, userId)
      +updateApplication(id, application, userId)
      +deleteApplication(id, userId)
      +getApplication(id, userId)
      +getAllApplications(userId)
      +getApplicationsByStatus(userId, status)
      +updateStatus(id, newStatus, userId)
      ...
    }
    class TaskService {
      +getUserTasks(userId)
      +getUserTasksByStatus(userId, completed)
      +getApplicationTasks(applicationId)
      +createTask(task, userId)
      +updateTask(taskId, task, userId)
      +toggleTaskCompletion(taskId, userId)
      +deleteTask(taskId, userId)
      ...
    }
    class MailService {
      +sendResetLink(String toEmail, String token)
      ...
    }

    %% ================ CONTROLLER =================
    class AuthController {
      +login(...)
      +register(...)
      +forgotPassword(...)
      +resetPassword(...)
    }
    class UserController {
      +updateProfile(...)
      +updatePassword(...)
      +deleteAccount(...)
    }
    class JobApplicationController {
      +createApplication(...)
      +updateApplication(...)
      +deleteApplication(...)
      +getApplication(...)
      +getAllApplications(...)
      +getApplicationsByStatus(...)
      +updateStatus(...)
    }
    class TaskController {
      +getUserTasks(...)
      +getUserTasksByStatus(...)
      +getApplicationTasks(...)
      +createTask(...)
      +updateTask(...)
      +toggleTaskCompletion(...)
      +deleteTask(...)
    }

    %% ================ UTILS/FILTER =================
    class JwtAuthenticationFilter {
      +doFilterInternal(...)
      ...
    }
    class JwtUtil {
      +generateToken(...)
      +validateToken(...)
      +getUsernameFromToken(...)
      +extractUserId(...)
      ...
    }

    %% ================ RELATIONEN =================

    %% Domain-Verknuepfungen
    User "1" -- "0..*" JobApplication : "owns"
    User "1" -- "0..*" Task : "owns"
    JobApplication "1" -- "0..*" Task : "optional link"

    %% Repo zu Domain
    UserRepository <.. User : "manages"
    JobApplicationRepository <.. JobApplication : "manages"
    TaskRepository <.. Task : "manages"

    %% Services -> Repositories
    AuthService o-- MailService
    AuthService o-- UserRepository
    UserService o-- UserRepository
    JobApplicationService o-- JobApplicationRepository
    TaskService o-- TaskRepository

    %% Controller -> Services
    AuthController o-- AuthService
    UserController o-- UserService
    JobApplicationController o-- JobApplicationService
    TaskController o-- TaskService

    %% Filter -> Util
    JwtAuthenticationFilter o-- JwtUtil

```

---

## 6. Storyboard & Screen-Mockups

### 6.1 Storyboard

#### Landing Page

- Logo, kurze Erläuterung, Buttons „Sign In" / „Get Started", FAQ

#### Auth-Pages

- Login (Username/E-Mail, Passwort)
- Register
- Forgot Password
- Reset Password

#### Main Layout (nach auth)

- Navigation (Logo, /dashboard, /manage, /settings, User icon, logout)
- content
- Footer (copyright, socials etc)

#### Dashboard

- Statistiken, Diagramme
- Aufgabenliste

#### Manage

- Tabelle aller Bewerbungen, CRUD

#### Settings

- Profilpflege (Username/E-Mail) verwaltung
- Passwort ändern
- Account löschen (alle daten werden auch gelöscht)
- Theme umstellen (Light / Dark / System)

### 6.2 Screen-Mockups

<div>
<em>Die folgenden Mockups zeigen das geplante Design der Anwendung:</em>
</div>
<br>

*Landing Page*

![Landing Page](images/mockups/Landing_Mockup.png)

*Authentication Pages*

![Auth Pages](images/mockups/Auth_Mockup.png)

*Dashboard*

![Dashboard](images/mockups/Dashboard_Mockup.png)

*Manage Applications*

![Manage](images/mockups/Manage_Mockup.png)

*Settings*

![Settings](images/mockups/Settings_Mockup.png)





---

## 7. REST-Schnittstellen

### 7.1 Backend-Endpunkte

#### Auth-Endpoints

| Methode | Pfad                          | Beschreibung                              |
| ------- | ----------------------------- | ----------------------------------------- |
| POST    | `/api/auth/register`        | Registrierung (username, email, password) |
| POST    | `/api/auth/login`           | Login → JWT                              |
| POST    | `/api/auth/forgot-password` | Reset-Token per E-Mail                    |
| POST    | `/api/auth/reset-password`  | Passwort-Reset mit Token                  |

#### User-Endpoints

| Methode | Pfad                   | Beschreibung             |
| ------- | ---------------------- | ------------------------ |
| PUT     | `/api/user/profile`  | Username/E-Mail ändern  |
| PUT     | `/api/user/password` | Passwort ändern         |
| DELETE  | `/api/user/account`  | Account + Daten löschen |

#### Applications-Endpoints

| Methode | Pfad                              | Beschreibung                        |
| ------- | --------------------------------- | ----------------------------------- |
| GET     | `/api/applications`             | Liste Bewerbungen (User spezifisch) |
| POST    | `/api/applications`             | Neue Bewerbung anlegen              |
| GET     | `/api/applications/{id}`        | Bewerbung abrufen                   |
| PUT     | `/api/applications/{id}`        | Bewerbung aktualisieren             |
| DELETE  | `/api/applications/{id}`        | Bewerbung löschen                  |
| PATCH   | `/api/applications/{id}/status` | Status aktualisieren                |

#### Tasks-Endpoints

| Methode | Pfad                       | Beschreibung                          |
| ------- | -------------------------- | ------------------------------------- |
| GET     | `/api/tasks`             | Alle Tasks des Users                  |
| POST    | `/api/tasks`             | Neue Task anlegen                     |
| PUT     | `/api/tasks/{id}`        | Task bearbeiten                       |
| PATCH   | `/api/tasks/{id}/toggle` | Task completed/uncompleted umschalten |
| DELETE  | `/api/tasks/{id}`        | Task löschen                         |

### 7.2 Datentypen (JSON-Format)

#### JobApplication (POST/PUT-Beispiel)

```json
{
  "companyName": "Google",
  "jobTitle": "Software Engineer",
  "jobUrl": "https://careers.google.com/jobs/...",
  "status": "APPLIED",
  "location": "Zürich",
  "contactPerson": "Hans Muster",
  "contactEmail": "hans.muster@gmail.com",
  "contactPhone": "+41 12 123 12 12",
  "notes": "Remote möglich?",
  "salary": 120000,
  "salaryPeriod": "YEARLY",
  "remote": true
}
```

#### Task (POST/PUT-Beispiel)

```json
{
  "title": "CV updaten",
  "description": "Neue Projekte einfügen",
  "deadline": "2025-01-30",
  "priority": "HIGH",
  "applicationId": "<ApplicationId>",
  "completed": false
}
```

---

## 8. Testplan & Testdurchführung

### 8.1 Frontend-Testfälle

| Testfall              | Vorgehen                                                     | Erwartetes Ergebnis                                                         |
| --------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| 1. Registrierung      | „Register" -> Felder (Username, Email, Passwort) -> Submit  | Meldung „User registered successfully", Weiterleitung                      |
| 2. Login              | Seite Login, gültige Creds, Absenden                        | Token im LocalStorage, Weiterleitung Dashboard                              |
| 3. Neue Bewerbung     | „Manage" -> „New Application", Formular -> Submit          | Bewerbung erscheint in Tabelle, Meldung „Application created successfully" |
| 4. Bewerbung löschen | In Tabelle Delete-Button -> Bestätigen                      | Bewerbung verschwindet, Meldung „Application deleted successfully"         |
| 5. Password Update    | „Settings" -> „Security", altes + neues Passwort -> Submit | Meldung „Password updated successfully"                                    |

### 8.2 Backend-Testfälle

| Testfall                      | Methode/Endpoint                      | Erwartetes Ergebnis                                       |
| ----------------------------- | ------------------------------------- | --------------------------------------------------------- |
| 1. POST /auth/register        | Duplicate E-Mail => 400               | Fehlertext „Email already in use"                        |
| 2. POST /auth/login           | korrekte Daten => 200, falsche => 400 | JSON mit token; bei falschen Daten => 400 + Fehlermeldung |
| 3. GET /api/applications      | Mit gültigem JWT => 200              | JSON-Array aller Bewerbungen                              |
| 4. PUT /api/applications/{id} | Felder aktualisieren                  | 200 + geändertes Objekt                                  |
| 5. DELETE /api/user/account   | Mit JWT => Account löschen           | 200 + „Account deleted successfully"                     |

---

## 9. Installationsanleitung

### 9.1 Frontend (M294)

#### Voraussetzungen

- [Node.js](https://nodejs.org/en)
- npm oder yarn

#### Installationsschritte

1. In `applicare_frontend/` wechseln
2. `npm install`
3. `npm run dev`
4. http://localhost:5173

### 9.2 Backend (M295)

#### Voraussetzungen

- Java (min. jdk 21)
- Maven
- MongoDB

#### Installationsschritte

1. In `applicare_backend/` wechseln
2. `mvn clean install`
3. `mvn spring-boot:run`
4. laeuft auf http://localhost:8080

#### Datenbank

- MongoDB ATLAS muss erreichbar sein; WISS NETZWERK BLOCKIERT ATLAS, DAHER MUSS MAN HOTSPOT BENUTZEN.
- Falls sie die datenbank in MongoDB compass ansehen möchten, können sie diesen connection string verwenden: `mongodb+srv://lyfe691:lyfe691@applicare.c8gi7.mongodb.net/`:

![MongoDB Compass](images/mongodb_compass.png)


---

## 10. Hilfestellungen

- [Spring Boot Docs](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [React + Vite](https://vitejs.dev/guide/)
- [Ant Design](https://ant.design/)
- [MongoDB Dokumentation](https://docs.mongodb.com/)
- [ChatGPT](https://chatgpt.com/)

---

## 11. Repository & Commit history

### Repository

Das Projekt gesamte ist auf GitHub verfügbar:
- [AppliCare](https://github.com/lyfe691/AppliCare)

### Commit history

Die gesamte Commit history ist auf GitHub verfügbar:
- [AppliCare](https://github.com/lyfe691/AppliCare/commits/main)
