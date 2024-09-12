import React from "react";
import { BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';

const BottomBar = ({ onAddClick, onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Determine if the screen is mobile-sized

  return (
    <>
      {isMobile && (
        <BottomNavigation
          sx={{ width: '100%', position: 'fixed', bottom: 0, display: { xs: 'flex', sm: 'none' } }}
        >
          <BottomNavigationAction
            label="Add"
            icon={<AddIcon />}
            onClick={onAddClick}
          />
          <BottomNavigationAction
            label="Menu"
            icon={<MenuIcon />}
            onClick={onMenuClick}
          />
        </BottomNavigation>
      )}
    </>
  );
};

export default BottomBar;
