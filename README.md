## Getting Started

This project was written using python3.7 & Angular 9. A pip requirements.txt
 file is
 included to install the dependencies

## Running with Docker
- A Docker Compose file is provided that will run the application in an
 isolated environment

- Make sure you have `docker & docker-compose` installed and that the Docker
 daemon is
 running
 
- Build & Run the image: `docker-compose up --build`

- Start using web app: `http://localhost:4200/`

## Running with a virtual environment and NPM

#### Run Django Server

- To run the application in a virtual Python environment, follow these instructions. This example will create a virtual Python environment

- Check you have the pynv version you need:
pyenv versions

- You should see 3.7.6

- If you do not have the correct version of Python, install it like this:
pyenv install 3.7.6

- On command line do this:
~/.pyenv/versions/3.7.6/bin/python -m venv env

- This creates a folder called env. Then do this to activate the virtual environment:
source env/bin/activate

- Lastly do this to check that you are now on the correct Python version:
python --version

To check we are on the right Python version

- You can install the dependencies with `pip install -r requirements.txt`

- You can then run the migrations commands with `python manage.py
 makemigrations
` then
 `python manage.py
 makemigrations
` in the livanova directory

- You can then run the server command with `python manage.py runserver`

#### Run Angular App 

- Make sure you have Node installed on your machine (v13.11.0 used)

- Run `npm install -g @angular/cli` to install the angular command line tool

To check you have it installed correctly check the version `ng v`

- Install the dependencies by running `npm install` in the angular directory

- You can then run the app command with `ng serve`

- Start using web app: `http://localhost:4200/`

## Project Structure Notes

- The Backend Django Rest Framework  are stored in the `livanova` folder
- The Front-End Angular app are in the `angular` folder

In both cases, they have a dedicated README to give more info.

## Task

- Create a web application that allows a user to upload an image, name & colour, and displays thumbnails of all the images & name, grouped by colour that have previously been uploaded. Required architecture would use Angular & Python.
