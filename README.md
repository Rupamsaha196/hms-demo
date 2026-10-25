# CarePulse - Hospital Management System (Frontend)

CarePulse is a modern, responsive Hospital Management System frontend built with **React**, **Vite**, and an intuitive **Navy Blue and White** clinical design system. It includes **Role-Based Access Control (RBAC)** across 5 roles, clean typography, Indian localized dummy data (+91), and is fully configured for one-click deployment on **Vercel**.

---

## 🏥 Modules & Features

- **Dashboard**: Real-time hospital metrics, bed occupancy, doctor roster glance, emergency bay status, and net cash flow (in ₹).
- **OPD (Outpatient Department)**: Patient token issue, patient queues, consultation status lifecycle (Waiting -> In Consultation -> Completed).
- **IPD (Inpatient Department)**: Ward management (ICU, General Ward, Deluxe Private), visual bed occupancy matrix (Occupied, Available, Cleaning), admitting & discharge workflows.
- **Radiology**: Diagnostic imaging worklist (X-Ray, CT Scan, MRI, Ultrasound), scan request modal, verified diagnostic findings & report viewer.
- **Pathology**: Laboratory specimen tracking (CBC, Lipid profile, Microbiology, Molecular PCR), status workflow, abnormal flags, and verified test report modal.
- **Doctor Available**: Live doctor duty roster, room/cabin allocation, specialty filter, and quick duty status toggle (Available, In Consultation, In Surgery, On Break, Off Duty).
- **Billings**: Patient invoices with itemized charges (Consultation, Room, Scans, Medicine), discount calculations, and printable invoice receipts with GSTIN.
- **Expenses or Income**: Complete hospital financial cash flow tracker (Revenues, Supplies, Fuel, Oxygen, Utilities) with net profit/balance calculation in ₹.
- **Ambulance**: Emergency fleet management (ALS, BLS, Neonatal ICU), driver contacts (+91), live location, and emergency dispatch modal with ETA (National 108).
- **5 User Roles (RBAC)**: Switch between **Admin**, **Doctor**, **Staff**, **Receptionist**, and **Accountant** directly from the top navigation bar.

---

## 🚀 Deploy to Vercel

The project includes a ready-to-use `vercel.json` with SPA route rewrites.

### Option 1: Via Vercel CLI
```bash
# 1. Install Vercel CLI globally (if not already installed)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel
```

### Option 2: Via GitHub & Vercel Dashboard
1. Push this project folder to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "CarePulse HMS Frontend with RBAC and Indian localization"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Vercel will automatically detect the settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**!

---

## 💻 Local Development
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```
Visit `http://localhost:5173/` in your browser.
