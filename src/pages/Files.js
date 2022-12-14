import React, { useState, useEffect } from "react";
import authService from "../service/authService";
import fileUploadService from "../service/fileUploadService";

const Files = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);

  const userID = JSON.parse(authService.getCurrentUser()).id;
  useEffect(() => {
    loadFiles();
  }, []);

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };

  const loadFiles = () => {
    fileUploadService.getFiles(userID).then((response) => {
      setFileInfos(response.data);
    });
  };

  const upload = () => {
    let currentFile = selectedFiles[0];
    setCurrentFile(currentFile);
    fileUploadService
      .upload(currentFile)
      .then((response) => {
        setMessage(response.data.message);
        return fileUploadService.getFiles(userID);
      })
      .then((files) => {
        setFileInfos(files.data);
      })
      .catch(() => {
        setMessage("Could not upload the file!");
        setCurrentFile(undefined);
      });

    setSelectedFiles(undefined);
  };

  return (
    <div className="bg-gray-100 m-auto max-w-xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8 space-y-6">
      <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
        Upload File
      </h5>
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        onChange={selectFile}
      ></input>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={!selectedFiles}
        onClick={upload}
      >
        Upload
      </button>

      <div>{message}</div>

      <div className="block rounded-lg shadow-lg bg-white">
        <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
          List of Files
        </h5>
        <div className="">
          <ul>
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="border grid grid grid-cols-10" key={index}>
                  <a className="col-span-8" href={file.url}>
                    {file.fileName}
                  </a>

                  <button
                    className="col-span-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 text-sm rounded"
                    onClick={() => {
                      fileUploadService
                        .deleteFile(file.fileName)
                        .then(function (response) {
                          console.log(response);
                          loadFiles();
                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Files;
