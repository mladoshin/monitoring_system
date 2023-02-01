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
                Sensitivity: "1000"
            }
        },
        Coupling: "AC",
        InputRange: "B10",
        IEPE: "Disable",
        Conversion: [
            {
                DataType: "G",
                Algorithm: {
                    WindowType: "Hann",
                    FreqStart: "10",
                    FreqEnd: "10000"
                }
            }
        ]
    }
  ]
};
