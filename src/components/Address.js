import { useLookupAddress } from "../hooks";

const blockExplorerLink = (address, blockExplorer) =>
  `${blockExplorer || "https://etherscan.io/"}${"address/"}${address}`;


export default function Address(props) {
    const address = props.value || props.address;
    const ens = useLookupAddress(props.ensProvider, address);
    if (!address) {
        return null;
    }
    let displayAddress = address.substr(0, 6);
    if (ens && ens.indexOf("0x") < 0) {
        displayAddress = ens;
      } else if (props.size === "short") {
        displayAddress += "..." + address.substr(-4);
      } else if (props.size === "long") {
        displayAddress = address;
      } else {
        displayAddress += "..." + address.substr(-4);
      }

    const etherscanLink = blockExplorerLink(address, props.blockExplorer);

    return(
        <span title={address}>
            <strong>Your wallet address: </strong>
            <a href={etherscanLink} target="_blank" rel="noopener noreferrer" className="text-inherit">
                { displayAddress }
            </a>
        </span>
    )

}