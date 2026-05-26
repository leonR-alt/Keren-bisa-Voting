# 🗳️ VoteKu — Modern Web-Based E-Voting Platform

VoteKu is a modern electronic voting platform designed to provide a secure, fast, and user-friendly online voting experience.  
Built with React and Spring Boot, this system supports online voting, candidate management, admin management, voting deadlines, and real-time election results.

---

## 🇺🇸 English

### ✨ Key Features

#### User
- Register and login
- Secure authentication system
- View candidate list
- Vote only once
- View voting results
- Election countdown timer
- Responsive modern interface

#### Admin
- Add, edit, and delete candidates
- Manage voter accounts
- Set election title
- Set voting deadline
- View election results
- Protected admin dashboard

#### Security
- JWT Authentication
- Protected admin routes
- Super Admin protection
- One-person one-vote validation

---

## 🇮🇩 Bahasa Indonesia

### ✨ Fitur Utama

#### User
- Register dan login akun
- Sistem autentikasi yang aman
- Melihat daftar kandidat
- Melakukan voting satu kali
- Melihat hasil voting
- Countdown waktu pemilihan
- Tampilan modern dan responsif

#### Admin
- Menambah, mengedit, dan menghapus kandidat
- Mengelola akun voter
- Mengatur judul pemilihan
- Mengatur deadline voting
- Melihat hasil pemilihan
- Dashboard admin yang terproteksi

#### Security
- JWT Authentication
- Protected admin routes
- Proteksi Super Admin
- Validasi satu orang satu suara

---

## 🧩 Technology Stack

### Frontend
- React
- Vite
- React Router DOM
- CSS

### Backend
- Spring Boot
- Spring Security
- JWT
- Hibernate / JPA
- Maven

### Database
- MySQL
- Aiven Cloud Database

### Deployment
- Vercel
- Render

---

## 📁 Project Structure


Keren-bisa-Voting/
│
├── frontend_voting/
│   └── voting-app-frontend/
│
└── voting-spring/



### ⚙️ Installation Guide
Clone Repository
```bash
git clone https://github.com/leonR-alt/Keren-bisa-Voting.git
```

🚀 Frontend Setup
```bash
cd frontend_voting/voting-app-frontend
npm install
npm run dev
```

Frontend berjalan di:
http://localhost:5173

🚀 Backend Setup
```bash
cd voting-spring
mvnw.cmd spring-boot:run
```

Backend berjalan di:
http://localhost:8080

## 🌐 Live Demo
### Frontend

https://keren-bisa-voting.vercel.app

### Backend

https://keren-bisa-voting.onrender.com

🔐 Super Admin Protection

Super Admin memiliki proteksi khusus:

Tidak bisa dihapus
Tidak bisa diturunkan dari admin
Hanya dirinya sendiri yang bisa mengedit akun

## 📌 Future Improvements
Multiple election system
Upload foto kandidat
Cloudinary integration
Statistik voting
Export hasil voting
Forgot password feature

# 👨‍💻 Developer

Developed by Leonaris Rumahorbo

GitHub:
https://github.com/leonR-alt