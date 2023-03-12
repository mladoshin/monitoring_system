import {
    Breadcrumbs,
    Button,
    Link,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Toolbar,
} from '@mui/material'
import React, { useState, useEffect, useMemo } from 'react'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ReplayIcon from '@mui/icons-material/Replay'
import { Box } from '@mui/system'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import FolderIcon from '@mui/icons-material/Folder'
import { getFile } from '../../api'
import FileModal from './FileModal'

function canOpenStats(path, subtree) {
    let res = false
    const regExp = /\/([0-9]+)/g
    const files = Object.keys(subtree)
    const folders = [...path.matchAll(regExp)].map((el) => el[1])
    try {
        if (files.indexOf(`${folders[1]}.csv`) !== -1 && folders.length == 2) {
            res = true
        }
    } catch (err) {}

    return res
}

export default function FileExplorer({ allFiles, refresh }) {
    const [modalOpen, setModalOpen] = useState({ open: false, data: null })
    const [currentFolder, setCurrentFolder] = useState({ file: '' })
    const [subtree, setSubTree] = useState({ ...allFiles })
    const [path, setPath] = useState('')
    const [canViewStats, setCanViewStats] = useState(false)

    useEffect(() => {
        if (!currentFolder.file) {
            setSubTree({ ...allFiles })
            return
        }
        setPath((p) => `${p}/${currentFolder.file}`)
        setSubTree((st) => st[currentFolder.file])
    }, [currentFolder])

    useEffect(() => {
        setCanViewStats(canOpenStats(path, subtree))
    }, [path, subtree])

    useEffect(() => {
        const keys = path.split('/').filter((k) => k !== '')

        let temp = allFiles
        for (let key of keys) {
            temp = temp[key]
        }

        setSubTree({ ...temp })
    }, [allFiles])

    const files = useMemo(() => {
        return Object.keys(subtree)
    }, [subtree])

    function goUp() {
        const newpath = path.split('/').slice(0, -1).join('/')
        setPath(newpath)
        const keys = newpath.split('/').filter((k) => k !== '')
        let temp = allFiles
        for (let key of keys) {
            temp = temp[key]
        }
        setSubTree({ ...temp })
    }

    async function loadFile(folder_path, file_name) {
        const path = `${folder_path}/${file_name}`
        const res = await getFile(path)

        if (res.statusText === 'OK') {
            setModalOpen({ open: true, data: res?.data, file_name })
        } else {
            console.log(res.statusText)
        }
    }

    function handleDoubleClick(folder_name) {
        if (subtree[folder_name] == null) {
            //file
            loadFile(path, folder_name)
            return
        }

        //folder
        setCurrentFolder((st) => ({
            ...st,
            file: folder_name,
        }))
    }

    return (
        <Paper sx={{ padding: '25px' }}>
            <Toolbar
                sx={{
                    paddingLeft: '0px !important',
                    borderBottom: '1px solid rgb(196, 196, 196)',
                    paddingBottom: '20px',
                    border: '1px solid rgb(196, 196, 196)',
                    px: '20px',
                    py: '10px',
                    borderRadius: '8px',
                }}
            >
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ flexGrow: 1 }}
                >
                    {['root', ...path.split('/').filter((p) => p != '')]?.map(
                        (el, idx) => (
                            <Link underline="none" key={`${el}${idx}`}>
                                {el}
                            </Link>
                        )
                    )}
                </Breadcrumbs>
                {canViewStats && (
                    <Button
                        sx={{ marginRight: '10px' }}
                        onClick={() =>
                            handleDoubleClick(`${currentFolder.file}.csv`)
                        }
                        variant="contained"
                    >
                        Смотреть сводку (MIC / SCADA)
                    </Button>
                )}
                <Button sx={{ marginLeft: '10px' }} onClick={goUp}>
                    <ArrowUpwardIcon />
                </Button>
                <Button sx={{ marginLeft: 'auto' }} onClick={refresh}>
                    <ReplayIcon />
                    Refresh
                </Button>
            </Toolbar>
            <Box sx={{ display: 'flex', height: '400px' }}>
                <List dense={true} sx={{ width: '100%' }}>
                    {files.map((folder_name, idx) => (
                        <ListItemButton
                            key={`${folder_name}`}
                            onDoubleClick={() => handleDoubleClick(folder_name)}
                        >
                            <ListItemIcon>
                                {subtree[folder_name] ? (
                                    <FolderIcon />
                                ) : (
                                    <TextSnippetIcon />
                                )}
                            </ListItemIcon>
                            <ListItemText primary={folder_name} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>

            {/*  modal for file contents */}
            <FileModal
                open={modalOpen.open}
                data={modalOpen.data}
                handleClose={() => setModalOpen({ open: false, data: null })}
                fileName={modalOpen.file_name}
            />
        </Paper>
    )
}
