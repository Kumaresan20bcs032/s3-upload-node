const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const AWS = require("aws-sdk");
const app = express();


app.use(express.json());
app.use(fileUpload());
app.use(cors());

// Configure the s3 bucket credientials.
AWS.config.update(
    {
        region: process.env.REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
);

const s3 = new AWS.S3({});

app.get("/", (req, res) => {
    return res.json({ message: "Applcation working fine" })
})



app.post("/upload-file", async (req, res) => {
    try {
        const { mimetype, name, data } = req.files.file;

        // Construct s3 params to upload the objects or files.
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: name,
            ContentType: mimetype,
            Body: data
        }

        const upload = await s3.upload(params).promise();

        return res.status(200).json({ status: 200, status_code: true, message: "File uploaded s3 bucket successfully.", data: upload })

    }
    catch (error) {
        return res.status(500).json({ status: false, status_code: 500, message: error.message, data: {} });
    }
})


const PORT = process.env?.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Server started at host: http://localhost:${PORT}`);
})