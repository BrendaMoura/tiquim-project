import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
import { Box, FormControlLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useAddress } from "@/app/hooks/useAddress";
import { useCountries } from "@/app/hooks/useCountries";
import { useContext, useEffect } from "react";
import PaymentContext from "../../states/PaymentProvider";
import getAddress from "../../services/address"; // Importa a função getAddress

// Deixa os inputs alinhados
const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

// Tira os botões de incremento e decremento do input number
const StyledOutlinedInput = styled(OutlinedInput)(() => ({
  "& input[type=number]": {
    "-moz-appearance": "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    {
      "-webkit-appearance": "none",
    },
}));

export default function AddressForm() {
  const { addressInfo, setAddressInfo, saveAddress, setSaveAddress } = useContext(PaymentContext);
  // saveAddress, setSaveAddress do context para pegar os dados
  const [zip, setZip] = React.useState("");
  const { address, isLoading: isAddressLoading, isError: isAddressError } = useAddress(zip);
  const [selectedCountry, setSelectedCountry] = React.useState("");
  const { countries, isLoading: isCountriesLoading, isError: isCountriesError } = useCountries();

  const handleCepChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    setAddressInfo((prev) => ({ ...prev, zip: cep }));

    // Verifica se o CEP tem 8 dígitos e é brasileiro
    if (cep.length === 8 && /^[0-9]{5}-?[0-9]{3}$/.test(cep)) {
      setAddressInfo((prev) => ({ ...prev, country: "Brasil" }));

      // Busca o endereço pelo CEP
      const addressData = await getAddress(cep);
      if (addressData) {
        setAddressInfo((prev) => ({
          ...prev,
          street: addressData.logradouro,
          neighborhood: addressData.bairro,
          city: addressData.localidade,
          state: addressData.uf,
        }));
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddressInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    setAddressInfo((prev) => ({ ...prev, country: event.target.value }));
  };

  return (
    <Box sx={{ maxWidth: 700, margin: "auto" }}>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        <FormGrid item xs={12} md={3}>
          <FormLabel htmlFor="zip" required>
            CEP
          </FormLabel>
          <StyledOutlinedInput
            id="zip"
            name="zip"
            type="number"
            autoComplete="shipping postal-code"
            required
            value={addressInfo.zip}
            onChange={handleCepChange}
          />
        </FormGrid>
        <FormGrid item xs={12} md={9}>
          <FormLabel htmlFor="street" required>
            Rua
          </FormLabel>
          <OutlinedInput
            id="street"
            name="street"
            type="text"
            autoComplete="street"
            required
            value={addressInfo.street}
            onChange={handleInputChange}
            disabled={isAddressLoading || isAddressError}
          />
        </FormGrid>
        <FormGrid item xs={12} md={3}>
          <FormLabel htmlFor="number" required>
            Número
          </FormLabel>
          <StyledOutlinedInput
            id="number"
            name="number"
            type="number"
            autoComplete="street number"
            required
            value={addressInfo.number}
            onChange={handleInputChange}
          />
        </FormGrid>
        <FormGrid item xs={12} md={9}>
          <FormLabel htmlFor="neighborhood" required>
            Bairro
          </FormLabel>
          <OutlinedInput
            id="neighborhood"
            name="neighborhood"
            type="text"
            autoComplete="neighborhood"
            required
            value={addressInfo.neighborhood}
            onChange={handleInputChange}
            disabled={isAddressLoading || isAddressError}
          />
        </FormGrid>
        <FormGrid item xs={6}>
          <FormLabel htmlFor="city" required>
            Cidade
          </FormLabel>
          <OutlinedInput
            id="city"
            name="city"
            type="text"
            autoComplete="city"
            required
            value={addressInfo.city}
            onChange={handleInputChange}
            disabled={isAddressLoading || isAddressError}
          />
        </FormGrid>
        <FormGrid item xs={6}>
          <FormLabel htmlFor="state" required>
            Estado
          </FormLabel>
          <OutlinedInput
            id="state"
            name="state"
            type="text"
            autoComplete="state"
            required
            value={addressInfo.state}
            onChange={handleInputChange}
            disabled={isAddressLoading || isAddressError}
          />
        </FormGrid>
        <FormGrid item xs={6}>
          <FormLabel htmlFor="country" required>
            País
          </FormLabel>
          <Select
            id="country"
            name="country"
            value={addressInfo.country}
            onChange={handleCountryChange}
            required
            disabled={isCountriesLoading || isCountriesError}
          >
            {countries?.map((country: string) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormGrid>
        <FormGrid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="saveAddress"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)} // Editado para Salvar dados para futuras doações
                sx={{ "&.Mui-checked": { color: "green" } }}
              />
            }
            label="Salvar endereço para próximas doações."
          />
        </FormGrid>
      </Grid>
    </Box>
  );
}
