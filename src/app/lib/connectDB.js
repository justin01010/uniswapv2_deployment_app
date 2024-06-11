const mongoose = require('mongoose');
async function connectToDatabase() {
  mongoose.connect('mongodb://127.0.0.1:27017/uniswapV2');
}
module.exports = { connectToDatabase };