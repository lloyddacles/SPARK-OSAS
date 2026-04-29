# 💎 Project SPARK: Institutional Hub & OSAS Management

**Project SPARK** (Student Portal for Academic Records & Knowledge) is a professional, full-stack institutional hub designed for the **Office of Student Affairs and Services (OSAS)**. It transitions campus management from legacy paper/JSON systems to a high-performance, cloud-powered SQL infrastructure.

![Institutional Dashboard](https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200)

---

## 🚀 Vision
To provide a secure, "Digital First" environment for student coordination, scholarship management, and organizational recognition, powered by real-time telemetry and a premium Sapphire Grid aesthetic.

## 🛠️ Technology Stack
*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
*   **Database**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
*   **ORM**: [Prisma 7](https://www.prisma.io/) (High-performance SQL Mapping)
*   **UI/UX**: [Framer Motion](https://www.framer.com/motion/) (Micro-animations), [Lucide React](https://lucide.dev/) (Icons)
*   **Styling**: Modern CSS Variables with [Sapphire Grid Design System](https://github.com/lloyddacles/SPARK-OSAS)

---

## 📦 Key Modules

### 🎓 Scholarship Command Center
*   **Automated Matching**: Track student applications against institutional and government criteria.
*   **Batch Processing**: Management-level approval for large scholarship cycles.
*   **Timeline Tracking**: Real-time deadlines and status updates.

### 🏢 Organization & Club Recognition
*   **Digital Renewal**: Streamlined recognition process for campus clubs (RSOs).
*   **Activity Proposals**: Secure submission and review pipeline for campus events.
*   **Adviser Endorsement**: Multi-level approval hierarchy for institutional security.

### 📋 Student Service Requests
*   **Certificate Issuance**: Digital requests for Good Moral and Academic certificates.
*   **Digital Vault**: Secure storage for student documents (1x1 Photos, CORs, Grades).
*   **Status Telemetry**: Real-time tracking of document processing.

### 🛡️ Institutional Security & Audit
*   **Audit Pulsing**: Secure logging of every administrative action.
*   **Role-Based Access**: Specialized dashboards for Admin, OSAS Director, and Guidance Counselors.
*   **Encrypted Sessions**: Cookie-based authentication with secure session management.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/spark-osas.git
cd spark-osas
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your Supabase credentials:
```env
DATABASE_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:5432/postgres"
```

### 4. Initialize Database
```bash
# Push the institutional schema to your live database
npx prisma db push

# (Optional) Migrate legacy data if data.json exists
node prisma/manual-migrate.js
```

### 5. Launch Development Server
```bash
npm run dev
```

---

## 💎 Design Philosophy
SPARK uses the **Sapphire Grid** aesthetic:
*   **Colors**: Deep Navy (`#020617`), Cyber Cyan (`#00e5ff`), and Ghost White.
*   **Typography**: Bold, high-contrast institutional headers with mono-spaced telemetry data.
*   **Interactions**: Smooth glassmorphic transitions and subtle border glows.

## ⚖️ Legal, Ownership & Intellectual Property

**Project SPARK** is the proprietary intellectual property and is subject to patent protections. All rights are strictly reserved.

*   **Principal Owner & Architect**: **Mr. Lloyd Christopher F. Dacles**
*   **Professional Credentials**: `MIS`, `CITSMP`, `DBMP`, `CPAA`, `ITPO`, `CDSA`
*   **Status**: This system is protected under intellectual property laws. Unauthorized duplication, reverse engineering, or redistribution of the core architecture and "Sapphire Grid" design system is strictly prohibited.

## 📄 License & Distribution
This software is provided for authorized institutional use only. For licensing inquiries, distribution rights, or implementation requests, please contact the principal architect.

---
**© 2026 Developed with ⚡ by Mr. Lloyd Christopher F. Dacles**
