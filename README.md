# BookYaMate - Project in Fullstack Web-Development
This app enables you to book a slot for having a fun time with your mate.

## Run backend & frontend
In order to use this application, you need a Google API Client ID! You can then set in `frontend/main.ts`.

To run the backend and frontend, you can either use **npm** or **docker**.

### npm
To run the backend and frontend, you need to have npm installed.

#### Backend
To run the backend, navigate to the `backend` directory and run `npm install` to install the dependencies.
After that, you can run `npm start-backend` to start the backend.

#### Frontend
To run the frontend, navigate to the `frontend` directory and run `npm install` to install the dependencies.
After that, you can run `npm start-frontend` to start the frontend.

### Docker
The following commands use the docker-compose-plugin to easily run the backend and frontend at the same time.
Please follow the instructions on the [Docker compose website](https://docs.docker.com/compose/install/)
to install the docker-compose-plugin.

#### Run
To run the containers, you can use `docker compose up` in the root directory of the project:

#### Stop
To gracefully stop both containers, use `Ctrl+c`.

#### Remove
To remove the stopped containers, use `docker compose down`.

To remove the images, use `docker rmi <id>`, where `<id>` is the id of a container, 
which can be found by running `docker images`.
To remove all images of non-existing containers, use `docker rmi $(docker images -q)`.

#### Common errors:
- If you do not have the right permissions to run docker without `sudo`,
  you might need to add your user to the docker group.
- If you already added yourself to the docker group 
  and already did a re-login and it still does not work, restart your machine.

