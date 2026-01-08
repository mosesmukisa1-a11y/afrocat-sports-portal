# Data Migration Guide: Phase 1 → Phase 2

## Overview

This guide covers migrating data from Phase 1 (Google Sheets) to Phase 2 (Postgres database).

## Prerequisites

1. Phase 1 Google Sheets with data
2. Phase 2 API running locally or deployed
3. Postgres database set up
4. Migration tool installed

## Migration Steps

### Step 1: Export Data from Google Sheets

1. Open the Google Sheet with TEAM_LIST
2. File → Download → Comma-separated values (.csv)
3. Save as `team_list_export.csv`

### Step 2: Run Migration

```bash
cd tools
npm install
node migrate_sheets_to_postgres.js team_list_export.csv
```

## Data Mapping

### TEAM_LIST → Users Table

| Google Sheet Column | Postgres Field | Transformation |
|---------------------|----------------|----------------|
| MemberID | memberId | Direct copy |
| FullName | name | Direct copy |
| Email | email | Direct copy (lowercase) |
| Status | status | Map to enum (PENDING/APPROVED/REJECTED) |
| Role | role | Map to enum (PLAYER/COACH/etc.) |

### Role Mapping

| Sheet Value | Postgres Enum |
|-------------|---------------|
| Player | PLAYER |
| Coach | COACH |
| Manager | MANAGER |
| Stats | STATS |
| Doctor | DOCTOR |
| Admin | ADMIN |

## Verification

After migration, verify data:

```sql
SELECT COUNT(*) FROM "User";
SELECT status, COUNT(*) FROM "User" GROUP BY status;
SELECT role, COUNT(*) FROM "User" GROUP BY role;
```

## Best Practices

1. Always backup before migration
2. Test on staging first
3. Run during low-traffic period
4. Monitor logs during migration
5. Verify data after migration

