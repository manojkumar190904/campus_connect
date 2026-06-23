# Campus Connect Architecture

## Product architecture

Campus Connect is split into these product surfaces:

1. Public SaaS landing page
2. Auth module with role-based sessions
3. Mobile-first protected shell
4. Role dashboards for Student, Faculty and Admin
5. Feature modules backed by MongoDB collections
6. Smart search API spanning notes, events, users, placements, announcements and discussions
7. Cloudinary upload-signature API
8. Vercel-safe notification feed with optional external Socket.IO bridge

## Database relationships

- `User` owns notes, discussions, marketplace items, lost/found reports and attendance records.
- `Department` references the faculty head through `head -> User`.
- `Note.uploadedBy -> User`.
- `Placement.createdBy -> User`, `Placement.applicants.student -> User`.
- `Event.createdBy -> User`.
- `Registration.event -> Event`, `Registration.student -> User`.
- `Attendance.faculty -> User`, `Attendance.records.student -> User`.
- `Announcement.publishedBy -> User`.
- `Club.facultyCoordinator -> User`, `Club.studentLead -> User`, `Club.members[] -> User`.
- `Discussion.author -> User`, `Discussion.replies.author -> User`.
- `MarketplaceItem.seller -> User`.
- `LostFound.reportedBy -> User`.
- `Notification.recipient -> User`, `Notification.readBy[] -> User`.
- `Achievement.user -> User`, `Achievement.awardedBy -> User`.

## Free-tier deployment plan

- Next.js app and API routes: Vercel Free
- MongoDB database: Atlas M0 Free
- File storage: Cloudinary Free
- Version control: GitHub Free
- Optional real-time sockets: external free WebSocket service or local demo server; Vercel Functions should use polling/feed fallback.
