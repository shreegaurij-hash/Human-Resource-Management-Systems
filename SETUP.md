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

## 3. Upload Employee Data
To populate the system with your employees, you can directly upload an Excel file through the application:
1. Start the application (see step 4).
2. Log in using the Admin credentials (provided below).
3. Navigate to the Employee Directory or Onboarding section and use the file upload feature to import your `.xlsx` or `.csv` file containing employee details.

*(Optional)* To generate mock leave requests for testing the dashboard, run:
```bash
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
