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
  // Note: Requires Chilkat v9.5.0.84 or greater.

  // This requires the Chilkat API to have been previously unlocked.
  // See Global Unlock Sample for sample code.

  // code for Global Unlock Sample
  // The Chilkat API can be unlocked for a fully-functional 30-day trial by passing any
  // string to the UnlockBundle method.  A program can unlock once at the start. Once unlocked,
  // all subsequently instantiated objects are created in the unlocked state.
  //
  // After licensing Chilkat, replace the "Anything for 30-day trial" with the purchased unlock code.
  // To verify the purchased unlock code was recognized, examine the contents of the LastErrorText
  // property after unlocking.  For example:
  //   var glob = new chilkat.Global();
  //   var success = glob.UnlockBundle("Anything for 30-day trial");
  //   if (success !== true) {
  //     console.log(glob.LastErrorText);
  //     return;
  //   }

  //   var status = glob.UnlockStatus;
  //   if (status == 2) {
  //     console.log("Unlocked using purchased unlock code.");
  //   } else {
  //     console.log("Unlocked in trial mode.");
  //   }

  //   // The LastErrorText can be examined in the success case to see if it was unlocked in
  //   // trial more, or with a purchased unlock code.
  //   console.log(glob.LastErrorText);
  // code for Global Unlock Sample

  // First generate an RSA private key.
  // (It is also possible to create CSRs based on ECDSA private keys..)
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
  csr.CommonName = "mysubdomain.mydomain.com";

  // Country Name (2 letter code)
  csr.Country = "GB";

  // State or Province Name (full name)
  csr.State = "Yorks";

  // Locality Name (eg, city)
  csr.Locality = "York";

  // Organization Name (eg, company)
  csr.Company = "Internet Widgits Pty Ltd";

  // Organizational Unit Name (eg, secion/division)
  csr.CompanyDivision = "IT";

  // Email address
  csr.EmailAddress = "support@mydomain.com";

  // Add Subject Alternative Names
  // (The AddSan method is added in Chilkat v9.5.0.84)
  // Call AddSan for each alternative name.
  success = csr.AddSan("dnsName", "mydomain.com");
  success = csr.AddSan("dnsName", "mysubdomain.mydomain.com");
  success = csr.AddSan("ipAddress", "192.168.0.123");

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
