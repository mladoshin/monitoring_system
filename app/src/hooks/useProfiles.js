import React, { useEffect, useState } from 'react'
import { addUserProfile, getUserProfiles } from '../api'

function useProfiles() {
    const [userProfiles, setUserProfiles] = useState([])
    const [selectedProfile, setSelectedProfile] = useState(null)

    async function fetchProfiles() {
        const res = await getUserProfiles().catch((err) =>
            console.log(err.message)
        )
        setUserProfiles(res)
    }

    useEffect(() => {
        fetchProfiles()
    }, [])

    function addProfile({name, data} = {}){
        addUserProfile({profile_name: name, data})
    }

    function removeProfile({name} = {}){
        if(!name) return;
        removeProfile({name})
    }

    return {userProfiles, addProfile, removeProfile, selectedProfile, setSelectedProfile}
}

export default useProfiles
