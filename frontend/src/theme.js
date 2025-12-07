import { createTheme, alpha } from '@mui/material/styles';

const surface = '#0c1018';
const panel = '#121927';
const mint = '#7cf4c2';
const amber = '#f6c177';
const sky = '#6bc1ff';
const purple = '#b794f6';
const rose = '#f687b3';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: mint,
            light: '#a8ffd9',
            dark: '#4dc29b',
            contrastText: '#0b0f16',
        },
        secondary: {
            main: amber,
            light: '#ffddb1',
            dark: '#c49046',
            contrastText: '#0b0f16',
        },
        background: {
            default: surface,
            paper: panel,
        },
        text: {
            primary: '#e8edf5',
            secondary: '#9fb1c9',
        },
        success: {
            main: '#7ce081',
            light: '#a8f5ab',
            dark: '#4caf50',
            contrastText: '#0b0f16',
        },
        warning: {
            main: amber,
            light: '#ffddb1',
            dark: '#c49046',
            contrastText: '#0b0f16',
        },
        error: {
            main: '#ef6a67',
            light: '#ff9b99',
            dark: '#d32f2f',
            contrastText: '#0b0f16',
        },
        info: {
            main: sky,
            light: '#9dd9ff',
            dark: '#2196f3',
            contrastText: '#0b0f16',
        },
        divider: alpha('#e8edf5', 0.06),
    },
    typography: {
        fontFamily: '"Space Grotesk", "Inter", system-ui, -apple-system, sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: 'clamp(2.8rem, 5vw, 3.6rem)',
            letterSpacing: '-0.04em',
        },
        h2: {
            fontWeight: 700,
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            letterSpacing: '-0.03em',
        },
        h3: {
            fontWeight: 700,
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            letterSpacing: '-0.02em',
        },
        h4: {
            fontWeight: 700,
            fontSize: '1.7rem',
            letterSpacing: '-0.01em',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.35rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.1rem',
            letterSpacing: '0',
        },
        button: {
            fontWeight: 700,
            letterSpacing: '0.02em',
            textTransform: 'none',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.7,
        },
        body2: {
            fontSize: '0.95rem',
            lineHeight: 1.6,
        },
    },
    shape: {
        borderRadius: 14,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '@import': [
                    'url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap")',
                ],
                body: {
                    backgroundImage:
                        'radial-gradient(circle at 20% 20%, rgba(124, 244, 194, 0.08) 0%, transparent 35%), ' +
                        'radial-gradient(circle at 80% 0%, rgba(107, 193, 255, 0.1) 0%, transparent 35%), ' +
                        'radial-gradient(circle at 50% 100%, rgba(183, 148, 246, 0.06) 0%, transparent 30%), ' +
                        'linear-gradient(140deg, #0b0f16 0%, #0f1724 50%, #0b0f16 100%)',
                    backgroundAttachment: 'fixed',
                },
                '*::-webkit-scrollbar': {
                    width: '12px',
                    height: '12px',
                },
                '*::-webkit-scrollbar-track': {
                    background: '#0b0f16',
                    borderRadius: '10px',
                },
                '*::-webkit-scrollbar-thumb': {
                    background: `linear-gradient(180deg, ${alpha(mint, 0.3)}, ${alpha(sky, 0.3)})`,
                    borderRadius: '10px',
                    border: '2px solid #0b0f16',
                    '&:hover': {
                        background: `linear-gradient(180deg, ${alpha(mint, 0.5)}, ${alpha(sky, 0.5)})`,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    padding: '12px 24px',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '0',
                        height: '0',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translate(-50%, -50%)',
                        transition: 'width 0.6s, height 0.6s',
                    },
                    '&:hover::before': {
                        width: '300px',
                        height: '300px',
                    },
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    },
                },
                contained: {
                    background: `linear-gradient(135deg, ${mint} 0%, ${sky} 50%, ${amber} 100%)`,
                    backgroundSize: '200% 200%',
                    color: '#0b0f16',
                    boxShadow: `0 8px 24px ${alpha(mint, 0.25)}`,
                    '&:hover': {
                        backgroundPosition: 'right center',
                        boxShadow: `0 12px 32px ${alpha(mint, 0.35)}`,
                    },
                    '&:active': {
                        transform: 'translateY(0px)',
                    },
                },
                outlined: {
                    borderWidth: 2,
                    borderColor: alpha(mint, 0.5),
                    color: mint,
                    background: alpha(mint, 0.03),
                    '&:hover': {
                        borderWidth: 2,
                        borderColor: mint,
                        backgroundColor: alpha(mint, 0.1),
                        boxShadow: `0 0 20px ${alpha(mint, 0.2)}`,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: `linear-gradient(165deg, ${alpha(panel, 0.98)} 0%, ${alpha(panel, 0.92)} 100%)`,
                    border: `1px solid ${alpha('#e8edf5', 0.08)}`,
                    boxShadow: `0 20px 60px ${alpha('#000', 0.4)}, inset 0 1px 0 ${alpha('#fff', 0.05)}`,
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 24px 70px ${alpha('#000', 0.5)}, inset 0 1px 0 ${alpha('#fff', 0.08)}`,
                        borderColor: alpha(mint, 0.15),
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: `linear-gradient(135deg, ${alpha(panel, 0.95)} 0%, ${alpha(panel, 0.92)} 50%, ${alpha(panel, 0.95)} 100%)`,
                    borderBottom: `2px solid transparent`,
                    borderImage: `linear-gradient(90deg, ${alpha(mint, 0.3)}, ${alpha(sky, 0.3)}, ${alpha(amber, 0.3)}) 1`,
                    boxShadow: `0 8px 32px ${alpha('#000', 0.4)}, 0 0 0 1px ${alpha(mint, 0.1)}`,
                    backdropFilter: 'blur(24px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: `linear-gradient(90deg, ${alpha(mint, 0.5)}, ${alpha(sky, 0.5)}, ${alpha(amber, 0.5)})`,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                        opacity: 1,
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha('#ffffff', 0.03),
                        borderRadius: 12,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '& fieldset': {
                            borderColor: alpha('#e8edf5', 0.12),
                            borderWidth: 2,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                        '&:hover fieldset': {
                            borderColor: alpha(mint, 0.4),
                        },
                        '&.Mui-focused': {
                            backgroundColor: alpha(mint, 0.04),
                            '& fieldset': {
                                borderColor: mint,
                                borderWidth: 2,
                                boxShadow: `0 0 0 4px ${alpha(mint, 0.12)}, 0 0 20px ${alpha(mint, 0.2)}`,
                            },
                        },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: mint,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                },
                filled: {
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${alpha('#e8edf5', 0.06)}`,
                    transition: 'background-color 0.2s ease',
                },
                head: {
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#e8edf5',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    backgroundColor: alpha(mint, 0.04),
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: alpha(mint, 0.05),
                        transform: 'scale(1.01)',
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    background: `linear-gradient(165deg, ${alpha(panel, 0.98)} 0%, ${alpha(panel, 0.94)} 100%)`,
                    border: `1px solid ${alpha('#e8edf5', 0.1)}`,
                    boxShadow: `0 24px 80px ${alpha('#000', 0.5)}`,
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                },
            },
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    backgroundColor: alpha('#000', 0.6),
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    color: mint,
                },
                circle: {
                    strokeLinecap: 'round',
                    animation: 'glow 2s ease-in-out infinite',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    height: 3,
                    borderRadius: 0,
                    backgroundColor: alpha(mint, 0.1),
                },
                bar: {
                    borderRadius: 0,
                    background: `linear-gradient(90deg, ${mint}, ${sky}, ${amber})`,
                    backgroundSize: '200% 100%',
                    animation: 'gradientShift 2s ease infinite',
                },
            },
        },
    },
});

export default theme;
