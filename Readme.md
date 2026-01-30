Energy Saver Tracker App

A mobile application that allows users to track and manage energy and resource usage.
The app enables users to add, edit, delete, and summarise usage data while syncing all information with a backend web service.

What is this app about?

This mobile application is developed as part of a team project.
It connects to a backend web service (API) to retrieve and store energy usage data, ensuring that information persists across sessions and devices.

Backend Web Service

This app communicates with a backend web service using HTTP requests.
The table below documents the available API routes used by the mobile application.

API Routes Documentation
Route	         HTTP Method	Description	Request Body / Parameters
/tracker	     GET	Retrieves all tracker items	None
/tracker	     POST	Adds a new tracker item	JSON (item, category, used, goal, unit, costPerUnit)
/tracker/:id	 PUT	Updates an existing tracker item	URL param id + JSON body
/tracker/:id	 DELETE	Deletes a tracker item	URL param id
Team Contributions

As this is a team project, each member’s role and contributions are documented below.

Name	        Role	                      Responsibilities
Shafiq	     Frontend Developer	              AddScreen.js, WelcomeScreen.js, input validation, UI implementation
Harshitha	Frontend Developer	              EditScreen.js, delete functionality, slide design using generative AI
Haseen	     Backend & Data	Database tables design, SummaryScreen.js, data calculations
Alson	Frontend Developer	HomeScreen.js, screen navigation, data display and refresh