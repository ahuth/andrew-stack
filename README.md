# Remix Andrew Stack

<!-- DELETE-START -->
[Remix](https://remix.run) template for creating full-stack apps.
<!-- DELETE-END -->

## Table of contents

<!-- DELETE-START -->
- [Using this template](#using-this-template)
- [What's in the template](#what-s-in-the-template)<!-- DELETE-END -->
- [Requirements](#requirements)
- [Setup](#setup)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

<!-- DELETE-START -->
## Using this template

Create an app from this template by running:

```sh
npx --yes create-remix@latest --yes --template ahuth/andrew-stack
```

## What's in the template

- Email/Password authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- [Conform](https://conform.guide/) for Progressively Enhanced and fully type safe forms
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) containerization
- [ESLint](https://eslint.org) for linting
- [GitHub Actions](https://github.com/features/actions) for CI
- [Playwright](https://playwright.dev/) for integration tests
- [PostgreSQL](https://www.postgresql.org/) database
- [Prettier](https://prettier.io) code formatting
- [Prisma](https://prisma.io) database ORM
- [shadcn/ui](https://ui.shadcn.com/) React component library
- [Storybook](https://storybook.js.org/) component explorer
- [Tailwind](https://tailwindcss.com/) for styling ❤️
- [TypeScript](https://typescriptlang.org) for type safety!
- [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com) for unit testing
- [Zod](https://zod.dev/) for Runtime schema validation
<!-- DELETE-END -->

## Requirements

- [Docker](https://www.docker.com/)
- [nodenv](https://github.com/nodenv/nodenv)

## Setup

After cloning the repo, setup the app by following these steps.

- Install the required Node version

  ```sh
  nodenv install
  ```

- Install dependencies

  ```sh
  npm install
  ```

- Create a `.env` file for local development

  ```sh
  cp .env.example .env
  ```

- Start any required Docker services, such as Postgres:

  ```sh
  npm run docker
  ```

  > **Note:** Ensure that Docker has finished and your containers are running before proceeding.

- Setup the database:

  ```sh
  npm run setup
  ```

- Run the build, which generates the App's Node server:

  ```sh
  npm run build
  ```

## Development

- Start the app in development mode, rebuilding assets on file change:

  ```sh
  npm start
  ```

- Once running, visit:

  ```
  https://localhost:3000
  ```

- By default there is a new user with some data you can use to get started:
  - Email: jane@example.com
  - Password: password

- Manage the database with the Prisma CLI. See [Developing with Prisma Migrate](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate).

  Some common operations are:

  | Goal | Command(s) |
  | ---- | ---------- |
  | Apply pending migrations | `npx prisma migrate dev` |
  | Add a new model | Modify prisma/schema.prisma and run `npx prisma migrate dev` to generate a migration |
  | Explore the db | `npx prisma studio` |
  | Reset your db | `npx prisma migrate reset` |

- Debug server side code by placing a `debugger` in your code, open up Chrome, and go to `chrome://inspect`.

## Troubleshooting

Something's gone awry 🤨? Try these steps:

- Re-build the Remix server

  ```sh
  npm run build
  ```

- Re-install all dependencies (a "clean install")

  ```sh
  npm ci
  ```
