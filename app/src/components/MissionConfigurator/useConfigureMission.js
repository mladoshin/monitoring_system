import React, {useState, useEffect} from 'react'

const default_config = {

}

function useConfigureMission() {
    const [config, setConfig] = useState(default_config)

    useEffect(()=>{
        //init store
        let config_st = localStorage.getItem('config')
        if(config_st){
            //config already exists
            try{
                config_st = JSON.parse(config_st)
                setCart(config_st)
            }catch(err){
                console.log(err.message)
            }
            
        }else{
            // init a cart in local storage
            localStorage.setItem('config', JSON.stringify(config))
        }

    }, [])

    return {config}
}

export default useConfigureMission