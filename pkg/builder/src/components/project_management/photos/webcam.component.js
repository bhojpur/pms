// Copyright (c) 2018 Bhojpur Consulting Private Limited, India. All rights reserved.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, { useState, useEffect } from 'react';
import {base64StringToBlob} from 'blob-util';
import Webcam from "react-webcam";
import UploadService from "./../../../services/photoupload.service";
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { Card } from 'react-bootstrap';

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
    width: {
        min: 1280,
        ideal: 1920,
        max: 2560,
    },
    height: {
        min: 720,
        ideal: 1080,
        max: 1440
    },
    facingMode: 'user'
};

export const WebcamCapture = () => {

    const [image,setImage]=useState('');
    const webcamRef = React.useRef(null);
    const [progress, setProgress] = useState(0);
    const [camera, setCamera] = useState("");
    const [message, setMessage] = useState("");
    const [currentFile, setCurrentFile] = useState(undefined);
    const [fileInfos, setFileInfos] = useState([]);
    const [deviceId, setDeviceId] = React.useState({});
    const [devices, setDevices] = React.useState([]);
    
    const capture = React.useCallback(
        () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        console.log(imageSrc.slice(22));
    });

    const upload = () => {
        let b64Data = image.slice(22);
        console.log(b64Data);
        // const contentType = 'image/png';
        const currentFile = base64StringToBlob(b64Data,'image/png');
        let filename = "";
        const min = 10000000000000;
        const max = 20000000000000;
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(rand);
        filename = "oncapture" + rand + ".png";
        console.log(filename);
        console.log(currentFile);

        setProgress(0);
        setCurrentFile(currentFile);
        console.log(currentFile.name);
    
        UploadService.uploadcapture(currentFile, filename, (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        })
          .then((response) => {
            setMessage(response.data.message);
            return UploadService.getCaptures();
          })
          .then((files) => {
            console.log(files.data);
            setFileInfos(files.data);
          })
          .catch(() => {
            setProgress(0);
            setMessage("Could not upload the file!");
            setCurrentFile(undefined);
          });
          //window.location.reload();
        // setSelectedFiles(undefined);
    };
    const handleDevices = React.useCallback(
        mediaDevices =>
          setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
        [setDevices]
    );
    
    function setCamDevice(devId){
            console.log(devId);
            setCamera(devId);
    }
    
    useEffect(() => {
        UploadService.getCaptures().then((response) => {
          setFileInfos(response.data);
        });
    }, []);
    React.useEffect(
        () => {
          navigator.mediaDevices.enumerateDevices().then(handleDevices);
        },
        [handleDevices]
    );

    return (
        <div className="webcam-container">
            <div className="webcam-img">
            <>
            {/* {devices.map((device, key) => (
                <div>
                    <Webcam audio={false} videoConstraints={{ deviceId: device.deviceId }} />
                    {device.label || `Device ${key + 1}`}
                </div>

                ))} */}
            </>
            <div className="row">
            <div className="form-group col-12">
              {/* <h5>Select Device</h5> */}
              {devices &&
                devices.map((device, index) => (
                <button
                    className = "btn btn-success mr-2"
                    value={device.deviceId}
                    onClick={(e) => {
                        e.preventDefault();
                        //console.log("Cam value : "+e)
                        setCamDevice(device.deviceId);
                    }}
                    key={index}
                >
                {/* unit data */}
                {device.label || `Device ${index + 1}`}
                </button>
                ))}
            </div>
            </div>
            <center>
                {image == '' ? <Webcam
                    audio={false}
                    height={500}
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    width={800}
                    videoConstraints={{deviceId: camera}}
                /> : <img src={image} />}
            </center>
                
            </div>
            <div>
                {image != '' ?
                <div>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setImage('')
                    }}
                        className="btn btn-primary">
                        Retake Image</button>
                        <button onClick={(e) => {
                        e.preventDefault();
                        upload();
                    }}
                        className="btn btn-success m-2">Save Image</button>
                        <h4>Upload Status</h4>
                        {image != '' && (
                        <div className="progress">
                        <div
                            className="progress-bar progress-bar-info progress-bar-striped"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: progress + "%" }}
                        >
                            {progress}%
                        </div>
                        </div>)}
                </div> :
                <center>
                <button onClick={(e) => {
                        e.preventDefault();
                        capture();
                    }}
                        className="btn btn-primary"><CameraAltIcon/>Capture</button>
                </center>
                    
                }
                <div className="container">
                    <h3>Recent Captures</h3>
                    <div className="row" style={{'overflow': 'auto','white-space': 'nowrap'}}>
                    {fileInfos &&
                            fileInfos.map((file, index) => (
                            <div className="container col-2 mt-1" key={index}>
                                <Card className="bg-dark text-white">
                                <Card.Img src={file.url} alt="Card image" style={{'width': '153px', 'height': '150px'}}/>
                                <Card.ImgOverlay>
                                {/* <Card.Title>{file.name}</Card.Title>
                                <Card.Text>
                                    {file.description}
                                </Card.Text> */}
                                </Card.ImgOverlay>
                            </Card>
                            </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};