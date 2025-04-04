import React, { useState, useEffect } from 'react';
import { Table, Modal, Input, FloatButton, Form, Select, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from '../../../components/Sidebar/Sidebar_Sec';
import { deleteMarche, getMarches, updateMarche } from '../../../services/MarcheService';
import { AxiosError } from 'axios';

interface Marche {
  id_Marche: number;
  numOrdre: string;
  type_Marche: string;
  objet_marche: string;
  statut: string;
  idSociete: number | null;
  idNotification: number | null;
}

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

  const onDeleteMarche = async (record: Marche) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer ce marché ?",
      okText: "Oui",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteMarche(record.numOrdre);
          setDataSource((pre) => pre.filter((marche) => marche.numOrdre !== record.numOrdre));
        } catch (error) {
          console.error("Erreur lors de la suppression du marché :", error);
          alert("Impossible de supprimer le marché. Veuillez réessayer plus tard.");
        }
      },
    });
  };

  const onEditMarche = (record: Marche) => {
    setIsEditing(true);
    setEditingMarche(record);
    form.setFieldsValue(record);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!editingMarche) return;

      const updatedMarche = {
        ...editingMarche,
        ...values
      };

      console.log("Données envoyées au backend:", {
        id: editingMarche.id_Marche,
        marche: updatedMarche
      });

      await updateMarche(editingMarche.id_Marche.toString(), updatedMarche);
      
      setDataSource((pre) =>
        pre.map((marche) =>
          marche.id_Marche === updatedMarche.id_Marche ? updatedMarche : marche
        )
      );
      
      message.success('Marché mis à jour avec succès');
      setIsEditing(false);
      setEditingMarche(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du marché:", error);
      if ((error as AxiosError).response) {
        console.error("Réponse d'erreur du serveur:", (error as AxiosError).response?.data);
      }
      message.error("Erreur lors de la mise à jour du marché");
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
      title: "Statut",
      dataIndex: "statut",
    },
    {
      key: "5",
      title: "Actions",
      render: (record: Marche) => (
        <>
          <EditOutlined
            onClick={() => onEditMarche(record)}
            style={{ color: "blue", marginRight: 12 }}
          />
          <DeleteOutlined
            onClick={() => onDeleteMarche(record)}
            style={{ color: "red" }}
          />
        </>
      ),
    },
  ];

  return (
    <Sidebar>
      <div className="form">
        <FloatButton
          icon={<PlusOutlined />}
          onClick={() => navigate("/add-marche")}
        />
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
          onOk={handleSave}
        >
          <Form
            form={form}
            layout="vertical"
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