import AppBarLayout from "../components/AppBarLayout";
import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { Error, GitHub, Twitter, WebAsset } from "@mui/icons-material";
import Etherscan from "../components/icons/Etherscan";
import { useApi } from "../api";
import { useLookupAddress } from "../eth";

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

function DataRow({ label, value }) {
  return (
    <Grid container alignItems="center" sx={{ mt: 1 }}>
      <Grid item xs={4} alignItems="center" sx={{ pr: 1, textAlign: "right" }}>
        <Typography variant="overline" color="secondary.light">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={8} justifyContent="center" sx={{ textAlign: "left" }}>
        <Typography>{value}</Typography>
      </Grid>
    </Grid>
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

function ProjectTopBanner({ address, contract, sx }) {
  let { projectBannerImageUrl } = contract.project || {};
  return (
    <Box
      component="img"
      src={projectBannerImageUrl}
      sx={{
        ...sx,
        objectFit: "cover",
        filter: "grayscale(60%)",
      }}
    />
  );
}

function ProjectInfoTable({ address, sx }) {
  // TODO: let {...} = use<TBD>(address)
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
        <Grid container>
          <Grid item xs={4} sx={{ textAlign: "right" }} />
          <Grid item xs={8} sx={{ textAlign: "left" }}>
            <Grid container spacing={0.5}>
              <Grid item>
                <Chip color="default" size="small" label="NFT" />
              </Grid>
              <Grid item>
                <Chip color="default" size="small" label="Ownable" />
              </Grid>
              <Grid item>
                <Chip color="default" size="small" label="Royalties" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* TODO: use loaded data */}
        <DataRow label="NFT" value="Crypto Coven (WITCH)" />
        <DataRow label="Supply" value="9.8K" />
        <DataRow label="Owner" value="0xac9d...17fa" />
        <DataRow label="Royalty" value="7.5%" />
      </CardContent>
    </Card>
  );
}

function ProjectHeroLockup({ address, contract }) {
  let theme = useTheme();
  let { projectName, projectLogoImageUrl, projectWebUrl, projectTwitterName } =
    contract.project || {};
  return (
    <Box>
      <Box
        component="img"
        src={projectLogoImageUrl}
        sx={{
          width: 126,
          height: 126,
          filter: "grayscale(60%)",
          borderRadius: "63px",
          border: `5px solid ${theme.palette.background.default}`,
          marginTop: "-63px",
          [theme.breakpoints.down("md")]: {
            width: 96,
            height: 96,
            borderRadius: "48px",
            border: `3px solid ${theme.palette.background.default}`,
            marginTop: "-48px",
          },
          marginLeft: "auto",
          marginRight: "auto",
          zIndex: 100,
        }}
      />
      <Typography
        variant="h1"
        sx={{
          textAlign: "center",
          fontSize: "40px",
          [theme.breakpoints.down("md")]: {
            fontSize: "32px",
          },
        }}
      >
        {projectName}
      </Typography>
      {/* TODO */}
      {/*<ReviewSummary*/}
      {/*  address={address}*/}
      {/*  sx={{*/}
      {/*    mt: 1,*/}
      {/*  }}*/}
      {/*/>*/}
      <Box
        sx={{
          textAlign: "left",
          p: 1,
          display: "inline-block",
          maxWidth: "250px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Button
          variant="text"
          size="small"
          color="inherit"
          sx={{ my: 0.5 }}
          href={projectWebUrl}
          startIcon={<WebAsset />}
        >
          {projectWebUrl}
        </Button>
        <br />
        <Button
          variant="text"
          size="small"
          color="inherit"
          href={`https://twitter.com/${projectTwitterName}`}
          startIcon={<Twitter />}
        >
          @{projectTwitterName}
        </Button>
      </Box>
    </Box>
  );
}

function ProjectSourceInfo({ address, contract, sx }) {
  let { github, etherscan } = contract.source;
  return (
    <Card
      sx={{
        ...sx,
        textAlign: "left",
      }}
    >
      <CardContent>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <Grid container direction="column" spacing={1}>
              {github && github.repositoryUrl && (
                <Grid item>
                  <Button
                    variant="text"
                    size="small"
                    color="inherit"
                    href={github.repositoryUrl}
                    startIcon={<GitHub />}
                  >
                    {github.repositoryUrl.split("github.com/").pop()}
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Button
                  variant="text"
                  size="small"
                  color="inherit"
                  href={etherscan.verifiedCodeUrl}
                  startIcon={<Etherscan />}
                >
                  {etherscan.verifiedCodeUrl
                    .split("etherscan.io/address/")
                    .pop()}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Card elevation={8}>
              <CardActionArea component={Link} to={`/address/${address}/code`}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {etherscan.files[0].name}
                  </Typography>
                  <Typography variant="caption" color="secondary.light">
                    {etherscan.files[0].syntax}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            {/*<Modal*/}
            {/*  open={isShowingSource}*/}
            {/*  onClose={() => setShowingSource(false)}*/}
            {/*  sx={{*/}
            {/*    display: "flex",*/}
            {/*    p: 10,*/}
            {/*    alignItems: "center",*/}
            {/*    justifyContent: "center",*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <Card elevation={20} sx={{maxHeight: "50vh"}}>*/}
            {/*    <CardContent sx={{textAlign: "center"}} spacing={1}>*/}
            {/*      <SourceViewer address={address} sx={{flexGrow: 1}}/>*/}
            {/*    </CardContent>*/}
            {/*    <CardActions sx={{float: "right"}}>*/}
            {/*      <Button component={Link} to={`/address/${address}/code`} startIcon={<Fullscreen/>}>Full Screen</Button>*/}
            {/*    </CardActions>*/}
            {/*  </Card>*/}
            {/*</Modal>*/}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function ContractAddress({ address, contract }) {
  let theme = useTheme();
  return (
    <AppBarLayout>
      <Box sx={{ position: "relative", textAlign: "center", zIndex: -1 }}>
        <ProjectTopBanner
          address={address}
          contract={contract}
          sx={{
            width: "100vw",
            height: "20vw",
            [theme.breakpoints.down("md")]: {
              width: "100vw",
              height: "50vw",
            },
          }}
        />
      </Box>
      <Grid container>
        <Grid
          xs={0}
          md={4}
          item
          sx={{
            p: 3,
            [theme.breakpoints.down("md")]: {
              display: "none",
            },
          }}
        >
          <ProjectInfoTable address={address} />
        </Grid>
        <Grid xs={12} md={4} item sx={{ pl: 3, pr: 3 }}>
          <ProjectHeroLockup address={address} contract={contract} />
          <Box
            sx={{
              [theme.breakpoints.up("md")]: {
                display: "none",
              },
            }}
          >
            <ProjectInfoTable address={address} sx={{ mt: 1 }} />

            <ProjectSourceInfo
              address={address}
              contract={contract}
              sx={{ mt: 1 }}
            />
            {/* TODO */}
            {/*<QuickReview address={address} sx={{ mt: 2 }} />*/}
          </Box>
        </Grid>
        <Grid
          xs={0}
          md={4}
          item
          sx={{
            p: 3,
            [theme.breakpoints.down("md")]: {
              display: "none",
            },
          }}
        >
          <ProjectSourceInfo address={address} contract={contract} />
          {/* TODO */}
          {/*<QuickReview address={address} sx={{ mt: 2 }} />*/}
        </Grid>
      </Grid>
    </AppBarLayout>
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
    return <ContractAddress {...{ address, contract: response.contract }} />;
  }
  if (response.wallet) {
    return <WalletAddress {...{ address: response.wallet.address }} />;
  }
  return <Error />;
}
