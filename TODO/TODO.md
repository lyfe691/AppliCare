# TODO - AppliCare

1. [X] password hashing with bcrypt
2. [X] password reset without manually entering the token -> meaning that the user just has to click on the link with the token.
3. [X] creating the SECRET variable in the .env file for the jwt secret key -> openssl rand -base64 64 or 128. the current hardcoded one cant be used in production
4. [X] cleaning up the frontend -> fixing the issues with global styles (index.css) and personal linked files like (Auth.css) for interfeering.
5. [ ] keeping an eye on security config since ill need to change it for production.
6. [X] make the error message in the auth forms look better
7. [X] make it possible to log in with username or email, currenly only username is possible. or remove username completely.
8. [X] create some regex to make sure the user doesnt user absurd usernames or emails, i dont really care about the password though, maybe just a length limit.
9. [X] create some protected route stuff
1. [X] create the applicare dashboard
1. [X] application files for backend
1. [X] application form
1. [X] fix the structure tree; components folder css folder etc
1. [X] create a logo!
1. [X] if theres too much applications make sure to add something like next page eg 1 2 3 etc
1. [X] better looking landing page with a good base.
1. [X] move the statisitcs in the dashbopard page to a new statistics page.
1. [X] IMPORTANT: CREATE A SETTINGS PAGE
1. [X] dark mode
2. [ ] AppliCare text in the authform -> link to /
2. [X] make landing page more mobile friendly.
2. [X] remove mui, use antd
2. [ ] add password confiramtion in register
2. [X] refine everything in the Dashboard.
2. [X] fix sorting in manage applicaitons
2. [X] add norifs in manage applicaitons for creating or failing to save a application
2. [X] add cnfirmation to delte the task like in the manage page
2. [X] add pagination for the tasks page and fix the mobile responsivess
2. [X] add logout confirmation
3. [X] create a better footer
3. [X] clear form after creating application.
3. [X] when navigating on mobile and clicking on a new page it should remove the menu
3. [ ] fix: chart in dashboard not recognizing applications; the number, it always shows null.
3. [X] fix: now that i am using the App layer of antd i need to update the naked tags since the text is so small
3. [ ] create a new /tasks and there the user creates the tasks like in the current dashboard, and then the user can see their tasks in the dashboard but modifies them im the /tasks
3. [X] create profile in nav with drop down like in shadcn example
3. [X] fix: when logged out and logged in in different browser tabs it should wither be that action that was made latest, example: if the user logged in and in the other tab is still in the reset password that the user should be logged in on that tab aswell on refresh. Same thing the other way around, if the user is logged in in one tab and logges out in another, on refresh the user shouls also be logged out.
3. [X] Add pagination to mobile too.
3. [X] fix: Warning: [antd: Modal] Static function can not consume context like dynamic theme. Please use 'App' component instead.
4. [X] no longer use hardcoded urls
4. [ ] fix: Warning: [antd: message] Static function can not consume context like dynamic theme. Please use 'App' component instead.
4. [X] fix: password regex validation should also apply to reset password page. (or everywhere) its important that its the same everywhere.
4. [ ] implement Oauth 2 with github and google
4. [ ] create support
4. [X] use axios instead of fetch
4. [X] when deleting account all associated data should be deleted eg. applications, tasks, etc.
4. [X] fix: when deleting account the logout modal shoould NOT be shown. also redirect to /
4. [X] fix: dont allow spaces in passwords
4. [X] fix wird 3 dots nav bug
5. [ ] add text limit to almost all forms like (5/100) etc.
5. [ ] fix: 0:30:21 [vite] (client) hmr invalidate /src/context/auth/AuthContext.jsx Could not Fast Refresh ("useAuth" export is incompatible). Learn more at https://github.com/vitejs/vite-plugin-react-swc#consistent-components-export
5. [ ] fix: 10:46:13 [vite] (client) hmr invalidate /src/context/theme/ThemeContext.jsx Could not Fast Refresh ("useTheme" export is incompatible). Learn more at https://github.com/vitejs/vite-plugin-react-swc#consistent-components-expo
5. [ ] fix: when closing the browser in the app and opening it again it shows blank and this error: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
5. [X] fix landing theme issue
5. [ ] add remember me to login
5. [ ] notifications
5. [X] cerate min. 5 unit tests for frontend and backend.
5. [X] clean up x1, x2, x3, x4, x5, x6
