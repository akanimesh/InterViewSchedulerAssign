import React, { useEffect, useState } from 'react'
import dayjs from "dayjs";
import {Link } from 'react-router-dom';
import {Box, Card, CardContent, CardActions, Typography, Button} from "@mui/material"
import ScheduleInterview from './ScheduleInterview';
import EditSchedule from './EditSchedule';
import axios from 'axios';
const Interview = ({ interview, handleDelete }) => {
  const [participantsList,setParticipantsList]=useState([]);
  // useEffect(()=>{
    // const participants = interview.participants;
    // setParticipantsList(participants);

    useEffect(()=>{
      axios
        .get(`http://127.0.0.1:8000/api/scheduler/interview/${interview.id}/get_all_participants/`)
        .then((res) => setParticipantsList(res.data))
        .catch((err)=>console.log(err))
    })


  //   const getAllParticipants = (id)=>{
  //     let participant_lst = []
  //     participants.map(){
  //       axios
  //       .get(`http://127.0.0.1:8000/api/scheduler/interview/${interview.id}/get_all_participants/`)
  //       .then((res) => participant_lst.push(res.data.username))
  //       .catch((error) => console.log(error));
  //     }
  //     return participant_lst;
  // }
  // const participantsList = getAllParticipants(interview.id);

  // },[interview])
  return (
    <Card sx={{width:1}} >
        <CardContent>
            <Typography variant='h6'>Meeting Id: {interview.id}</Typography>
            <Typography variant='h6'>Meeting Date: {interview.day}</Typography>
            <Typography variant='h6'>Start Time: {interview.start_time} End Time: {interview.end_time}</Typography>
            
            <Typography variant='h6'>Meeting Id:{participantsList.map((part) =><div>{part.username}</div>)}
            </Typography> 
        </CardContent>
        <CardActions>
        {/* <Link to="/edit-schedule">
        <Button size="small" >Edit</Button>
        </Link> */}
        <Button size="small" onClick={() => handleDelete(interview.id)}>Delete</Button>
        
      </CardActions>
    </Card>
  )
}

export default Interview