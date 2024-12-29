# TODO - AppliCare

1. [X] password hashing with bcrypt
2. [X] password reset without manually entering the token -> meaning that the user just has to click on the link with the token.
3. [X] creating the SECRET variable in the .env file for the jwt secret key -> openssl rand -base64 64 or 128. the current hardcoded one cant be used in production
4. [X] cleaning up the frontend -> fixing the issues with global styles (index.css) and personal linked files like (Auth.css) for interfeering.
5. [ ] keeping an eye on security config since ill need to change it for production.
6. [X] make the error message in the auth forms look better
7. [ ] make it possible to log in with username or email, currenly only username is possible.
8. [ ] create some regex to make sure the user doesnt user absurd usernames or emails, i dont really care about the password though, maybe just a length limit.
9. [X] create some protected route stuff
1. [X] create the applicare dashboard
1. [X] application files for backend
1. [X] application form
1. [ ] fix the structure tree; components folder css folder etc
1. [ ] create a logo!
