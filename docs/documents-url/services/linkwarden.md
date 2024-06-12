# <img src="/linkwarden-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Linkwarden <Badge type="tip" text="docker" style=" position: relative; float: right;" />


Linkwarden is a self-hosted, open-source collaborative bookmark manager to collect, organize and archive webpages.

The objective is to organize useful webpages and articles you find across the web in one place, and since useful webpages can go away (see the inevitability of Link Rot), Linkwarden also saves a copy of each webpage as a Screenshot and PDF, ensuring accessibility even if the original content is no longer available.

Additionally, Linkwarden is designed with collaboration in mind, sharing links with the public and/or allowing multiple users to work together seamlessly.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: "3.5"
services:
  postgres:
    container_name: linkwarden-postgres
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - /your-config-location/pgdata:/var/lib/postgresql/data
    environment:
      - NEXTAUTH_SECRET=VERY_SENSITIVE_SECRET
      - NEXTAUTH_URL=http://localhost:3000/api/v1/auth
      - POSTGRES_PASSWORD=POSTGRES-PASSWORD
      - PUID=1000
      - PGID=1000
      
  linkwarden:
    image: ghcr.io/linkwarden/linkwarden:v2.5.3 
    container_name: linkwarden
    ports:
      - 3000:3000
    volumes:
      - /your-config-location/data:/data/data
    environment:
      - DATABASE_URL=postgresql://postgres:POSTGRES-PASSWORD@postgres:5432/postgres
      - NEXTAUTH_SECRET=VERY_SENSITIVE_SECRET
      - NEXTAUTH_URL=http://localhost:3000/api/v1/auth
      - POSTGRES_PASSWORD=POSTGRES-PASSWORD
      - NEXT_PUBLIC_DISABLE_REGISTRATION=true
      - PUID=998
      - PGID=100
    restart: unless-stopped
    depends_on:
      - postgres
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>3000</strong></span>:3000).
* Update <code>PUID</code> and <code>GUID</code> accordingly to your system.
* Update <code>your-config-location</code> to your desired location for configuration files. Here the two volumes are mapped with two different folder inside your-config-location.
* Update <code>NEXTAUTH_SECRET</code> with a random string, make sure that both variables are the same.
* Update <code>POSTGRES-PASSWORD</code> with a secure password, make sure that both variables are the same.
* Update <code>DATABASE_URL</code> with the password defined above.

:::

## Run the container
For version of Docker Compose <code>≥ 2</code> use the following command to create and start the container:
```bash
docker compose up -d
```
For older versions use:
```bash
docker-compose up -d
```

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.100:3000</code>

## Create account
To create an account, click <code>Sign Up</code> below the login page.