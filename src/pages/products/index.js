import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Paper,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TextField,
  Typography,
} from '@material-ui/core';
import { DeleteForever, Edit, Add } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';

import { useLoading } from '~/hooks/loading';

import api from '~/services/api';

import FormProductModal from '~/components/product/form';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  filter: {
    padding: theme.spacing(2),
  },
  filterButton: {
    margin: theme.spacing(0, 1),
  },
}));

function products() {
  const classes = useStyles();
  const confirm = useConfirm();
  const { loadingShowed } = useLoading();

  const [productsList, setProductsList] = useState(null);
  const [formProduct, setFormProduct] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [filters, setFilters] = useState({
    take: 10,
    skip: 1,
  });

  const getProducts = async () => {
    try {
      const response = await api.get('/v1/product', { params: filters });
      setProductsList(response.data);
    } catch (error) {
      toast.error('Falha ao recuperar os produtos.');
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await api.delete(`/v1/product/${id}`);
      setProductsList(response.data);
      toast.success('Operação realizada com sucesso.');
    } catch (error) {
      toast.error('Falha ao tentar deletar produto.');
    }
  };

  useEffect(() => {
    if (!productsList) {
      getProducts();
    }
  }, [productsList]); // eslint-disable-line

  useEffect(() => {
    getProducts();
  }, [filters]); // eslint-disable-line

  const handleChangePage = (event, newPage) => {
    const newFilters = { ...filters, skip: newPage + 1 };
    setFilters(newFilters);
  };

  const handleChangeRowsPerPage = (event) => {
    const newFilters = { ...filters, take: Number(event.target.value) };
    setFilters(newFilters);
  };

  const handleDeleteProduct = (id) => {
    confirm({
      title: 'Deseja continuar?',
      description: 'Clicando em confirmar, o produto será excluído.',
    })
      .then(() => {
        deleteProduct(id);
        getProducts();
      })
      .catch(() => {});
  };

  const handleChangeForm = (event) => {
    let newFilters = { ...filters };

    if (!event.target.value) {
      delete newFilters[event.target.name];
    } else {
      newFilters = {
        ...newFilters,
        [event.target.name]: event.target.value,
      };
    }
    setFilters(newFilters);
  };

  const saveProduct = async (id = null, data) => {
    if (id) {
      await api.put(`/v1/product/${id}`, data);
    } else {
      await api.post(`/v1/product`, data);
    }
    getProducts();
  };

  const handleOpenForm = (product = {}) => {
    setFormProduct(product);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper>
            <Grid container spacing={2} className={classes.filter}>
              <Grid item xs={12}>
                <Typography variant="h5">Filtrar</Typography>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <TextField
                  variant="outlined"
                  label="Nome"
                  name="name"
                  autoFocus
                  color="primary"
                  disabled={loadingShowed}
                  size="small"
                  fullWidth
                  onBlur={handleChangeForm}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <TextField
                  variant="outlined"
                  label="Tag"
                  name="tag_name"
                  autoFocus
                  color="primary"
                  disabled={loadingShowed}
                  size="small"
                  fullWidth
                  onBlur={handleChangeForm}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} justifyContent="flex-end">
                  <Grid item xs={12} sm={3} lg={2}>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      startIcon={<Add />}
                      onClick={handleOpenForm}
                    >
                      Cadastrar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">Categoria</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productsList &&
                  productsList.data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.name}</TableCell>
                      <TableCell align="right">{row.tag.name}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="inherit"
                          size="small"
                          onClick={() => handleOpenForm(row)}
                        >
                          <Edit color="primary" />
                        </IconButton>
                        <IconButton
                          color="inherit"
                          size="small"
                          onClick={() => handleDeleteProduct(row.id)}
                        >
                          <DeleteForever color="primary" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={(productsList && productsList.total) || 0}
              rowsPerPage={filters.take}
              page={filters.skip - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Registros por página"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
            />
          </TableContainer>
        </Grid>
      </Grid>
      <FormProductModal
        send={saveProduct}
        open={openForm}
        handleClose={handleCloseForm}
        product={formProduct}
      />
    </>
  );
}

export default products;
