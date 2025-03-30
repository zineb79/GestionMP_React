import React, { useState, useEffect } from 'react';
import { Table, Modal, Input, FloatButton } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from '../../../components/Sidebar/Sidebar_Sec';
import { getMarches } from '../../../services/AuthService';

interface Marche {
  id_Marche: number;
  numOrdre: string;
  type_Marche: string;
  objet_marche: string;
  statut: string;
  idSociete: number | null;
  idNotification: number | null;
}

const List_AO = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingMarche, setEditingMarche] = useState<Marche | null>(null);
  const [dataSource, setDataSource] = useState<Marche[]>([]);
  const [loading, setLoading] = useState(true);
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
          await axios.delete(`/marche/${record.numOrdre}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setDataSource((pre) => pre.filter((ao) => ao.numOrdre !== record.numOrdre));
        } catch (error) {
          console.error("Erreur lors de la suppression du marché :", error);
          alert("Impossible de supprimer le marché. Veuillez réessayer plus tard.");
        }
      },
    });
  };

  const onEditMarche = (record: Marche) => {
    setIsEditing(true);
    setEditingMarche({ ...record });
  };

  const handleSave = async () => {
    if (!editingMarche) return;

    try {
      await axios.put(`/marche/${editingMarche.numOrdre}`, editingMarche, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDataSource((pre) =>
        pre.map((ao) =>
          ao.numOrdre === editingMarche.numOrdre ? editingMarche : ao
        )
      );
      resetEditing();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du marché :", error);
      alert("Impossible de mettre à jour le marché. Veuillez réessayer plus tard.");
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingMarche(null);
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
      key: "7",
      title: "Actions",
      render: (record: Marche) => (
        <>  
        <EditOutlined onClick={() => onEditMarche(record)} />
          <DeleteOutlined
            onClick={() => onDeleteMarche(record)}
            style={{ color: "red", marginLeft: 12 }}
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
            rowKey="num_Ordre_AO"
            loading={loading}
          />
          <Modal
            open={isEditing}
            onCancel={resetEditing}
            onOk={handleSave}
          >
            <Input
              value={editingMarche?.type_Marche}
              onChange={(e) =>
                setEditingMarche((pre) =>
                  pre ? { ...pre, type_Marche: e.target.value } : pre
                )
              }
            />
            <Input
              value={editingMarche?.objet_marche}
              onChange={(e) =>
                  setEditingMarche((pre) =>
                  pre ? { ...pre, objet_marche: e.target.value } : pre
                )
              }
            />
            <Input
              value={editingMarche?.statut}
              onChange={(e) =>
                setEditingMarche((pre) =>
                  pre ? { ...pre, statut: e.target.value } : pre
                )
              }
            />
          </Modal>
      </div>
    </Sidebar>
  );
};

export default List_AO;