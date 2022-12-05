export const snackBarTypes = {
  default: "default",
  error: "error",
  info: "info",
  success: "success",
  warning: "warning",
};

export default function snackbarConfig(type) {
  return {
    variant: type ?? snackBarTypes.default,
    preventDuplicate: true,
    autoHideDuration: 5000,
    anchorOrigin: { vertical: "bottom", horizontal: "center" },
  };
}
