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

export const Equipe = () => {
  const [loading, setLoading] = useState(true);
  const [equipeId, setEquipeId] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState();
  const [size, setSize] = useState(0);
  const [optionsCidades, setOptionsCidades] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const renderOptionsActions = (equipe) => [
    {
      content: "Editar",
      data: equipe.id,
      onClick: () => handleEditarEquipe(equipe.id),
    },
    {
      content: "Excluir",
      data: equipe.id,
      onClick: () => handleExcluirEquipe(equipe.id),
    },
  ];

  const handleEditarEquipe = async (id) => {
    setEquipeId(id);

    try {
      const { data } = await axiosInstance.get(`/api/equipes/${id}`);

      setValue("nome", data.nome);
      setValue("cidadeId", data.cidade.id);
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao consultar a equipe", snackbarConfig());
      }
    }
  };

  const handleExcluirEquipe = async (id) => {
    try {
      await axiosInstance.delete(`/api/equipes/${id}`);

      enqueueSnackbar("Equipe excluída com sucesso!", snackbarConfig());
      await fetchEquipes();
      resetValues();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;

        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao excluir a equipe", snackbarConfig());
      }
    }
  };

  const resetValues = () => {
    setValue("nome", "");
    setValue("cidadeId", "");
    setEquipeId(null);
  };

  const handleCadastrar = async (data) => {
    try {
      await axiosInstance.post("/api/equipes", data);

      resetValues();

      enqueueSnackbar("Equipe cadastrada com sucesso!", snackbarConfig());
      await fetchEquipes();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao cadastrar equipe", snackbarConfig());
      }
    }
  };

  const handleEditar = async (data) => {
    try {
      await axiosInstance.put(`/api/equipes/${equipeId}`, data);

      resetValues();

      enqueueSnackbar("Equipe editada com sucesso!", snackbarConfig());
      await fetchEquipes();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao editar equipe", snackbarConfig());
      }
    }
  };

  const onSubmit = async (data) => {
    if (equipeId) {
      await handleEditar(data);
    } else {
      await handleCadastrar(data);
    }
  };

  useEffect(() => {
    fetchCidades();
    fetchEquipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCidades = async () => {
    try {
      const { data } = await axiosInstance.get("/api/cidades/select");

      setOptionsCidades(data);
      fetchEquipes();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao consultar as cidades", snackbarConfig());
      }
    }
  };

  const fetchEquipes = async (page = 0, size = 10) => {
    setLoading(true);

    try {
      const params = {
        page,
        size: size,
        sort: "nome,asc",
      };
      const { data } = await axiosInstance.get("/api/equipes", { params });

      setEquipes(data.content);
      setRowsPerPage(data.size);
      setSize(data.totalElements);
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao consultar as equipes", snackbarConfig());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchEquipes(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setSize(event.target.value);
    setPage(0);

    fetchEquipes(0, event.target.value);
  };

  const handleClick = async () => await fetchEquipes();

  const renderRows = () => {
    if (!loading && Array.isArray(equipes) && equipes.length) {
      return equipes.map((equipe) => (
        <TableRow key={equipe.id}>
          <TableCell>{equipe.nome}</TableCell>
          <TableCell>{equipe.cidade.nome}</TableCell>
          <TableCell padding="none" align="center">
            {equipe.jogadores?.length || 0}
          </TableCell>
          <TableCell padding="none" align="center">
            {equipe.tecnicos?.length || 0}
          </TableCell>
          <TableCell padding="none" align="center">
            <TableActions options={renderOptionsActions(equipe)} />
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
      <div className="container cadastro-equipe">
        <Title>Cadastro de Equipe</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" value={equipeId} />
          <Input
            type="text"
            name="nome"
            label="Nome *"
            marginTop="0"
            control={control}
            placeholder="Digite o nome da equipe"
            error={errors?.nome?.message}
          />
          <Select
            control={control}
            name="cidadeId"
            setValue={setValue}
            options={optionsCidades}
            label="Cidade *"
            error={errors?.cidadeId?.message}
          />
          <div className="button">
            <Button variant="contained" type="submit">
              {equipeId ? "Editar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </div>

      <div className="container listagem-equipe">
        <Title>Equipes</Title>

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
                <TableCell>Cidade</TableCell>
                <TableCell>Quantidade de Jogadores</TableCell>
                <TableCell>Quantidade de Técnicos</TableCell>
                <TableCell>Ações</TableCell>
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
