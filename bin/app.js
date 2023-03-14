#!/usr/bin/env node

// yargs
import _yargs from "yargs";
import { hideBin } from "yargs/helpers";
// wakatime
import { WakaTimeClient } from "wakatime-client";
// utils
import chalk from "chalk";
// services
import wakatimeApiKeyService from "../services/wakatime/apiKey.js";
import Wakatime from "../services/wakatime/wakatime.js";

// --------------------------------------

const yargs = _yargs(hideBin(process.argv));

const main = async () => {
  try {
    // TODO return from function after configure
    const argv = await yargs
      .command({
        command: "configure",
        describe: "Configure the Wakatime API key",
        handler: wakatimeApiKeyService.configure,
      })
      .parse();

    if (argv?._?.length === 0) {
      await wakatimeApiKeyService.check();

      const wakatime = new Wakatime();
      
      await wakatime.showMyProfile();
      await wakatime.showMySummary();
    }
  } catch (err) {
    console.log(chalk.red("An error occurred:"));
    console.error(chalk.red(err.message));
  }
};

main();
