import React from "react";
import FileUploader from "react-firebase-file-uploader";
import firebase from "../../../app/firebase";
// import { Upload, Button } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

const AddAudit = () => {
  return (
    <FileUploader
      accept="*"
      name="avatar"
      randomizeFilename
      storageRef={firebase.storage().ref("audit")}
      onUploadStart={() => console.log("Start")}
      onUploadError={(err) => console.log("Error ", err)}
      onUploadSuccess={() => console.log("Sucess")}
      onProgress={(p) => console.log(p)}
    />
  );
};

export default AddAudit;
