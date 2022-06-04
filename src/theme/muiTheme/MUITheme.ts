import { createTheme } from '@material-ui/core/styles'
const theme = createTheme();
const darkTheme = createTheme({
    typography: {
        button: {
            color: 'white',
        },
        allVariants: {
            color: "white"
            },
    },
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
        action: {
            disabledBackground: theme.palette.primary.light,
            disabled: "white"
        }
    },
    props: {
        MuiButton: {
            style: {
                background: 'white'
            },
        },
    },
});

export default darkTheme;