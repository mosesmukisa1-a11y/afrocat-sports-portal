# Phase 0: Functional Specifications

## Project Overview

**Project Name:** Afrocat Sports Club Portal  
**Tagline:** "One Team, One Dream"  
**Location:** Windhoek, Namibia  
**Sport:** Volleyball

## Target Audience

1. **Players**: Register, view stats, track attendance, report injuries
2. **Coaches**: Manage teams, set training focus, view analytics
3. **Managers**: Financial oversight, team administration
4. **Stats Staff**: Record and manage match statistics
5. **Doctor/Wellness Staff**: Track injuries, manage recovery
6. **Admins**: Full system access and user management

## Core Features

### 1. Landing Dashboard
- Center logo placeholder
- Rotating action carousel (placeholder images)
- Quick access buttons:
  - Register / Login
  - Player Dashboard
  - Match Stats
  - Smart Training Focus
  - Attendance
  - Finance Center
  - Awards
  - Wellness & Injury Tracker

### 2. Registration Flow
- **Input Fields:**
  - Full Name (required)
  - Email (required, used as login username)
  - Phone (required)
  - Gender (required)
  - Date of Birth (required)
  - Nationality (required)
  - Role selection (Player/Coach/Manager/Stats/Doctor)
  - Team Name (if applicable)
  - Jersey Number (if Player)
  - Profile Photo (required, upload)
  - Bio (optional)
  - Terms & Conditions checkbox (required)

- **Process:**
  1. User fills registration form
  2. Photo uploaded to Drive (Phase 1) or storage (Phase 2+)
  3. Auto-generate Afrocat Member ID (format: AFC-YYYY-XXXX)
  4. Status defaults to "Pending"
  5. Timestamp recorded
  6. Admin notification email sent
  7. User receives "Registration Received" email

### 3. Approval Flow
- **Admin Actions:**
  - View pending registrations
  - Approve with optional notes
  - Reject with required reason

- **On Approval:**
  - Status → "Approved"
  - ApprovedBy and ApprovedAt recorded
  - Welcome email sent to user
  - Access granted to portal
  - User added to TEAM_LIST (Phase 1) or Users table (Phase 2+)

- **On Rejection:**
  - Status → "Rejected"
  - RejectionReason recorded
  - Rejection email sent with reason
  - No access granted

- **Auto-Reminders:**
  - Optional scheduled trigger for registrations pending >7 days

### 4. Authentication

**Phase 1 (MVP):**
- Email-only login
- Status-based access gating (only Approved users can access)

**Phase 2+ (Production):**
- OTP email login (preferred) OR password + reset
- JWT access tokens + refresh tokens
- Rate limiting
- Input validation

### 5. Role-Based Access Control (RBAC)

See [RBAC Matrix](./rbac-matrix.md) for detailed permissions.

**Roles:**
- Player
- Coach
- Manager
- Stats
- Doctor
- Admin

For complete specifications, see the full documentation in the repository.

