const { Network } = require("./network/net");
const net = new Network();

net.getAccountInfo("TJHdevcX13VX83KHSsj5oZ6aPCbVPPiaWN", (item) => {
    console.log(item)
})