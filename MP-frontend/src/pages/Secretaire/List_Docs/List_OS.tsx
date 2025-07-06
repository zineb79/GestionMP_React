import React, { useState, useEffect } from 'react';
import { Table, Modal, Input, FloatButton, Form, DatePicker, Select, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, FileWordOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { getOrdresDeService, deleteOrdreDeService, updateOrdreDeService, Type_OS } from '../../../services/OSService';
import { getMarches } from '../../../services/MarcheService';
import { getSocietes, Societe } from '../../../services/SocieteService';
import Sidebar from '../../../components/Sidebar/Sidebar_Sec';
import '../PagesSec.css';
import dayjs from 'dayjs';
import { OrdreDeService } from '../../../services/OSService';
import { Marche } from '../../../services/MarcheService';
import { DocumentService } from '../../../services/DocumentService';


const List_OS = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingOS, setEditingOS] = useState<OrdreDeService | null>(null);
    const [dataSource, setDataSource] = useState<OrdreDeService[]>([]);
    const [loading, setLoading] = useState(true);
    const [marches, setMarches] = useState<Marche[]>([]);
    const [societes, setSociete] = useState<Societe[]>([]);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [osData, marchesData, societesData] = await Promise.all([
                    getOrdresDeService(),
                    getMarches(),
                    getSocietes()
                ]);

                // Associer les marchés aux notifications
                const enrichedData = osData.map(os => {
                    const marche = marchesData.find(m => m.id_Marche === os.idMarche);
                    const societe = societesData.find(m => m.id_SO === marche?.idSociete);
                    return {
                        ...os,
                        idMarche_obj: marche,
                        marche_OS_obj: marche,
                        marche_OS: marche?.id_Marche || os.idMarche,
                        societe_obj: societe,
                    };
                }).filter(os => os.marche_OS_obj); 
                

                setDataSource(enrichedData);
                setMarches(marchesData);
                console.log("Ordres de service chargés:", enrichedData);
                console.log("Marchés chargés:", marchesData);
                console.log("Données enrichies:", enrichedData);
                console.log("Marchés IDs:", marchesData.map(m => m.id_Marche));
            } catch (error) {
                console.error("Erreur lors du chargement:", error);
                message.error("Erreur de chargement des données");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    /*const onDeleteOS = async (record: OrdreDeService) => {
        Modal.confirm({
            title: "Êtes-vous sûr de vouloir supprimer cet ordre de service ?",
            okText: "Oui",
            okType: "danger",
            onOk: async () => {
                if (!record.id_OS) return;
                try {
                    await deleteOrdreDeService(record.id_OS);
                    setDataSource(prev => prev.filter(os => os.id_OS !== record.id_OS));
                    message.success("Ordre de service supprimé avec succès");
                } catch (error) {
                    console.error("Erreur lors de la suppression:", error);
                    message.error("Échec de la suppression de l'ordre de service");
                }
            },
        });
    };*/

    const onEditOS = (record: OrdreDeService) => {
        setIsEditing(true);
        setEditingOS({ ...record });
        form.setFieldsValue({
            ...record,
            date_OS: record.date_OS ? dayjs(record.date_OS) : null
        });
    };

    const handleSave = async (values: any) => {
        if (!editingOS || !editingOS.id_OS) {
            message.error("ID de l'ordre de service manquant");
            return;
        }
        try {
            const updatedOS = {
                ...editingOS,
                ...values,
                date_OS: values.date_OS?.format('DD/MM/YYYY')
            };

            const response = await updateOrdreDeService(editingOS.id_OS, updatedOS);
            
            const [newData, updatedMarches, updatedSocietes] = await Promise.all([
                getOrdresDeService(),
                getMarches(),
                getSocietes()
            ]);
            
            const enrichedData = newData.map(os => {
                const marche = updatedMarches.find(m => m.id_Marche === os.idMarche);
                const societe = updatedSocietes.find(m => m.id_SO === marche?.idSociete);
                return {
                    ...os,
                    idMarche_obj: marche,
                    societe_obj: societe,
                    marche_OS_obj: marche,
                    marche_OS: marche?.id_Marche || os.idMarche,
                };
            }).filter(os => os.idMarche_obj);
            
            setDataSource(enrichedData);
            setMarches(updatedMarches); // 🔥 très important !
            

            setEditingOS(null);
            setIsEditing(false);
            console.log("Données enrichies:", updatedOS);
            message.success("Ordre de service mise à jour avec succès");
            resetEditing();
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            message.error("Échec de la mise à jour de l'ordre de service");
        }
    };

    const resetEditing = () => {
        setIsEditing(false);
        setEditingOS(null);
        form.resetFields();
    };
    
  const generateDocument = async (ordreDeService: OrdreDeService) => {
    try {
      await DocumentService.generateOrdreDeServiceDocument(ordreDeService);
      message.success('Document généré avec succès');
    } catch (error) {
      message.error('Erreur lors de la génération du document');
    }
  } 
  
    const columns = [
        {
            title: 'Numéro de Marché',
            key: 'idMarche',
            render: (record: OrdreDeService) => (
                    <Tag color="blue">{record.idMarche_obj?.numOrdre || "-"}</Tag>
            ),
            sorter: (a: OrdreDeService, b: OrdreDeService) => 
                    (a.idMarche_obj?.numOrdre || "").localeCompare(b.idMarche_obj?.numOrdre || "")
            },
        {
            title: 'Numéro d\'OS',
            key: 'numOrdre_OS',
            render: (record: OrdreDeService) => record.numOrdre_OS,
        },
        {
            title: 'Société',
            key: 'societe',
            render: (record: OrdreDeService) => record.societe_obj?.raisonSociale || "-",
        },
        {
            title: 'Type',
            key: 'type_OS',
            render: (record: OrdreDeService) => {
            if (record.type_OS === 'COMMENCEMENT') {
                return 'COMMENCEMENT';
            } else if (record.type_OS === 'ARRET') {
                return 'ARRÊT';
            } else if (record.type_OS === 'REPRISE') {
                return 'REPRISE';
            } else if (record.type_OS === 'CESSION') {
                return 'CESSION';
            } else {
                return '-';
            }
            },
            filters: [
                { text: 'COMMENCEMENT', value: 'COMMENCEMENT' },
                { text: 'ARRÊT', value: 'ARRET' },
                { text: 'REPRISE', value: 'REPRISE' },
                { text: 'CESSION', value: 'CESSION' },
            ],
            onFilter: (value: any, record: OrdreDeService) => record.type_OS === value,
        },
        {
            title: 'Date',
            key: 'date_OS',
            render: (record: OrdreDeService) => record.date_OS ? dayjs(record.date_OS).format("DD/MM/YYYY") : "N/A",
            sorter: (a: OrdreDeService, b: OrdreDeService) => 
                (a.date_OS || '').localeCompare(b.date_OS || '')
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: OrdreDeService) => (
                <>
                    <EditOutlined 
                        onClick={() => onEditOS(record)} 
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                    />
                    
                    <FileWordOutlined 
                        onClick={() => generateDocument(record)}
                        style={{ color: "purple", marginLeft: 14 }}
                    />
                    
                </>
            ),
        }
    ];

    return (
        <Sidebar>
            <div className="list-container">
                <FloatButton 
                    icon={<PlusOutlined />} 
                    onClick={() => navigate("/AddOs")} 
                    tooltip="Ajouter une ordre de service"
                />
                <div className="list-header">
                    <h2 className="list-title">Liste des Ordres de services</h2>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id_OS"
                    loading={loading}
                    bordered
                />
                <Modal 
                    title="Modifier l'ordre de service" 
                    open={isEditing} 
                    onCancel={resetEditing} 
                    onOk={() => form.submit()}
                    width={600}
                    destroyOnClose
                >
                    <Form 
                        form={form}
                        layout="vertical"
                        onFinish={handleSave}
                    >
                        <Form.Item
                            name="numOrdre_OS"
                            label="Numéro de ordre de service"
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            name="marche_OS"
                            label="Marché"
                        >
                            <Input value={editingOS?.idMarche_obj?.numOrdre || "N/A"}  
                            disabled />
                        </Form.Item>

                        <Form.Item 
                          name="type_OS"
                          label="Type"
                          rules={[{ required: true, message: 'Veuillez sélectionner un type' }]}
                        >
                            <Select
                                style={{ width: '100%' }}
                                options={[
                                    { value: Type_OS.COMMENCEMENT, label: 'Commencement' },
                                    { value: Type_OS.ARRET, label: 'Arret' },
                                    { value: Type_OS.REPRISE, label: 'Reprise' },
                                    { value: Type_OS.CESSION, label: 'Cession' }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            name="date_OS"
                            label="Date d'ordre de service"
                            rules={[{ required: true, message: 'Veuillez sélectionner la date' }]}
                        >
                            <DatePicker 
                                style={{ width: '100%' }} 
                                format="DD/MM/YYYY"
                                disabledDate={current => current && current > dayjs().endOf('day')}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Sidebar>
    );
};

export default List_OS;