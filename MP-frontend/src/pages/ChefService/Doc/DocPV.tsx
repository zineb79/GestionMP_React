import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Input,
  FloatButton,
  Form,
  DatePicker,
  Select,
  message,
  Tag,
  InputNumber,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getDecomptes,
  deleteDecompte,
  updateDecompte,
} from "../../../services/DecompteService";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";

import dayjs from "dayjs";
import { getSocietes, Societe } from "../../../services/SocieteService";
import { getMarches, Marche } from "../../../services/MarcheService";
import { Decompte } from "../../../services/DecompteService";

const List_Decomptes = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingDecompte, setEditingDecompte] = useState<Decompte | null>(null);
  const [dataSource, setDataSource] = useState<Decompte[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [marches, setMarches] = useState<Marche[]>([]);

  useEffect(() => {
    const fetchDecomptes = async () => {
      try {
        setLoading(true);
        const [decomptesData, societesData, marchesData] = await Promise.all([
          getDecomptes(),
          getSocietes(),
          getMarches(),
        ]);
        
        // Associer les marchés avec leurs sociétés
        const marchesWithSocietes = marchesData.map(marche => {
          const societe = societesData.find(s => s.id_SO === marche.idSociete);
          return {
            ...marche,
            societe_obj: societe
          };
        });
        
        // Enrichir les décomptes avec les marchés complets (incluant les sociétés)
        const enrichedData = decomptesData.map(decompte => {
          const marche = marchesWithSocietes.find(m => m.id_Marche === decompte.idMarche);
          return {
            ...decompte,
            marche_obj: marche
          };
        });
        
        setDataSource(enrichedData);
        setMarches(marchesWithSocietes);
        setSocietes(societesData);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        message.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchDecomptes();
  }, []);

  const onDeleteDecompte = async (record: Decompte) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer ce décompte ?",
      okText: "Oui",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteDecompte(record.id_D!);
          setDataSource((pre) => pre.filter((dec) => dec.id_D !== record.id_D));
          message.success("Le décompte a été supprimé avec succès");
        } catch (error) {
          message.error("Erreur lors de la suppression du décompte");
          console.error("Error:", error);
        }
      },
    });
  };

  const onEditDecompte = (record: Decompte) => {
    setIsEditing(true);
    setEditingDecompte({ ...record });
    form.setFieldsValue({
      ...record,
      numOrdre_D: record.numOrdre_D,
      aCompte: record.aCompte,
      somme_D: record.somme_D,
    });
  };

  const handleSave = async (values: any) => {
    if (!editingDecompte) return;
  
    try {
      if (!editingDecompte.id_D) {
        message.error("ID du décompte manquant");
        return;
      }
  
      const updatedDecompte = {
        ...editingDecompte,
        ...values,
      };
  
      await updateDecompte(updatedDecompte);
  
      // Rafraîchir les données avec les associations de marché
      const [newDecomptes, newMarches] = await Promise.all([
        getDecomptes(),
        getMarches()
      ]);
      
      const marchesWithSocietes = newMarches.map(marche => {
        const societe = societes.find(s => s.id_SO === marche.idSociete);
        return { ...marche, societe_obj: societe };
      });
      
      const enrichedData = newDecomptes.map(decompte => {
        const marche = marchesWithSocietes.find(m => m.id_Marche === decompte.idMarche);
        return { ...decompte, marche_obj: marche };
      });
      
      setDataSource(enrichedData);
      setMarches(marchesWithSocietes);
  
      setIsEditing(false);
      setEditingDecompte(null);
      message.success("Le décompte a été mis à jour avec succès");
    } catch (error) {
      message.error("Erreur lors de la mise à jour du décompte");
      console.error("Error:", error);
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingDecompte(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Numéro de Marché",
      dataIndex: ["marche_obj", "numOrdre"],
      key: "marche",
      render: (text: string, record: Decompte) => (
        <Tag color="blue">{record.marche_obj?.numOrdre || "N/A"}</Tag>
      ),
      sorter: (a: Decompte, b: Decompte) => 
        (a.marche_obj?.numOrdre || "").localeCompare(b.marche_obj?.numOrdre || "")
    },
    {
      title: "Numéro d'ordre",
      dataIndex: "numOrdre_D",
      key: "numOrdre_D",
      sorter: (a: Decompte, b: Decompte) =>
        (a.numOrdre_D || "").localeCompare(b.numOrdre_D || ""),
    },
    {
      title: "Acompte",
      dataIndex: "aCompte",
      key: "aCompte",
      render: (value: number) => `${value} €`,
      sorter: (a: Decompte, b: Decompte) => a.aCompte - b.aCompte,
    },
    {
      title: "Somme",
      dataIndex: "somme_D",
      key: "somme_D",
      render: (value: number) => `${value} €`,
      sorter: (a: Decompte, b: Decompte) => a.somme_D - b.somme_D,
    },
    {
      title: "Société",
      key: "societe",
      render: (record: Decompte) => (
        record.marche_obj?.societe_obj?.raisonSociale || "N/A"
      ),
      sorter: (a: Decompte, b: Decompte) => 
        (a.marche_obj?.societe_obj?.raisonSociale || "").localeCompare(
          b.marche_obj?.societe_obj?.raisonSociale || ""
        )
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Decompte) => (
        <>
          <EditOutlined 
            onClick={() => onEditDecompte(record)}
            style={{ color: "#1890ff", cursor: "pointer" }}
          />
          <DeleteOutlined
            onClick={() => onDeleteDecompte(record)}
            style={{ color: "red", marginLeft: 12, cursor: "pointer" }}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <Sidebar>
        <div className="list-container">
          <div className="list-header">
            <h2 className="list-title">Liste des Décomptes</h2>
          </div>
          <FloatButton
            icon={<PlusOutlined />}
            onClick={() => navigate("/AddDecompte")}
            tooltip="Ajouter un décompte"
          />
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id_D"
            loading={loading}
            pagination={{ pageSize: 10 }}
            bordered
          />

          <Modal
            title="Modifier le décompte"
            open={isEditing}
            onCancel={resetEditing}
            onOk={() => form.submit()}
            width={600}
          >
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item label="Marché associé">
                <Input 
                  value={editingDecompte?.marche_obj?.numOrdre || "N/A"} 
                  disabled 
                />
              </Form.Item>
              
              <Form.Item label="Société">
                <Input 
                  value={editingDecompte?.marche_obj?.societe_obj?.raisonSociale || "N/A"} 
                  disabled 
                />
              </Form.Item>

              <Form.Item
                label="Numéro d'ordre"
                name="numOrdre_D"
                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="Acompte (€)"
                name="aCompte"
                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0}
                  step={0.01}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                />
              </Form.Item>

              <Form.Item
                label="Somme (€)"
                name="somme_D"
                rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0}
                  step={0.01}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Sidebar>
    </div>
  );
};

export default List_Decomptes;