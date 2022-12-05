import ClearIcon from "@mui/icons-material/Clear";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import "./styles.scss";
import Error from "../Error";

const SelectComponent = ({
  sx,
  name,
  error,
  label,
  options,
  control,
  setValue,
  startAdornment,
}) => {
  const handleClearClick = () => {
    setValue(name, "");
  };

  return (
    <div className="select">
      <Controller
        name={name}
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormControl
            sx={{
              width: "100%",
              ...sx,
            }}
          >
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Select
              label={label}
              onChange={onChange}
              error={error !== undefined}
              id="demo-simple-select"
              value={value || "selecione"}
              startAdornment={startAdornment}
              labelId="demo-simple-select-label"
              endAdornment={
                <IconButton
                  sx={{ display: value ? "" : "none" }}
                  onClick={handleClearClick}
                >
                  <ClearIcon />
                </IconButton>
              }
            >
              <MenuItem value="selecione" disabled>
                Selecione
              </MenuItem>
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <Error error={error} />
    </div>
  );
};

SelectComponent.propTypes = {
  sx: PropTypes.object,
  error: PropTypes.string,
  setValue: PropTypes.func,
  marginTopError: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
};

export default SelectComponent;
