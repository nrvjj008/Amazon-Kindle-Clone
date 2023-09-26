# Amazon-Kindle-Clone

A clone of Amazon Kindle, with features such as user authentication, book reading with two distinct views (1-page and 2-page views, with the latter offering a realistic book flipping effect), paginated calls for quicker loading, and more.

## Features:
- User authentication
- Book reading with 2 distinct views
- Fully responsive design
- Paginated book page calls for faster access
- Book reviews
- Book personal notes
- Favorites
- Email configuration

## Prerequisites

Before starting, ensure the following are installed on your system:
- Python 3
- pip
- virtualenv
- Node.js
- npm (or yarn)

## Setting Up

### Virtual Environment for Django

#### For Windows:
1. Open Command Prompt as Administrator.
2. Install `virtualenv` using the command: `pip install virtualenv`
3. Navigate to your project directory: `cd path_to_project`
4. Create a virtual environment named "env": `virtualenv env`
5. Activate the virtual environment: `.\env\Scripts\activate`

#### For Mac/Linux:
1. Open Terminal.
2. Install `virtualenv` using the command: `pip install virtualenv`
3. Navigate to your project directory: `cd path_to_project`
4. Create a virtual environment named "env": `virtualenv env`
5. Activate the virtual environment: `source env/bin/activate`

### Installing Django Dependencies

1. Ensure the virtual environment is activated.
2. Install the required dependencies: `pip install -r requirements.txt`

### Setting Up Next.js

1. Change directory to your Next.js app directory (assuming it's named `frontend`): `cd frontend`
2. Install required npm packages: `npm install` (or `yarn install` if you're using Yarn)

## Configuration

1. Create an admin superuser for Django: `python manage.py createsuperuser`. Note: There's a default admin user with username: `admin` and password: `admin`.
2. There is also a default user with username: `test1` and password: `testtest`.
3. To upload eBooks, use the admin portal.
4. Configure the email settings in the Django `settings.py` as needed.

## Running the App

### Django Backend

1. Ensure the virtual environment is activated.
2. Navigate to the project directory.
3. Run the Django development server: `python manage.py runserver`
4. Access the app at [http://localhost:8000/](http://localhost:8000/admin)

### Next.js Frontend

1. Navigate to the Next.js app directory: `cd frontend`
2. Start the development server: `npm run dev` (or `yarn dev` if you're using Yarn)
3. By default, the app will be accessible at [http://localhost:3000/](http://localhost:3000/)

That's it! You should now have both the Django backend and Next.js frontend apps running locally.


![Screenshot 2023-09-26 at 2 38 01 AM](https://github.com/nrvjj008/Amazon-Kindle-Clone/assets/11418936/09774f9f-7fe7-4b13-9392-7fcf103f2ed7)
![Screenshot 2023-09-26 at 2 38 12 AM](https://github.com/nrvjj008/Amazon-Kindle-Clone/assets/11418936/2066efe8-0d23-4b33-bca2-98453c206331)
![Screenshot 2023-09-26 at 2 38 35 AM](https://github.com/nrvjj008/Amazon-Kindle-Clone/assets/11418936/826e5beb-f022-44cb-8048-ffea60c64154)
![Screenshot 2023-09-26 at 2 40 31 AM](https://github.com/nrvjj008/Amazon-Kindle-Clone/assets/11418936/4e441c43-79de-4290-a45d-91857a394f33)
![Screenshot 2023-09-26 at 2 40 47 AM](https://github.com/nrvjj008/Amazon-Kindle-Clone/assets/11418936/ec2ff3b6-3483-4ec3-b6da-4962b0735177)
![Screenshot 2023-09-26 at 2 41 04 AM](https://github.com/nrvjj008/Amazon-Kindle-Clone/assets/11418936/12cef4a2-7435-428f-bff5-0e9b21adbbaa)
![Screenshot 2023-09-26 at 2 41 25 AM](https://github.com/nrvjj008/Amazon-Kindle-Clone/assets/11418936/bcc67aef-94f9-4945-b9e0-f4210941c518)
![Screenshot 2023-09-26 at 2 41 49 AM](https://github.com/nrvjj008/Amazon-Kindle-Clone/assets/11418936/1f196ea3-c08a-4e50-93a2-ce00f8cd9e09)
![Screenshot 2023-09-26 at 2 41 56 AM](https://github.com/nrvjj008/Amazon-Kindle-Clone/assets/11418936/919cb3f2-8293-4cb3-b383-692f56278d20)




