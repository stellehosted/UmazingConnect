# BPS Compass

A modern, simple club-organizing app for BPS: students can push updates, create club pages, manage leadership, and more...

## Features

### Current Implementation
- **Microsoft Azure Authentication** - Secure login with school accounts only
- **Profile Creation** - Students and sponsors can create detailed profiles
- **Role-Based Permissions** - Different options for students, leadership, and presidents
- **W UI** - Next.js, TypeScript, and Tailwind CSS
- **Compatible Design** - Supports all devices

### Planned Features
- **Club Management** - Create, join, and manage school clubs
- **Social Posts** - Share updates, events, and announcements
- SOON **Event Management** - Create and RSVP to school events
- SOON **Real-time Updates** - Live notifications and messaging

## Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Microsoft Azure AD (MSAL)
- **State Management**: React Context API
- **Deployment**: Vercel


## Wanna try it yourself?

### 1. Clone and Install
npm install

### 2. Quick Start (Demo Mode)

For immediate testing without Azure setup:

```bash
# Create environment file
cp env-template.txt .env.local

# Edit .env.local and set:
NEXT_PUBLIC_DEMO_MODE=true

# Start development server
npm run dev
```

A demo user account will get you past Azure.

### 3. Azure Authentication Setup (dev)

1. **Go to Azure Portal**: https://portal.azure.com
2. **Navigate to**: Azure Active Directory > App registrations
3. **Create New Registration**:
   - Name: `SchoolConnect`
   - Supported account types: `Accounts in this organizational directory only`
   - Redirect URI (dev): Web > `http://localhost:3000`
4. **Get Client ID**: Copy the Application (client) ID
5. **Configure Permissions**: API permissions > Microsoft Graph > User.Read
6. **Create Environment File**:

```bash
# Create .env.local file
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Creation

1. **User visits app** → Redirected to profile creation (if not logged in)
2. **Microsoft Login** → User authenticates with school Microsoft account
3. **Domain Validation** → Only @berkeleyprep.org emails are accepted
4. **Profile Creation** → User creates profile with role, grade, interests, etc.
5. **Access Granted** → User can now access all app features

## Roles

### Member
- Can join clubs and participate in activities
- Grade level tracking
- Interest-based recommendations

### Vice President
- Can manage club pages
- Club verification capabilities
- Edit specific club info

### President
- Full club edits
- Highest control on leadership
- Can revoke or transfer leadership

## Contribute!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Check the Azure configuration guide
- Review the authentication flow documentation
- Open an issue in the repository

---
