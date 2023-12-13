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

This should load the said app. Enjoy. :)