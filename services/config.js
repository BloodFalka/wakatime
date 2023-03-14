import fs from "fs";

// ------------------------------------------------------------------

class Config {
  constructor(configFilePath) {
    this.configFilePath = configFilePath;
    this.config = {};
    this.load();
  }

  load() {
    if (fs.existsSync(this.configFilePath)) {
      const data = fs.readFileSync(this.configFilePath);
      this.config = JSON.parse(data);
    }
  }

  save() {
    fs.writeFileSync(this.configFilePath, JSON.stringify(this.config, null, 2));
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
    this.config[key] = value;
    this.save();
  }

  remove(key) {
    delete this.config[key];
    this.save();
  }
}

const config = new Config("config.json");

export default config;
