# Book library

## Description

This project is an implementation of book library, which allows users to create
new books, create orders, download invoices and so on. This project features 
authentication and authorization, database operations, Docker practices.

## Try this project

At first, clone this repo by running this command:

```git clone https://github.com/koksha19/book-library.git```

Create .env file in the root folder of the project:

```
PORT=3000
MONGODB_URI=...your mongo uri...
SESSION_SECRET=...your secret...
MJ_APIKEY_PUBLIC=...your public mailjet key...
MJ_APIKEY_PRIVATE=...your private mailjet key...
```

### Launch locally

Navigate to the project's folder and run:

```npm install```

Launch the application:

```npm run start```

Now open ```http://localhost:3000```

### Launch in container

Run this command to launch in container:

```docker compose up```

Open ```http://localhost:3000```

