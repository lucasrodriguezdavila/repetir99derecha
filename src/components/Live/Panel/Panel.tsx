import { ReactElement } from "react";
import "./panel.css";

interface Props {
  children?: ReactElement;
}

const Panel = ({ children }: Props) => {
  return <section className="panel">{children}</section>;
};

export default Panel;
