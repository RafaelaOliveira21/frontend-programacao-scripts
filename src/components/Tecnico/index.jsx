import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../config/axiosConfig";
import snackbarConfig from "../../utils/snackbarConfig";
import Input from "../Input";
import Select from "../Select";
import TableActions from "../TabletActions";
import Title from "../Title/Index";
import "./styles.scss";
import validationSchema from "./validate";

export const Tecnico = () => {
  const [loading, setLoading] = useState(true);
  const [tecnicoId, setTecnicoId] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState();
  const [size, setSize] = useState(0);
  const [optionsEquipes, setOptionsEquipes] = useState([]);
  const [optionsFuncoes, setOptionsFuncoes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const renderOptionsActions = (tecnico) => [
    {
      content: "Editar",
      data: tecnico.id,
      onClick: () => handleEditarTecnico(tecnico.id),
    },
    {
      content: "Excluir",
      data: tecnico.id,
      onClick: () => handleExcluirTecnico(tecnico.id),
    },
  ];

  const handleEditarTecnico = async (id) => {
    setTecnicoId(id);

    try {
      const { data } = await axiosInstance.get(`/api/tecnicos/${id}`);

      setValue("nome", data.nome);
      setValue("funcao", data.funcaoCodigo);
      setValue("equipeId", data.equipeId);
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao consultar o técnico", snackbarConfig());
      }
    }
  };

  const handleExcluirTecnico = async (id) => {
    try {
      await axiosInstance.delete(`/api/tecnicos/${id}`);

      enqueueSnackbar("Técnico excluída com sucesso!", snackbarConfig());
      await fetchTecnicos();
      resetValues();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;

        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao excluir o técnico", snackbarConfig());
      }
    }
  };

  const resetValues = () => {
    setValue("nome", "");
    setValue("funcao", "");
    setValue("equipeId", "");
    setTecnicoId(null);
  };

  const handleCadastrar = async (data) => {
    try {
      await axiosInstance.post("/api/tecnicos", data);

      resetValues();

      enqueueSnackbar("Técnico cadastrado com sucesso!", snackbarConfig());
      await fetchTecnicos();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao cadastrar técnico", snackbarConfig());
      }
    }
  };

  const handleEditar = async (data) => {
    try {
      await axiosInstance.put(`/api/tecnicos/${tecnicoId}`, data);

      resetValues();

      enqueueSnackbar("Técnico editado com sucesso!", snackbarConfig());
      await fetchTecnicos();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao editar técnico", snackbarConfig());
      }
    }
  };

  const onSubmit = async (data) => {
    if (tecnicoId) {
      await handleEditar(data);
    } else {
      await handleCadastrar(data);
    }
  };

  useEffect(() => {
    fetchFuncoes();
    fetchEquipes();
    fetchTecnicos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFuncoes = async () => {
    try {
      const { data } = await axiosInstance.get("/api/tecnicos/funcoes");

      setOptionsFuncoes(data);
      fetchTecnicos();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao consultar as funções", snackbarConfig());
      }
    }
  };

  const fetchEquipes = async () => {
    try {
      const { data } = await axiosInstance.get("/api/equipes/select");

      setOptionsEquipes(data);
      fetchTecnicos();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao consultar as equipes", snackbarConfig());
      }
    }
  };

  const fetchTecnicos = async (page = 0, size = 10) => {
    setLoading(true);

    try {
      const params = {
        page,
        size: size,
        sort: "nome,asc",
      };
      const { data } = await axiosInstance.get("/api/tecnicos", { params });

      setTecnicos(data.content);
      setRowsPerPage(data.size);
      setSize(data.totalElements);
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao consultar os técnicos", snackbarConfig());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchTecnicos(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setSize(event.target.value);
    setPage(0);

    fetchTecnicos(0, event.target.value);
  };

  const handleClick = async () => await fetchTecnicos();

  const renderRows = () => {
    if (!loading && Array.isArray(tecnicos) && tecnicos.length) {
      return tecnicos.map((tecnico) => (
        <TableRow key={tecnico.id}>
          <TableCell>{tecnico.nome}</TableCell>
          <TableCell>{tecnico.funcao}</TableCell>
          <TableCell>{tecnico.equipe}</TableCell>
          <TableCell align="right">
            <TableActions options={renderOptionsActions(tecnico)} />
          </TableCell>
        </TableRow>
      ));
    }

    return loading ? (
      <div className="loading">
        <CircularProgress size={24} />
      </div>
    ) : (
      <Typography variant="body2" align="center" gutterTop="2x">
        Nenhum registro encontrado
      </Typography>
    );
  };

  return (
    <>
      <div className="container cadastro-tecnico">
        <Title>Cadastro de Técnicos</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" value={tecnicoId} />
          <Input
            type="text"
            name="nome"
            label="Nome *"
            marginTop="0"
            control={control}
            placeholder="Digite o nome do técnico"
            error={errors?.nome?.message}
          />
          <Select
            control={control}
            name="funcao"
            setValue={setValue}
            options={optionsFuncoes}
            label="Função *"
            error={errors?.funcao?.message}
          />
          <Select
            control={control}
            name="equipeId"
            setValue={setValue}
            options={optionsEquipes}
            label="Equipe *"
            error={errors?.equipeId?.message}
          />
          <div className="button">
            <Button variant="contained" type="submit">
              {tecnicoId ? "Editar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </div>

      <div className="container listagem-tecnico">
        <Title>Técnicos</Title>

        <div className="button-consultar">
          <Button variant="contained" onClick={handleClick}>
            Consultar
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Função</TableCell>
                <TableCell>Equipe</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderRows()}</TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  page={page}
                  count={size}
                  rowsPerPage={rowsPerPage}
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from} a ${to} de ${count}`
                  }
                  labelRowsPerPage="Linhas por página"
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};
