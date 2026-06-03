import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import {
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";

// Modelos disponibles
const MODELS = [
  { id: 'shirt_baked.glb', label: 'Camiseta' },
  { id: 'shirt_polo.glb',  label: 'Polo'     },
  { id: 'shirt_saco.glb',  label: 'Hoodie'   },
];

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState("");
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const editorTabRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editorTabRef.current && !editorTabRef.current.contains(event.target)) {
        setActiveEditorTab("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      default:
        return null;
    }
  };

  const handleTabClick = (tabName) => {
    setActiveEditorTab((prevTab) => (prevTab === tabName ? "" : tabName));
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;
    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }
    setActiveFilterTab((prevState) => ({
      ...prevState,
      [tabName]: !prevState[tabName],
    }));
  };

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* left menu tabs */}
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen" ref={editorTabRef}>
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => handleTabClick(tab.name)}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          {/* Go back button */}
          <motion.div className="absolute z-10 top-5 right-5" {...fadeAnimation}>
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          {/* Selector de modelos - arriba centrado */}
          <motion.div
            className="absolute z-10 top-5 left-1/2 -translate-x-1/2 flex gap-2"
            {...fadeAnimation}
          >
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => (state.currentModel = model.id)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  background: snap.currentModel === model.id ? snap.color : '#ffffff22',
                  color: snap.currentModel === model.id ? '#fff' : '#ffffffcc',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s',
                }}
              >
                {model.label}
              </button>
            ))}
          </motion.div>

          {/* filter tabs */}
          <motion.div className="filtertabs-container" {...slideAnimation("up")}>
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
            <button className="download-btn" onClick={downloadCanvasToImage}>
              <img
                src={download}
                alt="Download Image"
                className="w-3/5 h-3/5 object-contain"
              />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;