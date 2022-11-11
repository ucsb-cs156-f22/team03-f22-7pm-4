FROM bellsoft/liberica-openjdk-alpine:17.0.2

WORKDIR /app

ENV NODE_VERSION=14.17.3
RUN apk add curl
RUN apk add git
RUN apk add bash
RUN apk add maven
RUN apk add --no-cache libstdc++
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN node --version
RUN npm --version
