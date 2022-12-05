import * as yup from "yup";

const validationSchema = yup.object({
  nome: yup.string().required("O nome é obrigatório"),
  funcao: yup.string().required("A função é obrigatória"),
  equipeId: yup.string().required("A equipe é obrigatória"),
});

export default validationSchema;
