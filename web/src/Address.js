import AppBarLayout from "./AppBarLayout";
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
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
import reviewStatusLG from "./review-status-lg.svg";
import projectBannerImageUrl from "./coven_banner.png";
import projectLogoImageUrl from "./coven_logo.png";
import { Check, GitHub, Twitter, WebAsset } from "@mui/icons-material";
import Etherscan from "./Etherscan";

// TODO: make this dynamic
const INFO = {
  "0x5180db8F5c931aaE63c74266b211F580155ecac8": {
    redirect: {
      to: "/address/cryptocoven.eth",
    },
  },
  "cryptocoven.eth": {
    contract: {
      address: "0x5180db8F5c931aaE63c74266b211F580155ecac8",
      addressName: "cryptocoven.eth",
      projectName: "Crypto Coven",
      projectReviewPercentage: 84,
      projectWebUrl: "https://cryptocoven.xyz",
      projectTwitterName: "crypto_coven",
      projectBannerImageUrl,
      projectLogoImageUrl,
    },
  },
};

const SOURCE_INFO = {
  "0x5180db8F5c931aaE63c74266b211F580155ecac8": {
    name: "CryptoCoven.sol",
    github: {
      repositoryUrl: "https://github.com/cryptocoven/contracts",
    },
    etherscan: {
      verifiedCodeUrl: "https://etherscan.io/address/cryptocoven.eth#code",
      compilation: {
        compilerVersion: "v0.8.4+commit.c7e474f2",
        optimization: {
          enabled: true,
          runs: 100_000,
        },
      },
      files: [
        {
          name: "CryptoCoven.sol",
          syntax: "solidity ^0.8.0",
        },
      ],
    },
  },
};
SOURCE_INFO["cryptocoven.eth"] =
  SOURCE_INFO["0x5180db8F5c931aaE63c74266b211F580155ecac8"];

function useAddressInfo(addressOrName) {
  return INFO[addressOrName]; // TODO real data
}

function useAddressSourceInfo(addressOrName) {
  return SOURCE_INFO[addressOrName]; // TODO real data
}

function LoadingAddress() {
  return (
    <AppBarLayout>
      <Container sx={{ textAlign: "center", pt: "30vh" }}>
        <CircularProgress />
      </Container>
    </AppBarLayout>
  );
}

function WalletAddress() {
  return (
    <AppBarLayout>
      {/*  TODO: "don't judge people, judge actions" */}
    </AppBarLayout>
  );
}

function ReviewSummary({ size = 1, address, sx = {} }) {
  let theme = useTheme();
  let { contract } = useAddressInfo(address);
  let { projectReviewPercentage } = contract;
  return (
    <Grid container justifyContent="center" alignItems="center" sx={sx}>
      <Grid item>
        <Box
          sx={{
            display: "inline-block",
            backgroundColor: theme.palette.primary.main,
            height: 48,
            width: 48,
            borderRadius: 24,
            // border: `3px solid ${theme.palette.info.main}`,
            padding: "8px 8px 8px 8px",
          }}
        >
          <Box
            component="img"
            src={reviewStatusLG}
            sx={{
              width: 32,
              height: 32,
            }}
          />
        </Box>
      </Grid>
      <Grid item ml={-1} zIndex={-1}>
        <Typography
          variant="h3"
          sx={{
            m: 0,
            display: "inline-block",
            backgroundColor: "#192319",
            // height: 48,
            px: "24px",
            fontSize: "26px",
          }}
        >
          {projectReviewPercentage}%
        </Typography>
      </Grid>
    </Grid>
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

function TopBanner({ address, sx }) {
  let { contract } = useAddressInfo(address);
  let { projectBannerImageUrl } = contract;
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

function InfoTable({ address, sx }) {
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

function HeroLockup({ address }) {
  let theme = useTheme();
  let { contract } = useAddressInfo(address);
  let { projectName, projectLogoImageUrl, projectWebUrl, projectTwitterName } =
    contract;
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
      <ReviewSummary
        address={address}
        sx={{
          mt: 1,
        }}
      />
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

function SourceInfo({ address, sx }) {
  let { github, etherscan } = useAddressSourceInfo(address);
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
              <CardActionArea>
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
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function QuickReview({ address, sx }) {
  return (
    <Grid justifyContent="center" spacing={1} container sx={{ ...sx }}>
      <Grid item>
        <Avatar />
      </Grid>
      <Grid item>
        <ButtonGroup>
          <Button sx={{ width: "48px" }} variant="contained" color="warning">
            !
          </Button>
          <Button sx={{ width: "48px" }} variant="contained" color="info">
            ?
          </Button>
          <Button sx={{ width: "48px" }} variant="contained" color="primary">
            <Check fontSize="inherit" />
          </Button>
        </ButtonGroup>
        <Typography component="p" variant="overline">
          Quick Review
        </Typography>
      </Grid>
    </Grid>
  );
}

function ContractAddress({ address }) {
  let theme = useTheme();
  return (
    <AppBarLayout>
      <Box sx={{ position: "relative", textAlign: "center", zIndex: -1 }}>
        <TopBanner
          address={address}
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
          <InfoTable address={address} />
        </Grid>
        <Grid xs={12} md={4} item sx={{ pl: 3, pr: 3 }}>
          <HeroLockup address={address} />
          <Box
            sx={{
              [theme.breakpoints.up("md")]: {
                display: "none",
              },
            }}
          >
            <InfoTable address={address} sx={{ mt: 1 }} />

            <SourceInfo address={address} sx={{ mt: 1 }} />
            <QuickReview address={address} sx={{ mt: 2 }} />
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
          <SourceInfo address={address} />
          <QuickReview address={address} sx={{ mt: 2 }} />
        </Grid>
      </Grid>
    </AppBarLayout>
  );
}

export default function Address() {
  let { address } = useParams();
  let info = useAddressInfo(address);
  if (!info) {
    return <LoadingAddress />;
  }
  if (info.redirect) {
    return <Navigate to={info.redirect.to} />;
  }
  if (info.contract) {
    return <ContractAddress {...{ address }} />;
  }
  return <WalletAddress {...{ address }} />;
}
