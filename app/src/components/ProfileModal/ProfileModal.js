import { Button, IconButton, Modal, Paper, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import './ProfileModal.scss'
import DeleteIcon from '@mui/icons-material/Delete'

function isNameValid(name, profiles){
    if(profiles.indexOf(`${name}.json`) === -1 && name) return true

    return false
}

function ProfileModal({
    open = true,
    profiles = [],
    onSelect,
    onDelete,
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
                            disabled={!isNameValid(name, profiles)}
                        >
                            Создать
                        </Button>
                    </div>
                )}
                <div>
                    {profiles.map((p) => (
                        <ProfileItem
                            profile={p}
                            onDelete={() => onDelete(p)}
                            onSelect={() => onSelect(p)}
                        />
                    ))}
                </div>
            </Box>
        </Modal>
    )
}

function ProfileItem({ profile, onSelect, onDelete }) {
    return (
        <Paper
            onClick={onSelect}
            sx={{ py: 2, px: 2 }}
            className="profile-item"
        >
            <b>{profile.replace('.json', '')}</b>
            <IconButton
                aria-label="delete"
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                }}
            >
                <DeleteIcon sx={{ color: 'crimson' }} />
            </IconButton>
        </Paper>
    )
}

export default ProfileModal
