require("dotenv").config({ silent: true });

const path = require("path");
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const config = require("../webpack/webpack.dev.config");
const DashboardPlugin = require("webpack-dashboard/plugin");
const AWS = require("aws-sdk");

const PORT = process.env.PORT || 8080;
const S3_BUCKET = process.env.S3_BUCKET;

const app = express();

const compiler = webpack(config);

compiler.apply(new DashboardPlugin());

AWS.config.update({ signatureVersion: "v4" });

if (process.env.S3_REGION) {
  AWS.config.update({ region: process.env.S3_REGION });
}


const middleware = webpackDevMiddleware(compiler, {
  contentBase: "build",
  stats: { colors: true },
});


app.use(middleware);
app.use(webpackHotMiddleware(compiler));

app.get("/sign-s3", (req, res) => {
  const s3 = new AWS.S3();
  const fileName = req.query["file-name"];
  const fileType = req.query["file-type"];

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: "public-read",
  };

  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }

    res.write(JSON.stringify({
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    }));

    res.end();
  });
});

app.get("*", (req, res) => {
  res.write(middleware.fileSystem.readFileSync(path.resolve("build/index.html")));
  res.end();
});

const listener = app.listen(PORT, () => {
  console.log("express started at http://localhost:%d", listener.address().port);
});
