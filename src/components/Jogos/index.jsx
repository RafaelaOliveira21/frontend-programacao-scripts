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

export const Jogos = () => {
  const [loading, setLoading] = useState(true);
  const [jogoId, setJogoId] = useState();
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

  const renderOptionsActions = (jogo) => [
    {
      content: "Editar",
      data: jogo.id,
      onClick: () => handleEditarJogador(jogo.id),
    },
    {
      content: "Excluir",
      data: jogo.id,
      onClick: () => handleExcluirJogador(jogo.id),
    },
  ];

  const handleEditarJogador = async (id) => {
    setJogoId(id);

    try {
      const { data } = await axiosInstance.get(`/api/jogos/${id}`);

      setValue("nome", data.nome);
      setValue("equipeCasaId", data.equipeCasa.id);
      setValue("pontosCasa", data.pontosCasa);
      setValue("equipeVisitanteId", data.equipeVisitante.id);
      setValue("pontosVisitante", data.pontosVisitante);
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao consultar o jogo", snackbarConfig());
      }
    }
  };

  const handleExcluirJogador = async (id) => {
    try {
      await axiosInstance.delete(`/api/jogos/${id}`);

      enqueueSnackbar("Jogo excluído com sucesso!", snackbarConfig());
      await fetchJogadores();
      resetValues();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;

        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao excluir o jogo", snackbarConfig());
      }
    }
  };

  const resetValues = () => {
    setValue("nome", "");
    setValue("equipeCasaId", "");
    setValue("pontosCasa", "");
    setValue("equipeVisitanteId", "");
    setValue("pontosVisitante", "");
    setValue("data", "");
    setJogoId(null);
  };

  const handleCadastrar = async (data) => {
    try {
      await axiosInstance.post("/api/jogos", data);

      resetValues();

      enqueueSnackbar("Jogo cadastrado com sucesso!", snackbarConfig());
      await fetchJogadores();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao cadastrar jogo", snackbarConfig());
      }
    }
  };

  const handleEditar = async (data) => {
    try {
      await axiosInstance.put(`/api/jogos/${jogoId}`, data);

      resetValues();

      enqueueSnackbar("Jogo editado com sucesso!", snackbarConfig());
      await fetchJogadores();
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao editar jogo", snackbarConfig());
      }
    }
  };

  const onSubmit = async (data) => {
    if (jogoId) {
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
        sort: "equipeCasa.nome,asc",
      };
      const { data } = await axiosInstance.get("/api/jogos", { params });

      setJogadores(data.content);
      setRowsPerPage(data.size);
      setSize(data.totalElements);
    } catch (error) {
      if (error?.response?.data) {
        const { message } = error.response.data;
        enqueueSnackbar(message, snackbarConfig());
      } else {
        enqueueSnackbar("Erro ao consultar os jogos", snackbarConfig());
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
      return jogadores.map((jogo) => (
        <TableRow key={jogo.id}>
          <TableCell>{jogo.equipeCasa.nome}</TableCell>
          <TableCell>{jogo.pontosCasa}</TableCell>
          <TableCell>{jogo.equipeVisitante.nome}</TableCell>
          <TableCell>{jogo.pontosVisitante}</TableCell>
          <TableCell>{jogo.data}</TableCell>
          <TableCell align="right">
            <TableActions options={renderOptionsActions(jogo)} />
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
      <div className="container cadastro-jogo">
        <Title>Cadastro de Jogo</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" value={jogoId} />
          <Select
            control={control}
            name="equipeCasaId"
            setValue={setValue}
            options={optionsEquipes}
            label="Equipe Casa*"
            error={errors?.equipeCasaId?.message}
          />
          <Input
            type="number"
            name="pontosCasa"
            label="Pontos Casa *"
            marginTop="0"
            control={control}
            placeholder="Digite os pontos da equipe casa"
            error={errors?.pontosCasa?.message}
          />
          <Select
            control={control}
            name="equipeVisitanteId"
            setValue={setValue}
            options={optionsEquipes}
            label="Equipe Visitante*"
            error={errors?.equipeVisitanteId?.message}
          />
          <Input
            type="number"
            name="pontosVisitante"
            label="Pontos Visitante *"
            marginTop="0"
            control={control}
            placeholder="Digite os pontos da equipe visitante"
            error={errors?.pontosVisitante?.message}
          />
          <div className="button">
            <Button variant="contained" type="submit">
              {jogoId ? "Editar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </div>

      <div className="container listagem-jogo">
        <Title>Jogos</Title>

        <div className="button-consultar">
          <Button variant="contained" onClick={handleClick}>
            Consultar
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Equipe Casa</TableCell>
                <TableCell>Pontos Casa</TableCell>
                <TableCell>Equipe Visitante</TableCell>
                <TableCell>Pontos Visitante</TableCell>
                <TableCell>Data</TableCell>
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
