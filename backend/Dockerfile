FROM node:10

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

RUN npm run start build

COPY . .

EXPOSE 3000

ENV APP_NAME=pfeeder
ENV APP_SCHEMA=http
ENV APP_HOST=localhost
ENV APP_PORT=3000
ENV APP_ROUTE_PREFIX=/api
ENV APP_BANNER=true
ENV LOG_LEVEL=debug
ENV LOG_OUTPUT=dev
ENV MONGO_PORT=27017
ENV MONGO_USERNAME=pfeeder_admin
ENV MONGO_PASSWORD=pfeeder
ENV MONGO_DATABASE=pfeeder
ENV TYPEORM_MIGRATIONS=src/database/migrations/**/*.ts
ENV TYPEORM_MIGRATIONS_DIR=src/database/migrations
ENV TYPEORM_ENTITIES=src/api/models/**/*.ts
ENV TYPEORM_ENTITIES_DIR=src/api/models
ENV CONTROLLERS=src/api/controllers/**/*Controller.ts
ENV MIDDLEWARES=src/api/middlewares/**/*Middleware.ts
ENV INTERCEPTORS=src/api/interceptors/**/*Interceptor.ts
ENV SUBSCRIBERS=src/api/subscribers/**/*Subscriber.ts
ENV RESOLVERS=src/api/resolvers/**/*Resolver.ts
ENV SWAGGER_ENABLED=true
ENV SWAGGER_ROUTE=/swagger
ENV SWAGGER_USERNAME=admin
ENV SWAGGER_PASSWORD=1234
ENV MONITOR_ENABLED=true
ENV MONITOR_ROUTE=/monitor
ENV MONITOR_USERNAME=admin
ENV MONITOR_PASSWORD=1234
ENV MQTT_URI=mqtt://mosquitto
ENV MQTT_STATUS=/pfeeder/status
ENV MQTT_ALERT=/pfeeder/alert
ENV MQTT_INFO=/pfeeder/info
ENV REDIS_PORT=6379

CMD ["npm", "run", "start" ]
