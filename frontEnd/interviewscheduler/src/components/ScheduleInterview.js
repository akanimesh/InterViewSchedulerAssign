import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Box, Paper, Grid, Button, Chip, Autocomplete } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import {Link } from 'react-router-dom';

const axios = require("axios").default;


export default function ScheduleInterview({ dateOfInterview, participantList, interviewStartTime, interviewEndTime }) {
  const [interviewDate, setInterviewDate] = React.useState(dateOfInterview);
  const [participants, setParticipants] = useState(participantList);
  const [userList, setUserList] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState(interviewStartTime);
  const [endTime, setEndTime] = useState(interviewEndTime);

  
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/scheduler/user/`)
      .then((res) => setUserList(res.data))
      .catch((err) => console.log(err, "fetching partsList"));
  }, []);

  useEffect(() => {
    let day = interviewDate;
    let part_lst = participants.map((participant) => participant.id);
    if (day !== undefined && part_lst !== undefined && part_lst.length > 1) {
      axios
        .get(
          `http://127.0.0.1:8000/api/scheduler/interview/available_slots/?day=${day}&participants=${part_lst}`
        )
        .then((res) => {
          setTimeSlots(res.data);
        })
        .catch((error) => console.log(error, "fetching timeSlots"));
    }
    else if(part_lst.length < 2){
      setTimeSlots([])
    }
  }, [interviewDate, participants]);

  const handleDateChange = (newValue) => {
    console.log(newValue, typeof(newValue));
    console.log(newValue.format('YYYY/MM/DD'))
    setInterviewDate(newValue);
  };
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
    axios.post('http://127.0.0.1:8000/api/scheduler/interview/', {
      participants: part_lst,
      day: interviewDate.format('YYYY-MM-DD'),
      start_time: startTime.format('HH:mm:DD'),
      end_time: endTime.format('HH:mm:DD'),
      description: "",
      status: "pending"
    })
    .then(function (response) {
      alert("Meet Successfully Created")
      // window.location = '/view-schedule';
    })
    .catch(function (error) {
      if(error.response.data.errors) alert(error.response.data.errors)
      console.log(error,error.response.data.errors, "offo error");
    });
  }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
              <DesktopDatePicker
                label="Date of the interview"
                inputFormat="YYYY/MM/DD"
                value={interviewDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <Autocomplete
                multiple
                id="tags-outlined"
                options={userList}
                getOptionLabel={(option) => option.username}
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
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)
                }
                renderInput={(params) => <TextField {...params} />}
              />
              <Button color="primary" variant="contained" onClick={handleSchdeuleInterview}>
                Schedule Interview
              </Button>
            </Stack>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={2}>
          <div>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Availabe Time Slots
            </Typography>
            <List>  
              {timeSlots.length != 0 ? (
                timeSlots.map((timeSlot) => <ListItem key={timeSlot.index} disablePadding>
                    <ListItemButton>
                      <ListItemText
                        primary={`${timeSlot.start_time}--${timeSlot.end_time}`}
                      />
                    </ListItemButton>
                  </ListItem>
                )
              ) : (
                <h1>NONE</h1>
              )}
            </List>
          </div>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </Box>
  );
}

ScheduleInterview.defaultProps = {
  participantList: [],
  dateOfInterview: '',
  interviewStartTime: '',
  interviewEndTime: '',
}