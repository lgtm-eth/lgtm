import React, { useEffect, useMemo, useRef, useState } from "react";
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
  TextField,
  Card,
  CardContent,
  CardHeader,
  Chip,
} from "@mui/material";
import {
  ChevronRight,
  Folder,
  Article,
  CloseRounded,
} from "@mui/icons-material";
import _ from "lodash";
import { useDocumentTitle } from "../hooks";
import Editor, { loader, useMonaco } from "@monaco-editor/react";
import { useContractSource } from "../api";
import { ethers } from "ethers";
import { useLookupAddress } from "../eth";
import { etherscanUrl } from "../utils/etherscan";
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

function FileList({ address, onPathSelected, selectedPath = "" }) {
  let {
    source: { files },
  } = useContractSource({ address });
  let root = useMemo(() => buildFileTree({ files }), [files]);
  let dirs = _.orderBy(root.children, "name").filter(
    ({ type }) => type === "directory"
  );
  return (
    <FileListNav
      dense
      sx={{
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

function identifyExternal({ source }) {
  let { files, mainContractName, contractPaths } = source;

  let kNames = [mainContractName];
  let externals = {};
  while (kNames.length) {
    let kName = kNames.pop();
    let kPath = contractPaths[kName];
    // TODO: consider excluding interfaces
    let {
      // TODO: move `functions` into the corresponding contract
      //       to handle multiple contracts defined in the same file
      info: { contracts, functions },
    } = files[kPath];
    let { bases } = contracts[kName];
    kNames = kNames.concat(bases || []);
    // NOTE: This .assign() sequence makes the child definition override the parent.
    //       (We start growing `externals` with the child's definitions first.)
    externals = Object.assign(
      {},
      _.mapValues(functions, (fn) => ({
        ...fn,
        contractName: kName,
        contractPath: kPath,
      })),
      externals
    );
  }
  return externals;
}

function decodeCall(iface, externals, input) {
  let prefix = (input || "").substring(0, 10) || "";
  let fn = externals[prefix];
  if (!fn) {
    return null;
  }
  let decoded = _.mapValues(_.keyBy(fn.inputs, "name"), (param) => ({
    param,
    value: null, // will only be set if decoding succeeds
  }));
  try {
    let values = iface.decodeFunctionData(prefix, input);
    decoded = _.mapValues(decoded, ({ param }) => ({
      param,
      value: values[param.name],
    }));
  } catch (ignore) {}
  return { prefix, fn, decoded };
}

function useAbiHintProvider(address, call = null) {
  let callRef = useRef(call);
  let { source } = useContractSource({ address });
  let monaco = useMonaco();

  let { provider, didChangeHints } = useMemo(() => {
    let didChangeHints = new monaco.Emitter();
    let provider = {
      onDidChangeInlayHints: didChangeHints.event,
      provideInlayHints: (model, range, token) => {
        let path = model.uri.path.substring(1);
        let { files } = source || {};
        let functions = files[path]?.info?.functions || {};
        let functionHints = Object.keys(functions).map((sig) => ({
          position: {
            lineNumber: functions[sig].position.line,
            column: functions[sig].position.column,
          },
          label: sig,
          paddingLeft: false,
          paddingRight: false,
          // TODO
          // command: {},
        }));
        let decodedCallHints = [];
        if (callRef.current?.fn?.contractPath === path) {
          decodedCallHints = Object.keys(callRef.current?.decoded).map(
            (pName) => ({
              position: {
                lineNumber: callRef.current?.decoded[pName].param.position.line,
                column:
                  callRef.current?.decoded[pName].param.position.column +
                  pName.length +
                  1,
              },
              type: 2,
              label: `= ${callRef.current?.decoded[pName].value}`,
            })
          );
        }
        let hints = functionHints.concat(decodedCallHints);
        return {
          hints,
          dispose: () => {},
        };
      },
      dispose: () => {},
    };
    return { provider, didChangeHints };
  }, [monaco, source]);
  useEffect(() => {
    callRef.current = call;
    didChangeHints.fire(null);
  }, [call, didChangeHints]);
  return { provider };
}

export default function SourceViewer({ address, initialSearchInput = "" }) {
  let monaco = useMonaco();
  if (!monaco) {
    return null;
  }
  return (
    <LoadedSourceViewer
      address={address}
      initialSearchInput={initialSearchInput}
    />
  );
}

function revealCall(editor, call) {
  let line = call.fn.position.line;
  editor.revealLineNearTop(line, 1);
  editor.setSelection({
    startLineNumber: line,
    endLineNumber: line + 1,
    startColumn: 1,
    endColumn: 1,
  });
  editor.focus();
}

function pathUri(address, path) {
  return `eth-source://${address}/${path}`;
}

function LGTMEditor({ address, selectedPath, call }) {
  let { source } = useContractSource({ address });
  let { provider: abiHintProvider } = useAbiHintProvider(address, call);
  let callRef = useRef(call);
  let editorRef = useRef(null);
  useEffect(() => {
    callRef.current = call;
    if (call) {
      if (
        editorRef.current &&
        editorRef.current.getModel()?.uri?.path === `/${call.fn.contractPath}`
      ) {
        revealCall(editorRef.current, call);
      } // else it will be revealed when the editor model changes.
    }
    // eslint-disable-next-line
  }, [call?.fn?.fragment]);
  let selectedFile = source?.files[selectedPath];
  return (
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
      theme="lgtm-dark"
      defaultLanguage={"sol"}
      loading={<CircularProgress />}
      path={pathUri(address, selectedPath)}
      value={selectedFile ? selectedFile.content : ""}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("lgtm-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editorInlayHint.background": "#050300CC",
            // "editorInlayHint.foreground": "#bcd7fa",
            // "editor.selectionBackground": "#231d14",
            // "editor.inactiveSelectionBackground": "#211A10",
          },
        });
        monaco.languages.registerInlayHintsProvider("sol", abiHintProvider);
        monaco.editor.onDidCreateEditor((editor) => {
          editorRef.current = editor;
          editor.onDidChangeModel(({ newModelUrl }) => {
            if (newModelUrl?.path === `/${callRef.current?.fn?.contractPath}`) {
              revealCall(editor, callRef.current);
            }
          });
        });
      }}
    />
  );
}

function useMainContractPath({ address }) {
  let {
    source: { files, mainContractName, contractPaths },
  } = useContractSource({ address });
  return (contractPaths || {})[mainContractName] || Object.keys(files).pop();
}

function SourceTabs({ address, selectedPath, onSelectedPath }) {
  let mainContractPath = useMainContractPath({ address });
  let tabList = useRef([mainContractPath]);
  tabList.current = _.uniq(
    [mainContractPath].concat(tabList.current).concat(selectedPath)
  );
  return (
    <Tabs
      value={selectedPath}
      textColor="inherit"
      onChange={(e, path) => onSelectedPath(path)}
      variant="standard"
    >
      {tabList.current.map((tab) => (
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
                      onSelectedPath(mainContractPath);
                    }
                    tabList.current = _.without(tabList.current, tab);
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
  );
}

function CallCardAddressParam({ address }) {
  let addressName = useLookupAddress(address);
  return (
    <Chip
      variant={"contained"}
      size={"small"}
      component="a"
      clickable
      target="_blank"
      href={etherscanUrl({ address })}
      label={
        <Typography fontFamily={"monospace"} variant={"caption"}>
          {addressName || address}
        </Typography>
      }
    />
  );
}

function CallCard({ call }) {
  return (
    <Card sx={{ textAlign: "left" }}>
      <CardHeader title={call.fn.name} subheader={call.fn.contractName} />
      <CardContent>
        <Grid container spacing={1}>
          {Object.keys(call.decoded || {}).map((pName) => (
            <React.Fragment key={pName}>
              <Grid item xs={1} textAlign={"right"}>
                <Typography fontFamily={"monospace"} variant={"caption"}>
                  {pName}
                </Typography>
              </Grid>
              <Grid item xs={11}>
                {call.decoded[pName].param.type === "address" ? ( // make addresses pretty
                  <CallCardAddressParam address={call.decoded[pName].value} />
                ) : (
                  // default treatment
                  <Typography fontFamily={"monospace"} variant={"caption"}>
                    {`${call.decoded[pName].value}`}
                  </Typography>
                )}
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

function LoadedSourceViewer({ address, initialSearchInput }) {
  let [searchInput, setSearchInput] = useState(initialSearchInput);
  let { source } = useContractSource({ address });
  let { externals, iface } = useMemo(() => {
    let externals = identifyExternal({ source });
    let iface = new ethers.utils.Interface(source.ABI);
    return { externals, iface };
  }, [source]);
  let [call, setCall] = useState(
    decodeCall(iface, externals, initialSearchInput)
  );
  let mainContractPath = useMainContractPath({ address });
  let [selectedPath, setSelectedPath] = useState(
    call?.fn?.contractPath || mainContractPath
  );
  useDocumentTitle(`${selectedPath.split("/").pop()} - ${address}`);

  console.log({ call });
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
        {/*<DecoderTextField*/}
        {/*  address={address}*/}
        {/*  onSelectedCall={(call) => setCall(call)}*/}
        {/*  initialInput={""}*/}
        {/*/>*/}
        <TextField
          size={"small"}
          variant={"filled"}
          color={"secondary"}
          value={searchInput}
          autoFocus
          onChange={(e) => {
            setSearchInput(e.target.value);
            let call = decodeCall(iface, externals, e.target.value);
            setCall(call);
            if (call) {
              setSelectedPath(call.fn.contractPath);
            }
          }}
          InputProps={{
            sx: {
              borderRadius: 0,
            },
          }}
          fullWidth
          multiline
          helperText={call ? `Decoded: ${call?.fn?.name}` : ""}
          maxRows={10}
        />
        <FileList
          address={address}
          onPathSelected={setSelectedPath}
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
            <SourceTabs
              address={address}
              selectedPath={selectedPath}
              onSelectedPath={setSelectedPath}
            />
          </Grid>
          {call?.fn?.contractPath === selectedPath && (
            <Grid item>
              <CallCard call={call} />
            </Grid>
          )}
          <Grid item xs={true}>
            <LGTMEditor
              address={address}
              selectedPath={selectedPath}
              call={call}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
