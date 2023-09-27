<strong>Prerequisites</strong>

<p>Before starting, make sure you have the following installed on your system:
<ul>
<li>Python 3
<li>pip
<li>virtualenv
</ul>
<strong>Setting Up Virtual Environment</strong>

<p>Follow these steps to set up a virtual environment on your system:</p>
<h3>For Windows</h3>
<ol>
<li>Open Command Prompt as Administrator.
<li>Run this command to install virtualenv: <code>pip install virtualenv</code>
<li>Navigate to your project directory in Command Prompt using the <code>cd</code> command.
<li>Run this command to create a virtual environment named "env": <code>virtualenv env</code>
<li>Activate the virtual environment using this command: <code>.\env\Scripts\activate</code>
</ol>
<h3>For Mac/Linux</h3>
<ol>
<li>Open Terminal.
<li>Run this command to install virtualenv: <code>pip install virtualenv</code>
<li>Navigate to your project directory in Terminal using the <code>cd</code> command.
<li>Run this command to create a virtual environment named "env": <code>virtualenv env</code>
<li>Activate the virtual environment using this command: <code>source env/bin/activate</code>
</ol>
<strong>Installing Dependencies</strong>

<p>After setting up the virtual environment, follow these steps to install the dependencies:</p>
<ol>
<li>Make sure the virtual environment is activated.
<li>Run this command to install the dependencies listed in the requirements.txt file: <code>pip install -r requirements.txt</code>
</ol><strong>Starting the App</strong>
<p>Change the directory to the project directory
<p>Run the Django development server using <code>python manage.py runserver</code>
<p>Open a web browser and go to http://localhost:8000/ to see the application running
<p>That's it! You should now have the Django app up and running in your virtual environment.

