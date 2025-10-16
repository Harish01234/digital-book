# Pages and Entries Management App

A complete, production-ready web application built with Next.js, TypeScript, TailwindCSS, and MongoDB with Mongoose for managing pages and their entries.

## Features

- **Two Page Types**: Deoya and Neoya with different data requirements
- **Full CRUD Operations**: Create, read, update, and delete pages and entries
- **Search Functionality**: Search entries by number
- **Real-time Calculations**: Automatic sum calculations for money and interest
- **Global Totals**: Dashboard shows totals across all pages
- **Toast Notifications**: User-friendly success and error messages
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Modern UI**: Clean, professional design with smooth transitions

## Tech Stack

- **Frontend**: Next.js 13 with App Router, React 18, TypeScript
- **Styling**: TailwindCSS with shadcn/ui components
- **Database**: MongoDB with Mongoose ODM
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (connection string already configured)

## Installation

1. Clone the repository or extract the project files

2. Install dependencies:
```bash
npm install
```

3. The MongoDB connection is already configured in `.env.local`. The file contains:
```
MONGODB_URI=mongodb+srv://harishmalakar2002_db_user:2UKFlaeOC9WZe9oA@cluster0.yj3qcio.mongodb.net/
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /api
    /pages                    # API routes for pages CRUD
      /[id]                   # Single page operations
        /entries              # Entry CRUD operations
  /pages
    /[id]                     # Page details view
  page.tsx                    # Dashboard
  layout.tsx                  # Root layout
  globals.css                 # Global styles

/components
  /ui                         # shadcn/ui components

/lib
  db.ts                       # MongoDB connection utility

/models
  page.ts                     # Mongoose schema and model
```

## Usage

### Dashboard

- View all pages grouped by type (Deoya and Neoya)
- See global totals for each page type
- Create new pages with the "New Page" button
- Click on any page card to view its details
- Delete pages using the trash icon

### Page Details

- View all entries for a specific page
- Add new entries with the "Add Entry" button
- Edit existing entries using the edit icon
- Delete entries using the trash icon
- Search entries by number using the search bar
- View calculated sums for money and interest (Neoya only)

### Page Types

#### Deoya Pages
Each entry contains:
- No (number)
- Money (amount)
- Date (defaults to today)

Displays: Sum of all money values

#### Neoya Pages
Each entry contains:
- No (number)
- Money (amount)
- Interest (amount)
- Date (defaults to today)

Displays: Sum of money and sum of interest

## API Endpoints

### Pages
- `GET /api/pages` - Fetch all pages
- `POST /api/pages` - Create a new page
- `GET /api/pages/[id]` - Fetch a specific page
- `PUT /api/pages/[id]` - Update a page
- `DELETE /api/pages/[id]` - Delete a page

### Entries
- `POST /api/pages/[id]/entries` - Add an entry to a page
- `PUT /api/pages/[id]/entries` - Update an entry
- `DELETE /api/pages/[id]/entries?entryId=[entryId]` - Delete an entry

## Database Schema

### Page Model
```typescript
{
  title: String (required),
  type: 'deoya' | 'neoya' (required),
  entries: [Entry],
  createdAt: Date,
  updatedAt: Date
}
```

### Entry Schema
```typescript
{
  _id: ObjectId,
  no: Number (required),
  money: Number (required),
  interest: Number (default: 0),
  date: Date (default: now)
}
```

## Features in Detail

### CRUD Operations
- All create, read, update, and delete operations are fully functional
- Proper error handling with user-friendly messages
- Optimistic UI updates for better user experience

### Calculations
- Real-time sum calculations for each page
- Global totals across all pages of the same type
- Automatic updates when entries are added, edited, or deleted

### Search
- Search entries by number within a page
- Real-time filtering as you type
- Clear visual feedback when no results are found

### UI/UX
- Responsive design with Tailwind breakpoints
- Loading spinners during data fetches
- Confirmation dialogs for destructive actions
- Toast notifications for all CRUD operations
- Smooth hover effects and transitions
- Clean, modern color scheme

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

## Notes

- The MongoDB database is already provisioned and connected
- Toast notifications appear in the top-right corner
- All forms include validation
- Dates default to today's date
- Numbers are formatted with thousand separators for readability

## Troubleshooting

If you encounter any issues:

1. Ensure MongoDB connection is working by checking the `.env.local` file
2. Clear your browser cache and restart the development server
3. Check the console for any error messages
4. Verify that all dependencies are installed correctly

## License

This project is provided as-is for your use.
