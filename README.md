# Movie Web App

A modern web application for discovering and exploring movies using the OMDB API. This project features a sleek UI with glassmorphism design, user authentication, movie search functionality, favorites management, and detailed movie information.

## Features

- **User Authentication**: Secure login and registration with form validation
- **Movie Search**: Search for movies by title, year, and type
- **Movie Details**: View comprehensive information about each movie
- **Favorites Management**: Save and manage your favorite movies
- **Responsive Design**: Optimized for all device sizes
- **Modern UI**: Glassmorphism design with animations and transitions
- **Genre Analytics**: Visual representation of your favorite movie genres

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for global state
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query) for data fetching, caching and synchronization
- **Authentication**: Custom JWT-based authentication
- **UI Components**: Combination of shadcn/ui and custom components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Chart**: Rechart JS

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/movie-web-app.git
   cd movie-web-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your OMDB API key:

   ```
   NEXT_PUBLIC_OMDB_API_KEY=your_api_key_here
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Technical Decisions

### State Management

I chose Zustand for state management because:

- It's lightweight and has minimal boilerplate compared to Redux
- Provides simple and intuitive API
- Works well with React hooks
- Supports middleware for persisting state to localStorage

### Authentication

The authentication system uses:

- JWT tokens stored in localStorage
- Custom hooks for login, registration, and authentication state
- Protected routes that redirect unauthenticated users
- Form validation with Zod schemas

### Data Fetching

Movie data is fetched using:

- TanStack Query (React Query) for efficient data fetching
- Automatic caching and background refetching
- Loading states to improve user experience
- Error handling with user-friendly messages
- Optimistic updates for a smoother user experience

### UI/UX Design

The UI design features:

- Glassmorphism for a modern, depth-rich interface
- Responsive design that works on all device sizes
- Animations with Framer Motion for a polished feel
- Consistent color scheme and typography

### Form Validation

Form validation is implemented using:

- React Hook Form for efficient form state management
- Zod for schema validation with strong TypeScript integration
- Real-time validation feedback to users
- Custom error messages for better user experience

## Known Limitations

### Year Range Filter

The application does not support filtering movies by a year range because the OMDB API only allows filtering by a specific year, not a range. As a workaround, the application provides a single year filter option. To implement a year range filter in the future, we would need to:

1. Make multiple API calls for each year in the range
2. Combine and deduplicate the results
3. Implement client-side pagination for the combined results

This approach would require careful consideration of API rate limits and performance implications.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OMDB API](https://www.omdbapi.com/) for providing movie data
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the framework
- [Framer Motion](https://www.framer.com/motion/) for animations
