import express from 'express'
const port = 3000

class AppServer {
    constructor() {
        this.app = express()

        this.app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        this.app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })

    }

}

export default AppServer



