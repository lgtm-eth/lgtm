import React, { useState } from "react";
import {
  Grid,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import { ChevronRight, Folder, Article } from "@mui/icons-material";
import Editor from "@monaco-editor/react";
import _ from "lodash";
import { useDocumentTitle } from "../hooks";

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
          {_.orderBy(node.children, ["type", "name"]).map((child) => (
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

export default function SourceViewer({ address, source, byteCode }) {
  let { contractFilePath, fileRoot } = source || {};
  let [tabs, setTabs] = useState([contractFilePath]);
  let [selectedPath, setSelectedPath] = useState(contractFilePath);
  useDocumentTitle(`${source.contractName} - ${address}`);
  let filesByPath = keyFilesByPath(fileRoot) || {};
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
              defaultLanguage={selectedPath.endsWith(".vy") ? "vy" : "sol"}
              defaultValue={selectedFile ? selectedFile.content : ""}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
