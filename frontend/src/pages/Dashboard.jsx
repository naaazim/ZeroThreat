import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    CircularProgress,
    Alert,
    LinearProgress,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Add,
    Visibility,
    AccountCircle,
    Assessment,
    CheckCircle,
    Security,
    BugReport,
} from '@mui/icons-material';
import { scanAPI } from '../services/api';
import NewScanModal from '../components/NewScanModal';
import CustomLoader from '../components/CustomLoader';

function Dashboard() {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [waitingScan, setWaitingScan] = useState(false);
    const [knownCount, setKnownCount] = useState(0);
    const navigate = useNavigate();
    const theme = useTheme();

    const getUserFromStorage = () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr || userStr === 'undefined' || userStr === 'null') {
                return { username: 'User' };
            }
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return { username: 'User' };
        }
    };

    const user = getUserFromStorage();

    const fetchScans = useCallback(async () => {
        try {
            const response = await scanAPI.getAll(0, 20);
            const list = response.data.content || [];
            setScans(list);
            const newCount = list.length;
            setKnownCount((prev) => {
                if (waitingScan && newCount > prev) {
                    setWaitingScan(false);
                }
                return newCount;
            });
        } catch (err) {
            setError('Erreur lors du chargement des scans');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [waitingScan]);

    useEffect(() => {
        fetchScans();
        const intervalId = setInterval(fetchScans, 5000);
        return () => clearInterval(intervalId);
    }, [fetchScans]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            COMPLETED: { color: 'success', label: 'Terminé' },
            RUNNING: { color: 'info', label: 'En cours' },
            PENDING: { color: 'warning', label: 'En attente' },
            FAILED: { color: 'error', label: 'Échoué' },
        };
        const config = statusConfig[status] || statusConfig.PENDING;
        return <Chip label={config.label} color={config.color} size="small" />;
    };

    const stats = {
        total: scans.length,
        completed: scans.filter((s) => s.status === 'COMPLETED').length,
        ports: scans.reduce((acc, s) => acc + (s.summary?.totalOpenPorts || 0), 0),
        vulnerabilities: scans.reduce(
            (acc, s) => acc + (s.summary?.sqlVulnerabilities || 0) + (s.summary?.webVulnerabilities || 0),
            0
        ),
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="sticky" elevation={0}>
                <Container maxWidth="xl">
                    <Toolbar sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    '&:hover img': {
                                        transform: 'scale(1.05) rotate(5deg)',
                                    },
                                }}
                            >
                                <img
                                    src="/logo.png"
                                    alt="ZeroThreat"
                                    style={{
                                        height: 38,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        filter: 'drop-shadow(0 0 8px rgba(124, 244, 194, 0.3))',
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    ZeroThreat
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tableau de bord
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{
                                color: 'text.primary',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    width: 38,
                                    height: 38,
                                    border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                    boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.6)}`,
                                    },
                                }}
                            >
                                {user.username?.[0]?.toUpperCase()}
                            </Avatar>
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                            <MenuItem disabled>
                                <AccountCircle sx={{ mr: 1 }} /> {user.username}
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                        </Menu>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(
                        theme.palette.secondary.main,
                        0.08
                    )})`,
                    borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                }}
            >
                <Container maxWidth="xl" sx={{ py: 5 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2 }}>
                        <Box>
                            <Typography variant="h2" sx={{ mb: 1 }}>
                                Tableau de bord
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Résumé des scans, incidents et actions rapides.
                            </Typography>
                        </Box>
                        <Button variant="contained" size="large" startIcon={<Add />} onClick={() => setShowModal(true)} sx={{ alignSelf: 'flex-start' }}>
                            Nouveau Scan
                        </Button>
                    </Box>
                </Container>
            </Box>

            {waitingScan && (
                <Box sx={{ position: 'sticky', top: 0, zIndex: 1000 }}>
                    <LinearProgress color="primary" />
                </Box>
            )}

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {waitingScan && (
                    <Alert severity="info" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={18} sx={{ mr: 1.5 }} />
                        Scan en cours : nous affichons les résultats dès qu'ils sont reçus.
                    </Alert>
                )}
                <Grid container spacing={3} sx={{ mb: 2 }}>
                    {[
                        { icon: <Assessment />, label: 'Scans totaux', value: stats.total, color: theme.palette.primary.main },
                        { icon: <CheckCircle />, label: 'Scans terminés', value: stats.completed, color: theme.palette.success.main },
                        { icon: <Security />, label: 'Ports détectés', value: stats.ports, color: theme.palette.info.main },
                        { icon: <BugReport />, label: 'Vulnérabilités', value: stats.vulnerabilities, color: theme.palette.error.main },
                    ].map((stat) => (
                        <Grid item xs={12} sm={6} md={3} key={stat.label} className="animate-scale-in" sx={{ animationDelay: `${['0.1s', '0.2s', '0.3s', '0.4s'][stat.label === 'Scans totaux' ? 0 : stat.label === 'Scans terminés' ? 1 : stat.label === 'Ports détectés' ? 2 : 3]}` }}>
                            <Card
                                className="hover-lift"
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    background: `linear-gradient(155deg, ${alpha(stat.color, 0.12)}, ${alpha(
                                        theme.palette.background.paper,
                                        0.9
                                    )})`,
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box
                                        sx={{
                                            p: 1,
                                            borderRadius: 2,
                                            bgcolor: alpha(stat.color, 0.2),
                                            color: stat.color,
                                            display: 'inline-flex',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                        {stat.value}
                                    </Typography>
                                </Box>
                                <Typography color="text.secondary">{stat.label}</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Card sx={{ mt: 2 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="h4">Historique des scans</Typography>
                                <Typography color="text.secondary">Derniers lancements et état d'avancement.</Typography>
                            </Box>
                            <Button variant="outlined" startIcon={<Add />} onClick={() => setShowModal(true)}>
                                Nouveau scan
                            </Button>
                        </Box>

                        {loading ? (
                            <CustomLoader message="Chargement des scans..." fullScreen={false} />
                        ) : error ? (
                            <Alert severity="error">{error}</Alert>
                        ) : scans.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Aucun scan disponible
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 3 }}>
                                    Lancez votre premier scan maintenant
                                </Typography>
                                <Button variant="contained" startIcon={<Add />} onClick={() => setShowModal(true)}>
                                    Lancer un scan
                                </Button>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Cible</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Statut</TableCell>
                                            <TableCell align="center">Ports</TableCell>
                                            <TableCell align="center">SQL</TableCell>
                                            <TableCell align="center">Web</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {scans.map((scan) => (
                                            <TableRow key={scan.id} hover>
                                                <TableCell sx={{ fontWeight: 700 }}>#{scan.id}</TableCell>
                                                <TableCell>
                                                    <Typography
                                                        sx={{
                                                            fontFamily: 'monospace',
                                                            color: 'primary.main',
                                                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        {scan.target}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{new Date(scan.timestamp).toLocaleString('fr-FR')}</TableCell>
                                                <TableCell>{getStatusChip(scan.status)}</TableCell>
                                                <TableCell align="center">
                                                    <Chip label={scan.summary?.totalOpenPorts || 0} size="small" color="success" />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={scan.summary?.sqlVulnerabilities || 0}
                                                        size="small"
                                                        color={scan.summary?.sqlVulnerabilities > 0 ? 'error' : 'default'}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={scan.summary?.webVulnerabilities || 0}
                                                        size="small"
                                                        color={scan.summary?.webVulnerabilities > 0 ? 'warning' : 'default'}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        component={Link}
                                                        to={`/scan/${scan.id}`}
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<Visibility />}
                                                    >
                                                        Détails
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </CardContent>
                </Card>
            </Container>

            <NewScanModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onScanStarted={fetchScans}
                onScanLaunched={() => {
                    setWaitingScan(true);
                    setKnownCount(scans.length);
                }}
            />
        </Box>
    );
}

export default Dashboard;
