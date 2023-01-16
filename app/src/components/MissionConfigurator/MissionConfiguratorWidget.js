import { Checkbox, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material'
import { useFormikContext } from 'formik';
import React from 'react'
import useConfigureMission from '../../hooks/useConfigureMission';
import Modal from '../Modal/Modal';

function MissionConfiguratorWidget() {
    const {config, enableChannel, modalOpen, handleOpenModal, handleCloseModal, currentChannel, saveChannel} = useConfigureMission({})

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
                </div>
                {config.map((value) => {

                    return (
                        <>
                            <ListItem
                                key={value.Channel.Port}
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
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </>
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

function ConfigModal({...props}){
    return (
        <Modal></Modal>
    )
}

export default MissionConfiguratorWidget