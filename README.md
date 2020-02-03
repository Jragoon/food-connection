# Food Connection

Before running the application, first install `nodejs`.

Setup guide:
```
$ git clone https://github.com/jragoon/food-connection
$ cd food-connection
$ npm install
$ cd backend
$ npm install
```
Following the instructions above will clone the repository and install the necessary dependencies. If dependencies change in the project, you will need to
run `npm install` again. 

To start the express server, do the following:
```
$ cd backend
$ npm start
```

This will run the nodemon (nodemonitor) which adjusts to live changes in the backend. You should see a message similar to `Server is running on port: XXXX`.

# Contributing to Food Connection

In order for your contribution to be accepted, please respect the following guidelines:
    - No business logic in React components
    - Make sure any existing tests pass

# Testing the application using Expo

To run the application and test it on your phone, first install the Expo app from the Google Play Store / iOS store.
Then, run `npm start` while in the `food-connection` directory. This will bring up and host an expo server locally. At this point, it will provide a QR
code you can scan and run a test version of your app on your phone.

# Server Details

We currently have a free-tier cluster through MongoDB atlas: https://www.mongodb.com/cloud/atlas
This means that we have 512MB of storage space, 500 available connections, and shared CPU time. It is hosted in the Eastern US, and can be trivially upgraded
in the future. Behind the scenes it is being hosted with Azure.
In order to connect to this account, you must enter the password in the connection string (the ATLAS_URI variable in `backend/.env`)

# Using the DB

Under backend, the models directory contains the declarations of our schema. Here is where we define schemas for users, food, etc.