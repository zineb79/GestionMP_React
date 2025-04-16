import { useState, useEffect } from "react";
import { Table, Modal, Input, FloatButton, message, Form, DatePicker, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import { deleteOrdreDeService, OrdreDeService, updateOrdreDeService, getOrdresDeService } from "../../../services/OSService";
import { getMarches, Marche } from "../../../services/MarcheService";

const List_OS = () => {
  const [isEditing, setIsEditing] = useState(false);
      const [editingOS, setEditingOS] = useState<OrdreDeService | null>(null);
      const [dataSource, setDataSource] = useState<OrdreDeService[]>([]);
      const [loading, setLoading] = useState(true);
      const [marches, setMarches] = useState<Marche[]>([]);
      const navigate = useNavigate();
      const [form] = Form.useForm();
      
      
  // Charger les appels d'offre depuis l'API
  useEffect(() => {
          const fetchData = async () => {
              try {
                  setLoading(true);
                  const [osData, marchesData] = await Promise.all([
                      getOrdresDeService(),
                      getMarches()
                  ]);
  
                  // Associer les marchés aux notifications
                  const enrichedData = osData.map(os => {
                      const marche = marchesData.find(m => m.id_Marche === os.marche_OS);
                      console.log(`Notification ${os.numOrdre_OS}: marche_NOTIF = ${os.marche_OS}, found marche =`, marche);
                      return {
                          ...os,
                          marche_OS_obj: marche,
                          marche_OS: marche?.id_Marche
                      };
                  });
  
                  setDataSource(enrichedData);
                  setMarches(marchesData);
              } catch (error) {
                  console.error("Erreur lors du chargement:", error);
                  message.error("Erreur de chargement des données");
              } finally {
                  setLoading(false);
              }
          };
          fetchData();
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
      title: "Marché",
      render: (record: OrdreDeService) => 
        `${record.marche_OS_obj?.numOrdre} - ${record.marche_OS_obj?.objet_marche}`,
    },{
      key: "2",
      title: "numero de l'ordre de service",
      dataIndex: "numOrdre_OS",
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
      <div className="list-header">
        <h2 className="list-title">Liste des Ordres de service</h2>
      </div>
      <FloatButton icon={<PlusOutlined />} onClick={() => navigate("/AddOS")} />
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record.id_OS}
        loading={loading}
        bordered
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
            <Form.Item
                            name="marche_NOTIF"
                            label="Marché"
                            rules={[{ required: true, message: 'Veuillez sélectionner un marché' }]}
                        >
                            <Select 
                                placeholder="Sélectionner le marché"
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {marches.map(marche => (
                                    <Select.Option 
                                        key={marche.id_Marche} 
                                        value={marche.id_Marche}
                                    >
                                        {`${marche.numOrdre} - ${marche.objet_marche}`}
                                    </Select.Option>
                                ))}
                            </Select>
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
      
    </Sidebar>
  );
};

export default List_OS;