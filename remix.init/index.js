const fs = require('node:fs/promises');
const path = require('node:path');
const {dedent} = require('ts-dedent');

/**
 * Prepare the generated repo for development by
 * - updating the app name in various places
 * - copying and modifying some files
 * - etc.
 *
 * @param {{isTypeScript: boolean, packageManager: string, rootDirectory: string}} param0
 */
module.exports = async function main({isTypeScript, rootDirectory}) {
  if (!isTypeScript) {
    console.warn(
      "I see you've asked for TypeScript to be removed from the project 🧐. That option is not supported, and the project will still be generated with TypeScript.",
    );
  }

  const DIR_NAME = path.basename(rootDirectory);
  const APP_NAME = DIR_NAME
    // get rid of anything that's not allowed in an app name
    .replace(/[^a-zA-Z0-9-_]/g, '-');

  const PATHS = {
    env: path.join(rootDirectory, '.env'),
    example_env: path.join(rootDirectory, '.env.example'),
    package_json: path.join(rootDirectory, 'package.json'),
    readme: path.join(rootDirectory, 'README.md'),
  };

  const replaceDefaultName = replaceDefaultTemplateName.bind(null, APP_NAME);

  await Promise.all([
    updateFile(PATHS.package_json, replaceDefaultName),
    updateFile(PATHS.readme, (file) => {
      return (
        replaceDefaultName(file)
          .replace('# Remix Andrew Stack', `# ${APP_NAME}`)
          // Remove parts of the readme that are only relevant to the template, not the generated app.
          //
          // These sections are marked with magic comments.
          //
          // Of note:
          // - `s` flag to match newlines with `.`  ━━━━━━━━━━━━━━━━━━━┓
          // - `?` character to make `*` non-greedy ┓                  ┃
          //                                  ┏━━━━━┛                  ┃
          //                                  ▼                        ▼
          .replaceAll(/<!-- DELETE-START -->.*?<!-- DELETE-END -->\s*/gs, '')
      );
    }),
    fs.copyFile(PATHS.example_env, PATHS.env),
  ]);

  console.log(
    dedent`
      Setup is almost complete. Follow these steps to finish initialization:

      - Follow the setup steps in the README.md

      - If you haven't already, initialize the git repo with \`git init\`
    `,
  );
};

/**
 * Update the contents of a file.
 * @param {string} path
 * @param {function(string):string} updater
 */
async function updateFile(path, updater) {
  const file = await fs.readFile(path, 'utf-8');
  const newFile = updater(file);
  return fs.writeFile(path, newFile);
}

/**
 * Replace the default template name with the actual app's name.
 * @param {string} content
 * @param {string} appName
 */
function replaceDefaultTemplateName(appName, content) {
  return content.replaceAll('andrew-stack-template', appName);
}
