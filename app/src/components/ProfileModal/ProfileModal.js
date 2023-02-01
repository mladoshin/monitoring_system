import { Button, Modal, Paper, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import './ProfileModal.scss'

function ProfileModal({
    open = true,
    profiles = [],
    onSelect,
    handleClose,
    select = false,
}) {
    const [name, setName] = useState('')

    return (
        <Modal
            open={open}
            onClose={handleClose}
            className="modal"
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="inner">
                <div className="modal-header">
                    <h3>Выберите профиль</h3>
                    <Button variant="outlined" onClick={handleClose}>
                        закрыть
                    </Button>
                </div>
                {!select && (
                    <div className="input-container">
                        <TextField
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Имя профиля"
                        />
                        <Button
                            variant="outlined"
                            onClick={() => {
                                onSelect(`${name}.json`)
                                handleClose()
                            }}
                        >
                            Создать
                        </Button>
                    </div>
                )}
                <div>
                    {profiles.map((p) => (
                        <Paper
                            onClick={() => onSelect(p)}
                            sx={{ py: 2, px: 2 }}
                            className="profile-item"
                        >
                            <b>{p}</b>
                        </Paper>
                    ))}
                </div>
            </Box>
        </Modal>
    )
}

export default ProfileModal
