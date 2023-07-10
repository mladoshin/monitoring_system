import React, { useEffect, useState } from 'react'
import { addUserProfile, getUserProfiles, removeUserProfile } from '../api'

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
        addUserProfile({profile_name: name, data}).then(res => {
            //console.log(name)
            if(userProfiles.indexOf(name) === -1){
                setUserProfiles(s => [...s, name])
            }
        })
    }

    function removeProfile(name){
        if(!name) return;
        removeUserProfile(name).then(removed_name => {
            const tmp = userProfiles.filter(el => el !== removed_name)
            setUserProfiles(tmp)

            if(selectedProfile === removed_name){
                setSelectedProfile(null)
            }
        })
    }

    return {userProfiles, addProfile, removeProfile, selectedProfile, setSelectedProfile}
}

export default useProfiles
