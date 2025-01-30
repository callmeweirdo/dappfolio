import { View } from 'react-native'
import React from 'react'
import { Button, H2, H5, Text, YStack } from "tamagui";
import DevHome from 'components/DevHome';
// import { LoginSheet } from '../components/loginsheet';
// import { toggleStore } from '../stores/toggleStore';

const home = () => {
    // const [open, setOpen] = React.useState(false);
    // const {login, toggleLogin} = toggleStore((state) => state);

    return (
        <>

            <DevHome />

            {/* <LoginSheet open={login} setOpen={toggleLogin} /> */}
        </>
    );
}

export default home;