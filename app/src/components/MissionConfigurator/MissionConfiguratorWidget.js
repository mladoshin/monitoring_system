import { Checkbox, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material'
import { useFormikContext } from 'formik';
import React from 'react'

function MissionConfiguratorWidget() {
    const formik = useFormikContext();

    const channels = [
        { id: 0, name: 'AI0', on: true },
        { id: 1, name: 'AI1', on: false },
        { id: 2, name: 'AI2', on: true },
        { id: 3, name: 'AI3', on: false },
    ]

    return (
        <Paper sx={{ padding: '25px', marginTop: "50px", marginBottom: "50px", width: '100%' }}>
            <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
            >
                <div style={{ display: 'flex', padding: '8px 16px', fontWeight: 600 }}>
                    <div style={{ width: 70, marginRight: 16 }}>
                        <span>Enable</span>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                        <span>Name</span>
                    </div>
                </div>
                {channels.map((value) => {

                    return (
                        <>
                            <ListItem
                                key={value.id}
                                disablePadding

                            >
                                <ListItemButton
                                    onClick={() => alert("Goto channel page")}
                                    sx={{ display: 'flex' }}
                                >
                                    <ListItemIcon sx={{ width: '70px' }}>
                                        <Checkbox
                                            edge="start"
                                            tabIndex={-1}
                                            disableRipple
                                            checked={value.on}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={value.name} sx={{ flexGrow: 1 }} />
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </>
                    );
                })}
            </List>

        </Paper>
    )
}

export default MissionConfiguratorWidget