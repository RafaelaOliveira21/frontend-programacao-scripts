import * as yup from "yup";

const validationSchema = yup.object({
  nome: yup.string().required("O nome é obrigatório"),
  cidadeId: yup.string().required("A cidade é obrigatória"),
});

export default validationSchema;
