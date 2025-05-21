import React, { useState, useEffect } from 'react';
import { User, UserForm } from '../../services/UserService';
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
} from '@mui/material';

const GestionComptes: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserForm>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    // Simuler la récupération des utilisateurs
    const mockUsers: User[] = [
      {
        id: 1,
        nom: 'Zineb',
        prenom: 'Salmi',
        email: 'zineb.salmi@example.com',
        role: 'secrétaire',
        dateCreation: '2025-01-15',
      },
      {
        id: 2,
        nom: 'Asma',
        prenom: 'Marie',
        email: 'asma.marie@example.com',
        role: 'secrétaire',
        dateCreation: '2025-02-20',
      },
    ];
    setUsers(mockUsers);
  }, []);

  const handleOpenDialog = (user: User | null) => {
    setSelectedUser(user);
    if (user) {
      setFormData({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        password: '',
        role: user.role,
      });
    } else {
      setFormData({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique pour sauvegarder les modifications
    handleCloseDialog();
  };

  return (
    <Sidebar>
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <h2>Gestion des Comptes</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog(null)}
        >
          Ajouter un compte
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nom}</TableCell>
                <TableCell>{user.prenom}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.dateCreation}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenDialog(user)}
                  >
                    Voir/Modifier
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
            <Button type="submit" variant="contained" color="primary">
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
