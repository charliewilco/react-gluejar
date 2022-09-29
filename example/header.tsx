import React from "react";

const linkStyle = {
	color: "#147aab",
	textDecoration: "none",
};

export const Header = () => (
	<header
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			marginBottom: 24,
		}}>
		<h1 style={{ fontWeight: 300, fontSize: 18 }}>Gluejar</h1>
		<nav style={{ opacity: 0.75 }}>
			<a style={linkStyle} href="https://github.com/charliewilco/react-gluejar">
				Source
			</a>
		</nav>
	</header>
);

export const Instructions = () => (
	<h2 style={{ fontWeight: 300, marginBottom: 24 }}>
		Copy an image from your file system and paste it here
	</h2>
);

export const Sorry = ({ error, onClose }: { error: string; onClose(): void }) => (
	<div>
		<h3>
			{error} <button onClick={onClose}>&times;</button>
		</h3>
	</div>
);
