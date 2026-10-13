require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const pregnancyRoutes = require("./routes/pregnancyRoutes");
const childRoutes = require("./routes/childRoutes");
const vaccineScheduleRoutes = require("./routes/vaccineScheduleRoutes");
const healthEducationRoutes = require("./routes/healthEducationRoutes");
const childNutritionRoutes = require("./routes/childNutritionRoutes");
const familyPlanningRoutes = require("./routes/familyPlanningRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "mamacare-connect-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/pregnancies", pregnancyRoutes);
app.use("/api/children", childRoutes);
app.use("/api/vaccine-schedule", vaccineScheduleRoutes);
app.use("/api/health-education", healthEducationRoutes);
app.use("/api/child-nutrition", childNutritionRoutes);
app.use("/api/family-planning", familyPlanningRoutes);
app.use("/api/ai", aiRoutes);

// Future phases plug in here:
// app.use("/api/reminders", require("./routes/reminderRoutes"));
// app.use("/api/clinics", require("./routes/clinicRoutes"));
// app.use("/api/admin", require("./routes/adminRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler - keeps stack traces out of API responses.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MamaCare Connect API running on port ${PORT}`));
