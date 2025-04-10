import React, { useState, useEffect } from "react";
import { Table, Modal, Input, FloatButton, Form, DatePicker, Select, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import '../PagesSec.css'
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import { deleteAppelOffre, getAppelsOffre, updateAppelOffre } from "../../../services/AOService";
import dayjs from "dayjs";

interface AppelOffre {
  id_AO?: number;
  num_Ordre_AO: string;
  type_AO: string;
  date_AO: string;
  coutEstime_AO: number;
  cautionProvisoire_AO: number;
  statut_AO: string;
  idMarche: number;
}

const List_AO = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingAppelOffre, setEditingAppelOffre] = useState<AppelOffre | null>(
    null
  );
  const [dataSource, setDataSource] = useState<AppelOffre[]>([]);
  const [loading, setLoading] = useState(true);
  const [statuts, setStatuts] = useState<string[]>([]);
  const [loadingStatuts, setLoadingStatuts] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();

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
          await deleteAppelOffre(record.num_Ordre_AO);
          setDataSource((pre) =>
            pre.filter((ao) => ao.num_Ordre_AO !== record.num_Ordre_AO)
          );
          message.success("L'appel d'offre a été supprimé avec succès");
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
      if (!editingAppelOffre.id_AO) {
        message.error("ID de l'appel d'offre manquant");
        return;
      }
      const updatedAO = await updateAppelOffre(editingAppelOffre.id_AO, editingAppelOffre);
      
      // Refresh the list
      const newData = await getAppelsOffre();
      setDataSource(newData);
      
      message.success("Appel d'offre mis à jour avec succès");
      resetEditing();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'appel d'offre :",
        error
      );
      message.error("Erreur lors de la mise à jour de l'appel d'offre");
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
      filters: [
        { text: 'National', value: 'National' },
        { text: 'International', value: 'International' },
      ],
      onFilter: (value: any, record: AppelOffre) => record.type_AO === value,
    },
    {
      key: "3",
      title: "Date d'appel d'offre",
      dataIndex: "date_AO",
      sorter: (a: AppelOffre, b: AppelOffre) => new Date(a.date_AO).getTime() - new Date(b.date_AO).getTime(),
    },
    {
      key: "4",
      title: "Coût estimé",
      dataIndex: "coutEstime_AO",
      sorter: (a: AppelOffre, b: AppelOffre) => a.coutEstime_AO - b.coutEstime_AO,
    },
    {
      key: "5",
      title: "Caution provisoire",
      dataIndex: "cautionProvisoire_AO",
      sorter: (a: AppelOffre, b: AppelOffre) => a.cautionProvisoire_AO - b.cautionProvisoire_AO,
    },
    {
      key: "6",
      title: "Statut",
      dataIndex: "statut_AO",
      filters: loadingStatuts ? [] : statuts.map(statut => ({
        text: statut,
        value: statut
      })),
      onFilter: (value: any, record: AppelOffre) => record.statut_AO === value,
    },
    {
      key: "7",
      title: "Actions",
      render: (record: AppelOffre) => (
        <>
          <EditOutlined onClick={() => onEditAppelOffre(record)} 
            style={{ color: "green", marginRight: 12 }}
          />
          <DeleteOutlined
            onClick={() => onDeleteAppelOffre(record)}
            style={{ color: "red", marginLeft: 12 }}
          />
          <DownloadOutlined style={{ color: "blue", marginLeft: 14 }} />
        </> 
      ),
    },
  ];

  return (
    <Sidebar>
      <div className="list-container">
        <FloatButton icon={<PlusOutlined />} onClick={() => navigate("/add-ao")} />
        <div className="list-header">
          <h2 className="list-title">Liste des Appels d'offre</h2>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="num_Ordre_AO"
          loading={loading}
        />
         <Modal 
          title="Modifier l'appel d'offre" 
          open={isEditing} 
          onCancel={resetEditing} 
          onOk={() => form.submit()}
          width={500}
        >
          <Form 
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item label="Numéro d'ordre">
              <Input
                value={editingAppelOffre?.num_Ordre_AO}
                disabled
              />
            </Form.Item>

            <Form.Item label="Type d'appel d'offre">
              <Input
                value={editingAppelOffre?.type_AO}
                onChange={(e) =>
                  setEditingAppelOffre((pre) =>
                    pre ? { ...pre, type_AO: e.target.value } : pre
                  )
                }
              />
            </Form.Item>

            <Form.Item label="Date d'appel d'offre">
              <DatePicker
                style={{ width: "100%" }}
                value={editingAppelOffre?.date_AO ? dayjs(editingAppelOffre.date_AO) : null}
                onChange={(date) =>
                  setEditingAppelOffre((pre) =>
                    pre ? { ...pre, date_AO: date ? date.format("YYYY-MM-DD") : "" } : pre
                  )
                }
              />
            </Form.Item>

            <Form.Item label="Coût estimé">
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
            </Form.Item>

            <Form.Item label="Caution provisoire">
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
            </Form.Item>

            <Form.Item label="Statut">
              <Select
                value={editingAppelOffre?.statut_AO}
                onChange={(value) =>
                  setEditingAppelOffre((pre) =>
                    pre ? { ...pre, statut_AO: value } : pre
                  )
                }
              >
                <Select.Option value="ENCOURS">ENCOURS</Select.Option>
                <Select.Option value="VALIDE">VALIDE</Select.Option>
                <Select.Option value="INFRUTUEUSE">INFRUTUEUSE</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default List_AO;
