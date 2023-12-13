# DummyAuthenticator
## Description
This is a simple Node application, which demonstrates how server-side authentication using user sessions can be implemented. The latter are stored on the server using a Redis store when running the app in production mode. In development mode, a simple key-value store is created in memory.

## Setup
In order to bring the system up, ensure you have Docker installed, as well as its Compose feature. Then, inside the root directory of the project, run the following command in your terminal:

```
docker compose up
```

In order to test the app, go to your localhost in a browser:

```
http://localhost
```

This should load the said app. Enjoy!

## Architecture
Here is a list of short descriptions for all involved components in the system's architecture:

- <strong>Server:</strong> Backend: authentication server based on Express.
- <strong>Client:</strong> Frontend: bundled React app.
- <strong>API:</strong> Set of controllers allowing authentication processes: user registration, login, and logout.
- <strong>Redis:</strong> Container which serves of persisting store for users and their sessions.

Below is a diagram of the architecture of this app. For now, the broker is responsible of the communication with the browser. There is no frontend, per se, that's part of this prototype.

<p align="center" width="100%">
  <img alt="Dummy Authenticator" src="./Diagrams/DummyAuthenticatorArchitecture.drawio.svg" width="90%" />
</p>