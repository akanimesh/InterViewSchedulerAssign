import React, { useState, useEffect } from 'react'
import {Typography} from "@mui/material";
import Interview from './Interview';

const axios = require("axios").default;

const InterViews = ({ interviewStatus }) => {
    console.log(interviewStatus)
    const [interviewList, setInterviewList] = useState([])
    useEffect(() => {
        axios
          .get(`http://127.0.0.1:8000/api/scheduler/interview/?status=${interviewStatus}`)
          .then((res) => setInterviewList(res.data))
          .catch((err) => console.log(err));
    }, []);
    return (
        <div>
            {interviewList.length !==0 ?
                interviewList.map((interview) => <Interview interview={interview} />) 
                :<Typography variant='h6'>None Available</Typography>
            }
        </div>
    )
}

export default InterViews