import React, {useEffect, useState} from 'react'
import { Button, Grid, Stack, TextField,Autocomplete } from '@mui/material';
import {Link } from 'react-router-dom';

const axios = require("axios").default;

const EditSchedule = ({id, dateOfInterview, participantList, interviewStartTime, interviewEndTime}) => {
    const [participants, setParticipants] = useState(participantList)
    const [interviewDate, setInterviewDate] = useState(dateOfInterview);
    const [startTime, setStartTime] = useState(interviewStartTime);
    const[endTime, setEndTime] = useState(interviewEndTime);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        axios
          .get(`http://127.0.0.1:8000/api/scheduler/user/`)
          .then((res) => setUserList(res.data))
          .catch((err) => console.log(err, "fetching partsList"));
      }, []);
    
    //   useEffect(() => {
    //     let day = interviewDate;
    //     let part_lst = participants.map((participant) => participant.id);
    //     if (day !== undefined && part_lst !== undefined && part_lst.length > 1) {
    //       axios
    //         .get(
    //           `http://127.0.0.1:8000/api/scheduler/interview/available_slots/?day=${day}&participants=${part_lst}`
    //         )
    //         .then((res) => {
    //           setTimeSlots(res.data);
    //         })
    //         .catch((error) => console.log(error, "fetching timeSlots"));
    //     }
    //     else if(part_lst.length < 2){
    //       setTimeSlots([])
    //     }
    //   }, [interviewDate, participants]);
    
    //   const handleDateChange = (newValue) => {
    //     console.log(newValue, typeof(newValue));
    //     console.log(newValue.format('YYYY/MM/DD'))
    //     setInterviewDate(newValue);
    //   };
      const handleParticipantsChange = (event, newValue) => {
        // console.log(newValue);
        setParticipants(newValue);
      };
    
      const handleSchdeuleInterview = (e) =>{
        let part_lst = participants.map((participant) => participant.id);
        e.preventDefault()
        if(!interviewDate){
          alert('select proper date');
          return
        }
        else if(!startTime){
          alert('select proper start time');
          return
        }
        else if(!endTime){
          alert('select proper end time');
          return
        }
        else if(startTime > endTime){
          alert('start time should be lesser than end time')
        }
        else if(!part_lst | part_lst.length <= 1){
          alert('minimum 2 participants required to schedule the meet');
          return
        }
        else{
        axios.put(`http://127.0.0.1:8000/api/scheduler/interview/${id}/`, {
          participants: part_lst,
          day: interviewDate,
          start_time: startTime,
          end_time: endTime,
          description: "",
          status: "pending"
        })
        .then(() => {
          alert("Meet Successfully Created")
          window.location = '/view-schedule';
        })
        .catch(function (error) {
          console.log(error, "offo error");
        });
      }
      }
  return (
    <Grid container spacing={2}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
        <Stack spacing={3}>
        Interview Date
        <br></br>
        <TextField 
            id="outlined-basic"  
            type="date" variant="outlined" value={interviewDate}
            onChange={(e)=> setInterviewDate(e.target.value)}
        />
        <br></br>
        participants
        <Autocomplete
                multiple
                id="tags-outlined"
                options={userList}
                getOptionLabel={(option) => option.id}
                // defaultValue={}
                filterSelectedOptions
                value={participants}
                onChange={handleParticipantsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="participants"
                    placeholder="participant"
                  />
                )}
              />
              <br></br>
            start time
        <TextField 
            id="outlined-basic" 
            type="time" variant="outlined" value={startTime}
            onChange={(e)=> setStartTime(e.target.value)}
        />
        <br></br>
        end time
        <TextField 
            id="outlined-basic" 
            type="time" variant="outlined" value={endTime}
            onChange={(e)=> setEndTime(e.target.value)}
        />

        <Button color="primary" variant="contained" onClick={handleSchdeuleInterview}>
                Schedule Interview
        </Button>
        </Stack>
        </Grid>
        <Grid item xs={4}></Grid>
    </Grid>
  )
}

export default EditSchedule