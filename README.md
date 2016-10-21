### 1. USERS
- [x] get
- [x] get/id
- [ ] patch
- [ ] delete
- [x] post

### 2. SEARCHES
- [ ] get
- [ ] get/id
- [ ] post
- [ ] patch
- [ ] delete

FAVORITES
- [ ] *post (fix to increment, also needs to insert into favorites_users)*
- [x] get
- [ ] get/ucheck (THIS IS A DUPLICATE OF A ROUTE HANDLER IN FAVORITES_USERS)
- [ ] get/fcheck (PROBABLY DUPLICATE OF ROUTE HANDLER IN FAVORIETS_USERS)
- [ ] patch
- [ ] delete

    
FAVORITES_USERS
- [ ]
- [x] get/ucheck (a user's favs)
- [x] get/userfav (a user's fav)
- [x] get/outercheck (all favs not in user's favs)
- [x] get/favsforsearch (all favorites for particular searchId with user info)
- [x] patch

TOKEN
- [x] get (works)
- [(x)] delete -- works on website
- [x] post (works)

TWEETS
- [x] get

SEARCHES_USERS (empty)


# q2-project
Galvanize WDI second quarter project

branch: seedsnpages

## *Summary:*

### 1. Created new seeds containing a decent number of entries. 
All tables containing foreign keys obey constraints;
we should be able to run all route handlers (that work..).

### 2. New pages: favorites.html, login.html, signup.html. 
These aren’t linked to one another in any way; user can’t click 
link on index to get to signup or log in. But...

### 3. Login.html and signup.html work. 
User can log in, log out and create new account.

### 4. Nav.js works.
If user is logged in, nav shows log out. If not logged in,
shows log in and sign up.

### 5. Favorites.html and favorites.js are there as templates.
They show how to query database and fetch data, which should be 
useful.

### 6. New files:
* /css/styles.css (for new pages)
* /js/favorites.js
* /js/login.js
* /js/nav.js
* /js/signup.js
* /favorites.html
* /login.html
* /signup.html

### 7. Changes
* Made a few alterations to body of index.HTML (all commented out).
* Added gsap animation js file at line 66