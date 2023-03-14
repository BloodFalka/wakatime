// utils
import chalk from "chalk";
import inquirer from "inquirer";
// services
import config from "../config.js";

// --------------------------------------------------------------------

const CONFIG_KEY = "wakatimeApiKey";

const get = () => config.get(CONFIG_KEY);

const set = (value) => {
  config.set(CONFIG_KEY, value);
};

const configure = async () => {
  // Prompt the user for the API key
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
      message: "Please enter your Wakatime API key:",
      validate: (value) => {
        if (value.trim().length === 0) {
          return "Please enter a valid API key";
        }
        return true;
      },
    },
  ]);

  // Store the API key in the config file
  set(answers.apiKey);

  console.log(chalk.green("The Wakatime API key has been configured"));
};

const check = async () => {
  const wakatimeApiKey = get();

  // If the API key is already stored, inform the user otherwise prompt key
  if (wakatimeApiKey) {
    console.log(chalk.green(`The Wakatime API key is ${wakatimeApiKey}`));
  } else {
    await configure();
  }
};

export default {
  get,
  set,
  configure,
  check,
};
