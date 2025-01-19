# **Task Force Wallet Pro**

Task Force Wallet app is a web application designed to simplify expense and income tracking across multiple accounts. Built using Next.js for both frontend and backend, the application enables users to manage transactions, set budgets, and gain insights into their financial habits through data visualizations.

---

## **Features**
- **Multi-Account Management**: Track income and expenses across bank accounts, mobile money, and cash.
- **Transaction Categories**: Organize transactions into categories and subcategories for better clarity.
- **Budget Monitoring**: Set spending limits and get notified when exceeding them.
- **Reports Generation**: Generate reports based on custom date ranges.
- **Data Visualizations**: Understand financial data through charts and graphs.
- **User Authentication**: Secure access with personalized user data.

---

## **Technologies Used**
- **Frontend**: React.js (Next.js)
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with PostgreSQL
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Charts**: Chart.js (or any library used)

---

## **Getting Started**

### **Prerequisites**
1. Install [Node.js](https://nodejs.org/) (v16 or later).
2. Set up a PostgreSQL database.

### **Installation Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/wallet-pro.git
   cd taskforce-wallet-app
2. run 
   ```bash
    npm install
3. in your .env place the following environment:
     ```bash
     DATABASE_URL=your-database-url
     NEXTAUTH_SECRET=your-secret-key 
     NEXT_PUBLIC_API_URL=api url
     

4. run 
    ```bash
 npx prisma migrate dev

5. run 
    ```bash
  npm run dev   



