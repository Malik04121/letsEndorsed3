# letsEndorsed3

User Authentication and Management Application
This project is a simple user authentication and management application built with Node.js. It provides the following endpoints:


  User signup - The payload must include the basic details of the user such as the email, mobile number, full name and initial password. Once the data is received at the backend, all PII (Personally identifiable data) such as email, mobile number and full name are to be encrypted using a strong public key. The password must be stored in a hashed format.
  
  Reset Password - Accept old and new passwords from the user, verify if the old password is correct, and if it is correct - store the new password in a hashed format.
  
  Login - Accept the user's email address and password, and return a JWT(JSON web token) with the user ID, email, and mobile number as the token payload.
  
   Update User details - Accept new user details fields to update and store the updated data in an encrypted format.
Installation
To install this project, run the following command:
npm install
To use this project, run the following command:
node index.js

To contribute to this project, please fork the repository and submit a pull request.

Dependencies
This project depends on the following libraries:

Express
Mongoose
Bcrypt
JWT

Security
This project takes security very seriously. All PII data is encrypted in transit and at rest. The password is stored in a hashed format.

Postman Documentation
The Postman documentation for this project can be found here:

Code snippet
https://documenter.getpostman.com/view/24009787/2s93ecv9uq
The documentation includes the following information:

A list of all the endpoints in the application
The request and response payloads for each endpoint
The authentication mechanism used by the application
The security considerations for the application
I hope this helps! Let me know if you have any other questions.
