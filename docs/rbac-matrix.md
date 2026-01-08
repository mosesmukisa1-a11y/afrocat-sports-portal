# RBAC Matrix: Permissions by Role

## Roles

1. **Player** - Regular club member
2. **Coach** - Team coach
3. **Manager** - Club manager
4. **Stats** - Statistics staff
5. **Doctor** - Medical/wellness staff
6. **Admin** - System administrator

## Permission Matrix

| Feature | Player | Coach | Manager | Stats | Doctor | Admin |
|---------|--------|-------|---------|-------|--------|-------|
| **Authentication** |
| Register | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **User Management** |
| View own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all users | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Approve registrations | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Reject registrations | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Edit user roles | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Teams** |
| View own team | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all teams | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Create teams | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Edit teams | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Delete teams | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Match Stats** |
| View own stats | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View team stats | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Create matches | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Edit matches | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Record player stats | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Delete matches | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Attendance** |
| View own attendance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View team attendance | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Mark attendance | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Edit attendance | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Finance** |
| View own transactions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all transactions | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Create transactions | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Approve expenses | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Delete transactions | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Awards** |
| View own awards | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all awards | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Create awards | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Edit awards | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Delete awards | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Wellness & Injuries** |
| View own injuries | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all injuries | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Create injury records | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Edit injury records | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Delete injury records | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Training Focus** |
| View training focus | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create training focus | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Edit training focus | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Delete training focus | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Audit Logs** |
| View audit logs | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Settings** |
| View settings | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Edit settings | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Permission Details

### Player
- Can register and manage own profile
- Can view own stats, attendance, injuries, and awards
- Cannot create or edit team data
- Cannot access financial information beyond own transactions

### Coach
- All Player permissions
- Can manage teams (create, edit, view all)
- Can create matches and record stats
- Can mark attendance for team members
- Can create awards
- Can set training focus
- Cannot access finance or approve expenses

### Manager
- All Coach permissions (except training focus creation)
- Can manage finances (create transactions, approve expenses)
- Can view all users
- Cannot approve registrations or manage system settings

### Stats
- Can view team stats
- Can create and edit matches
- Can record player statistics
- Cannot manage teams or finances

### Doctor
- Can view all injury records
- Can create and edit injury records
- Can view own profile and basic team info
- Cannot access stats, finance, or team management

### Admin
- Full system access
- Can approve/reject registrations
- Can manage all users and roles
- Can access audit logs
- Can manage system settings
- Can delete any entity

## Implementation Notes

- Permissions are enforced at both API and UI levels
- RBAC middleware checks permissions before route execution
- UI elements are conditionally rendered based on role
- Audit logs record all permission checks and violations
- Role changes require admin approval and are logged

