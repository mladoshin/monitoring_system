import { Breadcrumbs, Button, Link, List, ListItemButton, ListItemIcon, ListItemText, Paper, Toolbar } from "@mui/material"
import React, {useState, useEffect, useMemo} from "react"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ReplayIcon from '@mui/icons-material/Replay';
import { Box } from "@mui/system";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FolderIcon from '@mui/icons-material/Folder';


export default function FileExplorer({ allFiles, refresh }) {
    const [currentFolder, setCurrentFolder] = useState({ file: '' })
    const [subtree, setSubTree] = useState({ ...allFiles })
    const [path, setPath] = useState('')
  
    useEffect(() => {
      if (!currentFolder.file) {
        setSubTree({ ...allFiles })
        return
      }
      setPath(p => `${p}/${currentFolder.file}`)
      setSubTree(st => st[currentFolder.file])
    }, [currentFolder])
  
    useEffect(() => {
      const keys = path.split("/").filter(k => k !== '')
  
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
      const newpath = path.split("/").slice(0, -1).join('/')
      setPath(newpath)
  
      const keys = newpath.split("/").filter(k => k !== '')
  
      let temp = allFiles
      for (let key of keys) {
        console.log(temp)
        temp = temp[key]
      }
  
      setSubTree({ ...temp })
    }
  
    return (
      <Paper sx={{ padding: '25px' }}>
  
        <Toolbar sx={{ paddingLeft: "0px !important", borderBottom: '1px solid rgb(196, 196, 196)', paddingBottom: '20px', border: '1px solid rgb(196, 196, 196)', px: "20px", py: "10px", borderRadius: "8px" }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ flexGrow: 1 }}
          >
            {['root', ...path.split("/").filter(p => p != '')]?.map((el, idx) => (
              <Link underline="none" key={`${el}${idx}`}>
                {el}
              </Link>
            ))}
          </Breadcrumbs>
  
          <Button sx={{ marginLeft: '10px' }} onClick={goUp}>
            <ArrowUpwardIcon />
          </Button>
          <Button sx={{ marginLeft: 'auto' }} onClick={refresh}>
            <ReplayIcon />
            Refresh
          </Button>
        </Toolbar>
  
        <Box sx={{ display: 'flex', height: "400px" }}>
          <List dense={true} sx={{ width: "100%" }}>
            {files.map((folder_name, idx) => (
              <ListItemButton
                key={`${folder_name}${Math.round(Math.random() * Date.now())}`}
                onDoubleClick={() => {
                  if (subtree[folder_name] == null) {
                    return
                  }
                  setCurrentFolder(st => ({ ...st, file: folder_name }))
                }}
              >
                <ListItemIcon>
                  {subtree[folder_name] ? <FolderIcon /> : <TextSnippetIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={folder_name}
                />
              </ListItemButton>
  
            ))}
          </List>
  
        </Box>
  
      </Paper>
    )
  }