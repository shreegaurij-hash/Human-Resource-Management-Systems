# Setup Instructions for Human Resource Management System (HRMS)

Follow these simple steps to set up the product locally.

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## 1. Install Dependencies
Open your terminal in the root of the project and run:
```bash
npm install
```

## 2. Initialize Database
The system uses Prisma with a local SQLite database for easy setup. First, generate the Prisma client:
```bash
npx prisma generate
```

Then, apply the database schema (this will create `dev.db`):
```bash
npx prisma db push
```

## 3. Seed Mock Data
To populate the system with the initial set of employees and test data (e.g. Leave Requests, Onboarding), run the seed scripts:
```bash
# Seed initial users from Excel
npm run seed

# Seed leave requests for testing the admin dashboard
node seed-leaves.js
```

## 4. Start the Application
Run the Next.js development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

## Login Details
For testing the app, you can use the following default credentials.

**Admin & HR Login:**
- **Email:** `hr.admin01@dayflow.com`
- **Password:** `Dayflow@Admin01!`

**Employee Login:**
- **Email:** `adinolfi.wilson.k@dayflow.com`
- **Password:** `Dayflow@10026`
