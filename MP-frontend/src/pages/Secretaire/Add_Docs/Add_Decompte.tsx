import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createDecompte } from '../../../services/DecompteService';
import Sidebar from '../../../components/Sidebar/Sidebar_Sec';
import '../PagesSec.css';

const { Option } = Select;

const Add_Decompte = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [societes, setSocietes] = useState([]);
  const [marches, setMarches] = useState([]);

  useEffect(() => {
    // Fetch societes and marches data
    const fetchSocietes = async () => {
      try {
        // Replace with actual API call
        const data = await fetch('/api/societes').then(res => res.json());
        setSocietes(data);
      } catch (error) {
        console.error('Error fetching societes:', error);
      }
    };

    const fetchMarches = async () => {
      try {
        // Replace with actual API call
        const data = await fetch('/api/marches').then(res => res.json());
        setMarches(data);
      } catch (error) {
        console.error('Error fetching marches:', error);
      }
    };

    fetchSocietes();
    fetchMarches();
  }, []);

  const onFinish = async (values: any) => {
    try {
      await createDecompte(values);
      message.success('Décompte ajouté avec succès');
      navigate('/secretaire/list-decomptes');
    } catch (error) {
      message.error('Erreur lors de l\'ajout du décompte');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Sidebar>
        <div className="list-container">
          <div className="list-header">
            <h2 className="list-title">Ajouter un Décompte</h2>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="nom_D"
              label="Nom"
              rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="numOrdre_D"
              label="Numéro d'ordre"
              rules={[{ required: true, message: 'Veuillez entrer le numéro d\'ordre' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="aCompte"
              label="Acompte"
              rules={[{ required: true, message: 'Veuillez entrer l\'acompte' }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="somme_D"
              label="Somme"
              rules={[{ required: true, message: 'Veuillez entrer la somme' }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="societe_D"
              label="Société"
              rules={[{ required: true, message: 'Veuillez sélectionner une société' }]}
            >
              <Select>
                {societes.map((societe: any) => (
                  <Option key={societe.id_S} value={societe.id_S}>
                    {societe.nom_S}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="marche_D"
              label="Marché"
              rules={[{ required: true, message: 'Veuillez sélectionner un marché' }]}
            >
              <Select>
                {marches.map((marche: any) => (
                  <Option key={marche.id_M} value={marche.id_M}>
                    {marche.numOrdre_M}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Button block type="primary" htmlType="submit" className='ajouter'>
              Ajouter
            </Button>
          </Form>
        </div>
      </Sidebar>
    </div>
  );
};

export default Add_Decompte;
