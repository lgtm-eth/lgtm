import React, { useMemo, useState } from "react";
import {
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
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
import {
  ChevronRight,
  Folder,
  Article,
  CloseRounded,
} from "@mui/icons-material";
import _ from "lodash";
import { useDocumentTitle } from "../hooks";
import Editor, { loader } from "@monaco-editor/react";
import { decodeFileHash, encodeFileHash } from "../utils/fileHashCodec";
import { useLocation } from "react-router-dom";
loader.config({
  paths: {
    vs: process.env.PUBLIC_URL + "/vs",
  },
});

// TODO: reconcile either styled component or inline styles
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
        sx={{ pl: 1 + inset, color: theme.palette.secondary.light }}
        dense
        onClick={() => onPathSelected(node.path)}
        selected={selectedPath === node.path}
      >
        <ListItemIcon sx={{ color: theme.palette.secondary.light }}>
          <ChevronRight sx={{ visibility: "hidden", mr: 0.25 }} />
          <Article />
        </ListItemIcon>
        <ListItemText
          primary={node.name}
          primaryTypographyProps={{
            variant: "code",
            fontSize: 12,
          }}
        />
      </ListItemButton>
    );
  }
  return (
    <>
      <ListItemButton
        sx={{ height: 36, pl: 1 + inset }}
        dense
        onClick={() => setExpanded(!isExpanded)}
      >
        <ListItemIcon>
          <ChevronRight
            sx={{ mr: 0.25, transform: isExpanded ? "rotate(90deg)" : null }}
          />
          <Folder />
        </ListItemIcon>
        <ListItemText
          primary={node.name}
          primaryTypographyProps={{
            variant: "code",
            fontSize: 12,
            color: selectedPath.startsWith(node.path)
              ? theme.palette.text.primary
              : theme.palette.text.secondary,
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

function buildFileTree({ files }) {
  let root = {
    type: "directory",
    name: "",
    path: "",
    children: [],
  };
  Object.keys(files).forEach((path) => {
    let parts = path.split("/");
    let dir = root;
    let fileName = parts[parts.length - 1];
    // First make/find the directories (e.g. mkdir -p)
    for (let i = 0; i < parts.length - 1; i++) {
      let nextDirName = parts[i];
      let nextDir = dir.children.find((d) => d.name === nextDirName);
      if (!nextDir) {
        nextDir = {
          type: "directory",
          name: nextDirName,
          path: dir.path ? `${dir.path}/${nextDirName}` : nextDirName,
          children: [],
        };
        dir.children.push(nextDir);
        // console.log("+dir: ", nextDirName)
      }
      dir = nextDir;
    }
    // Add the file at the found directory.
    dir.children.push({
      type: "file",
      name: fileName,
      path,
      content: files[path].content,
      info: files[path].info,
    });
    // console.log("+file: ", fileName)
  });
  return root;
}

function FileList({ files, onPathSelected, selectedPath = "" }) {
  let root = useMemo(() => buildFileTree({ files }), [files]);
  let dirs = _.orderBy(root.children, "name").filter(
    ({ type }) => type === "directory"
  );
  return (
    <FileListNav
      dense
      sx={{
        pt: 6,
        bgcolor: "background.menu",
        height: (theme) => `calc(100vh - ${theme.spacing(14)})`,
        overflow: "scroll",
        flexGrow: 1,
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

export default function SourceViewer({
  addressInfo,
  call = "0x23b872dd000000000000000000000000423fa6f71071926cf8044084d8b0086cd053061e0000000000000000000000003513fda59c1932232553831ca4d3de32f731b62c0000000000000000000000000000000000000000000000000000000000000cb8",
}) {
  let { address, source } = addressInfo;
  let { files, mainContractName, contractPaths } = source || {};
  let mainContractPath =
    (contractPaths || {})[mainContractName] || Object.keys(files).pop();
  let { hash } = useLocation();
  let initialPath = decodeFileHash(hash).path.substring(1);
  let initialSelection = decodeFileHash(hash).selection;
  if (!files[initialPath]) {
    initialPath = mainContractPath;
  }
  if (!files[initialPath]) {
    initialPath = Object.keys(files || {})[0];
  }
  let [selectedPath, setSelectedPath] = useState(initialPath);
  let selectedFile = files[selectedPath];
  let [tabs, setTabs] = useState(_.uniq([mainContractPath, initialPath]));
  useDocumentTitle(`${selectedPath.split("/").pop()} - ${address}`);
  return (
    <Grid container sx={{ flexGrow: 1 }} alignItems="stretch">
      <Grid
        item
        sx={{
          width: 220,
          maxWidth: "40vw",
          textAlign: "left",
          overflow: "scroll",
        }}
      >
        <FileList
          files={files}
          onPathSelected={(path) => {
            if (tabs.indexOf(path) === -1) {
              setTabs(_.uniq([mainContractPath].concat([path]).concat(tabs)));
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
                <Tab
                  sx={{
                    pl: 1.5,
                    pr: tab !== mainContractPath ? 0 : 1.5,
                    pt: 0,
                    pb: 0,
                  }}
                  key={tab}
                  component="div"
                  label={
                    <Typography
                      sx={{
                        fontSize: 12,
                      }}
                    >
                      {tab.split("/").pop()}
                      {tab !== mainContractPath && (
                        <IconButton
                          size="small"
                          color="secondary"
                          sx={{
                            height: "100%",
                            p: 0,
                            pl: 1,
                            pr: 1,
                            fontSize: 12,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (tab === selectedPath) {
                              setSelectedPath(mainContractPath);
                            }
                            setTabs(_.without(tabs, tab));
                          }}
                        >
                          <CloseRounded sx={{ fontSize: 12 }} />
                        </IconButton>
                      )}
                    </Typography>
                  }
                  value={tab}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={true}>
            <Editor
              height="100%"
              options={{
                readOnly: true,
                glyphMargin: true,
                minimap: {
                  size: "proportional",
                  scale: 2,
                  showSlider: "always",
                },
              }}
              theme="vs-dark"
              defaultLanguage={"sol"}
              loading={<CircularProgress />}
              path={`eth-source://${address}/${selectedPath}`}
              value={selectedFile ? selectedFile.content : ""}
              beforeMount={(monaco) => {
                monaco.languages.registerInlayHintsProvider("sol", {
                  provideInlayHints: function (model, range, token) {
                    let path = model.uri.path.substring(1);
                    let functions = files[path]?.info?.functions || {};
                    return {
                      hints: Object.keys(functions).map((sig) => ({
                        position: {
                          lineNumber: functions[sig].position.line,
                          column: functions[sig].position.column,
                        },
                        label: sig,
                        paddingLeft: false,
                        paddingRight: false,
                      })),
                      dispose: () => {},
                    };
                  },
                });
                // monaco.languages.registerCodeLensProvider("sol", {
                //   provideCodeLenses: function (model, token) {
                //     return {
                //       lenses: [
                //         {
                //           range: {
                //             startLineNumber: 1,
                //             startColumn: 1,
                //             endLineNumber: 2,
                //             endColumn: 1,
                //           },
                //           id: "0x23b872dd",
                //           command: {
                //             id: "TODO",
                //             title: "0x23b872dd\ntest 1234\nand yet another",
                //             tooltip: "mintCommunitySale",
                //           },
                //         },
                //       ],
                //       dispose: () => {},
                //     };
                //   },
                //   resolveCodeLens: function (model, codeLens, token) {
                //     return codeLens;
                //   },
                // });
                monaco.editor.onDidCreateEditor((editor) => {
                  let isInitializing = true;
                  editor.onDidChangeModel((e) => {
                    if (isInitializing) {
                      isInitializing = false;
                      if (initialSelection) {
                        editor.setSelection({
                          ...initialSelection,
                          startColumn: 1,
                          endColumn: 1,
                        });
                        editor.revealLinesInCenter(
                          initialSelection.startLineNumber,
                          initialSelection.endLineNumber
                        );
                      }
                    }
                    window.location.hash = encodeFileHash({
                      path: editor.getModel().uri.path,
                      selection: editor.getSelection(),
                    });
                  });
                  editor.onDidChangeCursorSelection((e) => {
                    window.location.hash = encodeFileHash({
                      path: editor.getModel().uri.path,
                      selection: e.selection,
                    });
                  });
                });
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
