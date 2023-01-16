import { Button } from '@mui/material'
import React from 'react'
import "./Modal.scss"

function Modal() {
    return (
        <div className='modal-wrapper closed'>
            <div className='header'>
                <Button variant='outlined'>Назад</Button>
                <Button variant='contained'>Сохранить изменения</Button>
            </div>
            <div className='inner'>

            </div>
        </div>
    )
}

export default Modal