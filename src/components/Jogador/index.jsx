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

export const Jogador = () => {
  const [loading, setLoading] = useState(true);
  const [jogadorId, setJogadorId] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(0);
  const [size, setSize] = useState(0);
  const [optionsEquipes, setOptionsEquipes] = useState([]);
  const [jogadores, setJogadores] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const renderOptionsActions = (jogador) => [
    {
      content: "Editar",
      data: jogador.id,
      onClick: () => handleEditarJogador(jogador.id),
    },
    {
      content: "Excluir",
      data: jogador.id,
      onClick: () => handleExcluirJogador(jogador.id),
    },
  ];

  const handleEditarJogador = async (id) => {
    setJogadorId(id);

    try {
      const { data } = await axiosInstance.get(`/api/jogadores/${id}`);

      setValue("nome", data.nome);
      setValue("equipeId", data.equipeId);
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao consultar o jogador", snackbarConfig());
      }
    }
  };

  const handleExcluirJogador = async (id) => {
    try {
      await axiosInstance.delete(`/api/jogadores/${id}`);

      enqueueSnackbar("Jogador excluído com sucesso!", snackbarConfig());
      await fetchJogadores();
      resetValues();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;

        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao excluir o jogador", snackbarConfig());
      }
    }
  };

  const resetValues = () => {
    setValue("nome", "");
    setValue("equipeId", "");
    setJogadorId(null);
  };

  const handleCadastrar = async (data) => {
    try {
      await axiosInstance.post("/api/jogadores", data);

      resetValues();

      enqueueSnackbar("Jogador cadastrado com sucesso!", snackbarConfig());
      await fetchJogadores();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao cadastrar jogador", snackbarConfig());
      }
    }
  };

  const handleEditar = async (data) => {
    try {
      await axiosInstance.put(`/api/jogadores/${jogadorId}`, data);

      resetValues();

      enqueueSnackbar("Jogador editado com sucesso!", snackbarConfig());
      await fetchJogadores();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao editar jogador", snackbarConfig());
      }
    }
  };

  const onSubmit = async (data) => {
    if (jogadorId) {
      await handleEditar(data);
    } else {
      await handleCadastrar(data);
    }
  };

  useEffect(() => {
    fetchEquipes();
    fetchJogadores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEquipes = async () => {
    try {
      const { data } = await axiosInstance.get("/api/equipes/select");

      setOptionsEquipes(data);
      fetchJogadores();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao consultar as equipes", snackbarConfig());
      }
    }
  };

  const fetchJogadores = async (page = 0, size = 10) => {
    setLoading(true);

    try {
      const params = {
        page,
        size: size,
        sort: "nome,asc",
      };
      const { data } = await axiosInstance.get("/api/jogadores", { params });

      setJogadores(data.content);
      setRowsPerPage(data.size);
      setSize(data.totalElements);
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao consultar os jogadores", snackbarConfig());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchJogadores(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setSize(event.target.value);
    setPage(0);

    fetchJogadores(0, event.target.value);
  };

  const handleClick = async () => await fetchJogadores();

  const renderRows = () => {
    if (!loading && Array.isArray(jogadores) && jogadores.length) {
      return jogadores.map((jogador) => (
        <TableRow key={jogador.id}>
          <TableCell>{jogador.nome}</TableCell>
          <TableCell>{jogador.equipe}</TableCell>
          <TableCell align="right">
            <TableActions options={renderOptionsActions(jogador)} />
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
      <div className="container cadastro-jogador">
        <Title>Cadastro de Jogador</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" value={jogadorId} />
          <Input
            type="text"
            name="nome"
            label="Nome *"
            marginTop="0"
            control={control}
            placeholder="Digite o nome do jogador"
            error={errors?.nome?.message}
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
              {jogadorId ? "Editar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </div>

      <div className="container listagem-jogador">
        <Title>Jogadores</Title>

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
