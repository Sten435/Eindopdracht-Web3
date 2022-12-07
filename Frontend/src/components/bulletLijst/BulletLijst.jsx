const BulletLijst = ({ items }) => {
	return (
		<ul>
			{items.map((vraag, index) => {
				return <li key={index}>{vraag}</li>;
			})}
		</ul>
	);
};

export default BulletLijst;
