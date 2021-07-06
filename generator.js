const express = require("express");
const router = express.Router();
var os = require("os");
if (os.platform() == "win32") {
  if (os.arch() == "ia32") {
    var chilkat = require("@chilkat/ck-node14-win-ia32");
  } else {
    var chilkat = require("@chilkat/ck-node14-win64");
  }
} else if (os.platform() == "linux") {
  if (os.arch() == "arm") {
    var chilkat = require("@chilkat/ck-node14-arm");
  } else if (os.arch() == "x86") {
    var chilkat = require("@chilkat/ck-node13-linux32");
  } else {
    var chilkat = require("@chilkat/ck-node14-linux64");
  }
} else if (os.platform() == "darwin") {
  var chilkat = require("@chilkat/ck-node14-macosx");
}
router.post("/", async (req, res) => {
  const {
    commonName,
    country,
    state,
    locality,
    orgUnit,
    organization,
    alternativeName,
    ip,
  } = req.body;
  // Note: Requires Chilkat v9.5.0.84 or greater.

  var rsa = new chilkat.Rsa();

  // Generate a random 2048-bit RSA key.
  var success = rsa.GenerateKey(2048);
  if (success !== true) {
    console.log(rsa.LastErrorText);
    return;
  }

  // Get the private key
  // privKey: PrivateKey
  var privKey = rsa.ExportPrivateKeyObj();

  // Create the CSR object and set properties.
  var csr = new chilkat.Csr();

  // Specify the Common Name.
  csr.CommonName = commonName;

  // Country Name (2 letter code)
  csr.Country = country;

  // State or Province Name (full name)
  csr.State = state;

  // Locality Name (eg, city)
  csr.Locality = locality;

  // Organization Name (eg, company)
  csr.Company = organization;

  // Organizational Unit Name (eg, secion/division)
  csr.CompanyDivision = orgUnit;

  // Email address
  csr.EmailAddress = "support@mydomain.com";

  // Add Subject Alternative Names
  // (The AddSan method is added in Chilkat v9.5.0.84)
  // Call AddSan for each alternative name.
  if (alternativeName.length > 0) {
    alternativeName?.map((name) => {
      success = csr.AddSan("dnsName", name);
    });
  }
  success = csr.AddSan("ipAddress", ip);

  // Create the CSR using the private key.
  var pemStr = csr.GenCsrPem(privKey);
  if (csr.LastMethodSuccess !== true) {
    console.log(csr.LastErrorText);

    return;
  }

  // Save the private key and CSR to a files.
  privKey.SavePkcs8EncryptedPemFile("password", "qa_output/privKey1.pem");

  var fac = new chilkat.FileAccess();
  fac.WriteEntireTextFile("qa_output/csr1.pem", pemStr, "utf-8", false);

    console.log(pemStr);
  res.json({ status: 200, csr: pemStr });
  // Show the CSR.
});

module.exports = router;
