import React, {useState} from "react";

import {
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from "@mui/material";

import { Link } from 'react-router-dom';
import ListIcon from "@mui/icons-material/ListOutlined";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import ItemIcon from '@mui/icons-material/StarBorderOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ImportExcelIcon from '@mui/icons-material/FileUploadOutlined';

// import { makeStyles } from '@material-ui/core';

import { useSelector, useDispatch } from "react-redux";
import { listItemSelector, setListItem } from "../../store/reducers/listitem";
import styles from "./index.module.css";


const drawerWidth = 240;

const MainLayout = (props) => {
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const dispatch = useDispatch();
  const handleListItemClick = (event, index) => {
    dispatch(setListItem(index));
  };

  const { listItem } = useSelector(listItemSelector);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        style={{
          boxShadow: "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 1px 0px rgb(0 0 0 / 12%)",
          backgroundColor: "rgb(102 136 229)",
          color: "#ffffff",
        }}
      >
        <Toolbar>
          <Typography
            style={{ width: "100%", textAlign: "center" }}
            variant="h6"
            noWrap
            component="div"
          >
            CRIDB Web Automator
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <Link to="/" className={styles.link}>
              <ListItem button 
                selected={listItem === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <ListItemIcon className={styles.listItemIcon}><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home"/>
              </ListItem>
            </Link>
            <ListItem button onClick={handleClick}>
              <ListItemIcon className={styles.listItemIcon}><ListIcon /></ListItemIcon>
              <ListItemText primary="Save List" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List>
                <Link to="/save-list/person" className={styles.link}>
                  <ListItem button 
                    sx={{ pl: 4 }}
                    selected={listItem === 1}
                    onClick={(event) => handleListItemClick(event, 1)}
                  >
                      <ListItemIcon className={styles.listItemIcon}><ItemIcon /></ListItemIcon>
                      <ListItemText primary="Person" />
                  </ListItem>
                </Link>
                <Link to="/save-list/place" className={styles.link}>
                  <ListItem button 
                    sx={{ pl: 4 }}
                    selected={listItem === 2}
                    onClick={(event) => handleListItemClick(event, 2)}
                  >
                    <ListItemIcon className={styles.listItemIcon}><ItemIcon /></ListItemIcon>
                    <ListItemText primary="Place" />
                  </ListItem>
                </Link>
                <Link to="/save-list/artefact" className={styles.link}>
                  <ListItem button 
                    sx={{ pl: 4 }}
                    selected={listItem === 3}
                    onClick={(event) => handleListItemClick(event, 3)}
                  >
                    <ListItemIcon className={styles.listItemIcon}><ItemIcon /></ListItemIcon>
                    <ListItemText primary="Artefact" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <Link to="/import-excel" className={styles.link}>
              <ListItem button 
                selected={listItem === 0}
                onClick={(event) => handleListItemClick(event, 4)}
              >
                <ListItemIcon className={styles.listItemIcon}><ImportExcelIcon /></ListItemIcon>
                <ListItemText primary="Import Excel" />
              </ListItem>
            </Link>
          </List>
        </Box>
      </Drawer>
      <Box className="mt-3" component="main" sx={{ flexGrow: 1, p: 3 }} style={{width: "100%"}}>
        {props.children}
      </Box>
    </Box>
  );
};

export default MainLayout;
