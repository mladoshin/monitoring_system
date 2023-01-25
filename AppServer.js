import express, { json } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import fs, { exists } from "fs";
import { MIC_ENUM, MODE } from "./enums.js";
import xl from "excel4node";
import ip from "ip";
import * as dotenv from "dotenv";
dotenv.config();

axios.defaults.headers.common["Authorization"] = process.env.API_TOKEN;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.HTTPS_PORT;

class AppServer {
  constructor(mode = MODE.MONITORING) {
    this.app = express();
    this.app.use(json());
    this.app.use(express.static(path.join(__dirname, "./app/dist/")));

    this.app.get("/api/get-files", this.getAllFiles);

    this.app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "./app/dist/index.html"));
    });

    this.app.post("/api/start-mission", this.startMission);
    this.app.post("/api/generate-result", this.generateResultingXLSX);
    this.app.post("/api/connect-controller", this.connectController);

    this.app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });

    this.test_mode = "data";
    this.test_id = "test";
    this.mode = mode;
    this.all_files = {};
  }

  startMission = async (req, res) => {
    this.mode = MODE.TESTING;
    let error = null;
    const {
      comment = "",
      input_type,
      trigger_source,
      repeat_interval,
      repeat_times,
      sample_rate,
      data_count,
      file_name,
      directory_name,
      channel_config,
      force = false,
    } = req.body;

    this.test_mode = directory_name;
    this.test_id = file_name;

    try {
      if (!force) {
        if (
          fs.existsSync(
            path.join(__dirname, `/data/${this.test_mode}/${this.test_id}`)
          )
        ) {
          //file exists
          res.status(300).send({ msg: "Файл уже существует!" });
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }

    const body = {
      RepeatConfig: {
        RepeatInterval: repeat_interval,
        RepeatTimes: repeat_times,
      },
      DeviceConfig: {
        SampleRate: sample_rate,
        DataCount: data_count,
        InputType: input_type,
        TriggerSource: trigger_source,
      },
      ChannelConfig: Array.from(channel_config).filter((ch) => ch.enabled),
    };

    //remove test directory before writing to it (clearing old files)

    fs.rm(
      path.join(__dirname, `/data/${this.test_mode}/${this.test_id}`),
      { recursive: true, force: true },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully cleared the directory");
        }

        fs.mkdirSync(
          path.join(__dirname, `/data/${this.test_mode}/${this.test_id}`),
          { recursive: true }
        );

        const JSON_config = JSON.stringify(
          { ...body, comment: comment },
          null,
          2
        );
        const file = fs.createWriteStream(
          path.join(
            __dirname,
            `/data/${this.test_mode}/${this.test_id}/full-config.json`
          )
        );
        file.on("error", function (err) {
          /* error handling */
        });
        file.write(JSON_config);
        file.end();
      }
    );

    const response = await axios
      .post(`${process.env.CONTROLLER_URI}/devices/MCM-204-0/mission`, {
        ...body,
      })
      .catch((err) => (error = err.message));

    if (error) {
      res.status(400).send(error);
      console.log(error);
      return;
    }

    res.status(200).send({ ...response.data, all_files: this.all_files });
  };

  saveBinaryFile = (G_data, channel) => {
    fs.mkdirSync(
      path.join(__dirname, `/data/${this.test_mode}/${this.test_id}`),
      { recursive: true },
      (err) => {
        if (err) throw err;
      }
    );

    //write G data into dat file
    const file = fs.createWriteStream(
      path.join(
        __dirname,
        `/data/${this.test_mode}/${this.test_id}/${this.test_id}_ch${channel}.dat`
      )
    );
    file.on("error", function (err) {
      /* error handling */
    });
    file.write(G_data);
    file.end();
  };

  saveParamFile = (MIC_data_arr) => {
    const params = MIC_data_arr;
    console.log(params);
    let obj = {};

    for (let i = 0; i < 13; i++) {
      obj = { ...obj, [MIC_ENUM[i]]: params[i] };
    }

    const json = JSON.stringify(obj, null, 2);

    // write parameters json to test folder
    const file = fs.createWriteStream(
      path.join(
        __dirname,
        `/data/${this.test_mode}/${this.test_id}/parameters.json`
      )
    );
    file.on("error", function (err) {
      /* error handling */
    });
    file.write(json);
    file.end();
  };

  saveMICFile = (MIC_data) => {
    fs.mkdirSync(
      path.join(__dirname, `/data/${this.test_mode}/${this.test_id}`),
      { recursive: true },
      (err) => {
        if (err) throw err;
      }
    );

    // write MIC data to csv file
    const csv_file = fs.createWriteStream(
      path.join(
        __dirname,
        `/data/${this.test_mode}/${this.test_id}/${this.test_id}.csv`
      ),
      { flags: "a" }
    );
    csv_file.on("error", function (err) {
      /* error handling */
    });
    csv_file.write(`${MIC_data}\n`);
    csv_file.end();
  };

  saveData = (MIC_data, G_data) => {
    console.log("Writing to file");
    console.log("file path: ", `/data/${this.test_mode}/${this.test_id}`);

    fs.mkdirSync(
      path.join(__dirname, `/data/${this.test_mode}`),
      { recursive: true },
      (err) => {
        if (err) throw err;
      }
    );

    // write MIC data to csv file
    const csv_file = fs.createWriteStream(
      path.join(__dirname, `/data/${this.test_mode}/${this.test_id}.csv`)
    );
    csv_file.on("error", function (err) {
      /* error handling */
    });
    csv_file.write(MIC_data);
    csv_file.end();

    //write G data into dat file
    const file = fs.createWriteStream(
      path.join(__dirname, `/data/${this.test_mode}/${this.test_id}.dat`)
    );
    file.on("error", function (err) {
      /* error handling */
    });
    file.write(G_data);
    file.end();
  };

  generateTestingCSV = async (req, res) => {
    const { folder_name, file_name } = req.body;

    const files = fs.readdirSync(path.join(__dirname, `/data/${folder_name}/`));

    const csv_files = files.filter((file) => file.endsWith(".csv"));
    console.log(csv_files);

    if (csv_files.includes(`${file_name}.csv`)) {
      //clear the previous file
      fs.writeFileSync(
        path.join(__dirname, `/data/${folder_name}/${file_name}.csv`),
        ""
      );
    }

    const res_file = fs.createWriteStream(
      path.join(__dirname, `/data/${folder_name}/${file_name}.csv`),
      { flags: "a" }
    );
    res_file.on("error", (err) => console.log(err));
    res_file.setDefaultEncoding("utf-8");
    res_file.write(Object.values(MIC_ENUM).join(", "));

    for (const file of csv_files) {
      const file_content = fs.readFileSync(
        path.join(__dirname, `/data/${folder_name}/${file}`)
      );
      res_file.write("\n" + file_content.toString());
    }

    res_file.end();

    res_file.on("finish", () => {
      res
        .status(200)
        .download(
          path.join(__dirname, `/data/${folder_name}/${file_name}.csv`)
        );
    });
  };

  listFiles = (folder, temp) => {
    let folders;

    try {
      folders = Array.from(
        fs.readdirSync(path.join(__dirname, `/data/${folder}`))
      );
    } catch (err) {
      return;
    }

    for (let file_name of folders) {
      const keys = `${folder}/${file_name}`.split("/");
      let tmp = temp;

      for (let key of keys) {
        tmp[key] = key.includes(".") ? null : { ...tmp[key] };
        tmp = tmp[key];
      }

      this.listFiles(`${folder}/${file_name}`, temp);
    }

    return temp;
  };

  getAllFiles = (req, res) => {
    const files = this.listFiles("", {});

    const temp = {};
    const folders = this.listFilesInFolder("");
    //fs.readdirSync(path.join(__dirname, `/data/`))

    for (const folder of folders) {
      //console.log(folder)
      const files = this.listFilesInFolder(folder);
      // fs.readdirSync(path.join(__dirname, `/data/${folder}/`))
      temp[folder] = Array.from(files);
    }

    //console.log(temp)
    this.all_files = temp;

    res.status(200).send(files[""]);
  };

  processCSVFiles = (folder_path, files) => {
    const csv_files = files
      .filter((f) => f.includes(".csv"))
      .sort((a, b) => +a.split(".")[0] > +b.split(".")[0]);
    console.log(csv_files);

    for (let file in csv_files) {
    }
  };

  generateTestModeXLSX({ ws, col_start, mode, ws_start_row }) {
    const test_suites = this.listFilesInFolder(`${mode}/`);
    for (let j = 0; j < test_suites.length; j++) {
      const test_suite = test_suites[j];
      const files = this.listFilesInFolder(`${mode}/${test_suite}/`);

      const file_name = files.find((f) => f.includes(".csv"));

      const file_content = fs.readFileSync(
        path.join(__dirname, `/data/${mode}/${test_suite}/${file_name}`)
      );
      const channels = file_content.toString().split("\n");

      for (let channel_id = 0; channel_id < channels.length; channel_id++) {
        const channel = channels[channel_id];

        this.insertRowIntoXLSX(
          ws,
          j + channel_id * 10 + (mode - 1) * (80 + 8) + ws_start_row,
          col_start,
          channel
        );
      }
    }
  }

  saveXLSXFile = (wb, name) => {
    let error = null;

    try {
      fs.mkdirSync(
        path.join(__dirname, `/exports/`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );

      wb.write(`exports/${name}.xlsx`);
    } catch (err) {
      error = err.message;
    }

    return error;
  };

  generateResultingXLSX = async (req, res) => {
    const { file_name, all_modes, mode, save_on_server } = req.body;
    let wb = new xl.Workbook();

    // Add Worksheets to the workbook
    let ws = wb.addWorksheet("Sheet 1");

    const ws_start_row = 135 - 1;
    const ws_col_start = 4;

    if (!all_modes) {
      try {
        let error;
        this.generateTestModeXLSX({
          ws,
          col_start: 1,
          mode: 1,
          ws_start_row: 0,
        });

        if (save_on_server) {
          error = this.saveXLSXFile(
            wb,
            `${file_name}_${all_modes ? "all" : mode}`
          );
        }

        wb.write(`./data/${file_name}.xlsx`, res);
      } catch (err) {
        console.log(err.message);
        res.status(400).send("Error");
      }
      return;
    }

    const test_modes = this.listFilesInFolder("");

    for (let i = 0; i < test_modes.length; i++) {
      const mode = test_modes[i];
      const col_start = ([9, 10].includes(+mode) ? 1 : 0) + ws_col_start;

      this.generateTestModeXLSX({ ws, col_start, mode, ws_start_row });
    }

    if (save_on_server) {
      const err = this.saveXLSXFile(
        wb,
        `${file_name}_${all_modes ? "all" : mode}`
      );

      if (err) {
        res.status(400).send("Save to server failed!");
        return;
      }
    }

    wb.write(`./data/${file_name}.xlsx`, res);
  };

  listFilesInFolder = (folder_path) => {
    let files = [];

    try {
      files = fs.readdirSync(path.join(__dirname, `/data/${folder_path}`));
    } catch (err) {}

    return files;
  };

  insertRowIntoXLSX = (ws, row, col_start, data) => {
    const values = data.split(", ").slice(14, -1);
    for (let i = 0; i < values.length; i++) {
      ws.cell(row + 1, col_start + i).number(+values[i]);
    }
  };

  reconnectController = async () => {
    let error = null;
    const response = await axios
      .get(`${process.env.CONTROLLER_URI}/socket/MCM-204-0/connection`)
      .catch((err) => (error = err.message));

    if (error) {
      return new Error(err.message);
    }

    return response.data.host;
  };

  connectController = async (req, res) => {
    let error = null;
    const ip_address = ip.address();
    const hosts = await this.reconnectController().catch(
      (err) => (error = err.message)
    );

    if (error) {
      res.status(400).send(error);
      return;
    }

    const idx = hosts.findIndex((h) => h.address === ip_address);
    if (idx !== -1) {
      return;
    }

    const body = {
      address: ip.address(),
      port: Number(process.env.TCP_PORT),
    };

    const response = await axios
      .post(`${process.env.CONTROLLER_URI}/socket/MCM-204-0/connection`, {
        ...body,
      })
      .catch((err) => (error = err.message));

    if (error) {
      res.status(400).send(error);
      console.log(error);
      return;
    }

    res.status(200).send(response.data);
  };
}

export default AppServer;
