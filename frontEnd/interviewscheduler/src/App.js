import { useState } from "react";
import Header from "./components/Header";
import InterviewList from "./components/InterviewList";
import Login from "./components/Login";
import ScheduleInterview from "./components/ScheduleInterview";
import { BrowserRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom';

function App() {
  const [flag,setFlag]=useState(true)
  
  const [user, setUser] = useState(false)

  const getUser=()=>{
    if(localStorage.getItem('user')){
      const currentUser=JSON.parse(localStorage.getItem('user'));
      console.log(">>",currentUser,typeof(currentUser));
      return currentUser;
    }
    return false
  }

  
  return (
    <Router>
    <div >
        <Header flag={flag} user={user} setFlag={setFlag} setUser={setUser} getUser={getUser}/>
        {/* <Login setUser={setUser} />
        <InterviewList />
        <ScheduleInterview /> */}
      
      <Routes>
        <Route exact path="/" render={() => {
        return (
        getUser() !== false ?
        <Navigate to="/view-schedule" /> :
        <Navigate to="/login" /> 
      )}}
      />
        <Route exact path='/login' element={< Login setUser={setUser}/>}></Route>
        <Route exact path='/schedule' element={< ScheduleInterview />}></Route>
        <Route path='/view-schedule' element={< InterviewList getUser={getUser} user={user}/>}></Route>
        {/* <Route exact path='/edit-schedule' element={<ScheduleInterview />}></Route> */}
      </Routes>
    </div>
    </Router>
  );
}

export default App;
