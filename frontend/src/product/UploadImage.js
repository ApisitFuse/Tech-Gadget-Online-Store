import { useState } from "react";
import { fetchUploadImageAPI } from '../services/Image';

const HOST = process.env.REACT_APP_APP_HOST;
const PORT = process.env.REACT_APP_BN_PORT;

function UploadImage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageURL, setImageURL] = useState("");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("image", selectedFile);

        const response = await fetchUploadImageAPI(formData);

        const data = await response.json();
        setImageURL(`http://${HOST}:${PORT}${data.path}`);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {imageURL && <img src={imageURL} alt="Uploaded" width="200" />}
        </div>
    );
}

export default UploadImage;
