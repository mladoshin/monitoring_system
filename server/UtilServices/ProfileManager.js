import axios from 'axios'
import ip from 'ip'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path, {dirname}  from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class ProfileManager {
    static instance
    constructor() {
        if (ProfileManager.instance) {
            return ProfileManager.instance
        }
        ProfileManager.instance = this
    }

    getUserProfiles = async (req, res) => {
        const { profile_name } = req.query

        if (profile_name) {
            const file_path = path.join(
                __dirname,
                `../user-profiles/${profile_name}`
            )

            fs.readFile(file_path, 'utf8', (err, data) => {
                if (err) {
                    res.status(400).send(err)
                    return
                }
                res.status(200).send(data)
            })

            return
        }

        let files = []

        const file_path = path.join(__dirname, `../user_profiles/`)
        try {
            files = fs.readdirSync(file_path)
        } catch (err) {
            res.status(500).send(err.message)
        }

        res.status(200).send(files)
    }

    getUserProfile = async (req, res) => {
        const { profile_name = '' } = req.query

        const file_path = path.join(__dirname, `../user_profiles/${profile_name}`)

        fs.readFile(file_path, 'utf8', (err, data) => {
            if (err) {
                res.status(400).send(err)
                return
            }
            res.status(200).send(data)
        })
    }

    addUserProfile = async (req, res) => {
        const { profile_name, data } = req.body

        const file = fs.createWriteStream(
            path.join(__dirname, `../user_profiles/${profile_name}`)
        )

        file.on('error', function (err) {
            /* error handling */
            res.status(500).send(err)
        })
        file.write(JSON.stringify(data, null, 2))
        file.end()

        res.status(200).send({ [profile_name]: data })
    }

    removeUserProfile = async (req, res) => {
        const { profile_name } = req.query

        fs.rm(
            path.join(__dirname, `../user_profiles/${profile_name}`),
            { force: true },
            (err) => {
                if (err) {
                    res.status(400).send(err)
                    return
                }

                res.status(200).send(profile_name)
            }
        )
    }
}

export default ProfileManager
