import React, { useEffect, useMemo, useState } from 'react'

const initConfig = []

// generate initConfig for every channel
for (let i = 0; i < process.env.NUM_CHANNELS; i++) {
    initConfig.push(
        {
            enabled: true,
            Channel: {
                Port: `AI${i}`,
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
                }
            ]
        }
    )
}

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
        document.body.style.overflowY = 'hidden'
    }

    function handleCloseModal() {
        setModalOpen(false)
        setSelectedChannel(null)
        document.body.style.overflowY = 'auto'
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
        const { Conversion, enabled, Coupling, InputRange, IEPE, Sensor } = data

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

    const active_count = config.reduce((current, el) => {
        if(el.enabled){
            current = current+1;
        }
    }, 0)

    return { active_count, config, setConfig, enableChannel, setProp, setSensor, addConversion, removeConversion, modalOpen, handleOpenModal, handleCloseModal, selectedChannel, currentChannel, saveChannel }
}

export default useConfigureMission