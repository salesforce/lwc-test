const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();

app.use(express.static(path.join(__dirname, './build')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname,'./build/index.html'));
});

const server = app.listen(process.env.PORT || 3000, () => {
	// eslint-disable-next-line no-console
	console.log(`server running on port ${server.address().port}!`)
});
