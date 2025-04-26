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
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getDecomptes,
  deleteDecompte,
  updateDecompte,
} from "../../../services/DecompteService";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import "../PagesSec.css";
import dayjs from "dayjs";
import { getSocietes, Societe } from "../../../services/SocieteService";
import { getMarches, Marche } from "../../../services/MarcheService";
import { Decompte } from "../../../services/DecompteService";

const List_Decomptes = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingDecompte, setEditingDecompte] = useState<Decompte | null>(null);
  const [dataSource, setDataSource] = useState<any[]>([]);
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
        // Enrich decomptes with full societe and marche objects
        const enrichedData = decomptesData.map((decompte) => {
          // Debug log
          console.log("decompte:", decompte);
          // Use societe_D, societe_d_id_so, or idSociete for matching
          const societe = societesData.find(
            (s) =>
              s.id_SO ===
              (decompte.societe_D ?? (decompte as any).societe_d_id_so)
          );
          const marche = marchesData.find(
            (m) =>
              m.id_Marche ===
              (decompte.idMarche ?? (decompte as any).marche_d_id_marche)
          );
          // Debug log
          console.log("aCompte:", decompte.aCompte, "societe:", societe);
          return {
            ...decompte,
            societe,
            marche,
          };
        });
        setDataSource(enrichedData);
        setSocietes(societesData);
        setMarches(marchesData);
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
  };

  const handleSave = async () => {
    if (!editingDecompte) return;

    try {
      if (!editingDecompte.id_D) {
        message.error("ID du décompte manquant");
        return;
      }

      const updatedDecompte = await updateDecompte(editingDecompte);

      // Refresh the list
      const newData = await getDecomptes();
      setDataSource(newData);

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
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id_D",
      key: "id_D",
    },
    {
      title: "Numéro d'ordre",
      dataIndex: "numOrdre_D",
      key: "numOrdre_D",
    },
    {
      title: "Acompte",
      dataIndex: "aCompte",
      key: "aCompte",
    },
    {
      title: "Somme",
      dataIndex: "somme_D",
      key: "somme_D",
    },
    {
      title: "Société",
      dataIndex: "societe",
      key: "societe",
      render: (societe: Societe | undefined) => societe?.raisonSociale || "N/A",
    },
    {
      title: "Marché",
      dataIndex: "marche",
      key: "marche",
      render: (marche: Marche | undefined) => marche?.numOrdre || "N/A",
    },
    {
      title: "Actions",
      render: (record: Decompte) => (
        <>
          <EditOutlined onClick={() => onEditDecompte(record)} />
          {/*
          <DeleteOutlined
            onClick={() => onDeleteDecompte(record)}
            style={{ color: "red", marginLeft: 8 }}
          />
          */}
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
          />
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id_D"
            loading={loading}
          />

          {isEditing && (
            <Modal
              title="Modifier le décompte"
              open={isEditing}
              onCancel={resetEditing}
              footer={null}
            >
              <Form form={form} layout="vertical" onFinish={handleSave}>
                <Form.Item
                  label="Nom"
                  name="nom_D"
                  initialValue={editingDecompte?.numOrdre_D}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Numéro d'ordre"
                  name="numOrdre_D"
                  initialValue={editingDecompte?.numOrdre_D}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Acompte"
                  name="aCompte"
                  initialValue={editingDecompte?.aCompte}
                >
                  <Input type="number" />
                </Form.Item>

                <Form.Item
                  label="Somme"
                  name="somme_D"
                  initialValue={editingDecompte?.somme_D}
                >
                  <Input type="number" />
                </Form.Item>
              </Form>
            </Modal>
          )}
        </div>
      </Sidebar>
    </div>
  );
};

export default List_Decomptes;
