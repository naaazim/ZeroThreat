import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import { Close, RocketLaunch } from '@mui/icons-material';
import { scanAPI } from '../services/api';

function NewScanModal({ open, onClose, onScanStarted }) {
    const [target, setTarget] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await scanAPI.launchScan(target);
            onScanStarted();
            onClose();
            setTarget('');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du lancement du scan');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTarget('');
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RocketLaunch color="primary" />
                    <Typography variant="h5" component="span">
                        Nouveau Scan
                    </Typography>
                </Box>
                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Entrez l'adresse IP ou l'URL cible pour lancer un scan de vulnérabilités
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Cible (IP ou URL)"
                        placeholder="ex: 192.168.1.1 ou http://example.com"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        required
                        autoFocus
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleClose} color="inherit">
                        Annuler
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading} startIcon={<RocketLaunch />}>
                        {loading ? 'Lancement...' : 'Scanner'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

export default NewScanModal;
