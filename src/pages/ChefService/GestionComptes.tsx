import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  User
} from '../../services/UserService';
import { connectUserWs, disconnectUserWs } from '../../services/userWsService';

import Sidebar from '../../components/Sidebar/Sidebar_CS';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

const GestionComptes: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [utilisateursActifs, setUtilisateursActifs] = useState<User[]>([]);
  const stompClientRef = useRef<Client | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    id_user: 0,
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


// changement de l etat de chaque profil connecté
  useEffect(() => {
    connectUserWs(setUtilisateursActifs);
    return () => {
      disconnectUserWs();
    };
  }, []);


  // Charge la liste complète des utilisateurs via REST
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data || []);
      setError(null);
    } catch (error) {
      //console.error("Erreur lors du chargement des utilisateurs :", error);
      setError("Erreur lors du chargement des utilisateurs");
      setUsers([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchUsers();
      } catch {
        // gestion erreur déjà faite dans fetchUsers
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Connexion WebSocket pour récupérer utilisateurs actifs en temps réel
    connectUserWs(setUtilisateursActifs);

    return () => {
      // Déconnexion propre au démontage du composant
      disconnectUserWs();
    };
  }, []);

  const isFormValid = () => {
    return (
      formData.nom.trim() !== '' &&
      formData.prenom.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.role.trim() !== '' &&
      (selectedUser || formData.password.trim() !== '') // Mot de passe requis seulement en création
    );
  };  

  const handleOpenDialog = (user: User | null) => {
    setSelectedUser(user);
    if (user) {
      setFormData({
        ...user,
        password: '', // Ne jamais pré-remplir le mot de passe
      });
    } else {
      setFormData({
        id_user: 0,
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id_user, formData);
      } else {
        await createUser(formData);
      }
      await fetchUsers(); // recharge la liste des utilisateurs
      handleCloseDialog(); // ferme la boîte de dialogue
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      setError("Erreur lors de l'enregistrement de l'utilisateur");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Erreur lors de la suppression de l'utilisateur");
    }
  };

  if (loading) {
    return (
      <Sidebar>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Réessayer
          </Button>
        </Box>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <h2>Gestion des Comptes</h2>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog(null)}>
            Ajouter un compte
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id_user}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: 'primary.main',
                          color: 'white',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: 16,
                          position: 'relative',
                        }}
                      >
                        {user.prenom.charAt(0).toUpperCase()}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: 10,
                            height: 10,
                            bgcolor: utilisateursActifs.some(activeUser => activeUser.id_user === user.id_user)
                            ? 'green' : 'gray',
                            borderRadius: '50%',
                            border: '2px solid white',
                          }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.nom}</TableCell>
                  <TableCell>{user.prenom}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleOpenDialog(user)}>
                      Modifier
                    </Button>{' '}
                    <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(user.id_user)}>
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedUser ? 'Modifier le compte' : 'Créer un nouveau compte'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                margin="dense"
                name="nom"
                label="Nom"
                fullWidth
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
              <TextField
                margin="dense"
                name="prenom"
                label="Prénom"
                fullWidth
                value={formData.prenom}
                onChange={handleInputChange}
                required
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                fullWidth
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {!selectedUser && (
                <TextField
                  margin="dense"
                  name="password"
                  label="Mot de passe"
                  fullWidth
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              )}
              <TextField
                margin="dense"
                name="role"
                label="Rôle"
                fullWidth
                value={formData.role}
                onChange={handleInputChange}
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={!isFormValid()}
              >
                {selectedUser ? 'Modifier' : 'Créer'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Sidebar>
  );
};

export default GestionComptes;
