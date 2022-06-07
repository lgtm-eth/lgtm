import { useParams } from "react-router-dom";
import { etherscanUrl } from "../utils/etherscan";

export default function Block() {
  let { block } = useParams();
  window.location.replace(etherscanUrl({ block }));
  return null;
}
