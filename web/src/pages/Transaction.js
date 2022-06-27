import { useParams } from "react-router-dom";
import { etherscanUrl } from "../utils/etherscan";
import { useTransaction } from "../eth";
import AppBarLayout, {
  AppBarWithCenterpiece,
} from "../components/AppBarLayout";
import { CircularProgress } from "@mui/material";
import { Error } from "@mui/icons-material";
import React from "react";
import SourceViewer from "../components/SourceViewer";
import { useAddressInfo } from "../api";

function LoadedTransaction({ address, tx, input }) {
  let { isLoading, isError, info } = useAddressInfo({ address });
  if (isLoading) {
    return (
      <AppBarWithCenterpiece>
        <CircularProgress />
      </AppBarWithCenterpiece>
    );
  }
  if (isError) {
    return (
      <AppBarWithCenterpiece>
        <Error />
      </AppBarWithCenterpiece>
    );
  }
  if (!info.contract) {
    // Not interacting with a contract
    window.location.replace(etherscanUrl({ tx }));
    return null;
  }
  return (
    <AppBarLayout hideFooter>
      <SourceViewer address={address} initialSearchInput={input} />
    </AppBarLayout>
  );
}

export default function Transaction() {
  let { tx } = useParams();
  let { isLoading, isError, data } = useTransaction(tx);
  if (isLoading) {
    return (
      <AppBarWithCenterpiece>
        <CircularProgress />
      </AppBarWithCenterpiece>
    );
  }
  if (isError) {
    return (
      <AppBarWithCenterpiece>
        <Error />
      </AppBarWithCenterpiece>
    );
  }
  console.log(data.to, data.data, data);
  if (!data.to) {
    // Contract creation
    window.location.replace(etherscanUrl({ tx }));
    return null;
  }
  return <LoadedTransaction tx={tx} address={data.to} input={data.data} />;
}
