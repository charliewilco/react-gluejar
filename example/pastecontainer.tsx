import React from "react";
import { render } from "react-dom";
import { useGlueJar } from "../src";
import { Header, Instructions } from "./header";

const imageStyle = {
	maxWidth: `100%`,
	display: "inline-block",
	verticalAlign: "middle",
	fontStyle: "italic",
	marginBottom: 8,
};

const App = () => {
	const { pasted, error } = useGlueJar();

	return (
		<div
			style={{
				maxWidth: 600,
				margin: `1rem auto`,
				textAlign: "center",
			}}>
			<Header />
			<Instructions />
			{error !== null && <span>{error}</span>}
			<div>
				{pasted.length > 0 &&
					pasted.map((image) => (
						<img src={image} key={image} alt={`Pasted: ${image}`} style={imageStyle} />
					))}
			</div>
		</div>
	);
};

render(<App />, document.getElementById("root"));
