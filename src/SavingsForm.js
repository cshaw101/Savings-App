import React, { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";

const buttonStyles = {
  height: 50,
  borderRadius: 8,
  fontWeight: 600,
  fontSize: { xs: "1rem", sm: "1.125rem" },
};

const SavingsForm = ({ onFormSubmit }) => {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [savedAmount, setSavedAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(name, goal, dueDate, savedAmount);
    setName("");
    setGoal("");
    setDueDate("");
    setSavedAmount("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Create New Savings Goal
      </Typography>

      <TextField
        label="Savings Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <TextField
        label="Savings Goal ($)"
        type="number"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        required
      />

      <TextField
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
      />

      <TextField
        label="Amount Saved So Far ($)"
        type="number"
        value={savedAmount}
        onChange={(e) => setSavedAmount(e.target.value)}
        required
      />

      <Button type="submit" variant="contained" color="primary" sx={buttonStyles}>
        Create Savings Goal
      </Button>
    </Box>
  );
};

export default SavingsForm;
