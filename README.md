# 🎓 Smart QR-Based Attendance System

A professional, full-stack attendance management system for colleges where teachers generate time-limited QR codes and students scan them to mark attendance — with built-in proxy prevention, duplicate detection, and role-based access.

> **"This system uses session-based QR codes instead of student-based QR codes. Each student is authenticated and validated individually, which prevents proxy attendance while allowing scalable marking through a single QR."**

---

## 📸 Features at a Glance

| Feature | Description |
|---|---|
| **Role-Based Auth** | JWT login for Teachers & Students with separate dashboards |
| **QR Code Generation** | Teachers generate time-limited (90s) session QR codes |
| **QR Scanning** | Students scan QR via phone camera using `html5-qrcode` |
| **Proxy Prevention** | Session expiry, enrollment validation, duplicate detection, device fingerprinting |
| **Attendance Reports** | Filter by class/date, export to CSV |
| **Live Session Stats** | Real-time student count during active sessions |
| **Dark Mode** | Toggle via navbar |
| **Responsive UI** | Mobile-first design (students scan on phones) |

---

## 🧱 Tech Stack

### Frontend
- **React 18** (Vite)
- **React Router DOM** — client-side routing
- **Axios** — HTTP client with JWT interceptor
- **Tailwind CSS** — utility-first styling
- **html5-qrcode** — camera-based QR scanning
- **qrcode.react** — QR code generation
- **Lucide React** — icons

### Backend
- **Node.js** + **Express.js**
- **JWT** — authentication tokens
- **bcrypt** — password hashing
- **Mongoose** — MongoDB ODM
- **uuid** — unique session ID generation

### Database
- **MongoDB** (local or Atlas)

---

## 📁 Project Structure

```
attendence_system/
├── client/                     # React Frontend (Vite)
│   ├── index.html
│   ├── vite.config.js          # Dev server + API proxy config
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx            # Entry point
│       ├── App.jsx             # Router & route definitions
│       ├── index.css           # Global styles + Tailwind directives
│       ├── context/
│       │   └── AuthContext.jsx  # Auth state management (login/register/logout)
│       ├── services/
│       │   └── api.js           # Axios instance with JWT interceptor
│       ├── components/
│       │   ├── Navbar.jsx       # Top bar with dark mode toggle + logout
│       │   ├── Sidebar.jsx      # Role-based navigation links
│       │   ├── DashboardLayout.jsx  # Sidebar + Navbar + content wrapper
│       │   └── ProtectedRoute.jsx   # Route guard with role check
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── teacher/
│           │   ├── TeacherDashboard.jsx
│           │   ├── Classes.jsx
│           │   ├── CreateClass.jsx
│           │   ├── StartAttendance.jsx  # QR generation + countdown + live count
│           │   └── AttendanceReport.jsx # Filters + CSV export
│           └── student/
│               ├── StudentDashboard.jsx
│               ├── ScanQR.jsx           # Camera QR scanner
│               ├── MarkAttendance.jsx   # Auto-submit + status feedback
│               └── AttendanceHistory.jsx
│
├── server/                     # Node.js Backend (Express)
│   ├── server.js               # App entry: middleware, routes, DB connection
│   ├── .env                    # Environment variables
│   ├── models/
│   │   ├── User.js             # name, email, password, role, rollNumber
│   │   ├── Class.js            # classId, subject, semester, teacherId, students[]
│   │   ├── AttendanceSession.js # sessionId (UUID), classId, expiresAt, isActive
│   │   └── Attendance.js       # sessionId, studentId, markedAt, ipAddress, deviceHash
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verify + role authorization
│   ├── controllers/
│   │   ├── authController.js       # register + login logic
│   │   ├── classController.js      # create/list classes
│   │   └── attendanceController.js # start session, mark, report
│   └── routes/
│       ├── authRoutes.js
│       ├── classRoutes.js
│       └── attendanceRoutes.js
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| POST | `/api/classes` | Teacher | Create a new class |
| GET | `/api/classes/teacher` | Teacher | List teacher's classes |
| GET | `/api/classes/student` | Student | List enrolled classes |
| POST | `/api/attendance/start` | Teacher | Start attendance session (generates QR data) |
| POST | `/api/attendance/mark` | Student | Mark attendance for a session |
| GET | `/api/attendance/report` | Teacher | Get attendance report (filterable) |
| GET | `/api/attendance/session/:id` | Auth'd | Get session status + live count |

---

## 🛡️ Proxy Attendance Prevention

| Prevention Method | Implementation |
|---|---|
| **Time-limited QR** | Each session expires after 90 seconds |
| **Unique index** | Compound index on `(sessionId + studentId)` prevents duplicates |
| **Student login required** | JWT authentication on all student routes |
| **Enrollment validation** | Backend checks student's roll number is in the class roster |
| **IP logging** | Client IP address recorded with each attendance mark |
| **Device fingerprint** | User-Agent string stored as basic device hash |

---

## 🚀 Setup Guide (New User)

### Prerequisites

| Software | Version | Check Command |
|----------|---------|---------------|
| **Node.js** | v16 or higher | `node --version` |
| **npm** | v8 or higher | `npm --version` |
| **MongoDB** | v5 or higher | `mongod --version` |

### Step 1: Install MongoDB

<details>
<summary><b>macOS (Homebrew)</b></summary>

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community
```

> ⚠️ If `brew install` fails with "Command Line Tools are too outdated", run:
> ```bash
> sudo rm -rf /Library/Developer/CommandLineTools
> sudo xcode-select --install
> ```
</details>

<details>
<summary><b>Ubuntu / Debian</b></summary>

```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```
</details>

<details>
<summary><b>Windows</b></summary>

1. Download the MSI installer from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run installer → choose "Complete" setup
3. Check "Install MongoDB as a Service"
4. MongoDB will start automatically
</details>

**Verify MongoDB is running:**
```bash
pgrep mongod
# Should return a process ID number
```

### Step 2: Clone & Install Dependencies

```bash
# Clone or download the project
cd attendence_system

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 3: Configure Environment

Edit `server/.env` if needed:

```env
MONGO_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your_jwt_secret_key_here
PORT=5001
```

> **Note:** Port 5001 is used because macOS AirPlay Receiver occupies port 5000.
> If you're on Linux/Windows, you can change this to 5000 — just also update
> `client/vite.config.js` proxy target to match.

### Step 4: Start the Application

**Terminal 1 — Backend:**
```bash
cd server
npm start
```
Expected output:
```
Server running on port 5001
MongoDB Connected
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
Expected output:
```
VITE ready at http://localhost:5173/
```

### Step 5: Open in Browser

Go to **http://localhost:5173** — you should see the Login page.

---

## 🧪 Testing Flow

### 1. Register a Teacher
1. Go to `http://localhost:5173/register`
2. Fill: Name, Email, Password, Role = **Teacher**
3. Click Register → redirected to **Teacher Dashboard**

### 2. Create a Class
1. Click **Create Class** (or navigate to Classes → Create)
2. Fill: Class ID = `CSE301`, Subject = `Data Structures`, Semester = `5`
3. Enter Student Roll Numbers: `101, 102, 103`
4. Submit

### 3. Start an Attendance Session
1. Go to **Classes** → click **Start Attendance** on your class
2. Select the class → click **Start Session**
3. A **QR code** appears with a **90-second countdown timer**
4. Keep this window open

### 4. Register a Student (in Incognito / another browser)
1. Go to `http://localhost:5173/register`
2. Fill: Name, Email, Password, Role = **Student**, Roll Number = `101`
3. Click Register → redirected to **Student Dashboard**

### 5. Mark Attendance
1. Click **Scan QR** → allow camera access
2. Point phone/camera at the QR code on the teacher's screen
3. See **"Attendance Marked Successfully"** ✅
4. Try scanning again → **"Already Marked"** ❌

### 6. View Report (Teacher)
1. Switch to teacher window → go to **Reports**
2. Select the class → click **View Report**
3. See the student listed as **Present**
4. Click **Download CSV** to export

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| **Primary** | Deep Blue `#1E3A8A` |
| **Secondary** | Emerald Green `#10B981` |
| **Accent** | Amber `#F59E0B` |
| **Background** | Light Gray `#F9FAFB` |
| **Text** | Dark Gray `#111827` |
| **Error** | Red `#EF4444` |
| **Font** | Inter (Google Fonts) |

---

## 📝 Database Schema

### Users
```json
{ "name": "string", "email": "string (unique)", "password": "string (hashed)", "role": "teacher | student", "rollNumber": "string (student only)" }
```

### Classes
```json
{ "classId": "string (unique)", "subject": "string", "semester": "string", "teacherId": "ObjectId → User", "students": ["rollNumber strings"] }
```

### AttendanceSession
```json
{ "sessionId": "UUID (unique)", "classId": "string", "teacherId": "ObjectId → User", "expiresAt": "Date", "isActive": "boolean" }
```

### Attendance
```json
{ "sessionId": "string", "studentId": "ObjectId → User", "markedAt": "Date", "ipAddress": "string", "deviceHash": "string" }
```
> Compound unique index on `(sessionId, studentId)` prevents duplicate marking.

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `MongoDB Connection Error` | Ensure MongoDB is running: `brew services start mongodb-community` or `mongod` |
| `Port 5000 gives 403 Forbidden` | macOS AirPlay uses port 5000. Use port 5001 (already configured) |
| `vite: command not found` | Run `npm install` in the `client` directory |
| `Registration failed` | Check both servers are running and MongoDB is connected |
| QR scanner not working | Ensure camera permissions are granted; works best on phones |

---

## 📄 License

This project is built for academic/educational purposes.
