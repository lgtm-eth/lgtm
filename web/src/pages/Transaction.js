import { useParams } from "react-router-dom";

export default function Transaction() {
  let { tx } = useParams();
  window.location.replace(`https://etherscan.io/tx/${tx}`);
  // TODO
  return null;
}
