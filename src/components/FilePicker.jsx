import React from "react";
import PropTypes from "prop-types";
import { useSnapshot } from "valtio";

import CustomButton from "./CustomButton";
import state from "../store";

const FilePicker = ({ file, setFile, readFile }) => {
  const snap = useSnapshot(state);

  return (
    <div className="filepicker-container" style={{ height: "auto", minHeight: "220px" }}>
      <div className="flex-1 flex flex-col">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file-upload" className="filepicker-label">
          Upload File
        </label>

        <p className="mt-2 text-gray-500 text-xs truncate">
          {file === "" ? "No file selected" : file.name}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title="Logo"
          handleClick={() => readFile("logo")}
          customStyles="text-xs"
        />
        <CustomButton
          type="filled"
          title="Full"
          handleClick={() => readFile("full")}
          customStyles="text-xs"
        />
      </div>

      {/* Slider tamaño Logo */}
      {snap.isLogoTexture && (
        <div className="mt-3">
          <p className="text-gray-600 text-xs mb-1">
            Logo size: {Math.round(snap.logoScale * 100 / 0.15)}%
          </p>
          <input
            type="range"
            min="0.05"
            max="0.45"
            step="0.01"
            value={snap.logoScale}
            onChange={(e) => (state.logoScale = parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: snap.color }}
          />
        </div>
      )}

      {/* Slider tamaño Full texture */}
      {snap.isFullTexture && (
        <div className="mt-3">
          <p className="text-gray-600 text-xs mb-1">
            Texture size: {Math.round(snap.fullScale * 100)}%
          </p>
          <input
            type="range"
            min="0.3"
            max="2"
            step="0.05"
            value={snap.fullScale}
            onChange={(e) => (state.fullScale = parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: snap.color }}
          />
        </div>
      )}
    </div>
  );
};

FilePicker.propTypes = {
  file: PropTypes.object,
  setFile: PropTypes.func.isRequired,
  readFile: PropTypes.func.isRequired,
};

export default FilePicker;