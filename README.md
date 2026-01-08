# Afrocat Sports Club Portal

**Tagline:** "One Team, One Dream"  
**Location:** Windhoek, Namibia

A comprehensive sports club management portal built in phases, from MVP to enterprise scale.

## Project Overview

This repository contains the complete Afrocat Volleyball Club portal system, built across multiple phases:

- **Phase 0**: Planning & Specifications
- **Phase 1**: MVP (Google Apps Script + Google Sheets)
- **Phase 2**: Production Web Backend (Node.js + Prisma + Postgres) + Admin Web UI (Next.js)
- **Phase 3**: Mobile App (React Native Expo)
- **Phase 4**: Advanced Modules (integrated into Phase 2)
- **Phase 5**: DevOps & Deployment

## Quick Start

### Phase 1: MVP (Google Apps Script)
See [phase1-appscript/README_PHASE1.md](./phase1-appscript/README_PHASE1.md)

### Phase 2: Production Backend
See [phase2-web/api/README_PHASE2_API.md](./phase2-web/api/README_PHASE2_API.md)

### Phase 2: Admin Web UI
See [phase2-web/admin-web/README_PHASE2_ADMIN_WEB.md](./phase2-web/admin-web/README_PHASE2_ADMIN_WEB.md)

### Phase 3: Mobile App
See [phase3-mobile/README_PHASE3_MOBILE.md](./phase3-mobile/README_PHASE3_MOBILE.md)

## Architecture

- **Mobile-first UI** for all public pages
- **Role-based access control (RBAC)** from Day 1
- **Audit logging** for all actions
- **Modular, clean structure**
- **No hard-coded IDs**

## Roles

- **Player**: View own stats, attendance, injuries, awards
- **Coach**: Manage teams, set training focus, view team stats
- **Manager**: Financial management, team administration
- **Stats**: Record match statistics
- **Doctor**: Manage wellness and injury records
- **Admin**: Full system access

## Documentation

- [Phase 0 Specifications](./docs/phase0-spec.md)
- [RBAC Matrix](./docs/rbac-matrix.md)
- [API Contract](./docs/api-contract.md)
- [Data Migration Guide](./docs/data-migration.md)
- [Deployment Guide](./DEPLOYMENT.md)

## Migration

Tools for migrating from Phase 1 (Google Sheets) to Phase 2 (Postgres) are available in `/tools`.

## License

Proprietary - Afrocat Sports Club

