import { useState, useEffect } from "react";
import { Table, Modal, Input, FloatButton, message, Form, DatePicker } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import { deleteOrdreDeService, OrdreDeService, updateOrdreDeService, getOrdresDeService } from "../../../services/OSService";

const List_OS = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [dataSource, setDataSource] = useState<OrdreDeService[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editingOS, setEditingOS] = useState<OrdreDeService | null>(null);
      
  // Charger les appels d'offre depuis l'API
  useEffect(() => {
    const fetchMarches = async () => {
      try {
        const data = await getOrdresDeService();
        setDataSource(data as OrdreDeService[]);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des marchés :",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMarches();
  }, []);
      
      
        const onDeleteOS = async (record: OrdreDeService) => {
          Modal.confirm({
            title: "Êtes-vous sûr de vouloir supprimer cette notification ?",
            okText: "Oui",
            okType: "danger",
            onOk: async () => {
              try {
                await deleteOrdreDeService(record.id_OS);
                setDataSource((pre) =>
                  pre.filter((os) => os.id_OS !== record.id_OS)
                );
                message.success("L'ordre de service a été supprimé avec succès");
              } catch (error) {
                console.error(
                  "Erreur lors de la suppression de l'ordre de service :",
                  error
                );
                alert(
                  "Impossible de supprimer l'ordre de service. Veuillez réessayer plus tard."
                );
              }
            },
          });
        };
      
        const onEditOS= (record: OrdreDeService) => {
          setIsEditing(true);
          setEditingOS({ ...record });
        };
      
        const handleSave = async () => {
          if (!editingOS) return;
      
          try {
            if (!editingOS.id_OS) {
              message.error("ID de l'ordre de service manquant");
              return;
            }
            const updatedOS = await updateOrdreDeService(editingOS.id_OS, editingOS);
            
            // Refresh the list
            const newData = await getOrdresDeService();
            setDataSource(newData);
            
            message.success("Ordre de service mise à jour avec succès");
            resetEditing();
          } catch (error) {
            console.error(
              "Erreur lors de la mise à jour de l'ordre de service :",
              error
            );
            message.error("Erreur lors de la mise à jour de l'ordre de service");
            alert(
              "Impossible de mettre à jour l'ordre de service. Veuillez réessayer plus tard."
            );
          }
        };
      
        const resetEditing = () => {
          setIsEditing(false);
          setEditingOS(null);
        };
  const columns = [
    {
      key: "1",
      title: "numero de l'ordre de service",
      dataIndex: "numOrdre_OS",
    },
    {
      key: "2",
      title: "Marché",
      render: (record: OrdreDeService) => 
        `${record.marche_OS.numOrdre} - ${record.marche_OS.objet_marche}`,
    },
    {
      key: "3",
      title: "Type d'ordre de service",
      dataIndex: "type_OS",
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
          rowKey={(record) => record.id_OS}
          loading={loading}
        />
        <Modal 
          title="Modifier l'ordre de service" 
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
            <Form.Item label="Numéro de l'ordre de service">
              <Input
                value={editingOS?.numOrdre_OS}
                disabled
              />
            </Form.Item>
            <Form.Item label="Numéro de marché">
              <Input
                value={editingOS?.marche_OS.numOrdre}
                disabled
              />
            </Form.Item>
            <Form.Item label="Type d'ordre de service">
              <Input
                value={editingOS?.type_OS}
                disabled
              />
            </Form.Item>

            <Form.Item label="Date de l'ordre de service">
              <DatePicker
                style={{ width: "100%" }}
                value={editingOS?.date_OS ? dayjs(editingOS.date_OS) : null}
                onChange={(date) =>
                  setEditingOS((pre) =>
                    pre ? { ...pre, date_OS: date ? date.format("YYYY-MM-DD") : "" } : pre
                  )
                }
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default List_OS;