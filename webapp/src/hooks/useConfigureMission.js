import React, { useEffect, useMemo, useState } from "react";
import { MODE } from "../../../common/enums.mjs";

const initConfig = [];

// generate initConfig for every channel
for (let i = 0; i < process.env.NUM_CHANNELS; i++) {
  initConfig.push({
    enabled: true,
    Channel: {
      Port: `AI${i}`,
      Sensor: {
        Type: "Accelerometer",
        Sensitivity: "1000",
      },
    },
    Coupling: "DC",
    InputRange: "B10",
    IEPE: "Disable",
    Conversion: [
      {
        DataType: "G",
        Algorithm: {
          WindowType: "Hann",
          FreqStart: "10",
          FreqEnd: "10000",
        },
      },
    ],
  });
}

const defaultConversion = {
  DataType: "G",
};

const initControllerConfig = {
  input_type: "PseudoDifferential",
  trigger_source: "NoWait",
  repeat_interval: 5,
  repeat_times: "1",
  sample_rate: 16000,
  data_count: 16000,
  record_duration: 1,
  file_name: "vibro001",
  directory_name: 1,
  comment: "",
  channels: [],
  modal_open: false,
  current_channel: null,
  mode: MODE.TESTING,
  show_results: true,
};

function useConfigureMission({
  defaultConfig = initConfig,
  defaultControllerConfig = initControllerConfig,
  monitoring = false,
}) {
  const [config, setConfig] = useState(defaultConfig);
  const [controllerConfig, setControllerConfig] = useState(
    defaultControllerConfig
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const storageKey = monitoring ? "monitoringMissionConfig" : "missionConfig";
  const controllerConfigKey = "controllerConfig";

  useEffect(() => {
    const store = localStorage.getItem(storageKey);
    const controllerConfigStore = localStorage.getItem(controllerConfigKey);

    if (store) {
      setConfig(JSON.parse(store));
    } else {
      localStorage.setItem(storageKey, JSON.stringify(initConfig));
    }

    // initialise controller config
    if (controllerConfigStore) {
      console.log(controllerConfigStore)
      setControllerConfig(JSON.parse(controllerConfigStore));
    } else {
      localStorage.setItem(
        controllerConfigKey,
        JSON.stringify(initControllerConfig)
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(controllerConfigKey, JSON.stringify(controllerConfig));
  }, [controllerConfig]);

  const currentChannel = useMemo(() => {
    return config.find((ch) => ch.Channel.Port === selectedChannel);
  }, [selectedChannel]);

  function enableChannel(channelID, enabled) {
    const idx = config.findIndex((ch) => ch.Channel.Port === channelID);

    if (idx === -1) return;

    const temp = [...config];
    temp[idx] = { ...temp[idx], enabled };

    setConfig(temp);
  }

  function handleOpenModal(channelID) {
    setModalOpen(true);
    setSelectedChannel(channelID);
    document.body.style.overflowY = "hidden";
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedChannel(null);
    document.body.style.overflowY = "auto";
  }

  function setProp(channelID, prop, value) {
    if (!prop in ["Coupling", "InputRange", "IEPE"]) {
      console.log("Invalid prop!");
      return;
    }

    const idx = Array(config).findIndex((ch) => ch.Channel.Port === channelID);

    if (idx === -1) return;

    const temp = [...config];
    temp[idx] = { ...temp[idx], [prop]: value };
    setConfig(temp);
  }

  function setSensor(channelID, prop, value) {
    if (!prop in ["Type", "Sensitivity"]) {
      console.log("Invalid prop!");
      return;
    }

    const idx = Array(config).findIndex((ch) => ch.Channel.Port === channelID);

    if (idx === -1) return;

    const temp = [...config];
    temp[idx].Channel.Sensor[prop] = value;

    setConfig(temp);
  }

  function addConversion(channelID) {
    const idx = Array(config).findIndex((ch) => ch.Channel.Port === channelID);

    if (idx === -1) return;

    const temp = [...config];
    const newConversion = { ...defaultConversion, id: Date.now().toString(16) };
    const tempConversion = [...temp[idx].Conversion, newConversion];
    temp[idx] = { ...temp[idx], Conversion: tempConversion };
    setConfig(temp);
  }

  function removeConversion(channelID, conversionID) {
    const idx = Array(config).findIndex((ch) => ch.Channel.Port === channelID);

    if (idx === -1) return;

    const temp = [...config];
    const tempConversion = [...temp[idx].Conversion];
    tempConversion.splice(conversionID, 1);

    temp[idx] = { ...temp[idx], Conversion: tempConversion };
    setConfig(temp);
  }

  function saveChannel(channelID, data) {
    const { Conversion, enabled, Coupling, InputRange, IEPE, Sensor } = data;

    const idx = config.findIndex((ch) => ch.Channel.Port === channelID);
    if (idx === -1) return;

    const channel = {
      enabled,
      Channel: {
        Port: channelID,
        Sensor,
      },
      Coupling,
      InputRange,
      IEPE,
      Conversion,
    };

    const temp = [...config];
    temp[idx] = channel;
    setConfig(temp);
  }

  function saveControllerConfig(config_data) {
    setControllerConfig({...config_data, force: false});
  }

  function updateTestNumber(experiment_name, test_name) {
    const new_config = {
      ...controllerConfig,
      directory_name: experiment_name,
      file_name: test_name,
      force: false
    };

    localStorage.setItem(controllerConfigKey, JSON.stringify(new_config));
    setControllerConfig(new_config);
  }

  const active_count = config.reduce((current, el) => {
    if (el.enabled) {
      current = current + 1;
    }
  }, 0);

  return {
    active_count,
    config,
    setConfig,
    enableChannel,
    setProp,
    setSensor,
    addConversion,
    removeConversion,
    modalOpen,
    handleOpenModal,
    handleCloseModal,
    selectedChannel,
    currentChannel,
    saveChannel,
    saveControllerConfig,
    controllerConfig,
    updateTestNumber,
  };
}

export default useConfigureMission;
