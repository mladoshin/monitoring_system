import express, { json } from 'express'
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import axios from 'axios';
import fs from "fs"
import { MIC_ENUM, MODE } from './enums.js';
import { channel } from 'diagnostics_channel';


axios.defaults.headers.common['Authorization'] = 'Basic YWRtaW5pc3RyYXRvcjpBZGxpbms2MTY2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3000
const controller_address = "http://192.168.1.172:6166"

class AppServer {
    constructor(mode = MODE.MONITORING) {
        this.app = express()
        this.app.use(json())
        this.app.use(express.static(path.join(__dirname, './app/dist/')));

        this.app.get('/api/get-files', this.getAllFiles)


        this.app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, './app/dist/index.html'))
        })

        this.app.post('/api/start-mission', this.startMission)
        this.app.post('/api/generate-result', this.generateTestingCSV)

        this.app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })

        this.test_mode = 'data'
        this.test_id = 'test'
        this.mode = mode
        this.all_files = {}
    }

    startMission = async (req, res) => {
        this.mode = MODE.TESTING
        let error = null
        const { input_type, trigger_source, repeat_interval, repeat_times, sample_rate, data_count, file_name, directory_name } = req.body

        this.test_mode = directory_name
        this.test_id = file_name

        const body = {
            RepeatConfig: {
                RepeatInterval: repeat_interval,
                RepeatTimes: repeat_times
            },
            DeviceConfig: {
                SampleRate: sample_rate,
                DataCount: data_count,
                InputType: input_type,
                TriggerSource: trigger_source
            },
            ChannelConfig: [
                {
                    Channel: {
                        Port: "AI0",
                        Sensor: {
                            Type: "Accelerometer",
                            Sensitivity: "1000"
                        }
                    },
                    Coupling: "AC",
                    InputRange: "B10",
                    IEPE: "Disable",
                    Conversion: [
                        {
                            DataType: "G",
                            Algorithm: {
                                WindowType: "Hann",
                                FreqStart: "10",
                                FreqEnd: "10000"
                            }
                        },
                        {
                            DataType: "Customization",
                            Algorithm: {
                                CustomParameter: "MIC-DFT"
                            }
                        },
                    ]
                },
                {
                    Channel: {
                        Port: "AI1",
                        Sensor: {
                            Type: "Accelerometer",
                            Sensitivity: "1000"
                        }
                    },
                    Coupling: "AC",
                    InputRange: "B10",
                    IEPE: "Disable",
                    Conversion: [
                        {
                            DataType: "G",
                            Algorithm: {
                                WindowType: "Hann",
                                FreqStart: "10",
                                FreqEnd: "10000"
                            }
                        },
                        {
                            DataType: "Customization",
                            Algorithm: {
                                CustomParameter: "MIC-DFT"
                            }
                        },
                    ]
                },
                {
                    Channel: {
                        Port: "AI2",
                        Sensor: {
                            Type: "Accelerometer",
                            Sensitivity: "1000"
                        }
                    },
                    Coupling: "AC",
                    InputRange: "B10",
                    IEPE: "Disable",
                    Conversion: [
                        {
                            DataType: "G",
                            Algorithm: {
                                WindowType: "Hann",
                                FreqStart: "10",
                                FreqEnd: "10000"
                            }
                        },
                        {
                            DataType: "Customization",
                            Algorithm: {
                                CustomParameter: "MIC-DFT"
                            }
                        },
                    ]
                }
            ]
        }

        //remove test directory before writing to it (clearing old files)

        fs.rm(path.join(__dirname, `/data/${this.test_mode}/${this.test_id}`), { recursive: true, force: true }, err => {
            if (err){
                console.log(err)
            }else{
                console.log("Successfully cleared the directory")
            }
        })

        const response = await axios.post(`${controller_address}/devices/MCM-204-0/mission`, { ...body }).catch(err => error = err.message)

        if (error) {
            res.status(400).send(error)
            console.log(error)
            return
        }

        res.status(200).send({ ...response.data, all_files: this.all_files })
    }

    saveBinaryFile = (G_data, channel) => {
        fs.mkdirSync(path.join(__dirname, `/data/${this.test_mode}/${this.test_id}`), { recursive: true }, (err) => {
            if (err) throw err;
        });

        //write G data into dat file
        const file = fs.createWriteStream(path.join(__dirname, `/data/${this.test_mode}/${this.test_id}/${this.test_id}_ch${channel}.dat`));
        file.on('error', function (err) { /* error handling */ });
        file.write(G_data)
        file.end();
    }

    saveMICFile = (MIC_data) => {
        fs.mkdirSync(path.join(__dirname, `/data/${this.test_mode}/${this.test_id}`), { recursive: true }, (err) => {
            if (err) throw err;
        });

        // write MIC data to csv file
        const csv_file = fs.createWriteStream(path.join(__dirname, `/data/${this.test_mode}/${this.test_id}/${this.test_id}.csv`), {flags: 'a'});
        csv_file.on('error', function (err) { /* error handling */ });
        csv_file.write(`${MIC_data}\n`)
        csv_file.end();
    }

    saveData = (MIC_data, G_data) => {
        console.log("Writing to file")
        console.log("file path: ", `/data/${this.test_mode}/${this.test_id}`)

        fs.mkdirSync(path.join(__dirname, `/data/${this.test_mode}`), { recursive: true }, (err) => {
            if (err) throw err;
        });

        // write MIC data to csv file
        const csv_file = fs.createWriteStream(path.join(__dirname, `/data/${this.test_mode}/${this.test_id}.csv`));
        csv_file.on('error', function (err) { /* error handling */ });
        csv_file.write(MIC_data)
        csv_file.end();

        //write G data into dat file
        const file = fs.createWriteStream(path.join(__dirname, `/data/${this.test_mode}/${this.test_id}.dat`));
        file.on('error', function (err) { /* error handling */ });
        file.write(G_data)
        file.end();
    }

    generateTestingCSV = async (req, res) => {
        const { folder_name, file_name } = req.body

        const files = fs.readdirSync(path.join(__dirname, `/data/${folder_name}/`))

        const csv_files = files.filter(file => file.endsWith('.csv'))
        console.log(csv_files)

        if(csv_files.includes(`${file_name}.csv`)){
            //clear the previous file
            fs.writeFileSync(path.join(__dirname, `/data/${folder_name}/${file_name}.csv`), '')
        }

        const res_file = fs.createWriteStream(path.join(__dirname, `/data/${folder_name}/${file_name}.csv`), { flags: 'a' });
        res_file.on('error', (err) => console.log(err));
        res_file.setDefaultEncoding('utf-8')
        res_file.write(Object.values(MIC_ENUM).join(', '))


        for (const file of csv_files) {
            const file_content = fs.readFileSync(path.join(__dirname, `/data/${folder_name}/${file}`))
            res_file.write('\n' + file_content.toString())
        }

        res_file.end();

        res_file.on('finish', () => {
            res.status(200).download(path.join(__dirname, `/data/${folder_name}/${file_name}.csv`))
        })

    }

    getAllFiles = (req, res) => {
        const temp = {}
        const folders = fs.readdirSync(path.join(__dirname, `/data/`))

        for (const folder of folders) {
            console.log(folder)
            const files = fs.readdirSync(path.join(__dirname, `/data/${folder}/`))
            temp[folder] = Array.from(files)
        }

        console.log(temp)
        this.all_files = temp

        res.status(200).send(this.all_files)
    }



}

export default AppServer



