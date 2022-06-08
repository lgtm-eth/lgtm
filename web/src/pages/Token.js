import { useParams } from "react-router-dom";
import { etherscanUrl } from "../utils/etherscan";

export default function Token() {
  let { token } = useParams();
  window.location.replace(etherscanUrl({ token }));
  return null;
}
