import React, { useState, useEffect } from "react";
import SavingsForm from "./SavingsForm";
import SavingsInfo from "./SavingsInfo";
import AddToSavingsForm from "./AddToSavingsForm";
import BottomBar from "./BottomBar";
import { useMediaQuery, useTheme } from "@mui/material";
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
  const [savingsList, setSavingsList] = useState([]);
  const [currentSaving, setCurrentSaving] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("success");

  const buttonStyles = {
    height: 50,
    borderRadius: 8,
    fontWeight: 600,
    fontSize: { xs: "1rem", sm: "1.125rem" },
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const storedSavings = localStorage.getItem("savingsList");
    if (storedSavings) {
      setSavingsList(JSON.parse(storedSavings));
    } else {
      setSavingsList([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savingsList", JSON.stringify(savingsList));
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
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ padding: 2, paddingBottom: "64px" }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" }, fontWeight: 500 }}
        >
          Savings Tracker App
        </Typography>

        {currentSaving === null ? (
          <>
            <SavingsForm onFormSubmit={handleFormSubmit} />

            {!isMobile && (
              <Button
                variant="contained"
                color="primary"
                onClick={toggleDrawer}
                fullWidth
                sx={{ mt: 2, height: 50, borderRadius: 8, fontWeight: 600 }}
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
              variant="contained"
              color="secondary"
              onClick={() => setCurrentSaving(null)}
              fullWidth
              sx={{ mt: 2, height: 50, borderRadius: 8, fontWeight: 600 }}
            >
              Back to Savings List
            </Button>
          </>
        )}
      </Container>

      <BottomBar onAddClick={() => setCurrentSaving(null)} onMenuClick={toggleDrawer} />

      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: "100%", padding: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" }, fontWeight: 500 }}
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
                    setDrawerOpen(false);
                  }}
                  sx={{ padding: 2, alignItems: 'center', borderRadius: 8, boxShadow: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <ListItemText
                        primary={saving.name}
                        secondary={`Due: ${new Date(saving.dueDate).toLocaleDateString()}`}
                        sx={{ fontSize: { xs: "1.2rem", sm: "1.25rem" }, fontWeight: 400 }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progressValue}
                          color={barColor}
                          sx={{ height: 6, borderRadius: 4, flexGrow: 1 }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      ${saving.savedAmount} / ${saving.goal}
                    </Typography>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSavings(saving.name);
                      }}
                      sx={{ flexShrink: 0 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

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
