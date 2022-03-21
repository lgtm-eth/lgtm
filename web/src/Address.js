import AppBarLayout from "./AppBarLayout";
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import reviewStatusLG from "./review-status-lg.svg";
import projectBannerImageUrl from "./coven_banner.png";
import projectLogoImageUrl from "./coven_logo.png";
import { Twitter, WebAsset } from "@mui/icons-material";

// TODO: make this dynamic
const INFO = {
  "0x5180db8F5c931aaE63c74266b211F580155ecac8": {
    redirect: {
      to: "/address/cryptocoven.eth",
    },
  },
  "cryptocoven.eth": {
    contract: {
      projectName: "Crypto Coven",
      projectReviewPercentage: 84,
      projectUrl: "https://cryptocoven.xyz",
      projectTwitterName: "crypto_coven",
      projectBannerImageUrl,
      projectLogoImageUrl,
    },
  },
};

function useAddressInfo(address) {
  return INFO[address]; // TODO real data
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

function ReviewSummary({ percentage, sx }) {
  let theme = useTheme();
  return (
    <Grid
      container
      sx={{
        ...sx,
        borderRadius: "36px",
        overflow: "hidden",
        height: 72,
        [theme.breakpoints.down("md")]: {
          ...sx[theme.breakpoints.down("md")],
          borderRadius: "18px",
          height: 36,
        },
        width: "auto",
        textAlign: "center",
      }}
    >
      <Grid
        item
        sx={{
          backgroundColor: theme.palette.primary.main,
          height: 72,
          width: 72,
          padding: "12px 12px 12px 18px",
          [theme.breakpoints.down("md")]: {
            height: 36,
            width: 36,
            padding: "6px 6px 6px 9px",
          },
        }}
      >
        <Box
          component="img"
          src={reviewStatusLG}
          sx={{
            width: 48,
            height: 48,
            [theme.breakpoints.down("md")]: {
              width: 24,
              height: 24,
            },
          }}
        />
      </Grid>
      <Grid
        item
        sx={{
          backgroundColor: theme.palette.secondary.main,
          height: 72,
          padding: "12px 18px 12px 12px",
          [theme.breakpoints.down("md")]: {
            height: 36,
            padding: "6px 9px 6px 6px",
          },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            [theme.breakpoints.down("md")]: {
              fontSize: "20px",
            },
          }}
        >
          {percentage}%
        </Typography>
      </Grid>
    </Grid>
  );
}

function ContractAddress({ address }) {
  let theme = useTheme();
  let { contract } = useAddressInfo(address);
  let {
    projectName,
    projectBannerImageUrl,
    projectLogoImageUrl,
    projectReviewPercentage,
    projectUrl,
    projectTwitterName,
  } = contract;
  return (
    <AppBarLayout>
      <Box sx={{ position: "relative", textAlign: "center", zIndex: -1 }}>
        <Box
          component="img"
          src={projectBannerImageUrl}
          sx={{
            width: "100vw",
            height: "20vw",
            [theme.breakpoints.down("md")]: {
              width: "100vw",
              height: "50vw",
            },
            // width: "100%",
            // height: "600px",
            objectFit: "cover",
            // position: "absolute",
            // zIndex: 0,
            // top: 0,
            // left: 0,
          }}
        />
        <Box
          sx={{
            width: "100vw",
            height: "20vw",
            [theme.breakpoints.down("md")]: {
              width: "100vw",
              height: "50vw",
            },
            background:
              "radial-gradient(circle at 0%, #fff, transparent 80%, transparent 100%)",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <ReviewSummary
          sx={{
            position: "absolute",
            bottom: 18,
            left: 24,
            [theme.breakpoints.down("md")]: {
              left: 16,
            },
          }}
          status="LG"
          percentage={projectReviewPercentage}
        />
      </Box>
      <Box
        component="img"
        src={projectLogoImageUrl}
        sx={{
          width: 126,
          height: 126,
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
          color="secondary"
          sx={{ mb: 0.25 }}
          href={projectUrl}
          startIcon={<WebAsset />}
        >
          {projectUrl}
        </Button>
        <br />
        <Button
          variant="text"
          size="small"
          color="secondary"
          href={`https://twitter.com/${projectTwitterName}`}
          startIcon={<Twitter />}
        >
          @{projectTwitterName}
        </Button>
      </Box>
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
