import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Modal,
  IconButton,
  Backdrop,
  Fade,
  Typography,
  Button,
} from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-toastify';

import { useLoading } from '~/hooks/loading';

import api from '~/services/api';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #999',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  tag: {
    margin: '15px 0',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '15px 0',
  },
  buttonRight: {
    marginLeft: '5px',
  },
  buttonLeft: {
    marginRight: '5px',
  },
}));

export default function importProducts({ tag }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const { loadingShowed, showLoading, hideLoading } = useLoading();

  const handleChange = (uploadedfile) => {
    setFile(uploadedfile);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = useCallback(async () => {
    try {
      showLoading();
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/v1/tag/${tag.id}/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      hideLoading();
      handleClose();
    } catch (err) {
      hideLoading();

      if (err.message === 'Network Error') {
        toast.error(
          'Serviço temporareamente indisponível, tente novamente mais tarde.'
        );

        return;
      }

      toast.error('Falha ao tentar cadastrar produto.');
    }
  }, [hideLoading, showLoading, file, tag]);

  return (
    <div>
      <IconButton color="inherit" size="small" onClick={handleOpen}>
        <CloudUpload color="primary" />
      </IconButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Typography variant="h6" color="textPrimary">
              Anexar arquivo
            </Typography>
            <Typography
              variant="body1"
              color="textPrimary"
              className={classes.tag}
            >
              Categoria: {tag.name}
            </Typography>
            <FileUploader
              handleChange={handleChange}
              name="file"
              types={['JSON']}
              label="Click ou arraste o arquivo até aqui"
              className={classes.upload}
            />
            {file && (
              <Typography variant="caption" color="textPrimary">
                Arquivo: {file && file.name}
              </Typography>
            )}
            <div className={classes.buttons}>
              <Button
                disabled={loadingShowed}
                variant="contained"
                color="secondary"
                onClick={handleClose}
                fullWidth
                className={classes.buttonLeft}
              >
                Cancelar
              </Button>
              <Button
                disabled={loadingShowed || !file}
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                className={classes.buttonRight}
              >
                Enviar
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

importProducts.propTypes = {
  tag: PropTypes.shape().isRequired,
};
