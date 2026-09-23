# Admin System & Multi-Role Specifications

## Overview
This document outlines the specifications for implementing a multi-role admin system for the school club management platform, enabling school coordinators and club sponsors to manage the platform alongside student leadership.

---

## 1. Role & Permission System

### User Roles Hierarchy

**Super Admin / School Coordinator**
- Full system access
- Create and manage all clubs
- Assign/remove sponsors from clubs
- View all reports and moderate content
- Access admin dashboard and analytics
- Manage user roles (promote coordinators, etc.)

**Club Sponsor (Teacher)**
- Verified via Azure AD (userType: None)
- Claim clubs as sponsor (not president)
- View and moderate posts from sponsored clubs
- Approve/reject presidency transfers in their clubs
- Approve/reject leadership role changes in their clubs
- View club analytics for their clubs
- Cannot create posts (observation role)

**Club President (Multiple per club)**
- Manage club information
- Create and manage posts
- Add/remove members
- Promote members to officer/leader roles
- Request presidency transfers (requires sponsor approval)
- All presidents have equal permissions

**Club Officer/Leader**
- Create posts on behalf of club
- Limited club management
- Cannot change leadership structure

**Member**
- Join clubs freely (no approval needed)
- Like and interact with posts
- View club information

### Permission Matrix

| Action | Member | Officer | President | Sponsor | Coordinator |
|--------|--------|---------|-----------|---------|-------------|
| Join club | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create post | - | ✓ | ✓ | - | - |
| Edit club info | - | - | ✓ | - | ✓ |
| Add/remove members | - | - | ✓ | - | ✓ |
| Promote to officer | - | - | ✓ (pending sponsor approval) | ✓ | ✓ |
| Add/remove president | - | - | ✓ (pending sponsor approval) | ✓ | ✓ |
| Delete posts | - | - | Own only | Any in club | Any |
| View reports | - | - | - | Own clubs | All |
| Create clubs | - | - | - | - | ✓ |
| Assign sponsors | - | - | - | - | ✓ |

---

## 2. Database Schema Changes

### New Tables

```sql
-- Global user roles (coordinators)
CREATE TABLE user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL, -- 'coordinator'
  assigned_by TEXT,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Club sponsors (teachers)
CREATE TABLE club_sponsors (
  id TEXT PRIMARY KEY,
  club_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'removed'
  assigned_by TEXT,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES clubs(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(club_id, user_id)
);

-- Post reports
CREATE TABLE post_reports (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  reporter_id TEXT NOT NULL,
  reason TEXT NOT NULL, -- 'inappropriate', 'spam', 'harassment', 'misinformation', 'other'
  description TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewing', 'resolved', 'dismissed'
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  resolution_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (reporter_id) REFERENCES users(id)
);

-- Leadership change requests (for sponsor approval)
CREATE TABLE leadership_requests (
  id TEXT PRIMARY KEY,
  club_id TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  target_user_id TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'add_president', 'remove_president', 'add_officer', 'remove_officer'
  previous_role TEXT,
  new_role TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES clubs(id),
  FOREIGN KEY (requested_by) REFERENCES users(id),
  FOREIGN KEY (target_user_id) REFERENCES users(id)
);

-- Audit log for admin actions
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'post', 'club', 'user', 'report'
  target_id TEXT,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Modified Tables

**clubs table:**
- Keep `president_id` as "primary president" (optional, for display)
- Multiple presidents stored in `club_members` with role='president'

**users table:**
- Add `user_type` field to match Azure AD userType (for sponsor verification)

---

## 3. Authentication & Verification

### Sponsor Verification
- Check `user_type === 'None'` from Azure AD
- Teachers can claim clubs as sponsors
- Separate UI flow from student president claiming

### Coordinator Assignment
- Initial coordinators set via environment variable: `COORDINATOR_EMAILS`
- Coordinators can promote other users to coordinator role
- Stored in `user_roles` table

---

## 4. Content Moderation System

### Post Reporting
- Any logged-in user can report a post
- Report reasons: Inappropriate Content, Spam, Harassment, Misinformation, Other
- Optional description field
- Reports visible to:
  - Club sponsors (for their clubs)
  - Coordinators (all reports)

### Moderation Actions
- Hide post (soft delete, can be restored)
- Delete post permanently
- Dismiss report (mark as resolved, no action)
- Add resolution notes

### No Pre-Approval Required
- Posts publish immediately (no approval queue)
- Members join clubs immediately (no approval needed)
- Moderation is reactive, not proactive

---

## 5. Leadership Management

### Multiple Presidents
- Clubs can have multiple presidents
- All presidents have equal permissions
- Any president can manage club, create posts, manage members

### Presidency Changes (Requires Sponsor Approval)
- Adding a new president
- Removing a president
- Transferring "primary" presidency

### Officer Changes (Requires Sponsor Approval)
- Promoting member to officer/leader
- Demoting officer to member

### Approval Workflow
1. President initiates leadership change
2. Request created in `leadership_requests` table
3. Sponsor receives notification (in-app)
4. Sponsor approves or rejects with optional note
5. If approved, role change applied automatically
6. Requester notified of decision

---

## 6. Admin Panel Features

### Coordinator Dashboard (`/admin`)
- System statistics:
  - Total clubs, members, posts
  - Active users (last 7 days)
  - Pending reports count
- Quick actions:
  - Create new club
  - Assign sponsors
  - View all reports
- Recent activity feed

### Club Management (`/admin/clubs`)
- List all clubs with filters
- Create new clubs
- Edit club information
- Assign/remove sponsors
- Archive/delete clubs
- View club analytics

### Reports Queue (`/admin/reports`)
- List all reports with filters (pending, resolved, dismissed)
- Filter by club, reporter, date
- Bulk actions (dismiss multiple)
- Detailed report view with post preview

### User Management (`/admin/users`)
- Search users
- View user activity
- Assign coordinator role
- View user's clubs and roles

### Sponsor Dashboard (`/sponsor`)
- List of sponsored clubs
- Reports from sponsored clubs
- Pending leadership requests
- Club analytics for sponsored clubs

---

## 7. API Endpoints

### Admin Endpoints
- `POST /api/admin/clubs` - Create club (coordinator only)
- `PUT /api/admin/clubs/[id]` - Edit any club (coordinator only)
- `POST /api/admin/clubs/[id]/sponsor` - Assign sponsor (coordinator only)
- `DELETE /api/admin/clubs/[id]/sponsor/[userId]` - Remove sponsor (coordinator only)
- `GET /api/admin/reports` - Get all reports (coordinator only)
- `GET /api/admin/stats` - Get system statistics (coordinator only)
- `POST /api/admin/users/[id]/role` - Assign coordinator role (coordinator only)

### Sponsor Endpoints
- `GET /api/sponsor/clubs` - Get sponsored clubs
- `GET /api/sponsor/reports` - Get reports from sponsored clubs
- `GET /api/sponsor/requests` - Get pending leadership requests
- `POST /api/sponsor/requests/[id]/approve` - Approve leadership change
- `POST /api/sponsor/requests/[id]/reject` - Reject leadership change

### Report Endpoints
- `POST /api/posts/[id]/report` - Report a post (any user)
- `GET /api/reports/[id]` - Get report details (sponsor/coordinator)
- `POST /api/reports/[id]/resolve` - Resolve report (sponsor/coordinator)
- `POST /api/reports/[id]/dismiss` - Dismiss report (sponsor/coordinator)

### Leadership Request Endpoints
- `POST /api/clubs/[id]/leadership/request` - Request leadership change (president)
- `GET /api/clubs/[id]/leadership/requests` - Get pending requests (president/sponsor)

### Post Moderation Endpoints
- `DELETE /api/posts/[id]` - Delete post (author/sponsor/coordinator)
- `POST /api/posts/[id]/hide` - Hide post (sponsor/coordinator)
- `POST /api/posts/[id]/restore` - Restore hidden post (sponsor/coordinator)

---

## 8. UI Components

### New Components
- `admin-dashboard.tsx` - Main admin dashboard
- `admin-clubs-management.tsx` - Club management interface
- `admin-reports-queue.tsx` - Reports moderation queue
- `admin-user-management.tsx` - User role management
- `sponsor-dashboard.tsx` - Sponsor overview
- `sponsor-requests-queue.tsx` - Leadership approval queue
- `report-post-dialog.tsx` - Post reporting dialog
- `leadership-request-dialog.tsx` - Request leadership change
- `approve-request-dialog.tsx` - Approve/reject leadership request

### Modified Components
- `claim-club-dialog.tsx` - Add sponsor claiming option
- `club-detail-page.tsx` - Show multiple presidents, sponsor info
- `manage-leadership-dialog.tsx` - Create requests instead of direct changes
- Navigation - Add admin/sponsor links for authorized users

---

## 9. Environment Variables

```env
# Coordinator emails (comma-separated)
COORDINATOR_EMAILS=coordinator1@school.edu,coordinator2@school.edu

# Azure AD configuration (for sponsor verification)
AZURE_AD_TENANT_ID=your-tenant-id
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret

# Feature flags
ENABLE_REPORTING=true
ENABLE_SPONSOR_APPROVAL=true
```

---

## 10. Implementation Phases

### Phase 1: Foundation (Current Task)
- Add database tables (user_roles, club_sponsors, post_reports, leadership_requests, audit_log)
- Create helper functions to check user roles
- Add middleware for role-based access control

### Phase 2: Multiple Presidents
- Modify club claiming to support multiple presidents
- Update UI to show all presidents
- Update permissions to allow any president to manage club

### Phase 3: Sponsor System
- Implement sponsor claiming flow
- Create sponsor dashboard
- Build leadership request approval workflow

### Phase 4: Reporting System
- Add report post functionality
- Create reports queue for sponsors/coordinators
- Implement moderation actions

### Phase 5: Admin Panel
- Build coordinator dashboard
- Create club management interface
- Add user management features
- Implement analytics

### Phase 6: Polish & Testing
- Audit logging for all admin actions
- Email notifications (optional)
- Performance optimization
- Security audit

---

## 11. Security Considerations

- Role checks on all protected endpoints
- Input validation on all admin actions
- Rate limiting on reporting (prevent spam)
- Audit trail for all moderation actions
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize user input)
- CSRF protection on state-changing operations

---

## 12. Notes & Decisions

- **No approval needed for:** Joining clubs, creating posts
- **Approval needed for:** Leadership changes (president/officer promotions)
- **Sponsors verified by:** Azure AD userType field
- **Initial coordinators:** Set via environment variable
- **Multiple presidents:** All have equal permissions
- **Moderation:** Reactive (reports), not proactive (approval queues)
