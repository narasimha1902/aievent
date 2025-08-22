# AI-Powered Event Monitor

A full-stack web application built with Next.js, React, Tailwind CSS, and Supabase for real-time event monitoring and incident management at large-scale public events like concerts and rallies.

## Features

### Authentication & User Management
- **Login Page**: Email/password authentication with dark mode UI
- **Registration**: Create accounts with role selection (Mentor, Admin, Responder)
- **Forgot Password**: Password reset functionality
- **Role-based Access Control**: Different features based on user roles

### Main Dashboard
- **Live Map**: Real-time responder locations using Leaflet/Mapbox
- **AI-Generated Summaries**: Automated incident analysis and recommendations
- **Live Video Feed**: Preview component for security camera integration
- **Alert Cards**: Real-time incident notifications for Crowd Surge, Fire/Smoke, Medical emergencies
- **Dark Mode Support**: Toggle between light and dark themes

### Incident Management
- **Incident Detail Page**: View incident photos, type, time, and AI confidence scores
- **Dispatch System**: Verify, dispatch, or cancel incidents
- **Status Tracking**: Monitor incident progression from detection to resolution

### Mobile Responder View
- **Incident Assignment**: Accept or decline incident assignments
- **Route Navigation**: Integrated Google Maps directions
- **Status Updates**: Mark progress (En Route, Arrived, Completed)
- **Communication**: Call dispatch and messaging features

### Admin Panel
- **Responder Management**: CRUD operations for responder accounts
- **Zone Management**: Create and manage event zones
- **AI Model Thresholds**: Adjust detection sensitivity for different incident types
- **Human Verification Toggle**: Require manual verification before auto-dispatch
- **Export Reports**: Download system data for analysis

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS v4 with custom theme system
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Maps**: React Leaflet with OpenStreetMap
- **UI Components**: Custom component library with shadcn/ui patterns
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode support

## Project Structure

```
ai-event-monitor/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── admin/             # Admin panel pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── incidents/         # Incident management
│   │   ├── responder/         # Mobile responder view
│   │   ├── login/             # Authentication pages
│   │   ├── register/
│   │   └── forgot-password/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   ├── map/              # Map components
│   │   └── providers/        # Context providers
│   ├── contexts/             # React contexts
│   ├── lib/                  # Utility functions
│   └── styles/               # Global styles
├── public/                   # Static assets
├── supabase-schema.sql       # Database schema
└── package.json
```

## Database Schema

The application uses Supabase PostgreSQL with the following key tables:

- **users**: User profiles and roles
- **incidents**: AI-detected events with confidence scores
- **responders**: Real-time location and status tracking
- **assignments**: Incident-responder assignments
- **zones**: Event area management
- **ai_settings**: Model thresholds and configurations
- **location_history**: GPS tracking history
- **event_logs**: Audit trail

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-event-monitor
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Database Setup
1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) policies

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## User Roles & Permissions

### Mentor
- View dashboard and incidents
- Verify and dispatch responders
- Monitor real-time event status

### Admin
- All mentor permissions
- Manage responders and zones
- Configure AI model settings
- Export system reports
- User management

### Responder
- Receive incident assignments
- Update status and location
- Access mobile-optimized interface
- Navigate to incident locations

## Key Features Implementation

### Real-time Updates
- WebSocket connections through Supabase Realtime
- Live responder location tracking
- Instant incident notifications

### AI Integration
- Configurable confidence thresholds
- Automated incident detection
- Human verification workflows
- Smart dispatching algorithms

### Mobile Optimization
- Responsive design for all screen sizes
- Touch-optimized responder interface
- GPS integration for location services
- Offline capability considerations

### Security
- Row Level Security (RLS) policies
- Role-based access control
- Secure authentication flows
- Data encryption in transit and at rest

## Development

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Component-based architecture
- Responsive design patterns

### Performance
- Next.js 14 App Router for optimal performance
- Dynamic imports for code splitting
- Optimized map rendering
- Efficient state management

## Deployment

### Production Deployment
1. Build the application:
```bash
npm run build
```

2. Deploy to Vercel, Netlify, or your preferred platform
3. Configure environment variables in production
4. Set up Supabase production database

### Environment Variables
Ensure all environment variables are properly configured in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
