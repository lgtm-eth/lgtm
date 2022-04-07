import AppBarLayout from "./AppBarLayout";
import React, { useState } from "react";
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
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import projectBannerImageUrl from "./coven_banner.png";
import projectLogoImageUrl from "./coven_logo.png";
import {
  ChevronRight,
  GitHub,
  Twitter,
  WebAsset,
  Folder,
  Article,
  Error,
} from "@mui/icons-material";
import Editor from "@monaco-editor/react";
import Etherscan from "./Etherscan";
import { useApi } from "./api";
import _ from "lodash";

// TODO: make this dynamic
const INFO = {
  "0x5180db8F5c931aaE63c74266b211F580155ecac8": {
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
  "cryptocoven.eth": {
    redirect: {
      to: "/address/0x5180db8F5c931aaE63c74266b211F580155ecac8",
    },
  },
};
INFO["0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"] =
  INFO["0x5180db8F5c931aaE63c74266b211F580155ecac8"];

const SOURCE_INFO = {
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": {
    name: "Uni.sol",
    github: {
      repositoryUrl: "https://github.com/uniswap/v3-core",
    },
    etherscan: {
      verifiedCodeUrl:
        "https://etherscan.io/address/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984#code",
      files: [
        {
          name: "Uni.sol",
          syntax: "solidity ^0.8.0",
        },
      ],
    },
  },
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

function useStaticAddressSourceInfo(addressOrName) {
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

const FileListNav = styled(List)({
  "& .MuiListItemButton-root": {
    pt: 0.5,
    pl: 1,
    pr: 1,
    color: "text.secondary",
  },
  "& .MuiListItemIcon-root": {
    minWidth: 0,
    marginRight: 4,
  },
  "& .MuiListItemIcon-root .MuiSvgIcon-root": {
    fontSize: 14,
    opacity: 0.5,
  },
});

function FileListItem({ node, inset = 0, onPathSelected, selectedPath }) {
  let theme = useTheme();
  let [isExpanded, setExpanded] = useState(selectedPath.startsWith(node.path));
  if (node.type === "file") {
    return (
      <ListItemButton
        sx={{ pl: 2 + 2 * (inset - 1), color: theme.palette.secondary.light }}
        dense
        onClick={() => onPathSelected(node.path)}
        selected={selectedPath === node.path}
      >
        <ListItemIcon sx={{ color: theme.palette.secondary.light }}>
          <ChevronRight sx={{ visibility: "hidden", mr: 1 }} />
          <Article />
        </ListItemIcon>
        <ListItemText
          primary={node.name}
          primaryTypographyProps={{
            variant: "code",
            fontSize: 14,
          }}
        />
      </ListItemButton>
    );
  }
  return (
    <>
      <ListItemButton
        sx={{ height: 36, pl: 2 + 2 * inset }}
        dense
        onClick={() => setExpanded(!isExpanded)}
      >
        <ListItemIcon>
          <ChevronRight
            sx={{ mr: 1, transform: isExpanded ? "rotate(90deg)" : null }}
          />
          <Folder />
        </ListItemIcon>
        <ListItemText
          primary={node.name}
          primaryTypographyProps={{
            variant: "code",
            fontSize: 14,
            color: theme.palette.text.secondary,
          }}
        />
      </ListItemButton>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {_.orderBy(node.children, "name").map((child) => (
            <FileListItem
              key={child.path}
              inset={inset + 1}
              node={child}
              onPathSelected={onPathSelected}
              selectedPath={selectedPath}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}

function FileList({ root, onPathSelected, selectedPath = "" }) {
  let dirs = _.orderBy(root.children, "name").filter(
    ({ type }) => type === "directory"
  );
  return (
    <FileListNav
      sx={{
        // width: '100%',
        height: "100%",
        flexGrow: 1,
        // maxHeight: 300,
        // '& ul': { padding: 0 },
      }}
    >
      {dirs.map((dir) => (
        <FileListItem
          node={dir}
          key={dir.path}
          path={dir.path}
          onPathSelected={onPathSelected}
          selectedPath={selectedPath}
        />
      ))}
    </FileListNav>
  );
}

function keyFilesByPath(node, results = {}) {
  if (node.type === "file") {
    results[node.path] = node;
    return results;
  }
  node.children.forEach((child) => (results = keyFilesByPath(child, results)));
  return results;
}

function SourceViewer({ address }) {
  let { isLoading, isFailure, response } = useApi.getSource({ address });
  if (isLoading) {
    return (
      <Box sx={{ mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isFailure) {
    return (
      <Box sx={{ mt: 3 }}>
        <Error />
      </Box>
    );
  }
  let { fileRoot } = response;
  let filesByPath = keyFilesByPath(fileRoot);
  return (
    <LoadedSourceViewer
      filesByPath={filesByPath}
      address={address}
      {...response}
    />
  );
}

function LoadedSourceViewer({ filesByPath, fileRoot, contractFilePath }) {
  let [tabs, setTabs] = useState([contractFilePath]);
  let [selectedPath, setSelectedPath] = useState(contractFilePath);
  let selectedFile = filesByPath[selectedPath];
  return (
    <Grid container sx={{ flexGrow: 1 }} alignItems="stretch">
      <Grid
        item
        sx={{
          width: 240,
          paddingTop: 6,
          textAlign: "left",
          overflow: "scroll",
        }}
      >
        <FileList
          root={fileRoot}
          onPathSelected={(path) => {
            if (tabs.indexOf(path) === -1) {
              setTabs([path].concat(tabs));
            }
            setSelectedPath(path);
          }}
          {...{ selectedPath }}
        />
      </Grid>
      <Grid item sx={{ minWidth: "50vw" }} xs={true}>
        <Grid
          container
          direction="column"
          sx={{ height: "100%", width: "100%" }}
        >
          <Grid item sx={{ maxWidth: 400 }}>
            <Tabs
              value={selectedPath}
              textColor="inherit"
              onChange={(e, path) => setSelectedPath(path)}
              variant="standard"
            >
              {tabs.map((tab) => (
                <Tab key={tab} label={filesByPath[tab].name} value={tab} />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={true}>
            <Editor
              height="100%"
              options={{ readOnly: true }}
              path={selectedPath}
              theme="vs-dark"
              defaultLanguage={"sol"}
              defaultValue={selectedFile ? selectedFile.content : ""}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

function SourceInfo({ address, sx }) {
  let { github, etherscan } = useStaticAddressSourceInfo(address);
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
          <SourceInfo address={address} />
          {/* TODO */}
          {/*<QuickReview address={address} sx={{ mt: 2 }} />*/}
        </Grid>
      </Grid>
    </AppBarLayout>
  );
}

export function Source() {
  let { address } = useParams();
  return (
    <AppBarLayout hideFooter>
      <SourceViewer address={address} />
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
