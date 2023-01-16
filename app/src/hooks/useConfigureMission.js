import React, { useEffect, useMemo, useState } from 'react'

const initConfig = [
    {
        enabled: true,
        Channel: {
            Port: "AI0",
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
            },
            {
                DataType: "Customization",
                Algorithm: {
                    CustomParameter: "MIC-DFT"
                }
            },
        ]
    },
    {
        enabled: true,
        Channel: {
            Port: "AI1",
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
            },
            {
                DataType: "Customization",
                Algorithm: {
                    CustomParameter: "MIC-DFT"
                }
            },
        ]
    },
    {
        enabled: true,
        Channel: {
            Port: "AI2",
            Sensor: {
                Type: "Accelerometer",
                Sensitivity: "1000"
            }
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
                    FreqEnd: "10000"
                }
            },
            {
                DataType: "Customization",
                Algorithm: {
                    CustomParameter: "MIC-DFT"
                }
            },
        ]
    }
]

const defaultConversion = {
    DataType: "G",
}

function useConfigureMission({ defaultConfig = initConfig }) {
    const [config, setConfig] = useState(defaultConfig)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedChannel, setSelectedChannel] = useState(null)

    useEffect(() => {
        const store = localStorage.getItem("missionConfig")

        if (store) {
            setConfig(JSON.parse(store))
        } else {
            localStorage.setItem("missionConfig", JSON.stringify(initConfig))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("missionConfig", JSON.stringify(config))
    }, [config])

    const currentChannel = useMemo(() => {
        return config.find(ch => ch.Channel.Port === selectedChannel)
    }, [selectedChannel])

    function enableChannel(channelID, enabled) {
        const idx = config.findIndex(ch => ch.Channel.Port === channelID)

        if (idx === -1) return;

        const temp = [...config]
        temp[idx] = { ...temp[idx], enabled }

        setConfig(temp)
    }

    function handleOpenModal(channelID) {
        setModalOpen(true)
        setSelectedChannel(channelID)
    }

    function handleCloseModal(channelID) {
        setModalOpen(false)
        setSelectedChannel(null)
    }

    function setProp(channelID, prop, value) {
        if (!prop in ["Coupling", "InputRange", "IEPE"]) {
            console.log("Invalid prop!")
            return
        };

        const idx = Array(config).findIndex(ch => ch.Channel.Port === channelID)

        if (idx === -1) return;

        const temp = [...config]
        temp[idx] = { ...temp[idx], [prop]: value }
        setConfig(temp)
    }

    function setSensor(channelID, prop, value) {
        if (!prop in ["Type", "Sensitivity"]) {
            console.log("Invalid prop!")
            return
        };

        const idx = Array(config).findIndex(ch => ch.Channel.Port === channelID)

        if (idx === -1) return;

        const temp = [...config]
        temp[idx].Channel.Sensor[prop] = value

        setConfig(temp)
    }

    function addConversion(channelID) {
        const idx = Array(config).findIndex(ch => ch.Channel.Port === channelID)

        if (idx === -1) return;

        const temp = [...config]
        const newConversion = { ...defaultConversion, id: Date.now().toString(16) }
        const tempConversion = [...temp[idx].Conversion, newConversion]
        temp[idx] = { ...temp[idx], Conversion: tempConversion }
        setConfig(temp)
    }

    function removeConversion(channelID, conversionID) {
        const idx = Array(config).findIndex(ch => ch.Channel.Port === channelID)

        if (idx === -1) return;

        const temp = [...config]
        const tempConversion = [...temp[idx].Conversion]
        tempConversion.splice(conversionID, 1)

        temp[idx] = { ...temp[idx], Conversion: tempConversion }
        setConfig(temp)
    }

    function saveChannel(channelID, data) {
        const {Conversion, enabled, Coupling, InputRange, IEPE, Sensor} = data

        const idx = config.findIndex(ch => ch.Channel.Port === channelID)
        if (idx === -1) return;

        const channel = {
            enabled,
            Channel: {
                Port: channelID,
                Sensor
            },
            Coupling,
            InputRange,
            IEPE,
            Conversion
        }

        console.log("Saving channel!")
        console.log(channel)

        const temp = [...config]
        temp[idx] = channel
        setConfig(temp)
    }

    return { config, enableChannel, setProp, setSensor, addConversion, removeConversion, modalOpen, handleOpenModal, handleCloseModal, selectedChannel, currentChannel, saveChannel }
}

export default useConfigureMission