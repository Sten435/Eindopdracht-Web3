export default (socket, next) => {
	socket.on('vraagHulp', ({ userId }) => {
		console.log('vraagHulp: ', userId);
	});
	next();
};
