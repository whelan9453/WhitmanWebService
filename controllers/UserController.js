let helloWorld = function (req, res, next) {
	console.log('123', 'test');
    res.send('ok');
}

module.exports = {
	helloWorld: helloWorld
};