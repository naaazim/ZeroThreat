import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00e5ff',
            light: '#6effff',
            dark: '#00b2cc',
            contrastText: '#000000',
        },
        secondary: {
            main: '#d500f9',
            light: '#ff5bff',
            dark: '#9e00c5',
            contrastText: '#ffffff',
        },
        background: {
            default: '#0a0e1a',
            paper: '#141824',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b8c4',
        },
        success: {
            main: '#00e676',
            light: '#66ffa6',
            dark: '#00b248',
        },
        warning: {
            main: '#ffc400',
            light: '#fff64f',
            dark: '#c79400',
        },
        error: {
            main: '#ff1744',
            light: '#ff616f',
            dark: '#c4001d',
        },
        info: {
            main: '#00b0ff',
            light: '#69e2ff',
            dark: '#0081cb',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: '"Orbitron", "Rajdhani", sans-serif',
            fontWeight: 800,
            fontSize: '4rem',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
        },
        h2: {
            fontFamily: '"Orbitron", "Rajdhani", sans-serif',
            fontWeight: 700,
            fontSize: '3rem',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
        },
        h3: {
            fontFamily: '"Orbitron", "Rajdhani", sans-serif',
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '0.02em',
        },
        h4: {
            fontFamily: '"Orbitron", "Rajdhani", sans-serif',
            fontWeight: 600,
            fontSize: '2rem',
        },
        h5: {
            fontFamily: '"Orbitron", "Rajdhani", sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h6: {
            fontFamily: '"Orbitron", "Rajdhani", sans-serif',
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        button: {
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.7,
        },
    },
    shape: {
        borderRadius: 16,
    },
    shadows: [
        'none',
        '0 2px 8px rgba(0, 229, 255, 0.15)',
        '0 4px 16px rgba(0, 229, 255, 0.2)',
        '0 8px 24px rgba(0, 229, 255, 0.25)',
        '0 12px 32px rgba(0, 229, 255, 0.3)',
        '0 16px 40px rgba(0, 229, 255, 0.35)',
        '0 20px 48px rgba(0, 229, 255, 0.4)',
        '0 24px 56px rgba(0, 229, 255, 0.45)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
        '0 0 0 1px rgba(0, 229, 255, 0.1)',
    ],
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '@import': [
                    'url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@400;500;600;700;800;900&display=swap")',
                ],
                body: {
                    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 229, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(213, 0, 249, 0.05) 0%, transparent 50%)',
                    backgroundAttachment: 'fixed',
                },
                '*::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '*::-webkit-scrollbar-track': {
                    background: '#0a0e1a',
                },
                '*::-webkit-scrollbar-thumb': {
                    background: 'rgba(0, 229, 255, 0.3)',
                    borderRadius: '4px',
                    '&:hover': {
                        background: 'rgba(0, 229, 255, 0.5)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '12px 32px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0, 229, 255, 0.4)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #00e5ff 0%, #d500f9 100%)',
                    boxShadow: '0 4px 16px rgba(0, 229, 255, 0.3)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #6effff 0%, #ff5bff 100%)',
                        boxShadow: '0 8px 24px rgba(0, 229, 255, 0.5)',
                    },
                },
                outlined: {
                    borderWidth: 2,
                    borderColor: 'rgba(0, 229, 255, 0.5)',
                    '&:hover': {
                        borderWidth: 2,
                        borderColor: '#00e5ff',
                        backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'linear-gradient(135deg, rgba(20, 24, 36, 0.95) 0%, rgba(20, 24, 36, 0.8) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 229, 255, 0.15)',
                    borderRadius: 20,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 229, 255, 0.3), 0 0 0 1px rgba(0, 229, 255, 0.3)',
                        borderColor: 'rgba(0, 229, 255, 0.4)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'linear-gradient(135deg, rgba(10, 14, 26, 0.95) 0%, rgba(20, 24, 36, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(20, 24, 36, 0.6)',
                        borderRadius: 12,
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                            borderColor: 'rgba(0, 229, 255, 0.2)',
                            borderWidth: 2,
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(0, 229, 255, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#00e5ff',
                            boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    borderRadius: 8,
                },
                filled: {
                    border: '1px solid',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(0, 229, 255, 0.1)',
                },
                head: {
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.85rem',
                    color: '#00e5ff',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'linear-gradient(135deg, rgba(20, 24, 36, 0.95) 0%, rgba(20, 24, 36, 0.8) 100%)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundImage: 'linear-gradient(135deg, rgba(20, 24, 36, 0.98) 0%, rgba(20, 24, 36, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    borderRadius: 20,
                },
            },
        },
    },
});

export default theme;
