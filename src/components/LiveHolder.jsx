import React from 'react'
import { Button } from 'react-bootstrap'

const LiveHolder = () => {
    return (
        <div>
            <Button variant="outline-danger" >

                <p className="blink">

                    Live
                </p>

            </Button>{' '}
        </div>
    )
}

export default LiveHolder
