const CALIBRATION_CONFIG = {
  RepeatConfig: {
    RepeatInterval: 1000,
    RepeatTimes: 1,
  },
  DeviceConfig: {
    SampleRate: 16000,
    DataCount: 16000,
    InputType: "PseudoDifferential",
    TriggerSource: "NoWait",
  },
  ChannelConfig: [
    {
      enabled: true,
      Channel: {
        Port: `AI0`,
        Sensor: {
          Type: "Accelerometer",
          Sensitivity: "300",
        },
      },
      Coupling: "AC",
      InputRange: "B10",
      IEPE: "Enable",
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
    },
  ],
};

export {CALIBRATION_CONFIG}
