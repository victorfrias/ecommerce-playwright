# User Area Test Plan

## Application Overview

Covers the account/User Area login, registration, session persistence, logout, validation, header state, member discounts, and checkout integration using the provided Test User credentials.

## Test Scenarios

### 1. User Area authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Guest opens User Area and sees login form

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Start with a fresh browser context with no halden-user or halden-cart localStorage data, and navigate to /account.
    - expect: The page title and main heading identify the User Area as Log in.
    - expect: A Log in tab and Create account tab are visible.
    - expect: The login form contains Email and Password fields and a Log in button.
    - expect: A visitor-facing message explains that members receive a 5% discount and visitors pay full price.
  2. Inspect the header and page navigation.
    - expect: The header User Area link is present.
    - expect: The User Area link does not say Welcome or signed in.
    - expect: The account page does not show a Welcome back state or Sign out button.

#### 1.2. Successful login with Test User credentials

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Navigate to /account as a guest.
    - expect: The Log in tab is selected by default.
  2. Enter email test@user.com and password 123456, then submit.
    - expect: No validation or authentication error is shown.
    - expect: The browser navigates to /shop.
    - expect: The header shows Welcome Test User.
    - expect: The header User Area link has accessible name User Area, signed in as Test User.
    - expect: localStorage contains halden-user with name Test User and email test@user.com.
  3. Open the User Area link.
    - expect: The page shows Welcome back.
    - expect: The page shows Signed in as Test User (test@user.com).
    - expect: The page explains that members save 5% at checkout.
    - expect: A Sign out button and Continue shopping link are visible.

#### 1.3. Wrong password login failure

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Navigate to /account and enter test@user.com with an incorrect password.
    - expect: The Log in form remains on /account.
    - expect: A role=alert message shows Email or password is incorrect.
    - expect: The header remains in guest state.
    - expect: No halden-user value is stored.
    - expect: The Password field remains as a password input.

#### 1.4. Unknown email login failure

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Navigate to /account and enter nobody@example.com with password 123456.
    - expect: The browser remains on /account.
    - expect: A role=alert message shows Email or password is incorrect.
    - expect: The user is not logged in.
    - expect: No signed-in header state is shown.

#### 1.5. Login email validation

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Submit the login form with an empty Email and a nonempty Password.
    - expect: A role=alert message shows Enter a valid email.
    - expect: The form is not submitted successfully.
    - expect: The user remains logged out.
  2. Repeat with an invalid email such as test-user and a nonempty Password.
    - expect: A role=alert message shows Enter a valid email.
    - expect: The user remains logged out.

#### 1.6. Login password validation

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Submit the login form with test@user.com as Email and an empty Password.
    - expect: A role=alert message shows Enter your password.
    - expect: The user remains on /account.
    - expect: The user remains logged out.

#### 1.7. Switch between Log in and Create account tabs

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Start at /account in Log in mode, then select Create account.
    - expect: The Create account tab has aria-selected=true.
    - expect: The Log in tab has aria-selected=false.
    - expect: The heading changes from Log in to Create account.
    - expect: The Name, Email, and Password fields are visible.
    - expect: The submit button name changes to Create account.
  2. Enter account information or switch back to Log in.
    - expect: Switching modes clears any previous account error.
    - expect: No stale login or registration fields are submitted.
    - expect: Switching back to Log in hides the Name field.

#### 1.8. Create account validation

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Select Create account and submit with an empty Name, invalid Email, and password shorter than 6 characters.
    - expect: A role=alert message shows Enter your full name.
    - expect: The account is not created.
    - expect: No signed-in state is established.
  2. Enter a Name of at least 2 characters, invalid Email, and a 6-character Password; submit.
    - expect: A role=alert message shows Enter a valid email.
    - expect: No account is created.
  3. Enter a valid Name and Email, but a Password shorter than 6 characters; submit.
    - expect: A role=alert message shows Password must be at least 6 characters.
    - expect: No account is created.

#### 1.9. Create account rejects duplicate email

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Select Create account and submit Test User with test@user.com and a valid 6-character password.
    - expect: A role=alert message shows An account with this email already exists.
    - expect: The page remains in Create account mode.
    - expect: The user is not automatically logged in.

#### 1.10. Sign out from signed-in User Area

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Log in successfully with test@user.com and 123456, then open /account.
    - expect: Welcome back is shown with Test User and test@user.com.
  2. Click Sign out.
    - expect: The logged-in account state is replaced by the Log in form.
    - expect: The heading changes to Log in.
    - expect: The Create account and Log in tabs are available.
    - expect: The header no longer says Welcome Test User and instead shows User Area.
    - expect: halden-user is removed from localStorage.
    - expect: The Sign out button is no longer visible.

#### 1.11. Successful login persists after reload

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Log in successfully with test@user.com and 123456, then reload the page.
    - expect: The signed-in state is restored without another login request.
    - expect: The header shows Welcome Test User.
    - expect: Directly visiting /account shows Welcome back for Test User.
    - expect: Directly visiting /shop or /cart retains the signed-in state.

#### 1.12. Member discount applies in cart and checkout

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Start logged out, add Stoneware Pourer to the cart, and open the cart.
    - expect: The subtotal is $48.00.
    - expect: No Member discount row is shown.
    - expect: Shipping is $8.00.
    - expect: Total is $56.00.
  2. Sign out if needed, log in with test@user.com and 123456, return to the cart, and verify totals.
    - expect: The subtotal remains $48.00.
    - expect: The Member discount is $2.40.
    - expect: Shipping remains $8.00.
    - expect: The total is $53.60.
    - expect: The summary note indicates logged-in members save 5%.
  3. Open checkout as the logged-in member.
    - expect: Name is populated with Test User.
    - expect: Email is populated with test@user.com.
    - expect: The summary continues to show the 5% discount and recalculated total.
    - expect: The logged-in state remains visible in the header.

#### 1.13. Five percent discount updates with cart contents

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Log in with test@user.com and 123456, add Wool Cushion, and open the cart.
    - expect: A $2.10 member discount is shown for the $42.00 subtotal.
    - expect: The shipping remains $8.00 for a subtotal below $75.
    - expect: The total is $47.90.
  2. Increase the quantity to 2.
    - expect: Subtotal is $84.00.
    - expect: Member discount is $4.20.
    - expect: Shipping is Free.
    - expect: Total is $79.80.
  3. Sign out while this cart remains in the browser.
    - expect: Member discount is removed.
    - expect: Shipping remains Free.
    - expect: Total becomes $84.00.
    - expect: The header returns to guest state.

#### 1.14. Member details prefill checkout

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Log in with test@user.com and 123456, add a product, and open /checkout.
    - expect: The Name field is prefilled with Test User.
    - expect: The Email field is prefilled with test@user.com.
    - expect: The fields can still be edited.
    - expect: The user can complete checkout without manually reentering the account name and email.

#### 1.15. Continue shopping and account navigation

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Log in with test@user.com and 123456, open /account, and click Continue shopping.
    - expect: The browser navigates to /shop.
    - expect: The header continues to show Welcome Test User.
    - expect: The account is still signed in.
  2. Use browser navigation and direct links to revisit /account.
    - expect: The signed-in Welcome back state is shown consistently.
    - expect: No login form or password prompt is shown while authenticated.

#### 1.16. Direct account access while logged in

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Log in with test@user.com and 123456, then navigate directly to /account.
    - expect: The Log in and Create account tabs are not shown.
    - expect: Welcome back is displayed.
    - expect: Test User and test@user.com are displayed.
    - expect: Sign out and Continue shopping are available.

#### 1.17. Malformed stored session fallback

**File:** `tests/regression/user-area.spec.ts`

**Steps:**
  1. Set localStorage halden-user to invalid JSON, an empty object, or data missing name/email, then reload /account.
    - expect: The app does not crash.
    - expect: The malformed session is treated as logged out.
    - expect: The guest Log in form is shown.
    - expect: The header shows User Area instead of Welcome.
