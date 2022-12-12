import VerkaufPage from './VerkaufPage'


import { SnackbarProvider } from "notistack";

export default function(){

    return (
        <SnackbarProvider maxSnack={1} preventDuplicate>
            <VerkaufPage/>
        </SnackbarProvider>
    )
}


