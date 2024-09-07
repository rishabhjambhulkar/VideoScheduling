import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Card } from "@mui/material";
import Loader from "../Loader/Loader";
import { useAlert } from "react-alert";
import "./Home.css";
import { useSelector } from "react-redux";

const Home = () => {
  // State for bookings, loading, and error handling
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const alert = useAlert();

  const { user } = useSelector((state) => state.user); // Extract user data from Redux state

  useEffect(() => {
    // Fetch upcoming bookings from the server
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get("/api/v1/getBookings"); // Fetch all bookings
        if (user.role === 'user') {
          // Filter bookings for the current user
          const filteredBookings = data.bookings.filter(
            (booking) => booking.userId._id === user._id
          );
          setBookings(filteredBookings);
        } else {
          // Show all bookings for admin
          setBookings(data.bookings);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
        setLoading(false);
        alert.error("Failed to fetch bookings.");
      }
    };

    fetchBookings();
  }, [user, alert]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className="home">
      <div className="homeright">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking._id} style={{ margin: "10px", padding: "10px" }}>
              <Typography variant="h6">Booking with {booking.userId.name}</Typography>
              <Typography variant="body1">Email: {booking.userEmail}</Typography>
              <Typography variant="body1">Date: {new Date(booking.date).toLocaleDateString()}</Typography>
              <Typography variant="body1">Time Slot: {booking.timeSlot}</Typography>
              <Typography variant="body2" color="textSecondary">
                Created At: {new Date(booking.createdAt).toLocaleDateString()}
              </Typography>
            </Card>
          ))
        ) : (
          <Typography>No Upcoming Bookings</Typography>
        )}
      </div>
    </div>
  );
};

export default Home;
