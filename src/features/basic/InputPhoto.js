import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useToggle } from "./hooks";
import { ResponsiveModalInner } from "../advanced";
import { hasUserMedia } from "../helpers";

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
  const [stream, setStream] = useState(null);
  const [data, setData] = useState(null);
  const videoEl = useRef(null);

  //Cordova--
  const cameraSuccess = (imageUri) => setImageUrl(imageUri);
  const cameraError = () => {};
  const handleOpenCamera = (selection) => {
    navigator.camera.getPicture(cameraSuccess, cameraError, options);
  };
  //-- Cordova

  const onGetUserMediaButtonClick = () => {
    setShoot(false);
    setShowVideo(true);
    toggleLoading(loading);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        videoEl.current.srcObject = mediaStream;
        toggleLoading(loading);
        track = mediaStream.getVideoTracks()[0];
        imageCapture = new ImageCapture(track);
      })
      .catch((error) => {
        setShowVideo(false);
        console.log(error);
      });
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
        const name = url.substring(url.lastIndexOf("/") + 1);
        setFileName(name);
        let reader = new FileReader();
        reader.onload = function () {
          let b64 = reader.result;
          const data = {
            type: "blob",
            name: props.name,
            value: name + ".png",
            data: b64,
          };
          setData(data);
        };
        reader.readAsDataURL(nBlob);
      })
      .catch((error) => alert(error));
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    setFileName(null);
    setImageUrl(null);
    setData(null);
    stopTracks();
  };

  const validateShoot = () => {
    setShowVideo(false);
    stopTracks();
    const event = {
      target: data,
    };
    props.onChange(event);
  };

  const stopTracks = () => {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  };
  let buttons = [];
  if (!shoot) {
    if (!loading) {
      buttons.push({
        function: onTakePhotoButtonClick,
        theme: "light",
        icon: props.camIcon,
        position: "center",
      });
    }
  } else {
    buttons.push({
      function: validateShoot,
      theme: "primary",
      icon: props.validIcon,
      position: "center",
    });
    buttons.push({
      function: onGetUserMediaButtonClick,
      theme: "light",
      icon: props.cancelIcon,
      position: "center",
    });
  }
  let prefix = "data:image/png;base64,";
  if (props.value && props.value.lastIndexOf("data:") === 0) {
    prefix = "";
  }
  return (
    <>
      {!!window.cordova ? (
        <button onClick={handleOpenCamera} className="btn btn-primary">
          {props.camIcon}
        </button>
      ) : (
        hasUserMedia() && (
          <>
            {!showVideo ? (
              <>
                {props.thumbnailed ? (
                  <div className="text-center">
                    <img
                      className="media-image-upload img-thumbnail"
                      src={prefix + props.value}
                      name={filename}
                      onChange={props.onChange}
                    />
                    <br />
                    <button
                      onClick={onGetUserMediaButtonClick}
                      className="btn btn-primary"
                    >
                      {props.camIcon}
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={onGetUserMediaButtonClick}
                    className="px-1 pt-1"
                  >
                    {props.camIcon}
                  </div>
                )}
              </>
            ) : (
              <ResponsiveModalInner
                onClose={handleCloseVideo}
                onTakePhotoButtonClick={onTakePhotoButtonClick}
                modalClassName="bg-dark text-light"
                modalBackgroundColor="bg-light"
                loader={loading}
                height="80vh"
                {...props}
                buttons={buttons}
              >
                <div className="video-container">
                  {!shoot ? (
                    <video ref={videoEl} autoPlay className="video"></video>
                  ) : (
                    <img className="shoot-picture img-fluid" src={imageUrl} />
                  )}
                </div>
              </ResponsiveModalInner>
            )}
          </>
        )
      )}
    </>
  );
}

InputPhoto.propTypes = {
  onChange: PropTypes.func,
  size: PropTypes.string,
  thumbnailed: PropTypes.bool,
};

InputPhoto.defaultProps = {
  onChange: () => {},
  size: null,
  thumbnailed: false,
};
