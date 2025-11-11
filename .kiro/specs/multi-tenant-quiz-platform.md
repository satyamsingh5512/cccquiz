---
title: Multi-Tenant Quiz Platform with Google Auth & Leaderboards
status: draft
created: 2024-11-11
---

# Requirements

## User Stories

### Authentication & User Management
- **As a user**, I want to sign up with Google OAuth so I can quickly create an account
- **As a user**, I want to create an account with email/password as an alternative to Google
- **As an organization admin**, I want to create quizzes for my organization/college
- **As a user**, I want to have a unique username for leaderboard display

### Quiz Discovery & Access
- **As a user**, I want to search for available quizzes by quiz name
- **As a user**, I want to filter quizzes by college/organization name
- **As a user**, I want to see how many students have taken each quiz
- **As a user**, I want to join public quizzes without access codes

### Quiz Taking & Leaderboards
- **As a quiz taker**, I want to enter a unique username before starting a quiz
- **As a quiz taker**, I want to see my rank on the leaderboard after completing
- **As a user**, I want to view the leaderboard for any quiz showing top performers
- **As a quiz creator**, I want leaderboards to show unique usernames only

## Acceptance Criteria

### Phase 1: Authentication System
- [ ] Google OAuth integration working
- [ ] Email/password registration and login
- [ ] User profile with organization/college field
- [ ] Session management for regular users (not just admins)

### Phase 2: Multi-Tenant Quiz System
- [ ] Quiz model updated with:
  - Organization/college name
  - Creator user ID
  - Public/private flag
  - Participant count
- [ ] Users can create their own quizzes
- [ ] Quiz visibility controls (public vs access code)

### Phase 3: Quiz Discovery
- [ ] Search page with filters:
  - Quiz name search
  - College/organization filter
  - Sort by popularity (participant count)
- [ ] Quiz cards show participant count
- [ ] Public quizzes accessible without access codes

### Phase 4: Leaderboard System
- [ ] Username prompt before quiz start
- [ ] Username uniqueness validation per quiz
- [ ] Leaderboard collection storing:
  - Quiz ID
  - Username (unique per quiz)
  - Score
  - Time taken
  - Completion timestamp
- [ ] Leaderboard display page showing top performers
- [ ] User's rank highlighted on leaderboard

## Technical Design

### Database Schema Changes

#### Users Collection (Enhanced)
```typescript
{
  _id: ObjectId,
  email: string,
  name: string,
  password?: string, // hashed, optional for Google users
  googleId?: string,
  image?: string,
  organization: string,
  role: 'user' | 'admin',
  createdAt: Date
}
```

#### Quizzes Collection (Enhanced)
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  organization: string,
  creatorId: ObjectId,
  accessCode?: string, // optional for public quizzes
  isPublic: boolean,
  timeLimit: number,
  participantCount: number,
  createdAt: Date
}
```

#### Leaderboard Collection (New)
```typescript
{
  _id: ObjectId,
  quizId: ObjectId,
  username: string, // unique per quiz
  userId?: ObjectId, // optional, for logged-in users
  score: number,
  totalQuestions: number,
  timeTaken: number, // in seconds
  completedAt: Date
}
```

### API Routes Needed

1. **Authentication**
   - `POST /api/auth/signup` - Email/password registration
   - `GET/POST /api/auth/[...nextauth]` - NextAuth with Google provider

2. **Quiz Management**
   - `GET /api/quizzes/search` - Search and filter quizzes
   - `POST /api/quizzes/create` - Create quiz (authenticated users)
   - `GET /api/quizzes/public` - List public quizzes
   - `GET /api/quizzes/my-quizzes` - User's created quizzes

3. **Leaderboard**
   - `POST /api/leaderboard/check-username` - Validate username uniqueness
   - `POST /api/leaderboard/submit` - Submit quiz score
   - `GET /api/leaderboard/[quizId]` - Get leaderboard for quiz

### UI Components Needed

1. **Auth Pages**
   - Sign up page with Google button
   - Enhanced sign in with Google option
   - User profile/organization setup

2. **Quiz Discovery**
   - Search/browse page with filters
   - Quiz cards with participant count
   - Public quiz access flow

3. **Quiz Taking Flow**
   - Username prompt modal before quiz start
   - Username validation feedback
   - Post-quiz leaderboard display

4. **Leaderboard Page**
   - Top performers list
   - User's rank highlight
   - Score and time display

## Implementation Plan

### Step 1: Setup Google OAuth
- Add Google OAuth provider to NextAuth
- Update auth configuration
- Add environment variables

### Step 2: User Registration
- Create signup page
- Add email/password authentication
- Add organization field to user model

### Step 3: Multi-Tenant Quiz Creation
- Update quiz creation to include organization
- Add public/private toggle
- Link quizzes to creator

### Step 4: Quiz Discovery
- Create search/browse page
- Implement search and filter API
- Update quiz cards with participant count

### Step 5: Leaderboard System
- Create leaderboard collection
- Add username prompt before quiz
- Implement leaderboard display
- Add score submission logic

## Notes

- Maintain backward compatibility with existing admin system
- Ensure username uniqueness is per-quiz, not global
- Public quizzes should still support optional access codes
- Leaderboard should handle ties appropriately
- Consider rate limiting for quiz submissions
