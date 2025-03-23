import React, { useState, useEffect } from "react";
import { Table, Modal, Input, FloatButton } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import Sidebar from "../../components/Sidebar/Sidebar_Sec";
import { getAppelsOffre } from "../../services/AuthService";

interface AppelOffre {
  num_Ordre_AO: number;
  type_AO: string;
  date_AO: string;
  coutEstime_AO: number;
  cautionProvisoire_AO: number;
  statut_AO: string;
}

const List_AO = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingAppelOffre, setEditingAppelOffre] = useState<AppelOffre | null>(
    null
  );
  const [dataSource, setDataSource] = useState<AppelOffre[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Charger les appels d'offre depuis l'API
  useEffect(() => {
    const fetchAppelsOffre = async () => {
      try {
        const data = await getAppelsOffre();
        setDataSource(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des appels d'offre :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppelsOffre();
  }, []);

  const onDeleteAppelOffre = async (record: AppelOffre) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cet appel d'offre ?",
      okText: "Oui",
      okType: "danger",
      onOk: async () => {
        try {
          await api.delete(`/list/delete/${record.num_Ordre_AO}`);
          setDataSource((pre) =>
            pre.filter((ao) => ao.num_Ordre_AO !== record.num_Ordre_AO)
          );
        } catch (error) {
          console.error(
            "Erreur lors de la suppression de l'appel d'offre :",
            error
          );
          alert(
            "Impossible de supprimer l'appel d'offre. Veuillez réessayer plus tard."
          );
        }
      },
    });
  };

  const onEditAppelOffre = (record: AppelOffre) => {
    setIsEditing(true);
    setEditingAppelOffre({ ...record });
  };

  const handleSave = async () => {
    if (!editingAppelOffre) return;

    try {
      await api.put(
        `/list/update/${editingAppelOffre.num_Ordre_AO}`,
        editingAppelOffre
      );
      setDataSource((pre) =>
        pre.map((ao) =>
          ao.num_Ordre_AO === editingAppelOffre.num_Ordre_AO
            ? editingAppelOffre
            : ao
        )
      );
      resetEditing();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'appel d'offre :",
        error
      );
      alert(
        "Impossible de mettre à jour l'appel d'offre. Veuillez réessayer plus tard."
      );
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingAppelOffre(null);
  };

  const columns = [
    {
      key: "1",
      title: "Numéro d'ordre",
      dataIndex: "num_Ordre_AO",
    },
    {
      key: "2",
      title: "Type d'appel d'offre",
      dataIndex: "type_AO",
    },
    {
      key: "3",
      title: "Date d'appel d'offre",
      dataIndex: "date_AO",
    },
    {
      key: "4",
      title: "Coût estimé",
      dataIndex: "coutEstime_AO",
    },
    {
      key: "5",
      title: "Caution provisoire",
      dataIndex: "cautionProvisoire_AO",
    },
    {
      key: "6",
      title: "Statut",
      dataIndex: "statut_AO",
    },
    {
      key: "7",
      title: "Actions",
      render: (record: AppelOffre) => (
        <>
          <EditOutlined onClick={() => onEditAppelOffre(record)} />
          <DeleteOutlined
            onClick={() => onDeleteAppelOffre(record)}
            style={{ color: "red", marginLeft: 12 }}
          />
        </>
      ),
    },
  ];

  return (
    <Sidebar>
      <div className="form">
        <FloatButton icon={<PlusOutlined />} onClick={() => navigate("/add")} />
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="num_Ordre_AO"
          loading={loading}
        />
        <Modal open={isEditing} onCancel={resetEditing} onOk={handleSave}>
          <Input
            value={editingAppelOffre?.type_AO}
            onChange={(e) =>
              setEditingAppelOffre((pre) =>
                pre ? { ...pre, type_AO: e.target.value } : pre
              )
            }
          />
          <Input
            value={editingAppelOffre?.date_AO}
            onChange={(e) =>
              setEditingAppelOffre((pre) =>
                pre ? { ...pre, date_AO: e.target.value } : pre
              )
            }
          />
          <Input
            value={editingAppelOffre?.coutEstime_AO}
            onChange={(e) =>
              setEditingAppelOffre((pre) =>
                pre
                  ? { ...pre, coutEstime_AO: parseFloat(e.target.value) }
                  : pre
              )
            }
          />
          <Input
            value={editingAppelOffre?.cautionProvisoire_AO}
            onChange={(e) =>
              setEditingAppelOffre((pre) =>
                pre
                  ? { ...pre, cautionProvisoire_AO: parseFloat(e.target.value) }
                  : pre
              )
            }
          />
          <Input
            value={editingAppelOffre?.statut_AO}
            onChange={(e) =>
              setEditingAppelOffre((pre) =>
                pre ? { ...pre, statut_AO: e.target.value } : pre
              )
            }
          />
        </Modal>
      </div>
    </Sidebar>
  );
};

export default List_AO;
