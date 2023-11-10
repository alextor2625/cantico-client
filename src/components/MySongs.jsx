import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

const MySongs = ({ addSong, setAddSong }) => {


    const handleAddSong = () => {
        setAddSong((prevState) => !prevState)
    }


    return (
        <div>
            <Button variant="outline-warning">My Songs</Button>{' '}

            <Button onClick={handleAddSong}>
                {addSong ? 'Seguir Brechando' : 'Add Song'}
            </Button>
        </div>
    )
}

export default MySongs
