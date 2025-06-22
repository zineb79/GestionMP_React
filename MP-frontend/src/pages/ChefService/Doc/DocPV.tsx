import React, { useState, useEffect } from "react";
import { 
  Table, Modal, Input, FloatButton, Form, DatePicker, Select, 
  message, Tag, Card, Statistic, Row, Col, App 
} from "antd";
import { 
  EditOutlined, PlusOutlined, FileWordOutlined,
  FileDoneOutlined, FileSyncOutlined, SearchOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getMarches, Marche } from "../../../services/MarcheService";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import "../PagesSec.css";
import dayjs from "dayjs";
import { DocumentService } from '../../../services/DocumentService';
import { 
  getPvReceptions, PvReception, TypePvReception, updatePvReception 
} from "../../../services/PvReceptionService";

const DocPV = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPV, setEditingPV] = useState<PvReception | null>(null);
  const [dataSource, setDataSource] = useState<PvReception[]>([]);
  const [loading, setLoading] = useState(true);
  const [marches, setMarches] = useState<Marche[]>([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pvData, marchesData] = await Promise.all([
          getPvReceptions(),
          getMarches()
        ]);

        // Enrichir les données avec les numéros de marché
        const enrichedData = pvData.map(pv => {
          const marche = marchesData.find(m => m.id_Marche === pv.idMarche_PVR);
          return {
            ...pv,
            numOrdreMarche: marche?.numOrdre || "N/A",
            marche_obj: marche
          };
        });

        setDataSource(enrichedData);
        setMarches(marchesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calcul des statistiques
  const totalPV = dataSource.length;
  const provisoirePV = dataSource.filter(pv => pv.type_PVR === TypePvReception.PROVISOIRE).length;
  const definitifPV = dataSource.filter(pv => pv.type_PVR === TypePvReception.DEFINITIVE).length;

  const filteredData = dataSource.filter(item => 
    item.idMarche_PVR?.toString().includes(searchText.toLowerCase()) ||
    item.type_PVR?.toLowerCase().includes(searchText.toLowerCase())
  );

  const onEditPV = (record: PvReception) => {
    setIsEditing(true);
    setEditingPV({ ...record });
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date, 'YYYY-MM-DD') : null,
    });
  };

  const handleSave = async (values: any) => {
    if (!editingPV || !editingPV.id_PVR) {
      message.error("ID du PV de réception manquant");
      return;
    }
    try {
      const updatedPV = {
        ...editingPV,
        ...values,
        date: values.date?.format('YYYY-MM-DD'),
      };

      await updatePvReception(updatedPV);
      
      // Rafraîchir les données
      const [newData, updatedMarches] = await Promise.all([
        getPvReceptions(),
        getMarches()
      ]);

      const enrichedData = newData.map(pv => {
        const marche = updatedMarches.find(m => m.id_Marche === pv.idMarche_PVR);
        return {
          ...pv,
          numOrdreMarche: marche?.numOrdre || "N/A",
          marche_obj: marche
        };
      });

      setDataSource(enrichedData);
      setMarches(updatedMarches);
      
      setEditingPV(null);
      setIsEditing(false);
      message.success("PV de réception mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      message.error("Échec de la mise à jour du PV de réception");
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingPV(null);
    form.resetFields();
  };

  const generateDocument = async (PVR: PvReception) => {
    try {
      await DocumentService.generatePVDeReceptionDocument(PVR);
      message.success('Document généré avec succès');
    } catch (error) {
      message.error('Erreur lors de la génération du document');
    }
  };

  const columns = [
    {
      title: "Numéro de Marché",
      dataIndex: "idMarche_PVR",
      key: "idMarche_PVR",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
      sorter: (a: PvReception, b: PvReception) =>
        (a.idMarche_PVR || "").toString().localeCompare((b.idMarche_PVR || "").toString()),
    },
    {
      title: "Type",
      dataIndex: "type_PVR",
      key: "type_PVR",
      render: (type: TypePvReception) => {
        let color = type === TypePvReception.PROVISOIRE ? 'orange' : 'green';
        let text = type === TypePvReception.PROVISOIRE ? 'PROVISOIRE' : 'DEFINITIF';
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'PROVISOIRE', value: TypePvReception.PROVISOIRE },
        { text: 'DEFINITIF', value: TypePvReception.DEFINITIVE },
      ],
      onFilter: (value: TypePvReception, record: PvReception) => record.type_PVR === value,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
      sorter: (a: PvReception, b: PvReception) =>
        (a.date || "").localeCompare(b.date || ""),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: PvReception) => (
        <>
          <EditOutlined
            onClick={() => onEditPV(record)}
            style={{ color: "green", marginRight: 12, cursor: "pointer" }}
          />
          <FileWordOutlined 
            onClick={() => generateDocument(record)}
            style={{ color: "blue", marginLeft: 12, cursor: "pointer" }} 
          />
        </>
      ),
    },
  ];

  return (
    <App>
      <Sidebar>
        <div className="list-container" style={{ padding: '20px' }}>
          <Card 
            title="PV de Réception" 
            style={{ marginBottom: '20px' }}
            headStyle={{ backgroundColor: '#edfabf', borderBottom: '1px solid #d9d9d9' }}
          >
            {/* Cartes de statistiques */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={8}>
                <Card bordered={false}>
                  <Statistic
                    title="Total PV"
                    value={totalPV}
                    prefix={<FileDoneOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false}>
                  <Statistic
                    title="PV Provisoires"
                    value={provisoirePV}
                    prefix={<FileSyncOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false}>
                  <Statistic
                    title="PV Définitifs"
                    value={definitifPV}
                    prefix={<FileDoneOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Input 
                placeholder="Rechercher par numéro de marché ou type" 
                prefix={<SearchOutlined />} 
                style={{ width: '300px' }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <FloatButton
                icon={<PlusOutlined />}
                onClick={() => navigate("/AddPv")}
                tooltip="Ajouter un PV de réception"
                type="primary"
              />
            </div>

            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id_PVR"
              loading={loading}
              style={{ marginTop: '20px' }}
              bordered
              pagination={{ pageSize: 10 }}
            />
          </Card>

          <Modal
            title="Modifier le PV de réception"
            open={isEditing}
            onCancel={resetEditing}
            onOk={() => form.submit()}
            width={600}
            destroyOnClose
          >
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item label="Numéro de marché">
                <Input 
                  value={marches.find(m => m.id_Marche === editingPV?.idMarche_PVR)?.numOrdre || 'N/A'} 
                  disabled 
                />
              </Form.Item>
              <Form.Item name="idMarche_PVR" hidden>
                <Input />
              </Form.Item>

              <Form.Item
                name="type_PVR"
                label="Type"
                rules={[
                  { required: true, message: "Veuillez sélectionner un type" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: TypePvReception.PROVISOIRE, label: "Provisoire" },
                    { value: TypePvReception.DEFINITIVE, label: "Définitif" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="date"
                label="Date de réception"
                rules={[
                  { required: true, message: "Veuillez sélectionner la date" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Sidebar>
    </App>
  );
};

export default DocPV;