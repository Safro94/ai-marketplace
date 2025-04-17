# AI Market Hub - Complete Testing Guide

This guide provides step-by-step instructions for testing all features of the AI Market Hub. Follow each section to verify the functionality works as expected.

## Table of Contents

1. [General User Flows](#general-user-flows)
2. [Buyer Flows](#buyer-flows)
3. [Creator Flows](#creator-flows)
4. [Admin Flows](#admin-flows)
5. [Edge Cases to Test](#edge-cases-to-test)

---

## General User Flows

### 1. Registration and Login

**Steps:**

1. Navigate to the homepage
2. Click "Sign Up" in the top-right corner
3. Complete the registration form with:
   - Name
   - Email
   - Password
4. Click "Create Account"
5. Verify you receive a confirmation email
6. Click the verification link in the email
7. Log in with your credentials

**Expected Result:** You should be logged in and redirected to the homepage with your name visible in the navbar.

### 2. Profile Setup

**Steps:**

1. Click on your profile icon in the top-right corner
2. Select "Profile" from the dropdown menu
3. Click "Edit Profile"
4. Add a profile picture by clicking the avatar placeholder
5. Fill in your bio information
6. Click "Save Changes"

**Expected Result:** Your profile should be updated with the new information.

### 3. Browsing the Marketplace

**Steps:**

1. Click "Marketplace" in the main navigation
2. Browse the list of available assets
3. Test the filtering options:
   - Click category filters on the left sidebar
   - Use the price range slider
   - Toggle the "Sort by" dropdown (newest, popular, etc.)
4. Use the search bar to search for specific terms

**Expected Result:** Assets should filter and sort according to your selections.

---

## Buyer Flows

### 1. Viewing Asset Details

**Steps:**

1. From the marketplace, click on any asset card
2. On the asset detail page, verify you can see:
   - Asset title and description
   - Creator information
   - Preview images (click through gallery if multiple images)
   - Features list
   - Requirements list
   - Pricing options
   - Reviews section

**Expected Result:** All asset details should be visible and interactive.

### 2. Adding to Cart

**Steps:**

1. On an asset detail page, select a license type (e.g., Personal License)
2. Click "Add to Cart"
3. Verify the cart icon in the navbar updates with the item count
4. Click on another asset and add it to your cart with a different license

**Expected Result:** Both items should be added to your cart with their respective licenses.

### 3. Checkout Process

**Steps:**

1. Click the cart icon in the navbar
2. Review the items in your cart
3. Test removing an item by clicking the trash icon
4. Click "Checkout"
5. If not logged in, you should be prompted to log in
6. Complete the checkout form (in the MVP, this is simulated)
7. Click "Complete Purchase"

**Expected Result:** You should be redirected to a success page and the cart should be emptied.

### 4. Viewing Purchases

**Steps:**

1. Click your profile icon
2. Select "Purchases" from the dropdown
3. View your purchased assets
4. For each purchase, verify:
   - Asset title is correct
   - License type is correct
   - License key is displayed
   - Download button works

**Expected Result:** All your purchases should be listed with their license information.

### 5. Downloading Assets

**Steps:**

1. From your purchases page, click "Download" on any asset
2. Verify the asset file downloads correctly
3. Return to the asset detail page via the "View Asset" button
4. Verify you can also download from the asset detail page if you've purchased it

**Expected Result:** Asset files should download successfully.

### 6. Leaving Reviews

**Steps:**

1. Navigate to an asset you've purchased
2. Scroll to the reviews section
3. Click on the star rating (1-5 stars)
4. Add a review title and comment
5. Click "Submit Review"
6. Verify your review appears in the reviews list

**Expected Result:** Your review should be submitted and visible.

---

## Creator Flows

### 1. Becoming a Creator

**Steps:**

1. Click your profile icon
2. Select "Become a Creator"
3. Complete the creator application form
4. Submit the application
5. (In the MVP, this is auto-approved)

**Expected Result:** You should now have access to the creator dashboard.

### 2. Accessing Creator Dashboard

**Steps:**

1. Click your profile icon
2. Select "Creator Dashboard"
3. Verify you can see:
   - Revenue statistics
   - Asset statistics
   - Recent sales
   - Your assets list

**Expected Result:** The creator dashboard should display with your statistics.

### 3. Creating a New Asset

**Steps:**

1. From the creator dashboard, click "Upload New Asset"
2. Complete the asset creation form:
   - Title
   - Description
   - Features (one per line)
   - Requirements (optional)
   - Upload featured image (click "Upload Image")
   - Upload asset file (click "Upload File")
   - Add gallery images (optional)
   - Set pricing for licenses
3. Click "Upload Asset"

**Expected Result:** Your asset should be submitted for review with a "Pending Review" status.

### 4. Managing Existing Assets

**Steps:**

1. From the creator dashboard, view your assets list
2. Click the tabs to filter by status (All, Published, Pending, Rejected)
3. For a published asset, click the "View" button to see it in the marketplace
4. Click the three dots menu and select "Edit" for an asset
5. Make changes to the asset details
6. Click "Update Asset"

**Expected Result:** Your asset should be updated and return to "Pending Review" status.

### 5. Deleting an Asset

**Steps:**

1. From your assets list, click the three dots menu on an asset
2. Select "Delete"
3. Confirm the deletion in the popup dialog

**Expected Result:** The asset should be removed from your list.

### 6. Viewing Sales and Revenue

**Steps:**

1. On the creator dashboard, review the sales statistics
2. Check the "Recent Sales" section for details on individual sales

**Expected Result:** You should see accurate sales data if you have any sales.

---

## Admin Flows

### 1. Accessing Admin Dashboard

**Steps:**

1. Log in as an admin user
2. Click your profile icon
3. Select "Admin Dashboard"

**Expected Result:** You should see the admin dashboard with moderation options.

### 2. Moderating Assets

**Steps:**

1. From the admin dashboard, go to the "Content Moderation" section
2. View the list of assets pending review
3. Click on an asset to expand its details
4. Review the asset information
5. Add moderation notes in the text area
6. Click either "Reject" or "Approve"

**Expected Result:** The asset status should change according to your action, and the creator should be notified.

### 3. Managing Users

**Steps:**

1. From the admin dashboard, go to the "User Management" section
2. Search for a specific user
3. View user details
4. Test actions like:
   - Disable account
   - Grant/revoke creator status
   - Grant/revoke admin privileges

**Expected Result:** User permissions should update according to your actions.

---

## Edge Cases to Test

### 1. License Verification

**Steps:**

1. Purchase an asset with a specific license
2. Verify the license key is generated and displayed
3. Check that the license terms are accessible
4. Verify you can download the license certificate (if implemented)

**Expected Result:** All license information should be correctly displayed and accessible.

### 2. Cart Management

**Steps:**

1. Add multiple items to your cart
2. Log out and log back in
3. Verify your cart items are still present
4. Try adding the same asset with a different license
5. Verify it updates the existing cart item rather than adding a duplicate

**Expected Result:** Cart should persist across sessions and handle duplicate assets correctly.

### 3. Review Moderation

**Steps:**

1. Submit a review as a regular user
2. Log in as an admin
3. Navigate to the review moderation section
4. Approve or reject the review
5. Log back in as the regular user
6. Verify the review status is updated correctly

**Expected Result:** Reviews should be properly moderated and status updates should be visible.

### 4. Asset Updates

**Steps:**

1. As a creator, upload an asset
2. After it's approved, edit the asset
3. Verify it goes back to "Pending Review" status
4. As an admin, approve the updated asset
5. Verify the changes are reflected in the marketplace

**Expected Result:** Asset updates should follow the proper workflow and be reflected when approved.

### 5. Multiple License Purchases

**Steps:**

1. Purchase an asset with one license type
2. Try to purchase the same asset with a different license type
3. Verify both licenses are available in your purchases

**Expected Result:** Users should be able to purchase multiple license types for the same asset.

---

## Testing Checklist Summary

Use this quick checklist to ensure you've tested all major features:

- [ ] User registration and login
- [ ] Profile management
- [ ] Marketplace browsing and filtering
- [ ] Asset detail viewing
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Purchase management
- [ ] Review submission and display
- [ ] Creator registration
- [ ] Asset creation and management
- [ ] Sales and revenue tracking
- [ ] Admin moderation
- [ ] License key generation and display
- [ ] Edge cases (cart persistence, duplicate handling, etc.)

By completing all these test cases, you'll have verified the complete functionality of the AI Assets Marketplace.
