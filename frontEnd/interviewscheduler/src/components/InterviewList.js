import React, {useState, useEffect} from 'react'
import { Box, Stack, Tab, Tabs } from "@mui/material";
import {Typography} from "@mui/material";
import Interview from './Interview';

const axios = require("axios").default;

const InterviewList = ({getUser, user}) => {
    const [interviewStatus, setInterviewStatus] = useState("past");
    const [interviewList, setInterviewList] = useState([])
    useEffect(() => {
        axios
          .get(`http://127.0.0.1:8000/api/scheduler/interview/?status=${interviewStatus}`)
          .then((res) => setInterviewList(res.data))
          .catch((err) => console.log(err));
    }, [interviewStatus]);


    const handleChange = (event, newValue) => {
        setInterviewStatus(newValue);
    };

    const handleDelete = (id) =>{
        console.log(">>>",id);
        const updatedList = interviewList.filter((interview) => {return interview.id !== id});
        console.log(">>>>>",updatedList);
        axios
        .delete(`http://127.0.0.1:8000/api/scheduler/interview/${id}/`)
        .then(() =>{
            // const updatedList = interviewList.filter((interview) => interview.id !== id)
            setInterviewList(updatedList)
            console.log('>>>>>>>>>', interviewList)
        })
        .catch((err) => console.log(err))
    }
    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Tabs value={interviewStatus} onChange={handleChange} centered>
                <Tab label="Upcoming" value="accept" />
                <Tab label="Past"  value="past" />
            </Tabs>
                {interviewList.length !==0 ?
                    interviewList.map((interview) => 
                    <div style={{padding:10, display: "flex",
                        justifyContent: "center"}}>
                        <Interview interview={interview} handleDelete={handleDelete} getUser={getUser} />
                    </div>
                    )
                    :<Typography variant='h6'>None Available</Typography>
                }
            {/* <InterViews interviewStatus={interviewStatus} /> */}
        </Box>
    )
}

export default InterviewList