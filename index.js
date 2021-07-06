const express = require("express");
const app = express();

var cors = require("cors");

app.use(cors());
app.use(express.json({ extended: false }));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());
// generating csr
app.use("/api/generate", require("./generator"));
// generating csr
app.get("/*", (req, res) => {
  res.send("CSR GENERATOR By Saad Bin Khalid ");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Node Server is running on port ${PORT}`));
