import LieferantenPage from './LieferantenPage'

import { SnackbarProvider } from "notistack";

export default function(){

    return (
        <SnackbarProvider maxSnack={1} preventDuplicate>
            <LieferantenPage/>
        </SnackbarProvider>
    )
}

