# Analytics Challenge Client

### Project setup

```sh
git clone https://github.com/jdro10/analytics-challenge-client.git

# IMPORTANT: Update API settings:
cd analytics-challenge/src/environments

# Update environment.ts file
apiUrl: "https://{DOMAIN}/api/public/v1", // Replace {DOMAIN} with the actual API domain.
apiKey: "API_KEY",
customApi: "http://localhost:7070/api"

# Back into the analytics-challenge folder:
cd ../.. 

# Run docker compose:
docker-compose up -d --build

# Access the application via browser:
http://localhost:4210/
```
