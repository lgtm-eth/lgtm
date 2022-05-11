import AppBarLayout from "../components/AppBarLayout";
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Error } from "@mui/icons-material";
import { useApi } from "../api";
import { useLookupAddress } from "../eth";
import SourceViewer from "../components/SourceViewer";

function LoadingAddress() {
  return (
    <AppBarLayout>
      <Container sx={{ textAlign: "center", pt: "30vh" }}>
        <CircularProgress />
      </Container>
    </AppBarLayout>
  );
}

function WalletAddress({ address }) {
  // let theme = useTheme();
  return (
    <AppBarLayout>
      <Grid container>
        <Grid item xs={0} md={4} />
        <Grid xs={12} md={4} item sx={{ pl: 3, pr: 3 }}>
          <WalletInfoTable address={address} sx={{ mt: 1 }} />
        </Grid>
        <Grid item xs={0} md={4} />
      </Grid>
    </AppBarLayout>
  );
}

function WalletDataRow({ label, value }) {
  return (
    <Grid container alignItems="center" sx={{ mt: 1 }}>
      <Grid item xs={2} alignItems="center" sx={{ pr: 1, textAlign: "right" }}>
        <Typography variant="overline" color="secondary.light">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={10} justifyContent="center" sx={{ textAlign: "left" }}>
        <Typography variant={value.length > 30 ? "caption" : "body1"}>
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
}

function WalletInfoTable({ address, sx }) {
  let addressName = useLookupAddress(address);
  return (
    <Card
      elevation={1}
      sx={{
        ...sx,
        display: "block",
        // maxWidth: "400px",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
      }}
    >
      <CardContent sx={{}}>
        <WalletDataRow label="EOA" value={address} />
        {addressName ? (
          <WalletDataRow label="Name" value={addressName} />
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function Address() {
  let { address } = useParams();
  let { isLoading, isFailure, response } = useApi.getAddressInfo({ address });
  console.log({ isLoading, isFailure, response });
  if (isLoading) {
    return <LoadingAddress />;
  }
  if (isFailure) {
    return (
      <AppBarLayout>
        <Container sx={{ textAlign: "center", pt: "30vh" }}>
          <Error />
        </Container>
      </AppBarLayout>
    );
  }
  if (response.redirect) {
    return <Navigate to={response.redirect.to} />;
  }
  if (response.contract) {
    return (
      <AppBarLayout hideFooter>
        <SourceViewer {...response.contract} />
      </AppBarLayout>
    );
  }
  if (response.wallet) {
    return <WalletAddress {...{ address: response.wallet.address }} />;
  }
  return <Error />;
}
