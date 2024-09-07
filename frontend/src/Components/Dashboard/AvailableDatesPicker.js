import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Grid, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

const AvailableDatesPicker = ({ availabilityData }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");

  const availableDates = [];
  const timeSlots = {};

  // Extract available dates and time slots
  availabilityData.forEach(item => {
    const { startDate, endDate, scheduledSlots } = item;
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    for (let date = start; date.isSameOrBefore(end); date = date.add(1, 'day')) {
      availableDates.push(date.format('YYYY-MM-DD'));
    }

    for (const [day, slots] of Object.entries(scheduledSlots)) {
      if (!timeSlots[day]) timeSlots[day] = [];
      timeSlots[day].push(...slots);
    }
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DatePicker
            renderInput={(params) => <TextField {...params} />}
            value={selectedDate}
            onChange={handleDateChange}
            shouldDisableDate={(date) => !availableDates.includes(dayjs(date).format('YYYY-MM-DD'))}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RadioGroup value={selectedSlot} onChange={handleSlotChange}>
            {Object.keys(timeSlots).map(day => (
              <div key={day}>
                <h3>{`Day ${day}`}</h3>
                {timeSlots[day].map((slot, index) => (
                  <FormControlLabel
                    key={index}
                    control={<Radio />}
                    label={slot}
                    value={slot}
                  />
                ))}
              </div>
            ))}
          </RadioGroup>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default AvailableDatesPicker;
