import React, { useState, useEffect } from "react";
import { getNumOrdreMarche } from "../../../services/MarcheService";
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
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getOrdresDeService,
  deleteOrdreDeService,
  updateOrdreDeService,
  Type_OS,
  OrdreDeServiceWithNumOrdre,
} from "../../../services/OSService";
import { getMarches } from "../../../services/MarcheService";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import "../PagesSec.css";
import dayjs from "dayjs";
import { OrdreDeService } from "../../../services/OSService";
import { Marche } from "../../../services/MarcheService";
import { DocumentService } from "../../../services/DocumentService";
import { title } from "process";

const List_OS = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingOS, setEditingOS] = useState<OrdreDeService | null>(null);
  const [dataSource, setDataSource] = useState<OrdreDeServiceWithNumOrdre[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [marches, setMarches] = useState<Marche[]>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const osData = await getOrdresDeService();
        setDataSource(osData);
        const marchesData = await getMarches();
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

  const onDeleteOS = async (record: OrdreDeService) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cet ordre de service ?",
      okText: "Oui",
      okType: "danger",
      onOk: async () => {
        if (!record.id_OS) return;
        try {
          await deleteOrdreDeService(record.id_OS);
          setDataSource((prev) =>
            prev.filter((os) => os.id_OS !== record.id_OS)
          );
          message.success("Ordre de service supprimé avec succès");
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          message.error("Échec de la suppression de l'ordre de service");
        }
      },
    });
  };

  const onEditOS = (record: OrdreDeService) => {
    setIsEditing(true);
    setEditingOS({ ...record });
    form.setFieldsValue({
      ...record,
      idMarche: record.idMarche,
      date_OS: record.date_OS ? dayjs(record.date_OS) : null,
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
        date_OS: values.date_OS?.format("YYYY-MM-DD"),
        idMarche: values.idMarche,
      };

      const response = await updateOrdreDeService(editingOS.id_OS, updatedOS);

      const newData = await getOrdresDeService();
      setDataSource(newData);

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
  /*const generateDocument = async (ordreDeService: OrdreDeService) => {
    try {
      await DocumentService.generateOrdreDeServiceDocument(ordreDeService);
      message.success('Document généré avec succès');
    } catch (error) {
      message.error('Erreur lors de la génération du document');
    }
  } */
  const columns = [
    {
      title: "Numéro de Marché",
      dataIndex: "numMarcheNumOrdre",
      key: "numMarcheNumOrdre",
      render: (text: string | undefined) => text || "N/A",
      sorter: (a: OrdreDeServiceWithNumOrdre, b: OrdreDeServiceWithNumOrdre) =>
        (a.numMarcheNumOrdre || "").localeCompare(b.numMarcheNumOrdre || ""),
    },
    {
      title: "Numéro d'OS",
      dataIndex: "numOrdre_OS",
      key: "numOrdre_OS",
      sorter: (a: OrdreDeService, b: OrdreDeService) =>
        (a.numOrdre_OS || "").localeCompare(b.numOrdre_OS || ""),
    },
    {
      title: "Type",
      dataIndex: "type_OS",
      key: "type_OS",
      sorter: (a: OrdreDeService, b: OrdreDeService) =>
        (a.type_OS || "").localeCompare(b.type_OS || ""),
    },
    {
      title: "Date",
      dataIndex: "date_OS",
      key: "date_OS",
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
      sorter: (a: OrdreDeService, b: OrdreDeService) =>
        (a.date_OS || "").localeCompare(b.date_OS || ""),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: OrdreDeService) => (
        <>
          <EditOutlined
            onClick={() => onEditOS(record)}
            style={{ color: "#1890ff", cursor: "pointer" }}
          />
          <DeleteOutlined
            onClick={() => onDeleteOS(record)}
            style={{ color: "red", marginLeft: 12, cursor: "pointer" }}
          />
          <FileWordOutlined style={{ color: "purple", marginLeft: 14 }} />
        </>
      ),
    },
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
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item name="numOrdre_OS" label="Numéro de ordre de service">
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="idMarche"
              label="Marché"
              rules={[
                { required: true, message: "Veuillez sélectionner un marché" },
              ]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="type_OS"
              label="Type"
              rules={[
                { required: true, message: "Veuillez sélectionner un type" },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                options={[
                  { value: Type_OS.COMMENCEMENT, label: "Commencement" },
                  { value: Type_OS.ARRET, label: "Arret" },
                  { value: Type_OS.REPRISE, label: "Reprise" },
                  { value: Type_OS.CESSION, label: "Cession" },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="date_OS"
              label="Date d'ordre de service"
              rules={[
                { required: true, message: "Veuillez sélectionner la date" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
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
