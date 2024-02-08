# Use the official Node.js 20 image.
FROM node:20.9.0-alpine

WORKDIR /usr/src/app

COPY package.json ./

# RUN npm install --only=production
RUN npm install

COPY . .

RUN npm run build
# for debug
RUN ls dist 

# environment variables
ENV NODE_ENV="production"
ENV PORT=4001

# provide when building
ENV ATLAS_DB_URL_DEV=""
ENV ATLAS_DB_URL_PROD="db-url"
ENV FRONTEND_ORIGIN_DEV=""
ENV FRONTEND_ORIGIN_PROD=""

ENV API_KEY="secrectKey"
ENV JWT_EXPIRE="1h"
ENV JWT_SECRET="ThisIsASecret"
ENV REFRESH_TOKEN_EXPIRE="30d"
ENV REFRESH_TOKEN_SECRET="newnewsecret"

EXPOSE 4001

CMD [ "node", "dist/index.js" ]
