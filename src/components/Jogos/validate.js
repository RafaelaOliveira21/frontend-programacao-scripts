import * as yup from "yup";

const validationSchema = yup.object({
  equipeCasaId: yup.string().required("A equipe casa é obrigatória"),
  pontosCasa: yup
    .string()
    .required("Os pontos da equipe casa são obrigatórios"),
  equipeVisitanteId: yup.string().required("A equipe visitante é obrigatória"),
  pontosVisitante: yup
    .string()
    .required("Os pontos da equipe visitante são obrigatórios"),
});

export default validationSchema;
