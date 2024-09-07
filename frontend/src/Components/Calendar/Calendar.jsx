import React, { useState, useEffect } from 'react';
import { Button, Box, Container, Typography, Grid, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
import { useSelector, useDispatch } from "react-redux";
import Week from './week.js';
import dayjs from 'dayjs'; 
import axios from 'axios'; 

function Calendar() {
  const [selectedDayTimeUtc, setSelectedDayTimeUtc] = useState({});
  const [startDate, setStartDate] = useState(null); 
  const [endDate, setEndDate] = useState(null); 
  const [duration, setDuration] = useState(''); // Duration state

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); 
  const loading = useSelector((state) => state.user.loading); 

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Token on page load:", token);
  }, []);

  useEffect(() => {
    if (!user) {
      console.log('user', user);
    }
  }, [user]);

  // Function to save the selected dates and duration in UTC
  const handleSave = () => {
    if (startDate && endDate && duration) {
      const startUtc = dayjs(startDate).utc().toISOString(); // Convert to UTC
      const endUtc = dayjs(endDate).utc().toISOString(); // Convert to UTC
  
      console.log("Duration (minutes):", duration);
      console.log('Selected schedule:', selectedDayTimeUtc);
  
      const availabilityObj = {
        startDate: startUtc,
        endDate: endUtc,
        duration, 
        scheduledSlots: selectedDayTimeUtc
      };
  
      const token = localStorage.getItem("authToken"); // Retrieve token
  
      // Make the POST request to save the availability
      axios.post(
        '/api/v1/availability',
        availabilityObj,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            'Content-Type': 'application/json', // Set content type
          },
        }
      )
      .then((response) => {
        console.log('Availability data successfully saved:', response.data);
        // Optionally, handle success (e.g., show a success message or redirect)
      })
      .catch((error) => {
        console.error('Error saving availability data:', error.response);
        // Optionally, handle error (e.g., show an error message)
      });
  
    } else {
      console.error("Please select both start, end dates, and enter duration.");
    }
  };
  return (
    <div>
      <Container maxWidth="lg" px={4} py={3}>
        <Box mt={2} px={4} py={5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box className="available-box">
                <Week
                  selectedDayTimeUtc={selectedDayTimeUtc}
                  setSelectedDayTimeUtc={setSelectedDayTimeUtc}
                  // handleSaveSchedule={() => console.log("Saving Schedule")}
                />
              </Box>
            </Grid>
            <Grid item xs={5} md={4}>
              <Box className="available-box">
                <Box px={4} py={3}>
                  <Typography
                    component="legend"
                    style={{
                      marginBottom: 20,
                      color: 'black',
                      fontFamily: 'Roboto',
                      fontWeight: 'bold',
                    }}
                  >
                    Select Dates and Duration for the Interview
                  </Typography>
                  <Typography
                    component="legend"
                    style={{
                      marginBottom: 20,
                      color: 'black',
                      paddingTop: 0,
                      fontFamily: 'Roboto',
                    }}
                  >
                    Set the interview duration and dates when you are available.
                  </Typography>

                  {/* Input for Duration */}
                  <TextField
                    label="Duration (minutes)"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    fullWidth
                    style={{ marginBottom: '16px' }}
                  />

                  {/* Wrapping DatePicker inside LocalizationProvider */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
                      renderInput={(params) => <TextField {...params} fullWidth style={{ marginTop: '16px' }} />}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box textAlign="right">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSave()}
              style={{ textTransform: 'none' }}
            >
              Save Schedule
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Calendar;
