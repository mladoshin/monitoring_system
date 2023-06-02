import axios from 'axios'
import ip from 'ip'
import * as dotenv from 'dotenv'
dotenv.config()


const SocketQueries = {
    SOCKET_CONNECTION: `${process.env.CONTROLLER_URI}/socket/MCM-204-0/connection`,
}

class SocketManagement {
    static instance
    constructor() {
        if (SocketManagement.instance) {
            return SocketManagement.instance
        }
        SocketManagement.instance = this
    }

    //get all socket connection of controller
    #getSocketConnections = async () => {
        const response = await axios.get(SocketQueries.SOCKET_CONNECTION)
        return response?.data
    }

    //delete a single socket connection
    #deleteSocketConnection = async (socket) => {
        console.log(socket)
        const response = await axios
            .delete(SocketQueries.SOCKET_CONNECTION, { data: { ...socket } })
            .catch((err) => console.log(err))

        console.log(response.status)
    }

    //api query for deleteing unused/all socket connections
    resetSocketConnectionsQuery = async (req, res) => {
        const { all } = req.body

        const data = await this.#getSocketConnections()

        if (!data?.host) {
            return res.sendStatus(400)
        }

        data.host.forEach((host) => {
            if (all || !host.connected) {
                //delete socket connection
                const { address, port } = host
                this.#deleteSocketConnection({ address, port })
            }
        })

        res.sendStatus(200)
    }

    //api query for getting all socket connections
    getSocketConnectionsQuery = async (req, res) => {
        const data = await this.#getSocketConnections()

        if (!data) {
            res.send(400)
            return
        }

        res.status(200).send(data)
    }

    //reconnect the controller
    #reconnectController = async () => {
        const response = await axios.get(SocketQueries.SOCKET_CONNECTION)

        return response.data.host
    }


    //connect new ip_address of a host pc to controller
    connectController = async (req, res) => {
        let error = null
        const ip_address = ip.address()
        const hosts = await this.#reconnectController().catch((err) => {
            error = err
        })

        if (error) {
            res.status(400).send(error)
            return
        }

        const idx = hosts.findIndex((h) => h.address === ip_address)
        if (idx !== -1) {
            return
        }

        const body = {
            address: ip_address,
            port: Number(process.env.TCP_PORT),
        }

        const response = await axios
            .post(SocketQueries.SOCKET_CONNECTION, {
                ...body,
            })
            .catch((err) => (error = err.message))

        if (error) {
            res.status(400).send(error)
            console.log(error)
            return
        }

        res.status(200).send(response.data)
    }
}

export { SocketQueries }
export default SocketManagement
