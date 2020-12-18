FROM node:14
ARG NODE_ENV
ARG API_BASE_URL
ENV NODE_ENV "$NODE_ENV"
ENV API_BASE_URL "$API_BASE_URL"
# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm set strict-ssl false
RUN npm install
RUN npm install -g @angular/cli@7.3.9

# add app
COPY . /app

# start app
CMD ng serve --host 0.0.0.0


COPY /script/replace_api_url.sh /

CMD ["sh", "replace_api_url.sh"]

