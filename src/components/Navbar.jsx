import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMoralis } from 'react-moralis';
import { Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import SearchBar from './SearchBar';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { authenticate, isAuthenticated, enableWeb3, logout } = useMoralis();
  console.log(useMoralis());

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    enableWeb3();
  }, [isAuthenticated]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 2,
        pt: 1,
        borderBottom: '1px solid #e3e3e3',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'white',
        gap: '10',
        width: '100%',
        zIndex: 100,
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Typography sx={{ fontSize: 25, color: 'red', fontWeight: 800 }}>
          D📺live
        </Typography>
      </Link>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10',
        }}
      >
        {isAuthenticated ? (
          <Link
            to="/upload"
            style={{ display: 'flex', textDecoration: 'none' }}
          >
            <Button
              sx={{ mr: 2 }}
              variant="outlined"
              startIcon={<UploadIcon />}
              onMouseEnter={(event) => {
                setAnchorEl(event.currentTarget);
              }}
            >
              Upload
            </Button>
          </Link>
        ) : (
          <Button
            sx={{ mr: 2 }}
            variant="outlined"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={authenticate}
          >
            Connect to wallet
          </Button>
        )}
        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => {
            setAnchorEl(null);
          }}
        >
          <MenuItem
            onClick={() => {
              logout();
              setAnchorEl(null);
            }}
          >
            Logout
          </MenuItem>
        </Menu>
        <SearchBar />
      </Box>
    </Box>
  );
};

export default Navbar;
