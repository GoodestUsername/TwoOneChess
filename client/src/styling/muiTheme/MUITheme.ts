import { alpha, createTheme, darken } from '@mui/material';

// inspired by https://bloomui.com/product/tokyo-free-black-react-typescript-material-ui-admin-dashboard/
const generalDarkColors = {
    primary: "#23222B",
    secondary: '#220dde',
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
        main: generalDarkColors.primary,
        dark: darken(generalDarkColors.primary, 0.5),
        light: alpha(generalDarkColors.primary, 0.1)
    },
    secondary: {
        main: generalDarkColors.secondary,
        dark: darken(generalDarkColors.secondary, 0.8),
        light: alpha(generalDarkColors.secondary, 0.8)
    },
    success: {
      main: generalDarkColors.success,
      dark: darken(generalDarkColors.success, 0.3),
      light: alpha(generalDarkColors.success, 0.4)
    },
    warning: {
      main: generalDarkColors.warning,
      dark: darken(generalDarkColors.warning, 0.3),
      light: alpha(generalDarkColors.warning, 0.4)
    },
    error: {
      main: generalDarkColors.error,
      dark: darken(generalDarkColors.error, 0.3),
      light: alpha(generalDarkColors.error, 0.4)
    },
    info: {
      main: generalDarkColors.info,
      dark: darken(generalDarkColors.info, 0.3),
      light: alpha(generalDarkColors.info, 0.4)
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
            disabled: generalDarkColors.trueWhite
        },
        primary: {
            main: darkThemeColors.primary.main,
            dark: darkThemeColors.primary.dark,
            light: darkThemeColors.primary.light,
            contrastText: generalDarkColors.trueWhite
        },
        secondary: {
            main: darkThemeColors.secondary.main,
            dark: darkThemeColors.secondary.dark,
            light: darkThemeColors.secondary.light,
            contrastText: generalDarkColors.trueWhite
        },
        success: {
            main: darkThemeColors.success.main,
            dark: darkThemeColors.success.dark,
            light: darkThemeColors.success.light,
            contrastText: generalDarkColors.trueWhite
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
            contrastText: generalDarkColors.trueWhite
        },
        info: {
            main: darkThemeColors.info.main,
            dark: darkThemeColors.info.dark,
            light: darkThemeColors.info.light,
            contrastText: generalDarkColors.trueWhite
        },
        background: {
          default: generalDarkColors.primary,
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
                    background: generalDarkColors.trueWhite,
                    opacity: "50%"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: darkThemeColors.secondary.light,
                    ":hover": {
                        backgroundColor: darkThemeColors.secondary.main,
                    }
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: generalDarkColors.primary
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    background: darkThemeColors.secondary.dark,
                    color: generalDarkColors.trueWhite
                }
            }
        },
        MuiCssBaseline: {
            // from https://stackoverflow.com/questions/53772429/mui-how-can-i-style-the-scrollbar-with-css-in-js
            styleOverrides: {
              body: {
                    scrollbarColor: `#6b6b6b ${generalDarkColors.primary}`,
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: generalDarkColors.primary,
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
                        backgroundColor: generalDarkColors.primary,
                    },
                },
            },
        },
    }

});
  
export default darkTheme;