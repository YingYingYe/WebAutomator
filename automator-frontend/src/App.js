import React, { Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  makeStyles,
} from '@material-ui/core';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./store";
import { blue } from '@material-ui/core/colors';
import Home from './pages/Home';
import SavePersonList from './pages/SaveList/Person';
import SavePlaceList from './pages/SaveList/Place';
import SaveArtefactList from './pages/SaveList/Artefact';
import ImportExcel from './pages/ImportExcel';
import MainLayout from './layout/MainLayout';

import Login from './components/Login'
import useToken from './useToken';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[600]
    },
    secondary: {
      main: blue[300]
    }
  }
});

const useStyles = makeStyles(theme => ({
  main: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  }
}))

const App = () => {
  const classes = useStyles();
	const persistor = persistStore(store);

  const { token, setToken } = useToken();

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <Fragment>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <main className={classes.main}>
                <MainLayout>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/save-list/person" component={SavePersonList} />
                    <Route exact path="/save-list/place" component={SavePlaceList} />
                    <Route exact path="/save-list/artefact" component={SaveArtefactList} />
                    <Route exact path="/import-excel" component={ImportExcel} />
                    <Redirect to="/" />
                  </Switch>
                </MainLayout>
              </main>
            </PersistGate>
          </Provider>
        </ThemeProvider>
    </Fragment>
)};

export default App;

