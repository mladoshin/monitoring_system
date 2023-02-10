import {
    Checkbox,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
} from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useEffect } from 'react'
import useConfigureMission from '../../hooks/useConfigureMission'
import Modal from '../Modal/Modal'

function MissionConfiguratorWidget({
    ChannelConfig,
    paramsData,
    metrics = {},
}) {
    const {
        config,
        enableChannel,
        modalOpen,
        handleOpenModal,
        handleCloseModal,
        currentChannel,
        saveChannel,
    } = ChannelConfig

    return (
        <Paper
            sx={{
                padding: '25px',
                marginTop: '50px',
                marginBottom: '50px',
                width: '100%',
            }}
        >
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <div
                    style={{
                        display: 'flex',
                        padding: '8px 16px',
                        fontWeight: 600,
                    }}
                >
                    <div style={{ width: 100, marginRight: 16 }}>
                        <span>Включить</span>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                        <span>Имя канала</span>
                    </div>
                    <div style={{ width: 150 }}>
                        <span>Peak</span>
                    </div>
                    <div style={{ width: 150 }}>
                        <span>RMS</span>
                    </div>
                    <div style={{ width: 250 }}>
                        <span>Типы данных</span>
                    </div>
                </div>
                {config.map((value, idx) => {
                    const peak = metrics[idx]?.peak || null
                    const rms = metrics[idx]?.rms || null

                    return (
                        <div key={value.Channel.Port}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() =>
                                        handleOpenModal(value.Channel.Port)
                                    }
                                    sx={{ display: 'flex' }}
                                >
                                    <ListItemIcon sx={{ width: '100px' }}>
                                        <Checkbox
                                            edge="start"
                                            tabIndex={-1}
                                            disableRipple
                                            checked={value.enabled}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                enableChannel(
                                                    value.Channel.Port,
                                                    e.target.checked
                                                )
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={value.Channel.Port}
                                        sx={{ flexGrow: 1 }}
                                    />

                                    <div style={{ width: 150, fontSize: 14 }}>
                                        {peak && (
                                            <span>
                                                {parseFloat(peak).toFixed(
                                                    4
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ width: 150, fontSize: 14 }}>
                                        {rms && (
                                            <span>
                                                {parseFloat(rms).toFixed(
                                                    4
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    <DataTypeList types={value.Conversion} />
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </div>
                    )
                })}
            </List>

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                channel={currentChannel}
                enableChannel={enableChannel}
                saveChannel={saveChannel}
            />
        </Paper>
    )
}

function DataTypeList({ types = [] }) {
    return (
        <div style={{ display: 'flex', gap: 10, width: 250, flexWrap: 'wrap' }}>
            {[...types]
                .sort((a, b) => (a?.DataType > b?.DataType ? 1 : -1))
                ?.map((type, idx) => (
                    <span
                        key={idx}
                        style={{
                            border: '1px solid #757575',
                            padding: '2px 6px',
                            borderRadius: 5,
                        }}
                    >
                        {type.DataType}
                    </span>
                ))}
        </div>
    )
}

export default MissionConfiguratorWidget
