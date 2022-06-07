import { useParams } from "react-router-dom";
import { etherscanUrl } from "../utils/etherscan";

export default function Transaction() {
  let { tx } = useParams();
  window.location.replace(etherscanUrl({ tx }));
  return null;
}
