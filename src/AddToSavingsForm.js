import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";

const AddToSavingsForm = ({ onAddToSavings, onSubtractFromSavings }) => {
  const [amount, setAmount] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (amount > 0) {
      onAddToSavings(amount);
      setAmount(""); // Reset the input field
    }
  };

  const handleSubtract = (e) => {
    e.preventDefault();
    if (amount > 0) {
      onSubtractFromSavings(amount);
      setAmount(""); // Reset the input field
    }
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
    >
      <TextField
        label="Enter Amount ($)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        fullWidth
        sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
      />

      <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          fullWidth
          sx={{ height: 50, fontSize: { xs: "1rem", sm: "1.125rem" } }}
        >
          Add to Savings
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubtract}
          fullWidth
          sx={{ height: 50, fontSize: { xs: "1rem", sm: "1.125rem" } }}
        >
          Subtract from Savings
        </Button>
      </Box>
    </Box>
  );
};

export default AddToSavingsForm;
