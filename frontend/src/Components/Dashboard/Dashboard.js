import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Box,
  CircularProgress,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  TextField,
  Button,
} from "@mui/material";
import { useAlert } from "react-alert";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const AdminDashboard = () => {
  const [availability, setAvailability] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const alert = useAlert();

  useEffect(() => {
    const fetchAvailability = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get("/api/v1/getAvailability", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAvailability(response.data.availabilities);
        if (response.data.availabilities.length > 0) {
          setSelectedUser(response.data.availabilities[0]);
        }
      } catch (err) {
        setError("Failed to fetch data");
        alert.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [alert]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot("");

    if (selectedUser && date) {
      const dayOfWeek = date.day();
      const userSlots = selectedUser.scheduledSlots[dayOfWeek];

      if (userSlots) {
        const splitSlots = splitSlotsByDuration(userSlots, selectedUser.duration);
        setAvailableSlots(splitSlots);
      } else {
        setAvailableSlots([]);
      }
    }
  };

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };

  const splitSlotsByDuration = (slots, duration) => {
    const slotParts = [];

    slots.forEach((slot) => {
      const [startTimeStr, endTimeStr] = slot.split(" - ");
      const startTime = dayjs.utc(startTimeStr, "hh:mm A");
      let endTime = dayjs.utc(endTimeStr, "hh:mm A");

      if (endTime.isBefore(startTime)) {
        endTime = endTime.add(1, "day");
      }

      let currentTime = startTime;

      while (currentTime.isBefore(endTime)) {
        const nextTime = currentTime.add(duration, "minute");
        if (nextTime.isAfter(endTime)) break;

        const slotTime = `${currentTime.local().format("hh:mm A")} - ${nextTime
          .local()
          .format("hh:mm A")}`;
        slotParts.push(slotTime);

        currentTime = nextTime;
      }
    });

    return slotParts;
  };

  const handleSchedule = async () => {
    if (!selectedUser || !selectedDate || !selectedSlot) {
      alert.error("Please select a user, date, and time slot.");
      return;
    }

    const scheduleData = {
      userId: selectedUser.userId._id,
      userEmail: selectedUser.userId.email,
      date: selectedDate.format("YYYY-MM-DD"),
      timeSlot: selectedSlot,
    };

    try {
      const response = await axios.post("/api/v1/schedule", scheduleData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.status === 200) {
        alert.success("Schedule successfully created!");
      } else {
        alert.error("Failed to schedule.");
      }
    } catch (err) {
      alert.error("An error occurred while scheduling.");
    }
  };

  const isDateWithinAvailability = (date) => {
    if (!selectedUser) return false;

    const start = dayjs(selectedUser.startDate);
    const end = dayjs(selectedUser.endDate);

    const dayOfWeek = date.day();

    return (
      date.isBetween(start, end, null, "[]") &&
      selectedUser.scheduledSlots.hasOwnProperty(dayOfWeek)
    );
  };

  if (loading) {
    return (
      <Container maxWidth={false} disableGutters>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          padding={2}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} disableGutters>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          padding={2}
        >
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Box display="flex" height="100vh" bgcolor="background.default" padding={2}>
        {/* Sidebar */}
        <Box
          width="250px"
          padding="1rem"
          bgcolor="background.paper"
          borderRight="1px solid #ddd"
          boxShadow={2}
          borderRadius={2}
        >
          <Typography variant="h6" gutterBottom>
            All Users
          </Typography>
          <Divider />
          <List>
            {availability.length > 0 ? (
              availability.map((user) => (
                <ListItem
                  button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  selected={selectedUser?._id === user._id}
                >
                  <ListItemText primary={user.userId.name} />
                </ListItem>
              ))
            ) : (
              <Typography>No Users Yet</Typography>
            )}
          </List>
        </Box>

        {/* Main Content */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          padding="2rem"
          bgcolor="background.paper"
          borderRadius={2}
          boxShadow={2}
        >
          <Typography variant="h6" gutterBottom>
            User Details
          </Typography>
          {selectedUser ? (
            <Box width="100%" textAlign="center">
              <Typography variant="h6">{selectedUser.userId.name}</Typography>
              <Typography>Email: {selectedUser.userId.email}</Typography>
              <Typography>
                Start Date: {dayjs(selectedUser.startDate).format("DD/MM/YYYY")}
              </Typography>
              <Typography>
                End Date: {dayjs(selectedUser.endDate).format("DD/MM/YYYY")}
              </Typography>
              <Typography>Duration: {selectedUser.duration} minutes</Typography>

              {selectedDate && availableSlots.length > 0 && (
                <Box mt={2}>
                  <FormLabel component="legend">Available Slots</FormLabel>
                  <RadioGroup value={selectedSlot} onChange={handleSlotChange}>
                    {availableSlots.map((slot, index) => (
                      <FormControlLabel
                        key={index}
                        value={slot}
                        control={<Radio />}
                        label={slot}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              )}

              {selectedDate && selectedSlot && (
                <Box mt={2}>
                  <Typography variant="body1">
                    Selected Date: {selectedDate.format("DD/MM/YYYY")}
                  </Typography>
                  <Typography variant="body1">Selected Slot: {selectedSlot}</Typography>
                </Box>
              )}

              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSchedule}
                  disabled={!selectedSlot}
                >
                  Schedule
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography>Select a user to view details.</Typography>
          )}
        </Box>

        {/* DatePicker */}
        <Box
          width="250px"
          padding="1rem"
          bgcolor="background.paper"
          boxShadow={2}
          borderRadius={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              shouldDisableDate={(date) => !isDateWithinAvailability(date)}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
