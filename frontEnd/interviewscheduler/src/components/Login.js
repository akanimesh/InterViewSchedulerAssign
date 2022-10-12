import React, {useEffect, useState} from 'react'
import { Button, Grid, Stack, TextField } from '@mui/material';
import {Link } from 'react-router-dom';
const axios = require("axios").default;

const Login = ({ setUser }) => {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const handleLogin = () => {
        axios.post(
          'http://127.0.0.1:8000/api/scheduler/login/',{
            username:userName,
            password:password
          }
        )
        .then((res) => {
            const myUser = {
                "is_admin":res.data.is_admin,
                "username":res.data.username
            }
            setUser(myUser);
            localStorage.setItem('user',JSON.stringify(myUser));
    })
        .catch((err) => console.log(err))

        setUserName("")
        setPassword("")

    }
  return (
    <Grid container spacing={2}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
        <Stack spacing={3}>
        <TextField 
            id="outlined-basic" label="Username" 
            type="text" variant="outlined" value={userName}
            onChange={(e)=> setUserName(e.target.value)}
        />
        <TextField 
            id="outlined-basic" label="Password" 
            type="password" variant="outlined" value={password}
            onChange={(e)=> setPassword(e.target.value)}
        />
        <Link to="/view-schedule">
        <Button color="primary" variant="contained" onClick={handleLogin}>
            Login
        </Button>
        </Link>
        </Stack>
        </Grid>
        <Grid item xs={4}></Grid>
    </Grid>
  )
}

export default Login