# Use the official Node.js 20 image.
FROM node:20.9.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install --only=production
RUN npm install

COPY . .

RUN npm run build
# for debug
RUN ls dist 

# environment variables
ENV PORT=4001
ENV NODE_ENV="production"
ENV ATLAS_DB_URL_DEV="db-url"
ENV API_KEY="api-key"
ENV FRONTEND_ORIGIN=""

EXPOSE 4001

CMD [ "node", "dist/index.js" ]
