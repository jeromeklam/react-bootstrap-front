import React, { useState } from "react";
import { useToggle } from "./hooks";

let imageCapture = null;
let imageName = null;

const hasUserMedia = () => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  return !!navigator.getUserMedia;
};

let options = {
  quality: 50,
  allowEdit: false,
  correctOrientation: true,
};

if (window.cordova !== undefined) {
  options = {
    ...options,
    destinationType: navigator.camera.DestinationType.FILE_URI,
    sourceType: navigator.camera.PictureSourceType.CAMERA,
    encodingType: navigator.camera.EncodingType.JPEG,
    mediaType: navigator.camera.MediaType.PICTURE,
  };
}

export default function InputPhoto(props) {
  const [file, setFile] = useState(null);
  const [showVideoRow, toggleShowVideoRow] = useToggle(false);
  const [loading, toggleLoading] = useToggle(false);
  const [imageUrl, setImageUrl] = useState(null);

  const cameraSuccess = (imageUri) => {
    setImageUrl(imageUri);
  };

  const cameraError = (error) => {
    alert("Unable to obtain picture: " + error, "app");
  };

  const handleOpenCamera = (selection) => {
    navigator.camera.getPicture(cameraSuccess, cameraError, options);
  };

  const onGetUserMediaButtonClick = () => {
    toggleShowVideoRow(showVideoRow);
    toggleLoading(loading);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        document.querySelector("video").srcObject = mediaStream;
        toggleLoading(loading);
        const track = mediaStream.getVideoTracks()[0];
        imageCapture = new ImageCapture(track);
      })
      .catch((error) => alert(error));
  };

  const onTakePhotoButtonClick = () => {
    toggleLoading(loading);
    imageCapture
      .takePhoto()
      .then((blob) => {
        toggleLoading(loading);
        setImageUrl(URL.createObjectURL(blob.slice()));
      })
      .catch((error) => alert(error));
  };

  const handleChange = (e) => {
    setImageUrl(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  const handleSave = (e) => alert(e.target.files[0]);

  const handleRemovePicture = () => {
    setImageUrl(null);
  };
  const handleToggleShowVideoRow = () => toggleShowVideoRow(showVideoRow);

  return (
    <div>
      {window.cordova !== undefined ? (
        !showVideoRow ? (
          <button onClick={handleOpenCamera} className="icon">
            {props.camIcon}
          </button>
        ) : (
          <button onClick={handleToggleShowVideoRow} className="icon">
            {props.closeIcon}
          </button>
        )
      ) : (
        hasUserMedia() && (
          <div>
            {!showVideoRow ? (
              <button onClick={onGetUserMediaButtonClick} className="icon">
                {props.camIcon}
              </button>
            ) : loading ? (
              <img>{props.centLoad9xIcon}</img>
            ) : (
              <button onClick={handleToggleShowVideoRow} className="icon">
                {props.closeIcon}
              </button>
            )}
            {showVideoRow && (
              <div className="video-row">
                <video autoPlay className="video"></video>
                <button onClick={onTakePhotoButtonClick} className="icon">
                  {props.camIcon}
                </button>
              </div>
            )}
          </div>
        )
      )}
      <div>
        <label className="image-upload">
          <input className="file-input" type="file" onChange={handleChange} />
          <button className="icon">{props.uploadIcon} </button>
        </label>
      </div>
      <div>
        {imageUrl && (
          <div>
            {loading ? (
              <button className="icon">{props.centLoad9xIcon}</button>
            ) : (
              <div>
                <button onClick={handleRemovePicture} className="icon">
                  {props.closeIcon}
                </button>
                <img className="media-image-upload" src={imageUrl} />
                <button onClick={handleSave}>{props.SaveIcon}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

InputPhoto.propTypes = {};
InputPhoto.defaultProps = {};
