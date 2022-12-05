import { TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import Error from "../Error";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import "./styles.scss";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";

const DateTime = ({ name, label, control, error }) => {
  return (
    <div className="date">
      <Controller
        name={name}
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <DateTimePicker
              renderInput={(props) => (
                <TextField
                  {...props}
                  InputLabelProps={{ shrink: true }}
                  error={error !== undefined}
                  color="primary"
                  sx={{
                    width: "100%",
                  }}
                />
              )}
              label={label}
              value={value}
              onChange={onChange}
              // inputFormat="DD/MM/YYYY HH:mm"
              // toolbarFormat="DD/MM/YYYY HH:mm"
              minDate={new Date()}
            />
          </LocalizationProvider>
        )}
      />
      <Error error={error} />
    </div>
  );
};

export default DateTime;
