import { useLookupAddress } from "../eth";
import { Chip, Typography } from "@mui/material";
import { etherscanUrl } from "../utils/etherscan";
import React from "react";

export default function AddressChip({ address, ...props }) {
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
      {...props}
    />
  );
}
