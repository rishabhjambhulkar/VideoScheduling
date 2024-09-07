const Availability = require("../models/Availability");
const Schedule = require("../models/schedule");





exports.saveAvailability = async (req, res) => {
  console.log(req.body);
  // console.log(req.user);

  try {
    const { startDate, endDate, duration, scheduledSlots } = req.body;

    if (!startDate || !endDate || !duration) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Find existing availability for the user
    let availability = await Availability.findOne({ userId: req.user.id });

    if (availability) {
      // Update existing availability record
      availability.startDate = startDate;
      availability.endDate = endDate;
      availability.duration = duration;
      availability.scheduledSlots = scheduledSlots;
    } else {
      // Create a new availability record
      availability = new Availability({
        userId: req.user._id,
        startDate,
        endDate,
        duration,
        scheduledSlots
      });
    }

    // Save the availability record
    await availability.save();

    // Send success response
    res.status(200).json({ message: 'Availability data successfully saved.', availability });
  } catch (error) {
    console.error('Error saving availability data:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


exports.getAllAvailabilities = async (req, res) => {
  try {
    // Fetch all availability records and populate the 'userId' field with user data (e.g., name, email)
    const availabilities = await Availability.find()
      .populate('userId', 'name email'); // Assuming your User model has 'name' and 'email' fields

    // Log the availability data with user information for debugging
    console.log('All Availabilities with User Data:', availabilities);

    // Send the response with all availabilities and populated user data
    res.status(200).json({ availabilities });
  } catch (error) {
    console.error('Error fetching availability records:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};






exports.saveSchedule = async (req, res) => {
  try {
    const { userId, userEmail, date, timeSlot } = req.body;

    // Validate the input data
    if (!userId || !userEmail || !date || !timeSlot) {
      return res.status(400).json({ message: "Missing required fields" });
    }

  

    // Check if a schedule already exists for this user on the same date and time slot
    const existingSchedule = await Schedule.findOne({ userId, date, timeSlot });
    if (existingSchedule) {
      return res.status(409).json({ message: "Schedule already exists for this time slot" });
    }

    // Create a new schedule
    const newSchedule = new Schedule({
      userId,
      userEmail,
      date,
      timeSlot,
    });

    // Save the schedule to the database
    await newSchedule.save();

    return res.status(201).json({
      message: "Schedule successfully created",
      schedule: newSchedule,
    });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// Get All Bookings Controller
exports.getAllBookings = async (req, res) => {
  try {
    // Fetch all schedules (bookings) from the database
    const bookings = await Schedule.find().populate("userId", "name email");

    // Send the response with all bookings
    res.status(200).json({
      message: "All bookings retrieved successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      message: "Server error while fetching bookings",
    });
  }
};