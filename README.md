# Welcome to ft_transcendance !

## Folder stucture

We have 3 main folders:

- `api` that contains the Nest.js application, which is the API backend of our application
- `front` that contains the React.js application, which is the frontend UI for our application
- `db` that contains nothing for now but might contains the database schema specifications (tables and all)

Each of the `api` and `front` directories have their own directions on how to start their application so go their for more informations.

## How to run the project

There is two main ways to launch this application, one for development and one for production, and everything can be done though Docker and the Makefile

### The Dev environment

In order to start the project with the objective to develop somthing either on the API or on the front you can run `make dev`  
This will automaticaly build the images for you and launch the project and the containers with everything.  
You can now open your favourite code editor and start coding some feature (I see you, start working now).

### The Prod environment

If you want to start the project in its final and optimize form in order to ship it for production on a server, go ahead and type `make prod`  
This will compile and start the project with everything ready for production.  
Be aware that in this environment you CANNOT dynamically change files to modify the render. If you want to change something you need to rebuild the application.

### Usefull commands for the project

There is some commands to help you visualize what is happening inside the containers. I'll let you check more in depth the `Makefile` for more infos but here is it works in general:  
When you see `%.something`, this means that the rule is available for both `dev` and `prod` environment. But you need to add `dev` or `prod` before all of your commands.  
Let's take the example of the `%.logs` command. If you started your environment in `dev` mode with `make dev` you need to use the command `make dev.logs` in order to see the logs of your containers. If you want to cleanup your environment you will do `make dev.clean`.  
And its the same for every command
