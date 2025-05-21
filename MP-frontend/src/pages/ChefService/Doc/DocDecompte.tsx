import React, { useState, useEffect } from "react";
import {
  Table, Modal, Input, FloatButton, Form, DatePicker, Select,
  message, Tag, Card, Statistic, Row, Col
} from "antd";
import {
  EditOutlined, DeleteOutlined, PlusOutlined,
  FileWordOutlined, SearchOutlined,
  FileDoneOutlined, FileSyncOutlined, FileProtectOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import {
  getDecomptes, deleteDecompte, updateDecompte
} from "../../../services/DecompteService";
import dayjs from "dayjs";
import { getSocietes, Societe } from "../../../services/SocieteService";
import { getMarches, Marche } from "../../../services/MarcheService";
import { Decompte } from "../../../services/DecompteService";
import { DocumentService } from "../../../services/DocumentService";

const DocDecompte = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingDecompte, setEditingDecompte] = useState<Decompte | null>(null);
  const [dataSource, setDataSource] = useState<Decompte[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [marches, setMarches] = useState<Marche[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchDecomptes = async () => {
      try {
        setLoading(true);
        const [decomptesData, societesData, marchesData] = await Promise.all([
          getDecomptes(),
          getSocietes(),
          getMarches(),
        ]);

        const marchesWithSocietes = marchesData.map(marche => {
          const societe = societesData.find(s => s.id_SO === marche.idSociete);
          return { ...marche, societe_obj: societe };
        });

        const enrichedData = decomptesData.map(decompte => {
          const marche = marchesWithSocietes.find(m => m.id_Marche === decompte.idMarche);
          return { ...decompte, marche_obj: marche };
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

  // Calcul des statistiques
  const totalDecomptes = dataSource.length;
  const totalSomme = dataSource.reduce((sum, item) => sum + (item.somme_D || 0), 0);
  const totalAcompte = dataSource.reduce((sum, item) => sum + (item.aCompte || 0), 0);

  const filteredData = dataSource.filter(item =>
    item.numOrdre_D?.toLowerCase().includes(searchText.toLowerCase()) ||
    (item.marche_obj?.numOrdre && item.marche_obj.numOrdre.toLowerCase().includes(searchText.toLowerCase()))
  );

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
        numOrdre_D: values.numOrdre_D,
        aCompte: values.aCompte,
        somme_D: values.somme_D,
      };

      await updateDecompte(updatedDecompte);

      // Refresh data
      const [newData, marchesData, societesData] = await Promise.all([
        getDecomptes(),
        getMarches(),
        getSocietes()
      ]);

      const marchesWithSocietes = marchesData.map(marche => {
        const societe = societesData.find(s => s.id_SO === marche.idSociete);
        return { ...marche, societe_obj: societe };
      });

      const enrichedData = newData.map(decompte => {
        const marche = marchesWithSocietes.find(m => m.id_Marche === decompte.idMarche);
        return { ...decompte, marche_obj: marche };
      });

      setDataSource(enrichedData);
      setMarches(marchesWithSocietes);
      setSocietes(societesData);

      setIsEditing(false);
      setEditingDecompte(null);
      message.success("Le décompte a été mis à jour avec succès");
    } catch (error) {
      message.error("Erreur lors de la mise à jour du décompte");
      console.error("Error:", error);
    }
  };

  /*const generateDocument = async (decompte: Decompte) => {
    try {
      await DocumentService.generateDecompteDocument(decompte);
      message.success('Document généré avec succès');
    } catch (error) {
      message.error('Erreur lors de la génération du document');
    }
  };*/

  const resetEditing = () => {
    setIsEditing(false);
    setEditingDecompte(null);
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
    },
    {
      title: "Acompte",
      dataIndex: "aCompte",
      key: "aCompte",
      render: (value: number) => `${value?.toLocaleString()} €` || "N/A",
    },
    {
      title: "Somme",
      dataIndex: "somme_D",
      key: "somme_D",
      render: (value: number) => `${value?.toLocaleString()} €` || "N/A",
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
      render: (record: Decompte) => (
        <>
          <EditOutlined
            onClick={() => onEditDecompte(record)}
            style={{ color: "green", marginRight: 12, cursor: "pointer" }}
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
    <Sidebar>
      <div className="list-container" style={{ padding: '20px' }}>
        <Card
          title="Décomptes"
          style={{ marginBottom: '20px' }}
          headStyle={{ backgroundColor: '#edfabf', borderBottom: '1px solid #d9d9d9' }}
        >
          {/* Cartes de statistiques */}
          <Row gutter={16} style={{ marginBottom: '20px' }}>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Total Décomptes"
                  value={totalDecomptes}
                  prefix={<FileProtectOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Total Somme"
                  value={totalSomme.toLocaleString()}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<FileDoneOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Total Acompte"
                  value={totalAcompte.toLocaleString()}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<FileSyncOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Input
              placeholder="Rechercher par numéro de marché ou d'ordre"
              prefix={<SearchOutlined />}
              style={{ width: '300px' }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FloatButton
              icon={<PlusOutlined />}
              onClick={() => navigate("/AddDecompte")}
              tooltip="Ajouter un décompte"
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id_D"
            loading={loading}
            style={{ marginTop: '20px' }}
            bordered
          />
        </Card>

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

            <Form.Item
              label="Numéro d'ordre"
              name="numOrdre_D"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Acompte"
              name="aCompte"
              rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="Somme"
              name="somme_D"
              rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default DocDecompte;