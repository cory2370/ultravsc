# Role-Based Account System

## Overview

The UltraVSC forum now implements a role-based account system with different permissions for Students and Teachers.

## User Roles

### Role Selection
- Users choose their role (Student or Teacher) during registration
- **Role cannot be changed** after account creation
- To change role, user must delete account and create a new one
- Role is displayed in the header next to the user's name

### Student (Học sinh) 👨‍🎓
**Permissions:**
- ✅ Post a thread
- ✅ Reply to a thread (add comments)
- ✅ Delete or edit threads posted by themselves
- ❌ Cannot delete threads by other users

### Teacher (Giáo viên) 👨‍🏫
**Permissions:**
- ✅ Post a thread
- ✅ Reply to a thread (add comments)
- ✅ Delete threads by other users (moderation power)
- ✅ Delete their own threads
- ❌ Can only edit their own threads (not other users' threads)

## Implementation Details

### Authentication
- User role is stored in `sessionStorage` along with user data
- Role persists across page refreshes
- Role is checked via `AuthContext` permission functions

### Permission Functions
Located in `src/context/AuthContext.jsx`:
- `canEditPost(postAuthorId)` - Returns true if user can edit the post
- `canDeletePost(postAuthorId)` - Returns true if user can delete the post
- `isStudent()` - Returns true if current user is a student
- `isTeacher()` - Returns true if current user is a teacher

### UI Features
1. **Header Display**: Shows user name and role (👨‍🎓 Học sinh or 👨‍🏫 Giáo viên)
2. **Edit Button**: Appears on posts the user can edit (only their own posts)
3. **Delete Button**: 
   - Appears on posts students can delete (only their own)
   - Appears on all posts for teachers (moderation power)
4. **Post Creation**: New posts are automatically assigned the current user's ID and name

### Components Modified
- `AuthContext.jsx` - Added permission checking functions
- `Header.jsx` - Displays user role
- `Post.jsx` - Shows edit/delete buttons based on permissions
- `MainApp.jsx` - Handles edit/delete operations
- `EditPostModal.jsx` - New component for editing posts
- `Login.jsx` - Captures and stores role during registration

## Usage

### Registering as Student
1. Go to login page
2. Click "Đăng ký" (Register)
3. Fill in name, email, password
4. Select "Học sinh" from role dropdown
5. Submit form

### Registering as Teacher
1. Go to login page
2. Click "Đăng ký" (Register)
3. Fill in name, email, password
4. Select "Giáo viên" from role dropdown
5. Submit form

### Editing a Post
1. Find a post you created
2. Click "✏️ Chỉnh sửa" button
3. Modify title, content, category, or attachment
4. Click "Cập nhật bài viết"

### Deleting a Post
1. Find a post you can delete:
   - Students: Only their own posts
   - Teachers: Any post
2. Click "🗑️ Xóa" button
3. Confirm deletion

## Technical Notes

- User IDs are generated using `Date.now().toString()` for uniqueness
- Post `authorId` is stored with each post to check ownership
- Permission checks happen in real-time based on current user context
- All permission logic is centralized in `AuthContext` for maintainability

