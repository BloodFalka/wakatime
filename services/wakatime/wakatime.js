// services
import wakatimeApiKeyService from "./apiKey.js";
// wakatime
import { WakaTimeClient } from "wakatime-client";
// utils
import chalk from "chalk";
import inquirer from "inquirer";

// --------------------------------------------------------

class WakaTime {
  constructor(apiKey) {
    const storedApiKey = wakatimeApiKeyService.get();

    this.client = new WakaTimeClient(apiKey || storedApiKey);
  }

  // Get Data methods
  async getMe() {
    try {
      return await this.client.getMe();
    } catch (err) {
      console.log(chalk.red("An error occurred when get wakatime profile:"));
      console.error(chalk.red(err.message));
    }
  }

  async getMySummary() {
    try {
      console.log("Please enter start and end date in DD-MM-YYYY format");

      const { startDate, endDate } = await inquirer.prompt([
        {
          type: "input",
          name: "startDate",
          message: "Start Date:",
          validate: (value) => {
            if (value.trim().length === 0) {
              return "Please enter a valid Date";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "endDate",
          message: "End Date:",
          validate: (value) => {
            if (value.trim().length === 0) {
              return "Please enter a valid Date";
            }
            return true;
          },
        },
      ]);

      return await this.client.getMySummary({
        dateRange: {
          startDate,
          endDate,
        },
      });
    } catch (err) {
      console.log(chalk.red("An error occurred when get wakatime summary:"));
      console.error(chalk.red(err.message));
    }
  }

  // Show Data methods
  async showMyProfile() {
    try {
      const profile = await this.getMe();

      if (profile?.data) {
        const title = chalk.magenta(`Profile`);

        const username = `${chalk.cyan("Name:")} ${profile.data.username}`;
        const email = `${chalk.cyan("Email:")} ${profile.data.email}`;
        const timezone = `${chalk.cyan("Timezone:")} ${profile.data.timezone}`;
        const lastProject = `${chalk.cyan("Last Project:")} ${
          profile.data.last_project
        }`;

        const profileData = `${title}\n${username}\n${email}\n${timezone}\n${lastProject}`;

        console.log();
        console.log(profileData);
        console.log();
      }
    } catch (err) {
      console.log(chalk.red("An error occurred when show wakatime profile:"));
      console.error(chalk.red(err.message));
    }
  }

  async showMySummary() {
    try {
      const summary = await this.getMySummary();

      if (summary) {
        const { cumulative_total, daily_average, start, end, data } =
          summary || {};

        console.log(summary);

        console.log(
          chalk.magenta(
            `${new Date(start).toLocaleDateString("ua-UK")} - ${new Date(
              end
            ).toLocaleDateString("ua-UK")} Summary`
          )
        );

        console.log();

        if (cumulative_total?.text)
          console.log(`${chalk.cyan("Total:")} ${cumulative_total.text}`);

        if (daily_average?.text)
          console.log(`${chalk.cyan("Daily Average:")} ${daily_average.text}`);

        // Prompt user if they want to see data by days
        const { showByDays } = await inquirer.prompt({
          type: "confirm",
          name: "showByDays",
          message: "Do you want to see data by days?",
          default: false,
        });

        if (showByDays) {
          const { showByProjects } = await inquirer.prompt({
            type: "confirm",
            name: "showByProjects",
            message: "Do you want to see days data by projects?",
            default: false,
          });

          // Show Data by days
          if (data && showByDays) {
            data.map((day) => {
              const { grand_total, range, projects } = day || {};
              console.log();
              console.log(chalk.blue(range?.text));
              console.log(`${chalk.cyan("Total:")} ${grand_total.text}`);

              // Show Data by projects
              if (showByProjects)
                projects?.map((project) => {
                  const { name, text } = project || {};

                  console.log(`- ${name}: ${text}`);
                });
            });
          }
        }
      }
    } catch (err) {
      console.log(chalk.red("An error occurred when show wakatime summary:"));
      console.error(chalk.red(err.message));
    }
  }
}

export default WakaTime;
