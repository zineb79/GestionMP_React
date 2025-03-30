import React, { useState, useEffect } from "react";
import { Table, Modal, Input, FloatButton } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import { getOrdresDeService } from "../../../services/AuthService";

interface OrdreDeService {
  id_OS: number;
  type_OS: string;
  marche_OS: {
    id_Marche: number;
    numOrdre: string;
    objet_marche: string;
  };
}

const List_OS = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingOS, setEditingOS] = useState<OrdreDeService | null>(null);
  const [dataSource, setDataSource] = useState<OrdreDeService[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrdresDeService = async () => {
      try {
        const data = await getOrdresDeService();
        setDataSource(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des ordres de service :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdresDeService();
  }, []);

  const onDeleteOS = async (record: OrdreDeService) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cet ordre de service ?",
      okText: "Oui",
      okType: "danger",
      onOk: async () => {
        try {
          await api.delete(`/os/delete/${record.id_OS}`);
          setDataSource((pre) => pre.filter((os) => os.id_OS !== record.id_OS));
        } catch (error) {
          console.error("Erreur lors de la suppression de l'ordre de service :", error);
          alert("Impossible de supprimer l'ordre de service. Veuillez réessayer plus tard.");
        }
      },
    });
  };

  const onEditOS = (record: OrdreDeService) => {
    setIsEditing(true);
    setEditingOS({ ...record });
  };

  const handleSave = async () => {
    if (!editingOS) return;

    try {
      await api.put(`/os/update/${editingOS.id_OS}`, editingOS);
      setDataSource((pre) =>
        pre.map((os) => (os.id_OS === editingOS.id_OS ? editingOS : os))
      );
      resetEditing();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'ordre de service :", error);
      alert("Impossible de mettre à jour l'ordre de service. Veuillez réessayer plus tard.");
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingOS(null);
  };

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id_OS",
    },
    {
      key: "2",
      title: "Type d'ordre de service",
      dataIndex: "type_OS",
    },
    {
      key: "3",
      title: "Marché",
      render: (record: OrdreDeService) => 
        `${record.marche_OS.numOrdre} - ${record.marche_OS.objet_marche}`,
    },
    {
      key: "4",
      title: "Actions",
      render: (record: OrdreDeService) => (
        <>
          <EditOutlined onClick={() => onEditOS(record)} />
          <DeleteOutlined
            onClick={() => onDeleteOS(record)}
            style={{ color: "red", marginLeft: 12 }}
          />
        </>
      ),
    },
  ];

  return (
    <Sidebar>
      <div className="form">
        <FloatButton icon={<PlusOutlined />} onClick={() => navigate("/add-os")} />
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id_OS"
          loading={loading}
        />
        <Modal open={isEditing} onCancel={resetEditing} onOk={handleSave}>
          <Input
            value={editingOS?.type_OS}
            onChange={(e) =>
              setEditingOS((pre) =>
                pre ? { ...pre, type_OS: e.target.value } : pre
              )
            }
          />
        </Modal>
      </div>
    </Sidebar>
  );
};

export default List_OS;