import { Checkbox, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material'
import { useFormikContext } from 'formik';
import React from 'react'
import useConfigureMission from '../../hooks/useConfigureMission';
import Modal from '../Modal/Modal';

function MissionConfiguratorWidget({ ChannelConfig }) {
    const { config, enableChannel, modalOpen, handleOpenModal, handleCloseModal, currentChannel, saveChannel } = ChannelConfig

    return (
        <Paper sx={{ padding: '25px', marginTop: "50px", marginBottom: "50px", width: '100%' }}>
            <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
            >
                <div style={{ display: 'flex', padding: '8px 16px', fontWeight: 600 }}>
                    <div style={{ width: 100, marginRight: 16 }}>
                        <span>Включить</span>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                        <span>Имя канала</span>
                    </div>

                    <div style={{ width: 250 }}>
                        <span>Типы данных</span>
                    </div>
                </div>
                {config.map((value) => {

                    return (
                        <div key={value.Channel.Port}>
                            <ListItem
                                disablePadding
                            >
                                <ListItemButton
                                    onClick={() => handleOpenModal(value.Channel.Port)}
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
                                                enableChannel(value.Channel.Port, e.target.checked)
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={value.Channel.Port} sx={{ flexGrow: 1 }} />

                                    <DataTypeList types={value.Conversion} />
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </div>
                    );
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
        <div style={{ display: 'flex', gap: 10, width: 250 }}>
            {[...types].sort((a, b) => a?.DataType > b?.DataType ? 1 : -1)?.map((type, idx) => (
                <span
                    key={idx}
                    style={{ border: '1px solid #757575', padding: '2px 6px', borderRadius: 5 }}
                >
                    {type.DataType}
                </span>
            ))}
        </div>
    )
}

export default MissionConfiguratorWidget