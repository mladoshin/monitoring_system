import {
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import useConfigureMission from "../../hooks/useConfigureMission";
import Modal from "../Modal/Modal";

function MissionConfiguratorWidget({
  ChannelConfig,
  metrics = {},
  monitoring = false,
  style={}
}) {
  const {
    config,
    enableChannel,
    modalOpen,
    handleOpenModal,
    handleCloseModal,
    currentChannel,
    saveChannel,
  } = ChannelConfig;

  return (
    <>
      <TableContainer component={Paper} sx={style}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: 100, pl: 5 }}>
                {monitoring ? "Вкл." : "Включить"}
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                {monitoring ? "Канал" : "Имя канала"}
              </TableCell>

              {!monitoring && (
                <>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Peak
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Rms
                  </TableCell>
                </>
              )}

              <TableCell align="right" sx={{ fontWeight: "bold", pr: 5 }}>
                Типы данных
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {config.map((value, idx) => {
              const peak = metrics[idx]?.peak || null;
              const rms = metrics[idx]?.rms || null;
              return (
                <TableRow
                  hover
                  onClick={() => handleOpenModal(value.Channel.Port)}
                  key={idx}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ width: 100, pl: 5 }}
                  >
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      disableRipple
                      checked={value.enabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        enableChannel(value.Channel.Port, e.target.checked);
                      }}
                    />
                  </TableCell>
                  <TableCell align="left">{value.Channel.Port}</TableCell>
                  {!monitoring && (
                    <>
                      <TableCell align="right">
                        {peak && <span>{Number(peak).toFixed(4)}</span>}
                      </TableCell>
                      <TableCell align="right">
                        {rms && <span>{parseFloat(rms).toFixed(4)}</span>}
                      </TableCell>
                    </>
                  )}

                  <TableCell align="right" sx={{ pr: 5 }}>
                    <DataTypeList types={value.Conversion} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        channel={currentChannel}
        enableChannel={enableChannel}
        saveChannel={saveChannel}
      />
    </>
  );
}

function DataTypeList({ types = [] }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        justifyContent: "flex-end",
      }}
    >
      {[...types]
        .sort((a, b) => (a?.DataType > b?.DataType ? 1 : -1))
        ?.map((type, idx) => (
          <span
            key={idx}
            style={{
              border: "1px solid #757575",
              padding: "2px 6px",
              borderRadius: 5,
            }}
          >
            {type.DataType}
          </span>
        ))}
    </div>
  );
}

export default MissionConfiguratorWidget;
