import { createTheme } from '@material-ui/core/styles'

const darkTheme = createTheme({
    palette: {
        text: {

            disabled: '#FFF'
        },
        primary: {
            main: '#273db7',
            light: '#5330c1',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#101433',
            paper: 'rgba(40,51,97,0.35)',
        },
    },
    props: {
        MuiButton: {
            
        },
    },
});

export default darkTheme;