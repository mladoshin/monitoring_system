import React, { useEffect, useState } from 'react'
import { getAllFiles } from '../../api'
import FileExplorer from '../FileExplorer/FileExplorer'
import './MissionsPage.scss'

function MissionsPage() {
    const [allFiles, setAllFiles] = useState({})

    async function fetchFiles() {
        const res = await getAllFiles().catch((err) => console.log(err.message))
        setAllFiles(res)
    }

    useEffect(() => {
        fetchFiles()
    }, [])


    return (
        <div>
            <h1>Missions Page</h1>

            <div>
                <FileExplorer refresh={fetchFiles} allFiles={allFiles}/>
            </div>
        </div>
    )
}

export default MissionsPage
