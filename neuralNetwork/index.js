// 纯js实现神经网络示例

// 神经元：输入&输出&权重


// 神经网络：为什么需要多层网络？输入层？隐藏层？输出层


// 输出的连续性：为什么输出需要是连续性的？
var {brain} = require('brain.js');

const config = {
    binaryThresh: 0.5,
    hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
};
var net = new brain.NeuralNetwork(config);

net.train([
    {input: [0, 0], output: [0]},
    {input: [0, 1], output: [1]},
    {input: [1, 0], output: [1]},
    {input: [1, 1], output: [0]},
]);

var output = net.run([1, 0]);

console.log(output);