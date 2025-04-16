import React, { useState, useEffect } from 'react';
import { Table, Modal, Input, FloatButton, Form, Select, message, DatePicker } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Marche } from '../../../services/MarcheService';
import dayjs from 'dayjs'; 
import '../pagesSec.css';
import Sidebar from '../../../components/Sidebar/Sidebar_Sec';
import { getMarches, updateMarche } from '../../../services/MarcheService';

const List_Marche = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingMarche, setEditingMarche] = useState<Marche | null>(null);
  const [dataSource, setDataSource] = useState<Marche[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Charger les marchés depuis l'API
  useEffect(() => {
    const fetchMarches = async () => {
      try {
        const data = await getMarches();
        setDataSource(data as Marche[]);
      } catch (error) {
        console.error("Erreur lors de la récupération des marchés :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarches();
  }, []);

  const onEditMarche = (record: Marche) => {
    setIsEditing(true);
    setEditingMarche(record);
    form.setFieldsValue({
      ...record,
      delaisMarche: record.delaisMarche ? dayjs(record.delaisMarche) : null,
      statut: record.statut,
      type_Marche: record.type_Marche
    });
  };

  const handleSave = async (values: any) => {
    try {
      if (!editingMarche) {
        message.error("ID du marché manquant");
        return;
      }

      if (!editingMarche.id_Marche) {
        message.error('ID du marché manquant');
        return;
      }

      // Prepare the data to send to backend
      const updatedMarche = {
        id_Marche: editingMarche.id_Marche,
        numOrdre: editingMarche.numOrdre,
        type_Marche: values.type_Marche,
        objet_marche: values.objet_marche,
        statut: values.statut,
        delaisMarche: values.delaisMarche ? values.delaisMarche.format('YYYY-MM-DD') : null,
        delaisGarantie: values.delaisGarantie,
        chefServiceConcerne: values.chefServiceConcerne,
        serviceConcerne: values.serviceConcerne,
        montantFinal: values.montantFinal,
        isArchived: values.isArchived
      };

      await updateMarche(editingMarche.id_Marche, updatedMarche);
      
      setDataSource((pre) =>
        pre.map((marche) =>
          marche.id_Marche === updatedMarche.id_Marche ? updatedMarche : marche
        )
      );
      
      setIsEditing(false);
      setEditingMarche(null);
      message.success('Marché mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du marché:', error);
      message.error('Erreur lors de la mise à jour du marché');
    }
  };

  const columns = [
    {
      key: "1",
      title: "Numéro de marché",
      dataIndex: "numOrdre",
    },
    {
      key: "2",
      title: "Type de marché",
      dataIndex: "type_Marche",
    },
    {
      key: "3",
      title: "Objet de marché",
      dataIndex: "objet_marche",
    },
    {
      key: "4",
      title: "Délais du marché",
      dataIndex: "delaisMarche",
    },
    {
      key: "5",
      title: "Statut",
      dataIndex: "statut",
    },
    {
      key: "6",
      title: "Actions",
      render: (record: Marche) => (
        <>
          <EditOutlined
            onClick={() => onEditMarche(record)}
            style={{ color: "blue", marginRight: 12 }}
          />
        </>
      ),
    },
  ];

  return (
    <Sidebar>
      <div className="list-container">
        <FloatButton
          icon={<PlusOutlined />}
          onClick={() => navigate("/AddMarche")}
          style={{ right: '24px', backgroundColor: 'black !important' }}
        />
        <div className="list-header">
          <h2 className="list-title">Liste des Marchés</h2>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id_Marche"
          loading={loading}
        />
        <Modal
          title="Modifier le marché"
          open={isEditing}
          onCancel={() => {
            setIsEditing(false);
            setEditingMarche(null);
          }}
          onOk={form.submit}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item
              name="numOrdre"
              label="Numéro de marché"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="type_Marche"
              label="Type de marché"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Select>
                <Select.Option value="TRAVAUX">TRAVAUX</Select.Option>
                <Select.Option value="FOURNITURE">FOURNITURE</Select.Option>
                <Select.Option value="PRESTATION_SERVICE">PRESTATION_SERVICE</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="objet_marche"
              label="Objet de marché"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="delaisMarche"
              label="Délais du marché"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                placeholder="Sélectionner la date du délai du marché"
                className="date-picker-container"
                value={form.getFieldValue('delaisMarche') ? dayjs(form.getFieldValue('delaisMarche')) : null}
              />
            </Form.Item>

            <Form.Item
              name="statut"
              label="Statut"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Select>
                <Select.Option value="EnAttente">En Attente</Select.Option>
                <Select.Option value="EnCours">En Cours</Select.Option>
                <Select.Option value="Valide">Valide</Select.Option>
                <Select.Option value="NonValide">NonValide</Select.Option>
                <Select.Option value="Cloture">Cloture</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default List_Marche;