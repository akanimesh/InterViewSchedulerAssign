import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function Header({ flag, user, setFlag, setUser, getUser }) {
  const handleFlag = () =>{
    setFlag(!flag);
  };

  const handleLogout = ()=>{
    if(currentUser){
    localStorage.removeItem('user');
    setUser({});
    }
    window.location = '/login';
  }

  const currentUser = getUser();

  return (
    <Box sx={{ flexGrow: 1 }} mb={2} mt={1}>
      <AppBar position="static" color='transparent'>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <ScheduleIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome {currentUser.username}
          </Typography>
          {user.is_admin && (flag ? 
           <Link to="/schedule">
              <Button color="primary" variant='contained' onClick={handleFlag} >Schedule Interview</Button>
          </Link>
          : <Link to="/view-schedule">
              <Button color="primary" variant='contained' onClick={handleFlag} >Interview List</Button>
          </Link>)}

          {currentUser ?
              <Button color="primary" variant='contained' onClick={handleLogout} >Logout</Button>
              :<Link to="/login">
              <Button color="primary" variant='contained' >Login</Button>
          </Link>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}
