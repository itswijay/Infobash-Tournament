# InfoBash Tournament v4.0

A professional cricket tournament management system built with React, TypeScript, and Supabase.

## Features

- **Team Registration**: Complete team registration with member management
- **User Authentication**: Google OAuth integration via Supabase
- **Profile Management**: User profile creation and management
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Updates**: Supabase real-time capabilities
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI components
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Context + Hooks
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router DOM v7

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd infobash-tournament
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start development server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── shared/         # Shared components (Loading, Error states)
│   ├── team/           # Team-related components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and API functions
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

## Key Components

- **RegisterTeamPage**: Team registration and editing
- **ProfilePage**: User profile management
- **TeamRegistrationForm**: Team creation and editing form
- **AuthContext**: Authentication state management

## Database Schema

The application uses the following main tables:

- `user_profiles`: User profile information
- `teams`: Team details and metadata
- `team_members`: Individual team member information
- `tournaments`: Tournament configuration
- `admin_audit_logs`: Admin action audit trail
- `matches`: Match scheduling and results
- `match_results`: Detailed match results
- `user_roles`: User role assignments

### Database Setup

If you encounter database schema errors, run the database setup:

```bash
npm run setup-db
```

This will display the SQL scripts you need to run in your Supabase dashboard to create the required tables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For support and questions, please contact the development team.
