import React, { useEffect, useState } from 'react'
import { getAllFiles } from '../../api'
import FileExplorer from '../FileExplorer/FileExplorer'
import './MissionsPage.scss'
import { useDispatch } from 'react-redux'
import { setFiles } from '../../store/slices/fileSlice'

function MissionsPage() {
    const dispatch = useDispatch()
    const [basePath, setBasePath] = useState("")

    useEffect(() => {
        fetchFiles()

        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString);
        const mode = urlParams.get("mode")
        const test = urlParams.get("test")
        console.log(mode, test)
        if(mode && test){
            setBasePath(`/${mode}/${test}/`)
        }
    }, [])

    async function fetchFiles() {
        const res = await getAllFiles().catch((err) => console.log(err.message))
        dispatch(setFiles(res))
    }

    return (
        <div>
            <h1>Missions Page</h1>

            <div>
                <FileExplorer basePath={basePath}/>
            </div>
        </div>
    )
}

export default MissionsPage
