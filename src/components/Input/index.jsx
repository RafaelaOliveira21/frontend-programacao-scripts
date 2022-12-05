import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import Error from "../Error";
import "./styles.scss";

const Input = ({
  sx,
  type,
  name,
  error,
  label,
  onBlur,
  control,
  required,
  disabled,
  autoFocus,
  InputProps,
  placeholder,
}) => {
  return (
    <div className="input">
      <Controller
        name={name}
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            sx={{
              width: "100%",
              ...sx,
            }}
            type={type}
            label={label}
            value={value}
            color="primary"
            onBlur={onBlur}
            variant="outlined"
            id="outlined-basic"
            required={required}
            disabled={disabled}
            onChange={onChange}
            autoFocus={autoFocus}
            InputLabelProps={{ shrink: true }}
            InputProps={InputProps}
            placeholder={placeholder}
            error={error !== undefined}
          />
        )}
      />
      <Error error={error} />
    </div>
  );
};

Input.propTypes = {
  sx: PropTypes.object,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  InputProps: PropTypes.object,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
};

export default Input;
