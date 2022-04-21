import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Backdrop, Fade, Button } from '@material-ui/core';
import { Form } from '@unform/web';
import { TextField } from 'unform-material-ui';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { useLoading } from '~/hooks/loading';

import getValidationErrors from '~/utils/getValidationErrors';

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
    width: '375px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonRight: {
    marginLeft: '5px',
  },
  buttonLeft: {
    marginRight: '5px',
  },
}));

export default function form({ tag, send, open, handleClose }) {
  const classes = useStyles();
  const formRef = useRef(null);
  const { loadingShowed, showLoading, hideLoading } = useLoading();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('O campo nome é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        showLoading();
        await send(tag.id || null, data);
        hideLoading();
        handleClose();
      } catch (err) {
        hideLoading();
        if (err.inner) {
          const errors = getValidationErrors(err);

          formRef.current.setErrors(errors);

          return;
        }

        if (err.message === 'Network Error') {
          toast.error(
            'Serviço temporareamente indisponível, tente novamente mais tarde.'
          );

          return;
        }

        toast.error('Falha ao tentar cadastrar produto.');
      }
    },
    [hideLoading, showLoading, send, tag, handleClose]
  );

  return (
    <div>
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
            <Form onSubmit={handleSubmit} initialData={tag} ref={formRef}>
              <TextField
                name="name"
                disabled={loadingShowed}
                variant="outlined"
                color="primary"
                fullWidth
                margin="normal"
                label="Nome"
              />
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
                  type="submit"
                  disabled={loadingShowed}
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={classes.buttonRight}
                >
                  Salvar
                </Button>
              </div>
            </Form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

form.propTypes = {
  tag: PropTypes.shape(), //eslint-disable-line
  send: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

form.defaultProps = {
  tag: {},
};
