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
} from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ReplayIcon from "@mui/icons-material/Replay";
import { Box } from "@mui/system";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import FolderIcon from "@mui/icons-material/Folder";
import { getAllFiles, getFile } from "../../api";
import FileModal from "./FileModal";
import { useDispatch, useSelector } from "react-redux";
import { setFiles } from "../../store/slices/fileSlice";
import { toast } from "react-toastify";
import SpectrumModal from "./SpectrumModal";

function canOpenStats(path, subtree) {
  let res = false;
  const regExp = /\/([0-9]+)/g;
  const files = Object.keys(subtree || {});
  const folders = [...path.matchAll(regExp)].map((el) => el[1]);
  try {
    if (files.indexOf(`${folders[1]}.csv`) !== -1 && folders.length == 2) {
      res = true;
    }
  } catch (err) {}

  return res;
}

function canOpenSpectrum(path, subtree) {
  let res = false;
  const regExp = /\/([0-9]+)/g;
  const files = Object.keys(subtree || {});
  const folders = [...path.matchAll(regExp)].map((el) => el[1]);
  try {
    Array.from(files).forEach((file, idx) => {
      if (file.endsWith(".dat") && folders.length == 2) {
        res = true;
      }
    });
  } catch (err) {
    console.log(err);
  }

  return res;
}

export default function FileExplorer({ basePath = "" }) {
  const allFiles = useSelector((state) => state.files.value);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState({ open: false, data: null });
  const [spectrumModalOpen, setSpectrumModalOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState({ file: "" });
  const [subtree, setSubTree] = useState({ ...allFiles });
  const [path, setPath] = useState("");
  const [canViewStats, setCanViewStats] = useState(false);
  const [canViewSpectrum, setCanViewSpectrum] = useState(false);

  useEffect(() => {
    //if(basePath) return;

    if (!currentFolder.file) {
      setSubTree({ ...allFiles });
      return;
    }
    setPath((p) => `${p}/${currentFolder.file}`);
    setSubTree((st) => st[currentFolder.file]);
  }, [currentFolder]);

  useEffect(() => {
    setCanViewStats(canOpenStats(path, subtree));
    setCanViewSpectrum(canOpenSpectrum(path, subtree));
  }, [path, subtree]);

  useEffect(() => {
    if (basePath) return;
    const keys = path.split("/").filter((k) => k !== "");

    let temp = allFiles;
    for (let key of keys) {
      temp = temp[key];
    }

    setSubTree({ ...temp });
  }, [allFiles]);

  //if base path is specified, then open this path
  useEffect(() => {
    if (basePath) {
      openFolder(basePath);
    }
  }, [basePath]);

  console.log("canViewSpectrum: ", canViewSpectrum);

  //refresh all files
  async function refresh() {
    const res = await getAllFiles().catch((err) => console.log(err.message));
    dispatch(setFiles(res));
  }

  //function for opening a specific folder with path - basePath
  function openFolder(path) {
    try {
      const keys = path.split("/").filter((k) => k != "");
      let new_path = "";
      let tree = { ...allFiles };

      keys.forEach((key) => {
        new_path = `${new_path}/${key}`;
        tree = tree[key];
      });

      if (tree === undefined || tree === null) {
        throw new Error();
      }
      setPath(new_path);
      setSubTree(tree);
    } catch (err) {
      toast.error("Указанный путь не найден!", {
        position: "bottom-right",
        autoClose: false,
      });
    }
  }

  const files = useMemo(() => {
    if (!subtree) return [];
    return Object.keys(subtree);
  }, [subtree]);

  // go up 1 level in file hierarchy
  function goUp() {
    const newpath = path.split("/").slice(0, -1).join("/");
    setPath(newpath);
    const keys = newpath.split("/").filter((k) => k !== "");
    let temp = allFiles;
    for (let key of keys) {
      temp = temp[key];
    }
    setSubTree({ ...temp });
  }

  //load file contents from the api
  async function loadFile(folder_path, file_name) {
    const path = `${folder_path}/${file_name}`;
    const is_binary = file_name.includes("bin");
    const res = await getFile(
      path,
      is_binary ? { responseType: "arraybuffer" } : {}
    );

    console.log(res);

    if (res.statusText === "OK") {
      if (res.headers["content-type"] === "application/octet-stream") {
        //received binary data
        const data = new Float32Array(res.data);
        //console.log(data[0]);
        setModalOpen({
          open: true,
          data: Array.from(data).slice(0, 1000),
          file_name,
        });
        return;
      }

      setModalOpen({ open: true, data: res?.data, file_name });
    } else {
      console.log(res.statusText);
    }
  }

  //handle open a file by double clicking on it
  function handleDoubleClick(folder_name) {
    if (subtree[folder_name] == null) {
      //file
      loadFile(path, folder_name);
      return;
    }

    //folder
    setCurrentFolder((st) => ({
      ...st,
      file: folder_name,
    }));
  }

  function handleOpenSpectrum() {
    setSpectrumModalOpen(true)
  }

  return (
    <Paper sx={{ padding: "25px" }}>
      <Toolbar
        sx={{
          paddingLeft: "0px !important",
          borderBottom: "1px solid rgb(196, 196, 196)",
          paddingBottom: "20px",
          border: "1px solid rgb(196, 196, 196)",
          px: "20px",
          py: "10px",
          borderRadius: "8px",
        }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ flexGrow: 1 }}
        >
          {["root", ...path.split("/").filter((p) => p != "")]?.map(
            (el, idx) => (
              <Link underline="none" key={`${el}${idx}`}>
                {el}
              </Link>
            )
          )}
        </Breadcrumbs>
        {canViewStats && (
          <Button
            sx={{ marginRight: "10px" }}
            onClick={() => handleDoubleClick(`${currentFolder.file}.csv`)}
            variant="contained"
          >
            Смотреть сводку (MIC / SCADA)
          </Button>
        )}
        {canViewSpectrum && (
          <Button
            sx={{ marginRight: "10px" }}
            onClick={() => handleOpenSpectrum()}
            variant="contained"
          >
            Открыть спектр
          </Button>
        )}
        <Button sx={{ marginLeft: "10px" }} onClick={goUp}>
          <ArrowUpwardIcon />
        </Button>
        <Button sx={{ marginLeft: "auto" }} onClick={refresh}>
          <ReplayIcon />
          Refresh
        </Button>
      </Toolbar>
      <Box sx={{ display: "flex", height: "400px" }}>
        <List dense={true} sx={{ width: "100%" }}>
          {files.map((folder_name, idx) => (
            <ListItemButton
              key={`${folder_name}`}
              onDoubleClick={() => handleDoubleClick(folder_name)}
            >
              <ListItemIcon>
                {subtree[folder_name] ? <FolderIcon /> : <TextSnippetIcon />}
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

      <SpectrumModal
        open={spectrumModalOpen}
        handleClose={() => setSpectrumModalOpen(false)}
        path={path}
      />
      
    </Paper>
  );
}
