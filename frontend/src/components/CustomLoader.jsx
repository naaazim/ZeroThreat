import { Box, CircularProgress, Typography, alpha, useTheme } from '@mui/material';
import { Security } from '@mui/icons-material';

function CustomLoader({ message = 'Chargement...', fullScreen = true }) {
    const theme = useTheme();

    const content = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                ...(fullScreen && {
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }),
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    display: 'inline-flex',
                }}
            >
                {/* Outer glow ring */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                        animation: 'pulse 2s ease-in-out infinite',
                    }}
                />

                {/* Background circle */}
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={80}
                    thickness={2}
                    sx={{
                        color: alpha(theme.palette.primary.main, 0.1),
                        position: 'absolute',
                    }}
                />

                {/* Animated progress */}
                <CircularProgress
                    size={80}
                    thickness={2}
                    sx={{
                        color: theme.palette.primary.main,
                        filter: `drop-shadow(0 0 8px ${alpha(theme.palette.primary.main, 0.6)})`,
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                        },
                    }}
                />

                {/* Center icon */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Security
                        sx={{
                            fontSize: 32,
                            color: theme.palette.primary.main,
                            animation: 'float 3s ease-in-out infinite',
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
                <Typography
                    variant="h6"
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                        mb: 1,
                    }}
                >
                    {message}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 0.5,
                        justifyContent: 'center',
                    }}
                >
                    {[0, 1, 2].map((i) => (
                        <Box
                            key={i}
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: theme.palette.primary.main,
                                animation: 'pulse 1.5s ease-in-out infinite',
                                animationDelay: `${i * 0.2}s`,
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );

    return content;
}

export default CustomLoader;
