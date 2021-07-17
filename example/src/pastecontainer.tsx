import React from "react";
import { render } from "react-dom";
import { useGlueJar } from "../../src";
// import { Gluejar } from "@charliewilco/gluejar/legacy";

export const App = () => {
  const { pasted, error } = useGlueJar();

  return (
    <div className="Container">
      <Header />
      <Instructions />
      <Sorry error={error} />
      <div>{pasted.length > 0 && pasted.map(renderPastedImage)}</div>
    </div>
  );
};

const renderPastedImage = (source: string) => {
  const alt = `Pasted: ${source}`;
  return <img src={source} key={source} alt={alt} className="PastedImage" />;
};

const Header = () => (
  <header className="Header">
    <h1 className="HeaderTitle">Gluejar</h1>
    <nav className="Nav">
      <a className="Link" href="https://github.com/charliewilco/react-gluejar">
        Source
      </a>
    </nav>
  </header>
);

const Instructions = () => (
  <h2 className="Instructions">Copy an image from your file system and paste it here</h2>
);

const Sorry = ({ error }: { error: string | null }) =>
  error !== null ? (
    <div>
      <h3>{error}</h3>
    </div>
  ) : null;

render(<App />, document.getElementById("root"));
