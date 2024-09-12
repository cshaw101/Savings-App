import React, { useState, useEffect } from "react";
import SavingsForm from "./SavingsForm";
import SavingsInfo from "./SavingsInfo";
import AddToSavingsForm from "./AddToSavingsForm";
import BottomBar from "./BottomBar";
import { useMediaQuery } from "@mui/material"; // Import useMediaQuery hook
import './index.css'
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Drawer,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  const [savingsList, setSavingsList] = useState(null);
  const [currentSaving, setCurrentSaving] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("success");

  // Use the useMediaQuery hook to detect if the screen width is below 600px (mobile size)
  const isMobile = useMediaQuery("(max-width:600px)");

  // Load savings from localStorage on component mount
  useEffect(() => {
    const storedSavings = localStorage.getItem("savingsList");
    if (storedSavings) {
      setSavingsList(JSON.parse(storedSavings));
    } else {
      setSavingsList([]); // If nothing is in localStorage, initialize with an empty array
    }
  }, []);

  // Update localStorage whenever savingsList changes
  useEffect(() => {
    if (savingsList !== null) {
      localStorage.setItem("savingsList", JSON.stringify(savingsList));
    }
  }, [savingsList]);

  const handleFormSubmit = (name, goalAmount, goalDueDate, savedAmount) => {
    const isDuplicate = savingsList.some((saving) => saving.name === name);

    if (isDuplicate) {
      setNotificationMessage(`A saving with the name "${name}" already exists!`);
      setNotificationSeverity("error");
      setNotificationOpen(true);
      return;
    }

    const newSaving = {
      name,
      goal: goalAmount,
      dueDate: goalDueDate,
      savedAmount,
    };
    setSavingsList([...savingsList, newSaving]);
    setNotificationMessage(`${name} successfully created!`);
    setNotificationSeverity("success");
    setNotificationOpen(true);
  };

  const handleAddToSavings = (amount) => {
    const updatedSaving = {
      ...currentSaving,
      savedAmount: parseFloat(currentSaving.savedAmount) + parseFloat(amount),
    };

    const updatedSavingsList = savingsList.map((saving) =>
      saving.name === currentSaving.name ? updatedSaving : saving
    );

    setSavingsList(updatedSavingsList);
    setCurrentSaving(updatedSaving);
    setNotificationMessage("Great Job! Keep it up!");
    setNotificationSeverity("success");
    setNotificationOpen(true);
  };

  const handleSubtractFromSavings = (amount) => {
    const updatedSaving = {
      ...currentSaving,
      savedAmount: Math.max(0, parseFloat(currentSaving.savedAmount) - parseFloat(amount)),
    };

    const updatedSavingsList = savingsList.map((saving) =>
      saving.name === currentSaving.name ? updatedSaving : saving
    );

    setSavingsList(updatedSavingsList);
    setCurrentSaving(updatedSaving);
    setNotificationMessage("Hope to See you Again!");
    setNotificationSeverity("info");
    setNotificationOpen(true);
  };

  const handleDeleteSavings = (name) => {
    const updatedSavingsList = savingsList.filter((saving) => saving.name !== name);
    setSavingsList(updatedSavingsList);
    setCurrentSaving(null);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  const calculateProgress = (goal, savedAmount) => {
    const goalAmount = parseFloat(goal);
    const savedAmountFloat = parseFloat(savedAmount);
    const progress = (savedAmountFloat / goalAmount) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (savingsList === null) {
    // Return a loader or nothing while waiting for localStorage to load
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ padding: 2, paddingBottom: "64px" }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
        >
          Savings Tracker App
        </Typography>

        {currentSaving === null ? (
          <>
            <SavingsForm onFormSubmit={handleFormSubmit} />

            {/* Conditionally render View Savings List button based on whether it's mobile or not */}
            {!isMobile && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={toggleDrawer}
                fullWidth
                sx={{ mt: 2, height: 50 }}
              >
                View Savings List
              </Button>
            )}
          </>
        ) : (
          <>
            <SavingsInfo
              goal={currentSaving.goal}
              dueDate={currentSaving.dueDate}
              savedAmount={currentSaving.savedAmount}
            />

            <AddToSavingsForm
              onAddToSavings={handleAddToSavings}
              onSubtractFromSavings={handleSubtractFromSavings}
            />

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setCurrentSaving(null)}
              fullWidth
              sx={{ mt: 2, height: 50 }}
            >
              Back to Savings List
            </Button>
          </>
        )}
      </Container>

      <BottomBar onAddClick={() => setCurrentSaving(null)} onMenuClick={toggleDrawer} />

      {/* Drawer for mobile menu */}
      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: "100%", padding: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }}
          >
            Savings List
          </Typography>
          <List>
            {savingsList.map((saving, index) => {
              const progressValue = calculateProgress(saving.goal, saving.savedAmount);
              let barColor = "primary";

              if (
                new Date(saving.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
                progressValue < 70
              ) {
                barColor = "warning";
              }

              if (
                new Date(saving.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) &&
                progressValue < 70
              ) {
                barColor = "error";
              }

              return (
                <ListItem
                  button
                  key={index}
                  onClick={() => {
                    setCurrentSaving(saving);
                    setDrawerOpen(false); // Close drawer on selection
                  }}
                  sx={{ padding: 2, alignItems: "center" }}
                >
                  <Box sx={{ flex: 1 }}>
                    <ListItemText
                      primary={saving.name}
                      sx={{ fontSize: { xs: "1.2rem", sm: "1.25rem" } }}
                    />
                    <Box sx={{ width: "100%", mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progressValue}
                        color={barColor}
                        sx={{ height: 10, borderRadius: 5, width: "33%" }}
                      />
                    </Box>
                  </Box>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSavings(saving.name);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        action={
          <Button color="inherit" onClick={handleCloseNotification}>
            Close
          </Button>
        }
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notificationSeverity}
          sx={{ width: "100%" }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
