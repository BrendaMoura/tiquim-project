import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SimCardRoundedIcon from "@mui/icons-material/SimCardRounded";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import CreditCard, { Focused } from "react-credit-cards-2";
import { Container } from "@mui/material";
import { useContext } from "react";
import PaymentContext from "../../states/PaymentProvider";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}));

export default function CreditCardDetails() {
  const { cardInfo, setCardInfo, saveCard, setSaveCard } = useContext(PaymentContext);
  // saveAddress, setSaveAddress do context para pegar os dados
  const [focus, setFocus] = React.useState<Focused | undefined>(undefined);

  const handleCardNumberChange = (event: { target: { value: string } }) => {
    const value = event.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    if (value.length <= 16) {
      setCardInfo((prev) => ({ ...prev, cardNumber: formattedValue }));
    }
  };

  const handleCvvChange = (event: { target: { value: string } }) => {
    const value = event.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCardInfo((prev) => ({ ...prev, cvv: value }));
    }
  };

  const handleExpirationDateChange = (event: { target: { value: string } }) => {
    const value = event.target.value.replace(/\D/g, "");
    let formattedValue = value;

    if (value.length >= 2) {
      const month = parseInt(value.substring(0, 2), 10);
      if (month < 1 || month > 12) {
        return; // Mês inválido, não atualiza o estado
      }
    }

    if (value.length >= 4) {
      const year = parseInt(value.substring(2, 4), 10);
      if (year > 80) {
        return; // Ano inválido, não atualiza o estado
      }
    }

    if (value.length > 2) {
      formattedValue = value.substring(0, 2) + "/" + value.substring(2, 4);
    }

    if (value.length <= 4) {
      setCardInfo((prev) => ({ ...prev, expirationDate: formattedValue }));
    }
  };

  const handleCardNameChange = (event: { target: { value: string } }) => {
    const upperCaseValue = event.target.value.toUpperCase();
    setCardInfo((prev) => ({ ...prev, cardHolderName: upperCaseValue }));
  };

  return (
    <Container sx={{ width: "80%", m: "auto", mb: 5 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormGrid container>
            <Grid item xs={9}>
              <OutlinedInput
                id="card-number"
                autoComplete="card-number"
                placeholder="0000 0000 0000 0000"
                required
                value={cardInfo.cardNumber}
                onChange={handleCardNumberChange}
                onFocus={() => setFocus("number")}
                fullWidth
              />
            </Grid>
            <Grid item xs={9}>
              <OutlinedInput
                id="card-name"
                autoComplete="card-name"
                placeholder="Seu Nome"
                required
                value={cardInfo.cardHolderName}
                onChange={handleCardNameChange}
                onFocus={() => setFocus("name")}
                fullWidth
              />
            </Grid>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={3}>
                <OutlinedInput
                  id="card-expiration"
                  autoComplete="card-expiration"
                  placeholder="M/A"
                  required
                  value={cardInfo.expirationDate}
                  onChange={handleExpirationDateChange}
                  onFocus={() => setFocus("expiry")}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <OutlinedInput
                  id="cvv"
                  autoComplete="CVV"
                  placeholder="123"
                  required
                  value={cardInfo.cvv}
                  onChange={handleCvvChange}
                  onFocus={() => setFocus("cvc")}
                  fullWidth
                />
              </Grid>
            </Grid>
          </FormGrid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <CreditCard
              number={cardInfo.cardNumber}
              name={cardInfo.cardHolderName}
              expiry={cardInfo.expirationDate}
              cvc={cardInfo.cvv}
              focused={focus}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="saveCard"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)} // Editado para Salvar dados para futuras doações
                sx={{
                  "&.Mui-checked": {
                    color: "green",
                  },
                }}
              />
            }
            label="Salvar cartão de crédito para próximas doações"
          />
        </Grid>
      </Grid>
    </Container>
  );
}
