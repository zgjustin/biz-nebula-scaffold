const path = require('path');

const resolve = userPath => {
	return path.resolve(__dirname, '../../', userPath);
};

module.exports = resolve;
