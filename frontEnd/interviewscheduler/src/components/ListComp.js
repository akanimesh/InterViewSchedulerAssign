import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

export const ListComp = ({ timeSlots }) => {
  console.log(">>>",timeSlots);
  return (
    <div>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Availabe Time Slots
        </Typography>
      <List>
        
        {timeSlots.map((timeSlot) => {
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary={`${timeSlot.start_time}--${timeSlot.end_time}`}
              />
            </ListItemButton>
          </ListItem>;
        })}

      </List>
    </div>
  );
};
