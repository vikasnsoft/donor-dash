/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the user
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email address
 *           format: email
 *         password:
 *           type: string
 *           description: User's password (will be hashed)
 *           format: password
 *         isAdmin:
 *           type: boolean
 *           description: Whether the user has admin privileges
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the user was last updated
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         name: John Doe
 *         email: john@example.com
 *         password: password123
 *         isAdmin: false
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 * 
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the user
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email address
 *           format: email
 *         isAdmin:
 *           type: boolean
 *           description: Whether the user has admin privileges
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         name: John Doe
 *         email: john@example.com
 *         isAdmin: false
 * 
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *           format: email
 *         password:
 *           type: string
 *           description: User's password
 *           format: password
 *       example:
 *         email: john@example.com
 *         password: password123
 * 
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email address
 *           format: email
 *         password:
 *           type: string
 *           description: User's password
 *           format: password
 *       example:
 *         name: John Doe
 *         email: john@example.com
 *         password: password123
 * 
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email address
 *           format: email
 *         password:
 *           type: string
 *           description: User's new password (optional)
 *           format: password
 *       example:
 *         name: John Doe
 *         email: john@example.com
 *         password: newpassword123
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the request was successful
 *           default: false
 *         error:
 *           type: string
 *           description: Error message
 *       example:
 *         success: false
 *         error: Invalid credentials
 */

// This file contains only JSDoc comments for Swagger and does not export anything
