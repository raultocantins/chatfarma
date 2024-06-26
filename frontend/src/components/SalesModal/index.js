import React, { useEffect, useState } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { i18n } from "../../translate/i18n";
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },
  btnWrapper: {
    position: "relative",
  },
  tabs: {
    background: theme.palette.background.default,
  },
  table: {
    maxHeight: 150,
    minHeight: 150,
    overflowY: "auto",
  },
}));

const CampaignSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),

  quantity: Yup.number()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),

  amount: Yup.number().min(1, "Too Short!").required("Required"),
});

const SalesModal = ({ open, onClose, onSave }) => {
  const classes = useStyles();
  const [statusList, setstatusList] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setstatusList([
      { id: 1, name: "VENDIDO" },
      { id: 2, name: "FORA DO ALCANCE" },
    ]);
  }, []);

  const handleSave = () => {
    //SALVAR A VENDA E DEPOIS FECHAR A MODAL
    var body = {
      status: selectedStatus,
      products: products,
    };
    console.log(body);
    onSave();
  };

  const renderTableProducts = () => {
    return (
      <div className={classes.table}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ width: "0%" }}>
                Item
              </TableCell>
              <TableCell>Nome do produto</TableCell>
              <TableCell align="center">Quantidade</TableCell>
              <TableCell align="center">Valor</TableCell>
              <TableCell align="center">
                {i18n.t("contactListItems.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell align="center" style={{ width: "0%" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="center">{product.quantity}</TableCell>
                  <TableCell align="center">R${product.amount}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => {
                        const updatedProducts = [...products];
                        updatedProducts.splice(index, 1);
                        setProducts(updatedProducts);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </>
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">Novo Registro de Venda</DialogTitle>
        <DialogContent dividers>
          <Formik
            initialValues={{
              name: "",
              quantity: "",
              amount: "",
            }}
            enableReinitialize={true}
            validationSchema={CampaignSchema}
            onSubmit={(values, { resetForm }) => {
              setProducts([
                ...products,
                {
                  name: values.name,
                  quantity: values.quantity,
                  amount: values.amount,
                },
              ]);
              resetForm();
            }}
          >
            {({ _, handleChange, errors, touched, __ }) => (
              <Form>
                <Grid
                  spacing={2}
                  container
                  justifyContent="flex-start"
                  alignContent="flex-start"
                >
                  <Grid xs={12} md={4} item>
                    <Field
                      as={TextField}
                      label="Nome do produto"
                      name="name"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.textField}
                    />
                  </Grid>

                  <Grid xs={12} md={4} item>
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel id="quantity-selection-label">
                        Quantidade
                      </InputLabel>
                      <Field
                        as={Select}
                        label="Quantidade"
                        placeholder="Quantidade"
                        labelId="quantity-selection-label"
                        id="quantity"
                        name="quantity"
                        error={touched.quantity && Boolean(errors.quantity)}
                        helperText={touched.quantity && errors.quantity}
                      >
                        <MenuItem value="">Nenhuma</MenuItem>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (qt) => (
                            <MenuItem key={qt} value={qt}>
                              {qt}
                            </MenuItem>
                          )
                        )}
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={4} item>
                    <Field
                      as={TextField}
                      label="Valor"
                      id="amount"
                      name="amount"
                      error={touched.amount && Boolean(errors.amount)}
                      helperText={touched.amount && errors.amount}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.textField}
                      onChange={(e) => {
                        const { value } = e.target;
                        // Permite apenas números, ponto e vírgula
                        const formattedValue = value.replace(/[^0-9,.]/g, "");
                        handleChange({
                          target: {
                            name: "amount",
                            value: formattedValue,
                          },
                        });
                      }}
                    />
                  </Grid>

                  <Grid xs={12} md={12} item>
                    <Box display="flex" justifyContent="flex-end">
                      <Button color="primary" variant="contained" type="submit">
                        <Add />
                        Adicionar Produto
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>

          <Grid
            spacing={2}
            container
            justifyContent="flex-start"
            alignContent="flex-start"
          >
            <Grid xs={12} item>
              <Tabs
                indicatorColor="primary"
                textColor="secondary"
                variant="fullWidth"
                centered
                className={classes.tabs}
              >
                <Tab label="Produtos Adicionados" index={0} />
              </Tabs>
              <Box style={{ paddingTop: 20, border: "none" }}>
                {renderTableProducts}
              </Box>
            </Grid>

            <Grid xs={12} md={12} item>
              <FormControl
                variant="outlined"
                margin="dense"
                fullWidth
                className={classes.formControl}
              >
                <InputLabel id="status-selection-label">
                  Status da venda
                </InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status da venda"
                  placeholder="Status da venda"
                  labelId="status-selection-label"
                  id="statusListId"
                  name="statusListId"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="">Nenhuma</MenuItem>
                  {statusList &&
                    statusList.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ padding: "12px 24px" }}>
          <Button onClick={handleSave} color="secondary" variant="outlined">
            NENHUMA VENDA
          </Button>

          <Button
            color="primary"
            variant="contained"
            className={classes.btnWrapper}
            onClick={handleSave}
          >
            SALVAR VENDA
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SalesModal;
