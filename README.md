# Description

[Nest.js](https://github.com/nestjs/nest) repository with api-gateway and auth microservices.

# Start app with docker compose:

### 1. Configure project environment:
Copy `.env.example` file, rename it to `.env` and patch variable values you need. 
   
### 2. Start docker and run apps:
```bash
docker compose -f .\compose-dev.yml up
```

### 3. Sync db with prisma schema:
```bash
docker compose -f .\compose-dev.yml exec -it auth sh -c "npx prisma db push"
```

### 3. Create root user:
```bash
docker compose -f .\compose-dev.yml exec -it auth sh -c "npm run create-superuser"  
```

# Start app locally:

### 1. Install dependencies:
```bash
$ npm install
```

### 2. Configure project environment:
Copy `.env.example` file, rename it to `.env` and patch variable values you need. 

### 4. Start postgresql and sync with prisma schema:
> Note: If you want to run application locally you should start postgresql yourself or run docker container in this project. 

To sync schema run: 
```bash
npx prisma db push
```


### 3. Generate Prisma client:
```bash
$ npx prisma generate
```

### 4. Running the apps:
   
```bash
# development
$ npm run start && npm run start auth

# watch mode
$ npm run start:dev && npm run start:dev auth

# production mode
$ npm run start:prod && npm run start:prod auth
```

### 5. Create root user:
```bash
docker compose -f .\compose-dev.yml exec -it auth sh -c "npm run create-superuser"  
```

<!-- ## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
``` -->

# Project urls: 
`127.0.0.1:{API_GATEWAY_SERVICE_PORT}/api/docs` - Swagger documentation.


## License
Nest is [MIT licensed](LICENSE).
