import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, ButtonGroup, Button, Grid } from '@material-ui/core';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { ConfirmProvider } from 'material-ui-confirm';

import { useLoading } from '~/hooks/loading';
import { useTheme } from '~/hooks/theme';

import Loading from '~/components/loading';
import AppBar from '~/components/app-bar';

import userTheme from '~/styles/theme';
import history from '~/services/history';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
  },
  functionalities: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default function Layout({ children }) {
  const classes = useStyles();
  const { loadingShowed } = useLoading();
  const { darkMode } = useTheme();
  const [functionality, setFunctionality] = useState('Produtos');

  const handleClickProducts = () => {
    if (functionality !== 'Produtos') {
      history.push('/');
      setFunctionality('Produtos');
    }
  };

  const handleClickTags = () => {
    if (functionality !== 'Categorias') {
      history.push('/tags');
      setFunctionality('Categorias');
    }
  };

  return (
    <ThemeProvider theme={userTheme(darkMode)}>
      <ConfirmProvider
        defaultOptions={{
          confirmationText: 'Confirmar',
          cancellationText: 'Cancelar',
          confirmationButtonProps: { variant: 'contained', color: 'primary' },
          cancellationButtonProps: { variant: 'contained', color: 'secondary' },
        }}
      >
        <AppBar functionality={functionality} />
        <Container maxWidth="md" className={classes.container}>
          <Grid container>
            <Grid item xs={12} className={classes.functionalities}>
              <ButtonGroup disableElevation variant="contained" color="primary">
                <Button
                  onClick={handleClickProducts}
                  color={
                    (functionality === 'Produtos' && 'secondary') || 'primary'
                  }
                >
                  Produtos
                </Button>
                <Button
                  onClick={handleClickTags}
                  color={
                    (functionality === 'Categorias' && 'secondary') || 'primary'
                  }
                >
                  Categorias
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          {children}
          {loadingShowed && <Loading />}
        </Container>
      </ConfirmProvider>
    </ThemeProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};
