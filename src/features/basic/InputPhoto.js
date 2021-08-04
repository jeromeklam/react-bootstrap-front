import React, { useState } from "react";
import PropTypes from "prop-types";
import { useToggle } from "./hooks";
import { ResponsiveModalCamera } from "../advanced";

const hasUserMedia = () => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  return !!navigator.getUserMedia;
};

let imageCapture = null;
let track = null;

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
  const [filename, setFileName] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [loading, toggleLoading] = useToggle(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [shoot, setShoot] = useState(false);

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
    setShoot(false);
    setShowVideo(true);
    toggleLoading(loading);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        document.querySelector("video").srcObject = mediaStream;
        toggleLoading(loading);
        track = mediaStream.getVideoTracks()[0];
        imageCapture = new ImageCapture(track);
      })
      .catch((error) => alert(error));
  };

  const onTakePhotoButtonClick = () => {
    toggleLoading(loading);
    imageCapture
      .takePhoto()
      .then((blob) => {
        let nBlob = blob.slice();
        toggleLoading(loading);
        setShoot(true);
        let url = URL.createObjectURL(nBlob);
        setImageUrl(url);
        setFileName(url.substring(src.lastIndexOf("/") + 1) + ".png");
      })
      .catch((error) => alert(error));
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    track.stop();
    track = false;
    imageCapture = false;
  };

  const handleCancelShoot = () => {
    setImageUrl(null);
    setShoot(false);
    setFileName(null);
  };

  return (
    <div>
      {!!window.cordova ? (
        <button onClick={handleOpenCamera} className="btn btn-primary">
          {props.camIcon}
        </button>
      ) : (
        hasUserMedia() && (
          <div>
            {!showVideo ? (
              <button
                onClick={onGetUserMediaButtonClick}
                className="btn btn-primary"
              >
                {props.camIcon}
              </button>
            ) : (
              <ResponsiveModalCamera
                onClose={handleCloseVideo}
                onTakePhotoButtonClick={onTakePhotoButtonClick}
                loader={loading}
                {...props}
              >
                <div className="video-container">
                  {!shoot ? (
                    <>
                      <video autoPlay className="video h-100"></video>
                      {!loading && (
                        <button
                          onClick={onTakePhotoButtonClick}
                          className="camera-icon"
                        >
                          {props.camIcon}
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <img className="shoot-picture" src={imageUrl} />
                      <div className="shoot-btns">
                        <button
                          className="valid shoot-btn mr-3"
                          onClick={handleCloseVideo}
                        >
                          {props.validIcon}
                        </button>
                        <button
                          className="cancel shoot-btn ml-3"
                          onClick={onGetUserMediaButtonClick}
                        >
                          {props.cancelIcon}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </ResponsiveModalCamera>
            )}
          </div>
        )
      )}
      {imageUrl && (
        <div>
          {loading ? (
            <button className="btn btn-primary">{props.centLoad9xIcon}</button>
          ) : (
            <div>
              <button onClick={handleCancelShoot} className="btn btn-primary">
                {props.closeIcon}
              </button>
              <img
                className="media-image-upload"
                src={imageUrl}
                name={filename}
                onChange={props.onChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

InputPhoto.propTypes = {
  onChange: PropTypes.func,
  size: PropTypes.string,
};

InputPhoto.defaultProps = {
  onChange: () => {},
  size: null,
};
