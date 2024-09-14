###############################################################################
# Stage: base
#
# Base of the other stages. Only include things here that are used in the final
# image (which shouldn't be much).
#
FROM node:20.17.0-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

###############################################################################
# Stage: all deps
#
# Install all dependencies, including dev dependencies.
#
FROM base as deps

WORKDIR /myapp

ADD package.json package-lock.json ./
RUN npm install --include=dev

###############################################################################
# Stage: production deps
#
# node_modules with dev dependencies removed, leaving us with only those needed
# for prod.
#
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json package-lock.json ./
RUN npm prune --omit=dev

###############################################################################
# Stage: build
#
# Run all commands needed to build the app.
#
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

###############################################################################
# Stage: final image
#
# Include only the files needed to run the app in prod.
#
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma
COPY --from=build /myapp/build /myapp/build

ADD package.json ./

CMD ["npm", "run", "prod"]
