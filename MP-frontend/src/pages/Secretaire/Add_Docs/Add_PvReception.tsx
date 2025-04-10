import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createPvReception, TypePvReception } from '../../../services/PvReceptionService';
import Sidebar from '../../../components/Sidebar/Sidebar_Sec';
import '../PagesSec.css';

const { Option } = Select;

const Add_PvReception = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [marches, setMarches] = useState([]);

  useEffect(() => {
    // Fetch marches data
    const fetchMarches = async () => {
      try {
        // Replace with actual API call
        const data = await fetch('/api/marches').then(res => res.json());
        setMarches(data);
      } catch (error) {
        console.error('Error fetching marches:', error);
      }
    };

    fetchMarches();
  }, []);

  const onFinish = async (values: any) => {
    try {
      await createPvReception(values);
      message.success('PV de réception ajouté avec succès');
      navigate('/secretaire/list-pv-receptions');
    } catch (error) {
      message.error('Erreur lors de l\'ajout du PV de réception');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Sidebar>
        <div className="list-container">
          <div className="list-header">
            <h2 className="list-title">Ajouter un PV de Réception</h2>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="type_PVR"
              label="Type de PV"
              rules={[{ required: true, message: 'Veuillez sélectionner le type de PV' }]}
            >
              <Select>
                <Option value={TypePvReception.PROVISOIRE}>Provisoire</Option>
                <Option value={TypePvReception.DEFINITIVE}>Définitif</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="marche_PVR"
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

export default Add_PvReception;
