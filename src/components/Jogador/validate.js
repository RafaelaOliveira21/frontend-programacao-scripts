import * as yup from "yup";

const validationSchema = yup.object({
  nome: yup.string().required("O nome é obrigatório"),
  equipeId: yup.string().required("A equipe é obrigatória"),
});

export default validationSchema;
