const BulletLijst = ({ items }) => {
	return (
		<ul>
			{items.map((vraag, index) => {
				return (
					<li key={index} className="list-disc list-inside list-item">
						{vraag}
					</li>
				);
			})}
		</ul>
	);
};

export default BulletLijst;
