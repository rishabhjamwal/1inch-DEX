const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/tokenPrice", async (req, res) => {
  const { query } = req;

  const responseOne = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressOne,
  });

  const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressTwo,
  });

  const usdPrices = {
    tokenOne: responseOne.raw.usdPrice,
    tokenTwo: responseTwo.raw.usdPrice,
    ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
  };

  return res.status(200).json(usdPrices);
});
app.get("/api/allowance", async (req, res) => {
  const { tokenAddress, walletAddress } = req.query;
  const url = `https://api.1inch.dev/swap/v6.0/1/approve/allowance`; // Replace {chain} with the actual chain id

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer VdWWOOLQIOJ0vUdsJ1WQOuXmT5QtOzJp",
      },
      params: {
        tokenAddress,
        walletAddress,
      },
    });

    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching allowance", details: error.message });
  }
});

app.get("/api/approveTransaction", async (req, res) => {
  const { tokenAddress } = req.query;
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.1inch.dev/swap/v6.0/1/approve/transaction?tokenAddress=${tokenAddress}`,
    headers: {
      Authorization: "Bearer VdWWOOLQIOJ0vUdsJ1WQOuXmT5QtOzJp",
    },
  };


  return axios
    .request(config)
    .then((response) => {
      console.log("YESSSS", JSON.stringify(response.data));
      return res.json(JSON.stringify(response.data))
    })
    .catch((error) => {
      console.log({error: error.response.data});
      return res.json(JSON.stringify(error.response.data))

    });
});

app.get("/api/swap", async(req,res) => {
  const { src, dst, amount, from, slippage} = req.query;
  const url = "https://api.1inch.dev/swap/v6.0/1/swap";

  const config = {
      headers: {
  "Authorization": "Bearer VdWWOOLQIOJ0vUdsJ1WQOuXmT5QtOzJp"
},
      params: {
        src,
        dst,
        amount,
        from,
        slippage
      }
  };
      

  try {
    const response = await axios.get(url, config);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }

})



Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
