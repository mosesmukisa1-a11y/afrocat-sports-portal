# Phase 1: MVP - Google Apps Script Implementation

## Overview

Phase 1 is a fully functional MVP built using Google Apps Script, Google Sheets as the database, and Google Drive for photo storage.

## Setup Instructions

### Step 1: Create Google Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Name it "Afrocat Sports Club Portal"

### Step 2: Add Code Files

1. Copy the contents of `Code.gs` into the default `Code.gs` file
2. Create HTML files:
   - Click "+" next to "Files" → "HTML"
   - Name it "Landing" and paste `Landing.html` content
   - Repeat for "Login", "Register", and "Admin"

### Step 3: Configure Settings

1. Open `Code.gs`
2. Update the `ADMIN_EMAIL` constant with your admin email:
   ```javascript
   const ADMIN_EMAIL = 'your-admin@email.com';
   ```

### Step 4: Initialize the System

1. In the Apps Script editor, select the `setup` function from the dropdown
2. Click "Run"
3. Authorize the script when prompted (it needs access to Sheets, Drive, and Gmail)
4. Wait for "Setup completed successfully!" message

### Step 5: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Click the gear icon ⚙️ next to "Select type" → "Web app"
3. Configure:
   - **Description**: "Afrocat Sports Club Portal v1"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone" (or "Anyone with Google account" for restricted access)
4. Click "Deploy"
5. Copy the Web App URL

## Usage

### Access the Portal

Open the Web App URL in a browser. You'll see the landing page with:
- Logo placeholder
- Action carousel placeholder
- Quick access buttons

### Register a New User

1. Click "Register"
2. Fill in all required fields
3. Upload a profile photo
4. Accept Terms & Conditions
5. Click "Register"
6. User will receive confirmation email
7. Status will be "Pending"

### Admin Approval

1. Login with an admin email (must be in ADMINS sheet)
2. You'll see pending registrations
3. Click "Approve" or "Reject" for each user
4. If rejecting, provide a reason
5. User will receive approval/rejection email

### Login

1. Click "Login"
2. Enter email
3. If approved, you'll be logged in
4. Admins are redirected to admin panel

## Data Structure

### TEAM_LIST Sheet

Contains all registered members with columns:
- MemberID, FullName, Email, Phone, Gender, DateOfBirth
- Nationality, Role, TeamName, JerseyNumber
- ProfilePhotoURL, Bio, TermsAccepted
- Status, RejectionReason, ApprovedBy, ApprovedAt, Timestamp

### ADMINS Sheet

Contains admin users:
- Email, Name, Role, Active, AddedAt

### AUDIT Sheet

Logs all actions:
- Time, Actor, Action, TargetEmail, Details

### SETTINGS Sheet

System settings:
- Key, Value pairs

## Member ID Format

Format: `AFC-YYYY-XXXX`
- AFC: Prefix
- YYYY: Year
- XXXX: Sequential number (0001, 0002, etc.)

## Email Notifications

The system automatically sends:
1. **Registration confirmation** - When user registers
2. **Admin notification** - When new registration is submitted
3. **Welcome email** - When admin approves registration
4. **Rejection email** - When admin rejects registration

## Photo Storage

- Photos are uploaded to Google Drive folder: "Afrocat Member Photos"
- Folder is set to "Anyone with link can view"
- Photo URL is stored in TEAM_LIST sheet

## Security Notes

- Admin access is controlled by ADMINS sheet
- Only approved users can login
- All actions are logged in AUDIT sheet
- Email is used as unique identifier

## Troubleshooting

### "Setup error"
- Make sure you have permission to create sheets
- Check that you authorized all required permissions

### "Email already registered"
- User with this email already exists in TEAM_LIST
- Check the sheet manually

### "Unauthorized: Admin access required"
- Email is not in ADMINS sheet or Active is not TRUE
- Add email to ADMINS sheet manually

### Photos not showing
- Check Drive folder permissions
- Verify photo URL in TEAM_LIST sheet
- Ensure folder sharing is set correctly

## Next Steps

After Phase 1 is running:
1. Test registration and approval flow
2. Add more admin users to ADMINS sheet
3. Customize email templates if needed
4. Prepare for migration to Phase 2

## Support

For issues or questions, check:
- Apps Script execution logs (View → Execution log)
- Google Sheets for data verification
- Email delivery in Gmail

---

**RUN THIS:**

1. Create new Apps Script project
2. Copy Code.gs and all HTML files
3. Update ADMIN_EMAIL in Code.gs
4. Run setup() function
5. Deploy as web app
6. Test registration and login flow

