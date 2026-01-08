/**
 * Afrocat Sports Club Portal - Phase 1 MVP
 * Google Apps Script Implementation
 * 
 * Setup Instructions:
 * 1. Create a new Google Apps Script project
 * 2. Paste this code into Code.gs
 * 3. Create HTML files for Landing.html, Login.html, Register.html, Admin.html
 * 4. Run setup() function once to create sheets and folders
 * 5. Deploy as web app
 */

// Configuration
const SPREADSHEET_NAME = 'Afrocat Sports Club Portal';
const DRIVE_FOLDER_NAME = 'Afrocat Member Photos';
const ADMIN_EMAIL = 'admin@afrocat-sports.com'; // Change to your admin email

// Sheet names
const SHEET_TEAM_LIST = 'TEAM_LIST';
const SHEET_ADMINS = 'ADMINS';
const SHEET_AUDIT = 'AUDIT';
const SHEET_SETTINGS = 'SETTINGS';

/**
 * Setup function - Run once to initialize sheets and folders
 */
function setup() {
  try {
    // Get or create spreadsheet
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      ss = SpreadsheetApp.create(SPREADSHEET_NAME);
    }
    
    // Create TEAM_LIST sheet
    let teamListSheet = ss.getSheetByName(SHEET_TEAM_LIST);
    if (!teamListSheet) {
      teamListSheet = ss.insertSheet(SHEET_TEAM_LIST);
      teamListSheet.appendRow([
        'MemberID', 'FullName', 'Email', 'Phone', 'Gender', 'DateOfBirth',
        'Nationality', 'Role', 'TeamName', 'JerseyNumber', 'ProfilePhotoURL',
        'Bio', 'TermsAccepted', 'Status', 'RejectionReason', 'ApprovedBy',
        'ApprovedAt', 'Timestamp'
      ]);
      // Format header row
      let headerRange = teamListSheet.getRange(1, 1, 1, 18);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
    }
    
    // Create ADMINS sheet
    let adminsSheet = ss.getSheetByName(SHEET_ADMINS);
    if (!adminsSheet) {
      adminsSheet = ss.insertSheet(SHEET_ADMINS);
      adminsSheet.appendRow(['Email', 'Name', 'Role', 'Active', 'AddedAt']);
      let headerRange = adminsSheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
      // Add default admin
      adminsSheet.appendRow([ADMIN_EMAIL, 'System Admin', 'Admin', 'TRUE', new Date()]);
    }
    
    // Create AUDIT sheet
    let auditSheet = ss.getSheetByName(SHEET_AUDIT);
    if (!auditSheet) {
      auditSheet = ss.insertSheet(SHEET_AUDIT);
      auditSheet.appendRow(['Time', 'Actor', 'Action', 'TargetEmail', 'Details']);
      let headerRange = auditSheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
    }
    
    // Create SETTINGS sheet
    let settingsSheet = ss.getSheetByName(SHEET_SETTINGS);
    if (!settingsSheet) {
      settingsSheet = ss.insertSheet(SHEET_SETTINGS);
      settingsSheet.appendRow(['Key', 'Value']);
      let headerRange = settingsSheet.getRange(1, 1, 1, 2);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
      // Add default settings
      settingsSheet.appendRow(['MEMBER_ID_PREFIX', 'AFC']);
      settingsSheet.appendRow(['MEMBER_ID_YEAR', new Date().getFullYear().toString()]);
      settingsSheet.appendRow(['MEMBER_ID_COUNTER', '0']);
    }
    
    // Create Drive folder for photos
    let folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
    let photoFolder;
    if (!folders.hasNext()) {
      photoFolder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
    } else {
      photoFolder = folders.next();
    }
    
    // Set folder sharing to anyone with link can view
    photoFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    Logger.log('Setup completed successfully!');
    return 'Setup completed. Sheets and folders created.';
  } catch (error) {
    Logger.log('Setup error: ' + error.toString());
    throw error;
  }
}

/**
 * Generate unique member ID
 */
function generateMemberId() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settingsSheet = ss.getSheetByName(SHEET_SETTINGS);
  
  const prefix = getSetting('MEMBER_ID_PREFIX', 'AFC');
  const year = getSetting('MEMBER_ID_YEAR', new Date().getFullYear().toString());
  let counter = parseInt(getSetting('MEMBER_ID_COUNTER', '0')) + 1;
  
  // Update counter
  const data = settingsSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'MEMBER_ID_COUNTER') {
      settingsSheet.getRange(i + 1, 2).setValue(counter.toString());
      break;
    }
  }
  
  const memberId = `${prefix}-${year}-${String(counter).padStart(4, '0')}`;
  return memberId;
}

/**
 * Get setting value
 */
function getSetting(key, defaultValue) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settingsSheet = ss.getSheetByName(SHEET_SETTINGS);
  const data = settingsSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      return data[i][1] || defaultValue;
    }
  }
  return defaultValue;
}

/**
 * Log audit event
 */
function logAudit(actor, action, targetEmail, details) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const auditSheet = ss.getSheetByName(SHEET_AUDIT);
  auditSheet.appendRow([
    new Date(),
    actor,
    action,
    targetEmail || '',
    details || ''
  ]);
}

/**
 * Check if user is admin
 */
function isAdmin(email) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const adminsSheet = ss.getSheetByName(SHEET_ADMINS);
  const data = adminsSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email && data[i][3] === 'TRUE') {
      return true;
    }
  }
  return false;
}

/**
 * Register new member
 */
function registerMember(formData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const teamListSheet = ss.getSheetByName(SHEET_TEAM_LIST);
    
    // Check if email already exists
    const data = teamListSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === formData.email) {
        throw new Error('Email already registered');
      }
    }
    
    // Generate member ID
    const memberId = generateMemberId();
    
    // Upload photo to Drive
    let photoUrl = '';
    if (formData.photo) {
      const photoBlob = Utilities.newBlob(
        Utilities.base64Decode(formData.photo.split(',')[1] || formData.photo),
        'image/jpeg',
        `photo_${memberId}.jpg`
      );
      
      const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
      if (folders.hasNext()) {
        const photoFolder = folders.next();
        const file = photoFolder.createFile(photoBlob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        photoUrl = file.getUrl();
      }
    }
    
    // Add to TEAM_LIST
    const timestamp = new Date();
    teamListSheet.appendRow([
      memberId,
      formData.name,
      formData.email,
      formData.phone,
      formData.gender,
      formData.dateOfBirth,
      formData.nationality,
      formData.role,
      formData.teamName || '',
      formData.jerseyNumber || '',
      photoUrl,
      formData.bio || '',
      formData.termsAccepted ? 'TRUE' : 'FALSE',
      'Pending',
      '', // RejectionReason
      '', // ApprovedBy
      '', // ApprovedAt
      timestamp
    ]);
    
    // Log audit
    logAudit(formData.email, 'REGISTRATION', formData.email, `New registration: ${memberId}`);
    
    // Send registration confirmation email
    sendRegistrationEmail(formData.email, formData.name, memberId);
    
    // Notify admins
    notifyAdminsNewRegistration(formData.email, formData.name, memberId);
    
    return {
      success: true,
      memberId: memberId,
      status: 'Pending'
    };
  } catch (error) {
    Logger.log('Registration error: ' + error.toString());
    throw error;
  }
}

/**
 * Login - Check if user exists and is approved
 */
function login(email) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const teamListSheet = ss.getSheetByName(SHEET_TEAM_LIST);
  const data = teamListSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === email) {
      const user = {
        memberId: data[i][0],
        name: data[i][1],
        email: data[i][2],
        phone: data[i][3],
        gender: data[i][4],
        dateOfBirth: data[i][5],
        nationality: data[i][6],
        role: data[i][7],
        teamName: data[i][8],
        jerseyNumber: data[i][9],
        profilePhotoURL: data[i][10],
        bio: data[i][11],
        status: data[i][13],
        isAdmin: isAdmin(email)
      };
      
      if (user.status !== 'Approved') {
        throw new Error('Account not approved. Please wait for admin approval.');
      }
      
      logAudit(email, 'LOGIN', email, 'User logged in');
      return user;
    }
  }
  
  throw new Error('User not found');
}

/**
 * Get pending registrations (Admin only)
 */
function adminGetPending() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const teamListSheet = ss.getSheetByName(SHEET_TEAM_LIST);
  const data = teamListSheet.getDataRange().getValues();
  
  const pending = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][13] === 'Pending') {
      pending.push({
        memberId: data[i][0],
        name: data[i][1],
        email: data[i][2],
        phone: data[i][3],
        gender: data[i][4],
        dateOfBirth: data[i][5],
        nationality: data[i][6],
        role: data[i][7],
        teamName: data[i][8],
        jerseyNumber: data[i][9],
        profilePhotoURL: data[i][10],
        bio: data[i][11],
        timestamp: data[i][17]
      });
    }
  }
  
  return pending;
}

/**
 * Approve registration (Admin only)
 */
function adminApprove(email, adminEmail, notes) {
  if (!isAdmin(adminEmail)) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const teamListSheet = ss.getSheetByName(SHEET_TEAM_LIST);
  const data = teamListSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === email) {
      const row = i + 1;
      teamListSheet.getRange(row, 14).setValue('Approved'); // Status
      teamListSheet.getRange(row, 16).setValue(adminEmail); // ApprovedBy
      teamListSheet.getRange(row, 17).setValue(new Date()); // ApprovedAt
      
      logAudit(adminEmail, 'USER_APPROVED', email, notes || '');
      
      // Send welcome email
      sendWelcomeEmail(email, data[i][1], data[i][0]);
      
      return { success: true };
    }
  }
  
  throw new Error('User not found');
}

/**
 * Reject registration (Admin only)
 */
function adminReject(email, adminEmail, reason) {
  if (!isAdmin(adminEmail)) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  if (!reason) {
    throw new Error('Rejection reason is required');
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const teamListSheet = ss.getSheetByName(SHEET_TEAM_LIST);
  const data = teamListSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === email) {
      const row = i + 1;
      teamListSheet.getRange(row, 14).setValue('Rejected'); // Status
      teamListSheet.getRange(row, 15).setValue(reason); // RejectionReason
      
      logAudit(adminEmail, 'USER_REJECTED', email, reason);
      
      // Send rejection email
      sendRejectionEmail(email, data[i][1], reason);
      
      return { success: true };
    }
  }
  
  throw new Error('User not found');
}

/**
 * Send registration confirmation email
 */
function sendRegistrationEmail(email, name, memberId) {
  const subject = 'Afrocat Sports Club - Registration Received';
  const body = `
Dear ${name},

Thank you for registering with Afrocat Sports Club!

Your registration has been received and is pending approval.

Member ID: ${memberId}

Our admin team will review your registration and notify you once it's approved.

Best regards,
Afrocat Sports Club Team
"One Team, One Dream"
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body
  });
}

/**
 * Notify admins of new registration
 */
function notifyAdminsNewRegistration(email, name, memberId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const adminsSheet = ss.getSheetByName(SHEET_ADMINS);
  const data = adminsSheet.getDataRange().getValues();
  
  const subject = 'New Registration - Afrocat Sports Club';
  const body = `
A new registration has been submitted:

Name: ${name}
Email: ${email}
Member ID: ${memberId}

Please review and approve/reject in the admin panel.

Afrocat Sports Club Portal
  `;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][3] === 'TRUE') {
      MailApp.sendEmail({
        to: data[i][0],
        subject: subject,
        body: body
      });
    }
  }
}

/**
 * Send welcome email on approval
 */
function sendWelcomeEmail(email, name, memberId) {
  const subject = 'Welcome to Afrocat Sports Club!';
  const body = `
Dear ${name},

Great news! Your registration has been approved.

Member ID: ${memberId}

You can now log in to the Afrocat Sports Club Portal and access all features.

Welcome to the team!

Best regards,
Afrocat Sports Club Team
"One Team, One Dream"
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body
  });
}

/**
 * Send rejection email
 */
function sendRejectionEmail(email, name, reason) {
  const subject = 'Afrocat Sports Club - Registration Update';
  const body = `
Dear ${name},

Thank you for your interest in joining Afrocat Sports Club.

Unfortunately, your registration could not be approved at this time.

Reason: ${reason}

If you have any questions, please contact us.

Best regards,
Afrocat Sports Club Team
"One Team, One Dream"
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body
  });
}

/**
 * Web app entry point - Landing page
 */
function doGet(e) {
  const page = e.parameter.page || 'landing';
  
  if (page === 'login') {
    return HtmlService.createTemplateFromFile('Login').evaluate()
      .setTitle('Login - Afrocat Sports Club')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } else if (page === 'register') {
    return HtmlService.createTemplateFromFile('Register').evaluate()
      .setTitle('Register - Afrocat Sports Club')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } else if (page === 'admin') {
    return HtmlService.createTemplateFromFile('Admin').evaluate()
      .setTitle('Admin - Afrocat Sports Club')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } else {
    return HtmlService.createTemplateFromFile('Landing').evaluate()
      .setTitle('Afrocat Sports Club Portal')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

/**
 * Include HTML files
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

