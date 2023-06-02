import axios from 'axios'
import ip from 'ip'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path, {dirname}  from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class PostprocessingManager {
    static instance
    constructor() {
        if (PostprocessingManager.instance) {
            return PostprocessingManager.instance
        }
        PostprocessingManager.instance = this
    }

    #generateTestModeXLSX({ ws, col_start, mode, ws_start_row }) {
        const test_suites = this.listFilesInFolder(`${mode}/`)
        for (let j = 0; j < test_suites.length; j++) {
            const test_suite = test_suites[j]
            const files = this.listFilesInFolder(`${mode}/${test_suite}/`)

            const file_name = files.find((f) => f.includes('.csv'))

            const file_content = fs.readFileSync(
                path.join(__dirname, `/data/${mode}/${test_suite}/${file_name}`)
            )
            const channels = file_content.toString().split('\n')

            for (
                let channel_id = 0;
                channel_id < channels.length;
                channel_id++
            ) {
                const channel = channels[channel_id]

                this.insertRowIntoXLSX(
                    ws,
                    j + channel_id * 10 + (mode - 1) * (80 + 8) + ws_start_row,
                    col_start,
                    channel
                )
            }
        }
    }

    #saveXLSXFile = (wb, name) => {
        let error = null

        try {
            fs.mkdirSync(
                path.join(__dirname, `/exports/`),
                { recursive: true },
                (err) => {
                    if (err) throw err
                }
            )

            wb.write(`exports/${name}.xlsx`)
        } catch (err) {
            error = err.message
        }

        return error
    }

    #listFilesInFolder = (folder_path) => {
        let files = []

        try {
            files = fs.readdirSync(path.join(__dirname, `/data/${folder_path}`))
        } catch (err) {}

        return files
    }

    generateResultingXLSX = async (req, res) => {
        const { file_name, all_modes, mode, save_on_server } = req.body
        let wb = new xl.Workbook()

        // Add Worksheets to the workbook
        let ws = wb.addWorksheet('Sheet 1')

        const ws_start_row = 135 - 1
        const ws_col_start = 4

        if (!all_modes) {
            try {
                let error
                this.#generateTestModeXLSX({
                    ws,
                    col_start: 1,
                    mode: 1,
                    ws_start_row: 0,
                })

                if (save_on_server) {
                    error = this.#saveXLSXFile(
                        wb,
                        `${file_name}_${all_modes ? 'all' : mode}`
                    )
                }

                wb.write(`./data/${file_name}.xlsx`, res)
            } catch (err) {
                console.log(err.message)
                res.status(400).send('Error')
            }
            return
        }

        const test_modes = this.#listFilesInFolder('')

        for (let i = 0; i < test_modes.length; i++) {
            const mode = test_modes[i]
            const col_start = ([9, 10].includes(+mode) ? 1 : 0) + ws_col_start

            this.#generateTestModeXLSX({ ws, col_start, mode, ws_start_row })
        }

        if (save_on_server) {
            const err = this.#saveXLSXFile(
                wb,
                `${file_name}_${all_modes ? 'all' : mode}`
            )

            if (err) {
                res.status(400).send('Save to server failed!')
                return
            }
        }

        wb.write(`./data/${file_name}.xlsx`, res)
    }
}

export default PostprocessingManager
