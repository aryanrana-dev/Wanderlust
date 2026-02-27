# Wanderlust 🌍

Wanderlust is a full-stack web application designed for users to discover, list, and review travel accommodations and destinations. Built with a robust MVC (Model-View-Controller) architecture, it offers a seamless experience for managing property listings, uploading images, and interacting with other users' reviews. 

This project reflects my ongoing focus on full-stack web development and serves as a practical milestone as I continue building applications to reach my goal of becoming a software engineer.

## 🚀 Features

* **Property Listings:** Users can view, create, edit, and delete travel listings.
* **Image Uploads:** Integrated cloud storage for seamless image uploads associated with listings.
* **Reviews & Ratings:** Ability for users to leave reviews and rate their stays.
* **Data Validation:** Server-side and client-side validation to ensure secure and accurate data entry.
* **Authentication & Authorization:** Secure user sign-up, login, and protected routes (e.g., only listing owners can edit or delete their properties).
* **Responsive Design:** A user-friendly interface that works across desktop and mobile devices.

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, EJS (Embedded JavaScript templates)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose ODM)
* **Cloud Storage:** Cloudinary (for image hosting)
* **Routing:** Express Router
* **Validation:** Joi (Schema validation)

## 📁 Project Structure

```text
Wanderlust/
├── controller/       # Contains the core logic for handling requests (Listings, Reviews, Users)
├── init/             # Scripts and sample data for initializing/seeding the database
├── models/           # Mongoose schemas (Listing, Review, User)
├── public/           # Static assets (CSS, client-side JavaScript, images)
├── routes/           # Express routes mapping URLs to specific controllers
├── utils/            # Helper functions, custom error classes (e.g., ExpressError)
├── views/            # EJS templates for the frontend UI
├── .gitignore        # Files and directories ignored by Git
├── app.js            # Main application entry point and server setup
├── cloudConfig.js    # Configuration for Cloudinary image uploads
├── dataClean.js      # Utility script for cleaning/managing database records
├── middleware.js     # Custom Express middleware (Authentication, validation checks)
├── package.json      # Project metadata and dependencies
└── schema.js         # Joi validation schemas for incoming request data

⚙️ Installation & Local Setup
To run this project locally on your machine, follow these steps:

1. Clone the repository:

Bash
git clone [https://github.com/aryanrana-dev/Wanderlust.git](https://github.com/aryanrana-dev/Wanderlust.git)
cd Wanderlust

2. Install dependencies:

Bash
npm install

3. Set up Environment Variables:
Create a .env file in the root directory and add your secret keys. You will need credentials for your database and cloud storage:

Code snippet
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MONGO_URL=your_mongodb_connection_string
SUPER_SECRET_KEY=your_session_secret

**4. Start the application:**
```bash
node app.js
The server will start running. Open your browser and navigate to http://localhost:8080 (or whichever port you have configured).

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

📝 License
This project is open-source and available under the MIT License.


***