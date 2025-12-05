import { useState, useEffect } from 'react';
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

function Dashboard() {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
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

    useEffect(() => {
        fetchScans();
    }, []);

    const fetchScans = async () => {
        try {
            const response = await scanAPI.getAll(0, 20);
            setScans(response.data.content || []);
        } catch (err) {
            setError('Erreur lors du chargement des scans');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
            {/* Navbar */}
            <AppBar position="sticky" elevation={0}>
                <Container maxWidth="xl">
                    <Toolbar>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            <img src="/logo.png" alt="ZeroThreat" style={{ height: 40, marginRight: 12 }} />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                ZeroThreat
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{ color: 'text.primary' }}
                        >
                            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                                {user.username?.[0]?.toUpperCase()}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem disabled>
                                <AccountCircle sx={{ mr: 1 }} /> {user.username}
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                        </Menu>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                            Tableau de bord
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Gérez et visualisez vos scans de sécurité
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Add />}
                        onClick={() => setShowModal(true)}
                        sx={{ px: 4 }}
                    >
                        Nouveau Scan
                    </Button>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[
                        { icon: <Assessment />, label: 'Scans totaux', value: stats.total, color: theme.palette.primary.main },
                        { icon: <CheckCircle />, label: 'Scans terminés', value: stats.completed, color: theme.palette.success.main },
                        { icon: <Security />, label: 'Ports détectés', value: stats.ports, color: theme.palette.info.main },
                        { icon: <BugReport />, label: 'Vulnérabilités', value: stats.vulnerabilities, color: theme.palette.error.main },
                    ].map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: alpha(stat.color, 0.1),
                                                color: stat.color,
                                                mr: 2,
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    <Typography color="text.secondary">{stat.label}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Scans Table */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                            Historique des scans
                        </Typography>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                <CircularProgress />
                            </Box>
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
                                                <TableCell>#{scan.id}</TableCell>
                                                <TableCell>
                                                    <Typography
                                                        sx={{
                                                            fontFamily: 'monospace',
                                                            color: 'primary.main',
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
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

            {/* Modal */}
            <NewScanModal open={showModal} onClose={() => setShowModal(false)} onScanStarted={fetchScans} />
        </Box>
    );
}

export default Dashboard;
