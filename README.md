# Restaurant Management System (RMS)

This is a comprehensive Restaurant Management System (RMS) designed to streamline all aspects of restaurant operations, from order and table management to employee and inventory tracking.

## ✨ Features

*   **Authentication:** Secure user sign-in, sign-up, and session management.
*   **Admin Dashboard:** A powerful interface for managing all aspects of the restaurant.
*   **Menu Management:** Create and organize menu items and categories.
*   **Ingredient & Recipe Management:** Track ingredients, manage stock levels, and create recipes.
*   **Table Management:** Visualize and manage table statuses (available, occupied, reserved).
*   **Order Management:** A complete system for taking, tracking, and managing customer orders.
*   **Reservation System:** Allow customers to book tables in advance.
*   **Employee Management:** Manage employee profiles, shifts, timekeeping, leave requests, and payroll.
*   **Customer Management:** Track customer information, loyalty points, and reviews.
*   **File Uploads:** Support for uploading images for menu items and ingredients.

## 🚀 Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:**
    *   [Radix UI](https://www.radix-ui.com/) for accessible, unstyled components.
    *   [Lucide React](https://lucide.dev/guide/packages/lucide-react) for icons.
    *   Custom components built for the application.
*   **Database ORM:** [Prisma](https://www.prisma.io/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **Authentication:** [better-auth](https://github.com/pilcrowonpaper/better-auth)
*   **File Uploads:** [UploadThing](https://uploadthing.com/)
*   **Form Management:** [React Hook Form](https://react-hook-form.com/)
*   **Schema Validation:** [Zod](https://zod.dev/)
*   **Linting & Formatting:** [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

## 📂 Project Structure

The project is organized into the following main directories:

*   `app/`: Contains all the routes and pages of the application, following the Next.js App Router structure.
*   `components/`: Reusable React components used throughout the application.
*   `lib/`: Core logic, utility functions, and third-party library configurations.
*   `actions/`: Next.js Server Actions for handling server-side logic.
*   `prisma/`: Database schema (`schema.prisma`) and seeding scripts.
*   `public/`: Static assets like images and fonts.
*   `schemas/`: Zod schemas for form validation.
*   `types/`: TypeScript type definitions.

## ⚙️ Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v20.x or later)
*   [pnpm](https://pnpm.io/installation)
*   [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd rms
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the necessary environment variables. You can use the `.env.example` file as a template.
    ```bash
    cp .env.example .env
    ```
    Update the `DATABASE_URL` in the `.env` file with your PostgreSQL connection string.

4.  **Push the database schema:**
    ```bash
    pnpm prisma:push
    ```

### Running the Application

To run the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 📜 Available Scripts

*   `pnpm dev`: Starts the development server with Turbopack.
*   `pnpm build`: Creates a production build of the application.
*   `pnpm start`: Starts the production server.
*   `pnpm lint`: Lints the codebase using Next.js's ESLint configuration.
*   `pnpm prisma:generate`: Generates the Prisma Client.
*   `pnpm prisma:push`: Pushes the Prisma schema to the database.
*   `pnpm prisma:reset`: Resets the database.

## DATABASE SCHEMA

The database schema is defined in the `prisma/schema.prisma` file. It includes models for:

*   **Core:** `User`, `Session`, `Account`
*   **Restaurant:** `MenuItem`, `MenuCategory`, `Recipe`, `Ingredient`, `RestaurantTable`, `Order`, `Reservation`
*   **Employees:** `EmployeeProfile`, `Shift`, `Timekeeping`, `LeaveRequest`, `Payroll`
*   **Customers:** `CustomerProfile`, `Review`, `Notification`, `Voucher`

For more details, please refer to the `prisma/schema.prisma` file.