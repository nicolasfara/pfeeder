FROM node:10

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

RUN npm run start build

COPY . .

EXPOSE 3000

ENV LOG_LEVEL=debug
ENV LOG_OUTPUT=dev
ENV CONTROLLERS=src/api/controllers/**/*Controller.ts
ENV MIDDLEWARES=src/api/middlewares/**/*Middleware.ts
ENV INTERCEPTORS=src/api/interceptors/**/*Interceptor.ts
ENV SWAGGER_ENABLED=true
ENV SWAGGER_ROUTE=/swagger
ENV SWAGGER_USERNAME=admin
ENV SWAGGER_PASSWORD=1234
ENV MONITOR_ENABLED=true
ENV MONITOR_ROUTE=/monitor
ENV MONITOR_USERNAME=admin
ENV MONITOR_PASSWORD=1234

CMD ["npm", "run", "start" ]
