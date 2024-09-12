import React, { useState } from "react";
import { Box, Typography, LinearProgress, TextField, Button, Collapse } from "@mui/material";

const isExcludedDate = (date, nonWorkingDates) => {
  const formattedDate = date.toISOString().split('T')[0];
  return nonWorkingDates.includes(formattedDate);
};

const calculateEffectiveDaysLeft = (dueDate, nonWorkingDates) => {
  const today = new Date();
  const dueDateObj = new Date(dueDate);
  let effectiveDaysLeft = 0;

  for (let d = new Date(today); d <= dueDateObj; d.setDate(d.getDate() + 1)) {
    if (!isExcludedDate(d, nonWorkingDates)) {
      effectiveDaysLeft++;
    }
  }

  return effectiveDaysLeft;
};

const SavingsInfo = ({ goal, dueDate, savedAmount }) => {
  const [nonWorkingDates, setNonWorkingDates] = useState([]);
  const [newNonWorkingDate, setNewNonWorkingDate] = useState("");
  const [showNonWorkingDates, setShowNonWorkingDates] = useState(false);

  const handleAddNonWorkingDate = () => {
    if (newNonWorkingDate && !nonWorkingDates.includes(newNonWorkingDate)) {
      setNonWorkingDates([...nonWorkingDates, newNonWorkingDate]);
      setNewNonWorkingDate("");
    }
  };

  const handleRemoveNonWorkingDate = (date) => {
    setNonWorkingDates(nonWorkingDates.filter(d => d !== date));
  };

  // Convert goal and savedAmount to numbers
  const goalAmount = parseFloat(goal);
  const savedAmountFloat = parseFloat(savedAmount);

  // Calculate progress percentage
  const progress = (savedAmountFloat / goalAmount) * 100;
  const progressValue = Math.min(Math.max(progress, 0), 100);

  // Calculate days left until the due date
  const today = new Date();
  const dueDateObj = new Date(dueDate);
  const timeDiff = dueDateObj - today;
  const totalDaysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // Calculate effective days left excluding non-working dates
  const effectiveDaysLeft = calculateEffectiveDaysLeft(dueDate, nonWorkingDates);
  
  // Calculate daily savings needed
  const remainingAmount = Math.max(goalAmount - savedAmountFloat, 0);
  const dailySavingsNeeded = effectiveDaysLeft > 0 ? (remainingAmount / effectiveDaysLeft).toFixed(2) : 0;

  // Determine progress bar color based on the conditions
  let progressColor = 'primary'; // default to blue
  if (totalDaysLeft <= 7 && progressValue < 70) {
    progressColor = 'warning'; // yellow
  }
  if (totalDaysLeft <= 3 && progressValue < 70) {
    progressColor = 'error'; // red
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      <Typography variant="h5">Savings Goal</Typography>

      <Typography variant="body1">
        <strong>Due Date:</strong> {dueDate}
      </Typography>

      <Typography variant="body1">
        <strong>Goal:</strong> ${goalAmount}
      </Typography>

      <Typography variant="body1">
        <strong>Saved Amount:</strong> ${savedAmountFloat}
      </Typography>

      <Typography variant="body1">
        <strong>Days Left:</strong> {totalDaysLeft} days (excluding non-working dates: {effectiveDaysLeft})
      </Typography>

      <Typography variant="body1">
        <strong>Daily Savings Needed:</strong> ${dailySavingsNeeded}
      </Typography>

      {/* Exclude Days Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowNonWorkingDates(!showNonWorkingDates)}
      >
        {showNonWorkingDates ? 'Hide Excluded Days' : 'Exclude Days'}
      </Button>

      {/* Non-Working Dates Input */}
      <Collapse in={showNonWorkingDates}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>Add Non-Working Dates:</Typography>
          <TextField
            label="Non-Working Date (YYYY-MM-DD)"
            type="date"
            value={newNonWorkingDate}
            onChange={(e) => setNewNonWorkingDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNonWorkingDate}
            sx={{ mt: 1 }}
          >
            Add
          </Button>
          {/* Non-Working Dates List */}
          {nonWorkingDates.length > 2 && (
            <Box sx={{ mt: 2 }} className="scrollable-section">
              <Typography variant="body1" sx={{ mb: 1 }}>Non-Working Dates:</Typography>
              {nonWorkingDates.map(date => (
                <Box key={date} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>{date}</Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveNonWorkingDate(date)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          )}
          {nonWorkingDates.length <= 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>Non-Working Dates:</Typography>
              {nonWorkingDates.map(date => (
                <Box key={date} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>{date}</Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRemoveNonWorkingDate(date)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Collapse>

      {/* Progress Bar */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {`$${savedAmountFloat} / $${goalAmount}`}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{ height: 8, borderRadius: 5, width: '33%' }}  // Adjust width as needed
          color={progressColor}
        />
      </Box>
    </Box>
  );
};

export default SavingsInfo;
