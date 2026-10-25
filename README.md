# MedCare · Patient Booking System (Vite + React + Bootstrap)

## Run it
```bash
npm install
cp .env.example .env     # then put in YOUR Supabase URL + anon key
npm run dev
```
Build for production: `npm run build` (output in `dist/`).
If you deploy to GitHub Pages or similar, make sure unknown paths fall back to `index.html` (SPA routing),
and add your site URL to Supabase → Authentication → URL Configuration (also used for Google/Facebook login).

## Supabase tables used (same as the original project)
| Table | Columns used |
|---|---|
| `user` | name, email, number |
| `Admin_Portal_User` | name, specialty (the doctors list) |
| `patientData` | user_id, patient_Name, email, contact_No, age, date_time, gender, reason, doctor_Name |

Without a `.env` the UI still runs: a banner explains what is missing and the doctor list uses a few sample doctors.

## Structure
```
src/
  components/  Navbar, Footer, Layout, ProtectedRoute, form bits, shared sections
  context/     AuthContext (Supabase auth), ToastContext
  lib/         supabase client, services/data, formatting, useDoctors
  pages/       Home, Services, About, Login, Signup, Book, Appointments, Profile, NotFound
  styles/      main.css (design layer on top of Bootstrap)
```
