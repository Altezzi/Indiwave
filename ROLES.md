# Roles & Permissions (Indiwave Platform)

This document defines the user roles on the platform, their hierarchy, and what each role is allowed to do.

## Role Hierarchy

From lowest → highest authority:

**USER** < **CREATOR** < **REVIEWER** < **UPLOAD_TEAM** < **MODERATOR** < **SENIOR_MOD** < **ADMIN**

- Higher roles inherit the powers of those below (unless explicitly excluded)
- No role can manage peers or higher
- Audit logs are written for all privileged actions

## Roles Explained

### USER
- **Default** for all registered accounts
- Can browse, read, and comment on series/chapters (unless silenced)

### CREATOR
- Can upload and manage their own series and chapters once they have claimed their profile
- Cannot manage other creators' content

### REVIEWER
- Can view the Review Queue (creator claim requests)
- Can assign requests to themselves
- Can Approve / Reject / Request more info on claims
- Cannot edit content, upload series, or manage comments

### UPLOAD_TEAM
- Can create "unclaimed" creators (placeholder profiles for external authors)
- Can upload series and chapters under those unclaimed creators
- Cannot approve/reject claims
- Cannot moderate comments

### MODERATOR
- Can moderate content but cannot create unclaimed creators or upload on behalf of others

**Tools available:**
- Merge duplicate creators
- Move a series/chapters to another creator
- Process takedown/DMCA requests
- Moderate comments (remove, hide, shadow-hide, resolve reports)
- Silence users on a chapter, series, or globally

**Cannot:**
- Manage roles
- Approve/reject claim requests

### SENIOR_MOD
- **All powers** of a Moderator
- **Role management:** can change the roles of users below them (User, Creator, Reviewer, Upload Team, Moderator)
- Cannot change roles of other Senior Mods or Admins
- Cannot assign Senior Mod or Admin roles
- Cannot manage site configuration

### ADMIN
- **Full access** to all features
- Can manage site configuration
- Can manage all user roles, including Senior Mods and other Admins

## Safeguards

- **No self-promotion:** users cannot change their own role
- **Audit logs:** every action (uploads, moderation, claims, role changes) is logged with actor → target → action → timestamp
- **Role checks enforced** in API and UI (not just hidden buttons)
- **Scoped management:** Senior Mods cannot escalate to Senior Mod/Admin, nor change peers

## Example Scenarios

1. **Upload Team workflow:** An Upload Team member creates an "unclaimed" creator and uploads chapters. Later, the actual creator joins and claims their profile via the Review Queue, which is handled by a Reviewer.

2. **Moderation action:** A Moderator sees spam in a chapter's comments → they remove the comments and silence the user from commenting on that series.

3. **Role management:** A Senior Mod notices a Moderator misusing powers → they can demote them to User.

4. **Admin action:** Only an Admin can promote a trusted Senior Mod or change site configuration.

## TL;DR

- **Reviewer** → handles claims
- **Upload Team** → creates/upload content for unclaimed creators
- **Moderator** → handles comments, silences, merges, takedowns
- **Senior Mod** → all Moderator powers + can manage roles below them
- **Admin** → everything
