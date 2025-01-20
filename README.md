# **Task Force Wallet web app**

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
*** The following are the images represnting the dashboard.
<img width="1707" alt="Screenshot 2025-01-18 at 08 07 33" src="https://github.com/user-attachments/assets/870f1754-7b69-4914-a901-4b456e1f4d38" />
<img width="1710" alt="Screenshot 2025-01-18 at 07 30 56" src="https://github.com/user-attachments/assets/825403e1-dd26-4263-9f32-72a90266b55f" />
<img width="1706" alt="Screenshot 2025-01-18 at 07 30 33" src="https://github.com/user-attachments/assets/017add34-4f8d-4d55-a6fd-dbcd3b33c27f" />
<img width="1710" alt="Screenshot 2025-01-18 at 07 29 38" src="https://github.com/user-attachments/assets/f5d8f610-38b5-4817-a61e-87eadafb0a90" />
<img width="1690" alt="Screenshot 2025-01-18 at 07 29 15" src="https://github.com/user-attachments/assets/b0bc6af2-d1fe-4643-9af1-016f7a18a615" />
<img width="1710" alt="Screenshot 2025-01-18 at 07 29 00" src="https://github.com/user-attachments/assets/1bc7c0d7-f710-4d75-a064-681516018534" />

the following image represent ERD of wallet db
<img width="780" alt="Screenshot 2025-01-20 at 09 18 02" src="https://github.com/user-attachments/assets/91c07046-1a91-4a7e-b240-2d187e25fb85" />

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
 npm run dev



