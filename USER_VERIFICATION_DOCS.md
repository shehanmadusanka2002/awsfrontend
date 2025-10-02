# User Verification Component Documentation

## Overview
The User Verification component allows administrators to manually review and verify user registrations by examining uploaded documents (NIC Front, NIC Back, and Selfie with NIC).

## Features

### 1. User Management
- **Filter Options**: View all users, pending verification, verified users, or rejected users
- **Statistics Dashboard**: Shows counts for total, pending, verified, and rejected users
- **User Information Display**: Shows comprehensive user details including name, email, NIC, phone, roles, and registration date

### 2. Document Review
- **Image Viewing**: Thumbnail view of all three required documents
- **Lightbox Modal**: Click on any image to view it in full size with zoom capability
- **Document Types**:
  - NIC Front Side
  - NIC Back Side  
  - Selfie with NIC card front side

### 3. Verification Actions
- **Approve User**: Changes user status from INACTIVE to ACTIVE
- **Reject User**: Changes user status from INACTIVE to REJECTED
- **View Details**: Opens detailed modal with all user information and documents

### 4. User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface matching admin dashboard theme
- **Loading States**: Shows loading indicators during API calls
- **Success/Error Messages**: Provides feedback for all actions
- **Hover Effects**: Interactive elements with smooth transitions

## API Integration

### Expected API Endpoints

#### 1. Get Users for Verification
```
GET /api/admin/users/verification?status={filter}
Headers: Authorization: Bearer {token}
```

**Response Format:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "nicNumber": "123456789V",
    "phoneNumber": "+94771234567",
    "userRoles": ["SHOP_OWNER", "FARM_OWNER"],
    "status": "INACTIVE", // or "ACTIVE", "REJECTED"
    "createdAt": "2024-01-15T10:30:00Z",
    "nicFrontDocument": "/uploads/nic-front-1.jpg",
    "nicBackDocument": "/uploads/nic-back-1.jpg", 
    "selfieDocument": "/uploads/selfie-1.jpg"
  }
]
```

#### 2. Approve User
```
POST /api/admin/users/{userId}/approve
Headers: Authorization: Bearer {token}
```

#### 3. Reject User
```
POST /api/admin/users/{userId}/reject
Headers: Authorization: Bearer {token}
```

### Fallback Behavior
If API endpoints are not available, the component will:
1. Use dummy data for demonstration
2. Show demo mode messages for actions
3. Update local state to simulate API responses

## User Workflow

### 1. Registration Process
- Users register through the RegistrationForm component
- System sets user status to INACTIVE by default
- Users upload 3 required documents:
  - NIC Front Side image
  - NIC Back Side image
  - Selfie holding NIC front side

### 2. Admin Verification Process
1. **Access**: Admin navigates to User Verification in admin dashboard
2. **Filter**: Admin can filter by user status (All, Pending, Verified, Rejected)
3. **Review**: Admin clicks "View Details" to see user information and documents
4. **Examine Documents**: Admin clicks on document images to view them in full size
5. **Decision**: Admin either approves or rejects the user based on document review
6. **Action**: User status changes to ACTIVE (approved) or REJECTED (rejected)

### 3. User Status Flow
```
Registration → INACTIVE (Pending) → ACTIVE (Approved) or REJECTED (Rejected)
```

## Component Structure

### Main Component: `UserVerification.jsx`
- **State Management**: Uses React hooks for component state
- **API Integration**: Axios for HTTP requests
- **Authentication**: Uses JWT token from localStorage
- **Error Handling**: Graceful fallback to demo mode

### Key State Variables
- `filter`: Current filter selection (all, pending, verified, rejected)
- `users`: Array of user data
- `loading`: API loading state
- `selectedUser`: Currently selected user for detail view
- `showImageModal`: Image lightbox visibility
- `selectedImage`: Currently displayed image in lightbox
- `actionLoading`: Loading state for approve/reject actions
- `message`: Success/error message display

### Key Functions
- `fetchUsers()`: Retrieves users from API
- `handleUserAction()`: Processes approve/reject actions
- `viewUserDetails()`: Opens user detail modal
- `openImageModal()`: Opens image in lightbox
- `closeImageModal()`: Closes image lightbox

## Styling & Theme
- **Framework**: Tailwind CSS
- **Color Scheme**: Teal/cyan theme matching admin dashboard
- **Icons**: Heroicons library
- **Responsive**: Mobile-first responsive design
- **Animations**: Smooth transitions and hover effects

## Security Considerations
- **Authentication**: Requires admin JWT token
- **Authorization**: Admin-only access through route protection
- **Image Security**: Images served through secure backend endpoints
- **Input Validation**: All user actions validated on backend

## Future Enhancements
1. **Bulk Actions**: Select multiple users for batch approval/rejection
2. **Search Functionality**: Search users by name, email, or NIC
3. **Export Reports**: Export verification statistics
4. **Audit Trail**: Track who approved/rejected each user
5. **Email Notifications**: Notify users of verification status changes
6. **Advanced Filters**: Filter by date range, user roles, etc.
7. **Document Annotations**: Allow admins to add notes to documents

## Troubleshooting

### Common Issues
1. **Images not loading**: Check backend image serving configuration
2. **API errors**: Verify backend endpoints and authentication
3. **Slow loading**: Implement pagination for large user lists
4. **Mobile display**: Ensure responsive design works on all devices

### Development Testing
- Use browser dev tools to simulate different screen sizes
- Test with various image formats and sizes
- Verify all interactive elements work correctly
- Check network tab for API call success/failure