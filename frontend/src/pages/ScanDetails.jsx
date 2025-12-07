import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    CircularProgress,
    Alert,
    Paper,
    Divider,
    alpha,
    useTheme,
} from '@mui/material';
import { ArrowBack, Security, BugReport, Language } from '@mui/icons-material';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { scanAPI } from '../services/api';
import CustomLoader from '../components/CustomLoader';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ScanDetails() {
    const { id } = useParams();
    const [scan, setScan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    const fetchScanDetails = useCallback(async () => {
        if (!id) {
            setError('Identifiant de scan manquant');
            setLoading(false);
            return;
        }
        try {
            const response = await scanAPI.getById(id);
            setScan(response.data);
        } catch (err) {
            setError('Erreur lors du chargement des détails');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchScanDetails();
    }, [fetchScanDetails]);

    if (loading) {
        return <CustomLoader message="Chargement des détails du scan..." />;
    }

    if (error || !scan) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Alert severity="error">{error || 'Scan introuvable'}</Alert>
                <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
                    Retour au tableau de bord
                </Button>
            </Container>
        );
    }

    const portChartData = {
        labels: scan.nmapResults?.map((r) => `Port ${r.port}`) || [],
        datasets: [
            {
                data: scan.nmapResults?.map(() => 1) || [],
                backgroundColor: [
                    alpha(theme.palette.primary.main, 0.8),
                    alpha(theme.palette.secondary.main, 0.8),
                    alpha(theme.palette.success.main, 0.8),
                    alpha(theme.palette.warning.main, 0.8),
                    alpha(theme.palette.error.main, 0.8),
                ],
                borderWidth: 0,
            },
        ],
    };

    const vulnChartData = {
        labels: ['SQL', 'Web'],
        datasets: [
            {
                label: 'Vulnérabilités',
                data: [scan.sqlMapResults?.length || 0, scan.niktoResults?.length || 0],
                backgroundColor: [alpha(theme.palette.error.main, 0.8), alpha(theme.palette.warning.main, 0.8)],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: theme.palette.text.secondary,
                },
            },
        },
        scales: {
            y: {
                ticks: { color: theme.palette.text.secondary },
                grid: { color: alpha(theme.palette.text.secondary, 0.12) },
            },
            x: {
                ticks: { color: theme.palette.text.secondary },
                grid: { color: alpha(theme.palette.text.secondary, 0.12) },
            },
        },
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="sticky" elevation={0}>
                <Container maxWidth="xl">
                    <Toolbar sx={{ py: 1.5 }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => navigate('/dashboard')}
                            sx={{
                                mr: 2,
                                color: 'text.primary',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    color: 'primary.main',
                                    transform: 'translateX(-4px)',
                                },
                            }}
                        >
                            Retour
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1.5 }}>
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
                                    Détail du scan
                                </Typography>
                            </Box>
                        </Box>
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
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <Card
                        sx={{
                            background: `linear-gradient(150deg, ${alpha(theme.palette.background.paper, 0.96)}, ${alpha(
                                theme.palette.background.paper,
                                0.9
                            )})`,
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="overline" color="text.secondary">
                                        Scan #{scan.id}
                                    </Typography>
                                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                                        Cible {scan.target}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <Typography
                                            sx={{
                                                fontFamily: 'monospace',
                                                color: 'primary.main',
                                                bgcolor: alpha(theme.palette.primary.main, 0.12),
                                                px: 2,
                                                py: 0.5,
                                                borderRadius: 1,
                                            }}
                                        >
                                            {scan.target}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {new Date(scan.timestamp).toLocaleString('fr-FR')}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Chip
                                    label={scan.status}
                                    color={scan.status === 'COMPLETED' ? 'success' : 'info'}
                                    sx={{ fontWeight: 700, px: 1.5 }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4} className="animate-scale-in stagger-1">
                        <Card
                            className="hover-lift"
                            sx={{
                                p: 3,
                                background: `linear-gradient(155deg, ${alpha(theme.palette.success.main, 0.14)}, ${alpha(
                                    theme.palette.background.paper,
                                    0.92
                                )})`,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                        {scan.nmapResults?.length || 0}
                                    </Typography>
                                    <Typography color="text.secondary">Ports ouverts</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.success.main, 0.2),
                                        color: theme.palette.success.main,
                                    }}
                                >
                                    <Security />
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4} className="animate-scale-in stagger-2">
                        <Card
                            className="hover-lift"
                            sx={{
                                p: 3,
                                background: `linear-gradient(155deg, ${alpha(theme.palette.error.main, 0.14)}, ${alpha(
                                    theme.palette.background.paper,
                                    0.92
                                )})`,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                        {scan.sqlMapResults?.length || 0}
                                    </Typography>
                                    <Typography color="text.secondary">Vulnérabilités SQL</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.error.main, 0.2),
                                        color: theme.palette.error.main,
                                    }}
                                >
                                    <BugReport />
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4} className="animate-scale-in stagger-3">
                        <Card
                            className="hover-lift"
                            sx={{
                                p: 3,
                                background: `linear-gradient(155deg, ${alpha(theme.palette.warning.main, 0.16)}, ${alpha(
                                    theme.palette.background.paper,
                                    0.92
                                )})`,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                        {scan.niktoResults?.length || 0}
                                    </Typography>
                                    <Typography color="text.secondary">Vulnérabilités Web</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.warning.main, 0.22),
                                        color: theme.palette.warning.main,
                                    }}
                                >
                                    <Language />
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                    Distribution des ports
                                </Typography>
                                <Box sx={{ height: 300 }}>
                                    {scan.nmapResults?.length > 0 ? (
                                        <Pie data={portChartData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                                    ) : (
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                            <Typography color="text.secondary">Aucune donnée</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                    Vulnérabilités détectées
                                </Typography>
                                <Box sx={{ height: 300 }}>
                                    <Bar data={vulnChartData} options={chartOptions} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                                    Résultats Nmap
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {scan.nmapResults?.length > 0 ? (
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Port</TableCell>
                                                    <TableCell>Protocole</TableCell>
                                                    <TableCell>Service</TableCell>
                                                    <TableCell>Version</TableCell>
                                                    <TableCell>État</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {scan.nmapResults.map((result) => (
                                                    <TableRow key={result.id}>
                                                        <TableCell>{result.port}</TableCell>
                                                        <TableCell>{result.protocol}</TableCell>
                                                        <TableCell>{result.service}</TableCell>
                                                        <TableCell>{result.version}</TableCell>
                                                        <TableCell>
                                                            <Chip label={result.state} size="small" color="success" />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography color="text.secondary">Aucun résultat</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                                    Résultats SQLMap
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {scan.sqlMapResults?.length > 0 ? (
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Type</TableCell>
                                                    <TableCell>Paramètre</TableCell>
                                                    <TableCell>Payload</TableCell>
                                                    <TableCell>Description</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {scan.sqlMapResults.map((result) => (
                                                    <TableRow key={result.id}>
                                                        <TableCell>
                                                            <Chip label={result.vulnerabilityType} size="small" color="error" />
                                                        </TableCell>
                                                        <TableCell>{result.parameter}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                                            {result.payload}
                                                        </TableCell>
                                                        <TableCell>{result.description}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography color="text.secondary">Aucune vulnérabilité détectée</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                                    Résultats Nikto
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {scan.niktoResults?.length > 0 ? (
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>OSVDB ID</TableCell>
                                                    <TableCell>Méthode</TableCell>
                                                    <TableCell>URI</TableCell>
                                                    <TableCell>Description</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {scan.niktoResults.map((result) => (
                                                    <TableRow key={result.id}>
                                                        <TableCell>{result.osvdbId}</TableCell>
                                                        <TableCell>
                                                            <Chip label={result.method} size="small" />
                                                        </TableCell>
                                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                                            {result.uri}
                                                        </TableCell>
                                                        <TableCell>{result.description}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography color="text.secondary">Aucune vulnérabilité détectée</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default ScanDetails;
