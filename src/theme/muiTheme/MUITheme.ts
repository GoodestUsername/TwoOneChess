import { alpha, createTheme, darken } from '@mui/material';

// inspired by https://bloomui.com/product/tokyo-free-black-react-typescript-material-ui-admin-dashboard/
const generalColors = {
    primary: "#6d5fec",
    primaryAlt: '#23222B',
    primaryAlt2: "#1D1D1D",
    secondary: '#7881ac',
    success: '#49e201',
    warning: '#f88f08',
    error: '#f60025',
    info: '#77d3ff',
    black: '#eaeaec',
    white: '#222e57',
    trueWhite: '#ffffff'
}

const darkThemeColors = {
    primary: {
        main: generalColors.primary,
        dark: darken(generalColors.primary, 0.5),
        light: alpha(generalColors.primary, 0.6)
    },
    secondary: {
        main: generalColors.secondary,
        dark: darken(generalColors.secondary, 0.3),
        light: alpha(generalColors.secondary, 0.4)
    },
    success: {
      main: generalColors.success,
      dark: darken(generalColors.success, 0.3),
      light: alpha(generalColors.success, 0.4)
    },
    warning: {
      main: generalColors.warning,
      dark: darken(generalColors.warning, 0.3),
      light: alpha(generalColors.warning, 0.4)
    },
    error: {
      main: generalColors.error,
      dark: darken(generalColors.error, 0.3),
      light: alpha(generalColors.error, 0.4)
    },
    info: {
      main: generalColors.info,
      dark: darken(generalColors.info, 0.3),
      light: alpha(generalColors.info, 0.4)
    }
}
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
            disabled: generalColors.trueWhite
        },
        primary: {
            main: darkThemeColors.primary.main,
            dark: darkThemeColors.primary.dark,
            light: darkThemeColors.primary.light,
            contrastText: generalColors.trueWhite
        },
        secondary: {
            main: darkThemeColors.secondary.main,
            dark: darkThemeColors.secondary.dark,
            light: darkThemeColors.secondary.light,
            contrastText: generalColors.trueWhite
        },
        success: {
            main: darkThemeColors.success.main,
            dark: darkThemeColors.success.dark,
            light: darkThemeColors.success.light,
            contrastText: generalColors.trueWhite
        },
        warning: {
            main: darkThemeColors.warning.main,
            dark: darkThemeColors.warning.dark,
            light: darkThemeColors.warning.light,
        },
        error: {
            main: darkThemeColors.error.main,
            dark: darkThemeColors.error.dark,
            light: darkThemeColors.error.light,
            contrastText: generalColors.trueWhite
        },
        info: {
            main: darkThemeColors.info.main,
            dark: darkThemeColors.info.dark,
            light: darkThemeColors.info.light,
            contrastText: generalColors.trueWhite
        },
        background: {
          default: generalColors.primaryAlt,
          paper: 'rgba(40,51,97,0.35)',
        },
        divider: 'rgba(255,255,255,100)',
        action: {
            disabledBackground: darkThemeColors.primary.dark,
            disabled: "white"
        }
    },
    components: {
        MuiDivider: {
            styleOverrides: {
                root: {
                    background: generalColors.trueWhite,
                    opacity: "50%"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: darkThemeColors.primary.dark
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: generalColors.primaryAlt2
                }
            }
        },
        MuiCssBaseline: {
            // from https://stackoverflow.com/questions/53772429/mui-how-can-i-style-the-scrollbar-with-css-in-js
            styleOverrides: {
              body: {
                    scrollbarColor: "#6b6b6b #2b2b2b",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "#2b2b2b",
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        backgroundColor: "#6b6b6b",
                        minHeight: 24,
                        border: "3px solid #2b2b2b",
                    },
                    "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                        backgroundColor: "#2b2b2b",
                    },
                },
            },
        },
    }

});
  
export default darkTheme;